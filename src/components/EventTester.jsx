import { useState } from 'react'
import { pushToDataLayer } from '../utils/gtm'

function EventTester() {
  const [eventName, setEventName] = useState('')
  const [eventData, setEventData] = useState('{}')

  const handleStandardEvent = (eventType) => {
    pushToDataLayer({
      event: eventType,
      page_title: document.title,
      page_location: window.location.href,
      timestamp: new Date().toISOString()
    })
  }

  const handleCustomEvent = () => {
    try {
      const data = JSON.parse(eventData)
      pushToDataLayer({
        event: eventName || 'custom_event',
        ...data
      })
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert('Помилка в JSON форматі')
    }
  }

  return (
    <div className="event-tester">
      <h3>Тестування стандартних подій</h3>
      <div className="button-group">
        <button onClick={() => handleStandardEvent('page_view')}>
          Page View
        </button>
        <button onClick={() => handleStandardEvent('click')}>
          Click
        </button>
        <button onClick={() => handleStandardEvent('scroll')}>
          Scroll
        </button>
        <button onClick={() => handleStandardEvent('view_item')}>
          View Item
        </button>
      </div>

      <h3>Тестування кастомних подій</h3>
      <div className="form-group">
        <label>
          Назва події:
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="custom_event"
          />
        </label>
        <label>
          Дані події (JSON):
          <textarea
            value={eventData}
            onChange={(e) => setEventData(e.target.value)}
            rows="4"
            placeholder='{"key": "value"}'
          />
        </label>
        <button onClick={handleCustomEvent}>
          Відправити кастомну подію
        </button>
      </div>
    </div>
  )
}

export default EventTester
