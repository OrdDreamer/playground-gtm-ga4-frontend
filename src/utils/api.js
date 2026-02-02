const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

/**
 * Відправляє подію до GTM Server-Side endpoint
 */
export async function sendToGTMSS(eventData) {
  try {
    const response = await fetch(`${API_URL}/gtm/collect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error sending to GTM Server-Side:', error)
    throw error
  }
}

/**
 * Отримує лог подій з backend
 */
export async function getEventsLog(limit = 100) {
  try {
    const response = await fetch(`${API_URL}/api/events?limit=${limit}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching events log:', error)
    throw error
  }
}

/**
 * Симулює server-side подію
 */
export async function simulateEvent(eventName, data = {}) {
  try {
    const response = await fetch(`${API_URL}/api/simulate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_name: eventName,
        data: data,
      }),
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error simulating event:', error)
    throw error
  }
}

/**
 * Очищає лог подій
 */
export async function clearEventsLog() {
  try {
    const response = await fetch(`${API_URL}/api/events`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error clearing events log:', error)
    throw error
  }
}
