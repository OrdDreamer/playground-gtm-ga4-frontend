const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

/**
 * Перевіряє, чи доступний API
 */
export function isApiAvailable() {
  return !!(import.meta.env.VITE_API_URL || API_URL)
}

/**
 * Перевіряє, чи сервер відповідає
 */
export async function checkApiHealth() {
  if (!isApiAvailable()) {
    return false
  }
  
  try {
    // Спробуємо зробити простий запит до API (наприклад, отримати продукти)
    // Якщо ендпоїнт /api/health не існує, використовуємо /api/products
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 секунди таймаут
    
    try {
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'GET',
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      return response.ok || response.status === 404 // 404 теж означає, що сервер відповідає
    } catch (fetchError) {
      clearTimeout(timeoutId)
      // Спробуємо альтернативний ендпоїнт
      try {
        const response = await fetch(`${API_URL}/api/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(2000)
        })
        return response.ok
      } catch {
        return false
      }
    }
  } catch (error) {
    console.warn('API недоступний:', error)
    return false
  }
}

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

/**
 * E-commerce API функції
 */

/**
 * Отримує список продуктів
 * @param {Object} params - Параметри фільтрації (category, limit, offset)
 */
export async function getProducts(params = {}) {
  try {
    const queryParams = new URLSearchParams(params).toString()
    const url = `${API_URL}/api/products${queryParams ? `?${queryParams}` : ''}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

/**
 * Отримує деталі продукту за ID
 * @param {string} productId - ID продукту
 */
export async function getProduct(productId) {
  try {
    const response = await fetch(`${API_URL}/api/products/${productId}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
}

/**
 * Отримує поточний кошик користувача
 */
export async function getCart() {
  try {
    const response = await fetch(`${API_URL}/api/cart`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching cart:', error)
    throw error
  }
}

/**
 * Додає товар до кошика
 * @param {Object} item - Дані товару для додавання
 */
export async function addToCart(item) {
  try {
    const response = await fetch(`${API_URL}/api/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error adding to cart:', error)
    throw error
  }
}

/**
 * Видаляє товар з кошика
 * @param {string} itemId - ID товару для видалення
 */
export async function removeFromCart(itemId) {
  try {
    const response = await fetch(`${API_URL}/api/cart/remove/${itemId}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error removing from cart:', error)
    throw error
  }
}

/**
 * Оновлює кількість товару в кошику
 * @param {string} itemId - ID товару
 * @param {number} quantity - Нова кількість
 */
export async function updateCartItem(itemId, quantity) {
  try {
    const response = await fetch(`${API_URL}/api/cart/update/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error updating cart item:', error)
    throw error
  }
}

/**
 * Очищає кошик
 */
export async function clearCart() {
  try {
    const response = await fetch(`${API_URL}/api/cart`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error clearing cart:', error)
    throw error
  }
}

/**
 * Починає процес оформлення замовлення
 */
export async function beginCheckout() {
  try {
    const response = await fetch(`${API_URL}/api/cart/checkout`, {
      method: 'POST',
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error beginning checkout:', error)
    throw error
  }
}

/**
 * Створює замовлення (purchase)
 * @param {Object} orderData - Дані замовлення
 */
export async function createOrder(orderData) {
  try {
    const response = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error creating order:', error)
    throw error
  }
}

/**
 * Отримує історію замовлень
 * @param {Object} params - Параметри (limit, offset)
 */
export async function getOrders(params = {}) {
  try {
    const queryParams = new URLSearchParams(params).toString()
    const url = `${API_URL}/api/orders${queryParams ? `?${queryParams}` : ''}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw error
  }
}
