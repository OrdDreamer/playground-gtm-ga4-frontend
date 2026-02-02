import { useState, useEffect } from 'react'
import { getDataLayer, clearDataLayer, removeFromDataLayer, updateDataLayerItem } from '../utils/gtm'
import { getEventsLog, clearEventsLog, simulateEvent, sendToGTMSS } from '../utils/api'

function DataLayerViewer() {
  const [dataLayer, setDataLayer] = useState([])
  const [eventsLog, setEventsLog] = useState([])
  const [loading, setLoading] = useState(false)
  const [apiUrl] = useState(import.meta.env.VITE_API_URL || 'http://localhost:8000')
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [editData, setEditData] = useState('')
  const [simulateEventName, setSimulateEventName] = useState('')
  const [simulateEventData, setSimulateEventData] = useState('{}')

  // Оновлення dataLayer при змінах
  useEffect(() => {
    const updateDataLayer = () => {
      setDataLayer(getDataLayer())
    }

    updateDataLayer()
    
    // Перевіряємо dataLayer кожні 500мс
    const interval = setInterval(updateDataLayer, 500)
    
    return () => clearInterval(interval)
  }, [])

  // Завантаження логу подій з backend
  const loadEventsLog = async () => {
    if (!apiUrl) {
      alert('VITE_API_URL не налаштовано')
      return
    }

    setLoading(true)
    try {
      const result = await getEventsLog(50)
      setEventsLog(result.events || [])
    } catch (error) {
      alert('Помилка завантаження логу подій: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Очищення логу подій
  const handleClearEventsLog = async () => {
    if (!apiUrl) {
      alert('VITE_API_URL не налаштовано')
      return
    }

    if (!confirm('Ви впевнені, що хочете очистити лог подій?')) {
      return
    }

    try {
      await clearEventsLog()
      setEventsLog([])
      alert('Лог подій очищено')
    } catch (error) {
      alert('Помилка очищення: ' + error.message)
    }
  }

  // Симуляція події
  const handleSimulateEvent = async () => {
    if (!apiUrl) {
      alert('VITE_API_URL не налаштовано')
      return
    }

    try {
      const data = JSON.parse(simulateEventData || '{}')
      const result = await simulateEvent(simulateEventName, data)
      alert('Подія успішно симульована!')
      console.log('Simulation result:', result)
      loadEventsLog()
    } catch (error) {
      alert('Помилка симуляції: ' + error.message)
    }
  }

  // Відправка до GTM Server-Side
  const handleSendToGTMSS = async (item) => {
    if (!apiUrl) {
      alert('VITE_API_URL не налаштовано')
      return
    }

    try {
      const result = await sendToGTMSS(item)
      alert('Подія відправлена до GTM Server-Side!')
      console.log('GTM SS result:', result)
      loadEventsLog()
    } catch (error) {
      alert('Помилка відправки: ' + error.message)
    }
  }

  // Редагування елемента
  const handleEditItem = (index) => {
    setSelectedIndex(index)
    setEditData(JSON.stringify(dataLayer[index], null, 2))
  }

  // Збереження змін
  const handleSaveEdit = () => {
    try {
      const newData = JSON.parse(editData)
      updateDataLayerItem(selectedIndex, newData)
      setSelectedIndex(null)
      setEditData('')
    } catch (error) {
      alert('Помилка в JSON форматі')
    }
  }

  return (
    <div className="data-layer-viewer">
      <h3>DataLayer Viewer & Manager</h3>

      {/* DataLayer маніпуляції */}
      <div className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h4>DataLayer ({dataLayer.length} елементів)</h4>
          <div>
            <button onClick={() => setDataLayer(getDataLayer())} style={{ marginRight: '0.5rem' }}>
              Оновити
            </button>
            <button onClick={() => {
              if (confirm('Ви впевнені, що хочете очистити dataLayer?')) {
                clearDataLayer()
                setDataLayer([])
              }
            }}>
              Очистити
            </button>
          </div>
        </div>

        <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '1rem', borderRadius: '4px', backgroundColor: '#f5f5f5' }}>
          {dataLayer.length === 0 ? (
            <p>DataLayer порожній</p>
          ) : (
            dataLayer.map((item, index) => (
              <div key={index} style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fff', borderRadius: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <strong>Елемент {index}</strong>
                  <div>
                    <button onClick={() => handleEditItem(index)} style={{ marginRight: '0.5rem', fontSize: '0.8rem' }}>
                      Редагувати
                    </button>
                    <button onClick={() => {
                      if (confirm('Видалити цей елемент?')) {
                        removeFromDataLayer(index)
                        setDataLayer(getDataLayer())
                      }
                    }} style={{ marginRight: '0.5rem', fontSize: '0.8rem' }}>
                      Видалити
                    </button>
                    {apiUrl && (
                      <button onClick={() => handleSendToGTMSS(item)} style={{ fontSize: '0.8rem' }}>
                        Відправити до GTM SS
                      </button>
                    )}
                  </div>
                </div>
                <pre style={{ fontSize: '0.85rem', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {JSON.stringify(item, null, 2)}
                </pre>
              </div>
            ))
          )}
        </div>

        {/* Редагування */}
        {selectedIndex !== null && (
          <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
            <h5>Редагування елемента {selectedIndex}</h5>
            <textarea
              value={editData}
              onChange={(e) => setEditData(e.target.value)}
              rows="8"
              style={{ width: '100%', fontFamily: 'monospace', fontSize: '0.85rem' }}
            />
            <div style={{ marginTop: '0.5rem' }}>
              <button onClick={handleSaveEdit} style={{ marginRight: '0.5rem' }}>
                Зберегти
              </button>
              <button onClick={() => {
                setSelectedIndex(null)
                setEditData('')
              }}>
                Скасувати
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Backend API */}
      {apiUrl && (
        <>
          <div className="section">
            <h4>Backend API ({apiUrl})</h4>
            
            <div style={{ marginBottom: '1rem' }}>
              <button onClick={loadEventsLog} disabled={loading} style={{ marginRight: '0.5rem' }}>
                {loading ? 'Завантаження...' : 'Завантажити лог подій'}
              </button>
              <button onClick={handleClearEventsLog}>
                Очистити лог
              </button>
            </div>

            {eventsLog.length > 0 && (
              <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '1rem', borderRadius: '4px', backgroundColor: '#f5f5f5' }}>
                <h5>Лог подій ({eventsLog.length})</h5>
                {eventsLog.map((log, index) => (
                  <div key={index} style={{ marginBottom: '0.5rem', padding: '0.5rem', backgroundColor: '#fff', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                      {new Date(log.timestamp || Date.now()).toLocaleString()}
                    </div>
                    <pre style={{ fontSize: '0.8rem', margin: '0.5rem 0 0 0', whiteSpace: 'pre-wrap' }}>
                      {JSON.stringify(log, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="section">
            <h4>Симуляція Server-Side події</h4>
            <div className="form-group">
              <label>
                Назва події:
                <input
                  type="text"
                  value={simulateEventName}
                  onChange={(e) => setSimulateEventName(e.target.value)}
                  placeholder="test_event"
                />
              </label>
              <label>
                Дані події (JSON):
                <textarea
                  value={simulateEventData}
                  onChange={(e) => setSimulateEventData(e.target.value)}
                  rows="4"
                  placeholder='{"key": "value"}'
                />
              </label>
              <button onClick={handleSimulateEvent}>
                Симулювати подію
              </button>
            </div>
          </div>
        </>
      )}

      {!apiUrl && (
        <div className="section" style={{ padding: '1rem', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
          <p>⚠️ VITE_API_URL не налаштовано. Backend функціональність недоступна.</p>
          <p style={{ fontSize: '0.9rem' }}>Додайте VITE_API_URL до .env файлу для використання backend API.</p>
        </div>
      )}
    </div>
  )
}

export default DataLayerViewer
