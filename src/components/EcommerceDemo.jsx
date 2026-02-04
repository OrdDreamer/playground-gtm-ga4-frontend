import { useState, useEffect } from 'react'
import { pushToDataLayer } from '../utils/gtm'
import {
  getProducts,
  getCart,
  addToCart as addToCartAPI,
  removeFromCart as removeFromCartAPI,
  beginCheckout as beginCheckoutAPI,
  createOrder,
  isApiAvailable,
  checkApiHealth
} from '../utils/api'

// Mock продукти для офлайн режиму
const MOCK_PRODUCTS = [
  { id: 'prod1', name: 'Тестовий продукт 1', price: 99.99, category: 'Електроніка' },
  { id: 'prod2', name: 'Тестовий продукт 2', price: 149.99, category: 'Одяг' },
  { id: 'prod3', name: 'Тестовий продукт 3', price: 79.99, category: 'Аксесуари' }
]

const CART_STORAGE_KEY = 'ecommerce_cart'
const OFFLINE_MODE_KEY = 'ecommerce_offline_mode'

function EcommerceDemo() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [offlineMode, setOfflineMode] = useState(false)
  const [apiAvailable, setApiAvailable] = useState(false)

  // Завантаження збереженого стану офлайн режиму
  useEffect(() => {
    const savedOfflineMode = localStorage.getItem(OFFLINE_MODE_KEY)
    if (savedOfflineMode === 'true') {
      setOfflineMode(true)
    }
    
    // Завантаження кошика з localStorage
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (e) {
        console.error('Помилка завантаження кошика з localStorage:', e)
      }
    }
  }, [])

  // Перевірка доступності API та завантаження даних
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Перевірка, чи вручну встановлено офлайн режим
        if (offlineMode) {
          setProducts(MOCK_PRODUCTS)
          setLoading(false)
          return
        }

        // Перевірка наявності API URL
        if (!isApiAvailable()) {
          console.warn('API URL не вказано, перехід в офлайн режим')
          setOfflineMode(true)
          setProducts(MOCK_PRODUCTS)
          setLoading(false)
          return
        }

        // Перевірка доступності сервера
        const isAvailable = await checkApiHealth()
        setApiAvailable(isAvailable)

        if (!isAvailable) {
          console.warn('Сервер недоступний, перехід в офлайн режим')
          setOfflineMode(true)
          setProducts(MOCK_PRODUCTS)
          setLoading(false)
          return
        }

        // Завантаження даних з сервера
        try {
          const [productsData, cartData] = await Promise.all([
            getProducts(),
            getCart()
          ])
          
          setProducts(productsData.products || productsData || MOCK_PRODUCTS)
          const serverCart = cartData.items || cartData || []
          setCart(serverCart)
          
          // Синхронізація з localStorage
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(serverCart))
        } catch (err) {
          console.warn('Помилка завантаження з сервера, використовуємо офлайн режим:', err)
          setOfflineMode(true)
          setProducts(MOCK_PRODUCTS)
        }
      } catch (err) {
        console.error('Помилка завантаження даних:', err)
        setOfflineMode(true)
        setProducts(MOCK_PRODUCTS)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [offlineMode])

  // Збереження кошика в localStorage при зміні
  useEffect(() => {
    if (cart.length > 0 || offlineMode) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    }
  }, [cart, offlineMode])

  // Перемикання офлайн режиму
  const toggleOfflineMode = async () => {
    const newMode = !offlineMode
    setOfflineMode(newMode)
    localStorage.setItem(OFFLINE_MODE_KEY, newMode.toString())
    
    if (!newMode) {
      // Спробувати підключитися до API
      setLoading(true)
      try {
        if (isApiAvailable()) {
          const isAvailable = await checkApiHealth()
          setApiAvailable(isAvailable)
          
          if (isAvailable) {
            const [productsData, cartData] = await Promise.all([
              getProducts(),
              getCart()
            ])
            setProducts(productsData.products || productsData || MOCK_PRODUCTS)
            const serverCart = cartData.items || cartData || []
            setCart(serverCart)
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(serverCart))
          } else {
            setError('Сервер недоступний')
          }
        }
      } catch (err) {
        console.error('Помилка підключення до API:', err)
        setError('Не вдалося підключитися до сервера')
      } finally {
        setLoading(false)
      }
    } else {
      setProducts(MOCK_PRODUCTS)
    }
  }

  const handleAddToCart = async (product) => {
    const item = {
      item_id: product.id,
      item_name: product.name,
      price: product.price,
      item_category: product.category,
      quantity: 1
    }

    // GTM подія
    pushToDataLayer({
      event: 'add_to_cart',
      currency: 'UAH',
      value: product.price,
      items: [item]
    })

    if (offlineMode || !apiAvailable) {
      // Офлайн режим - працюємо локально
      const existingItem = cart.find(cartItem => cartItem.item_id === product.id)
      if (existingItem) {
        setCart(cart.map(cartItem => 
          cartItem.item_id === product.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        ))
      } else {
        setCart([...cart, item])
      }
      return
    }

    // Онлайн режим - відправка на сервер
    try {
      const response = await addToCartAPI({
        product_id: product.id,
        quantity: 1
      })

      const updatedCart = response.cart?.items || response.items || [...cart, item]
      setCart(updatedCart)
    } catch (err) {
      console.error('Помилка додавання до кошика, перехід в офлайн режим:', err)
      // Fallback на локальну роботу
      const existingItem = cart.find(cartItem => cartItem.item_id === product.id)
      if (existingItem) {
        setCart(cart.map(cartItem => 
          cartItem.item_id === product.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        ))
      } else {
        setCart([...cart, item])
      }
      setOfflineMode(true)
      setError('Сервер недоступний, працюємо в офлайн режимі')
    }
  }

  const handleRemoveFromCart = async (productId) => {
    const product = cart.find(item => item.item_id === productId)
    if (!product) return

    // GTM подія
    pushToDataLayer({
      event: 'remove_from_cart',
      currency: 'UAH',
      value: product.price,
      items: [product]
    })

    if (offlineMode || !apiAvailable) {
      // Офлайн режим - працюємо локально
      setCart(cart.filter(item => item.item_id !== productId))
      return
    }

    // Онлайн режим - відправка на сервер
    try {
      const response = await removeFromCartAPI(productId)
      const updatedCart = response.cart?.items || response.items || cart.filter(item => item.item_id !== productId)
      setCart(updatedCart)
    } catch (err) {
      console.error('Помилка видалення з кошика, перехід в офлайн режим:', err)
      // Fallback на локальну роботу
      setCart(cart.filter(item => item.item_id !== productId))
      setOfflineMode(true)
      setError('Сервер недоступний, працюємо в офлайн режимі')
    }
  }

  const handleBeginCheckout = async () => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    
    // GTM подія
    pushToDataLayer({
      event: 'begin_checkout',
      currency: 'UAH',
      value: total,
      items: cart
    })

    if (offlineMode || !apiAvailable) {
      // В офлайн режимі просто відправляємо GTM подію
      return
    }

    // Онлайн режим - відправка на сервер
    try {
      await beginCheckoutAPI()
    } catch (err) {
      console.error('Помилка початку оформлення:', err)
      setError('Не вдалося почати оформлення замовлення, але подія відправлена в GTM')
    }
  }

  const handlePurchase = async () => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const transactionId = `TXN-${Date.now()}`
    
    // GTM подія
    pushToDataLayer({
      event: 'purchase',
      transaction_id: transactionId,
      currency: 'UAH',
      value: total,
      items: cart
    })

    if (offlineMode || !apiAvailable) {
      // Офлайн режим - очищаємо кошик локально
      setCart([])
      localStorage.removeItem(CART_STORAGE_KEY)
      alert(`Замовлення оформлено в офлайн режимі! ID: ${transactionId}`)
      return
    }

    // Онлайн режим - створення замовлення на сервері
    try {
      const orderData = {
        items: cart.map(item => ({
          product_id: item.item_id,
          quantity: item.quantity,
          price: item.price
        })),
        currency: 'UAH',
        total_value: total
      }
      
      const response = await createOrder(orderData)
      const serverTransactionId = response.order?.transaction_id || response.transaction_id || transactionId
      
      setCart([])
      localStorage.removeItem(CART_STORAGE_KEY)
      alert(`Замовлення оформлено! ID: ${serverTransactionId}`)
    } catch (err) {
      console.error('Помилка оформлення замовлення:', err)
      // Навіть якщо сервер не відповів, очищаємо кошик (GTM подія вже відправлена)
      setCart([])
      localStorage.removeItem(CART_STORAGE_KEY)
      alert(`Замовлення оформлено (офлайн)! ID: ${transactionId}`)
      setOfflineMode(true)
      setError('Сервер недоступний, замовлення збережено локально')
    }
  }

  const handleViewItemList = () => {
    pushToDataLayer({
      event: 'view_item_list',
      item_list_id: 'products_page',
      item_list_name: 'Сторінка продуктів',
      items: products.map(p => ({
        item_id: p.id,
        item_name: p.name,
        price: p.price,
        item_category: p.category
      }))
    })
  }

  if (loading) {
    return (
      <div className="ecommerce-demo">
        <p>Завантаження...</p>
      </div>
    )
  }

  return (
    <div className="ecommerce-demo">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3>E-commerce події</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              id="offline-mode-toggle"
              data-analytics-id="offline-mode-toggle"
              type="checkbox"
              checked={offlineMode}
              onChange={toggleOfflineMode}
            />
            <span style={{ color: offlineMode ? '#ff6b6b' : '#51cf66', fontWeight: 'bold' }}>
              {offlineMode ? '🔴 Офлайн режим' : '🟢 Онлайн режим'}
            </span>
          </label>
        </div>
      </div>
      
      {offlineMode && (
        <div style={{ 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffc107', 
          padding: '0.75rem', 
          borderRadius: '4px',
          marginBottom: '1rem',
          color: '#856404'
        }}>
          ⚠️ Працюємо в офлайн режимі. Дані зберігаються локально.
        </div>
      )}

      {error && (
        <div style={{ 
          color: 'red', 
          marginBottom: '1rem',
          padding: '0.75rem',
          backgroundColor: '#ffe0e0',
          borderRadius: '4px',
          border: '1px solid #ff6b6b'
        }}>
          {error}
          <button 
            id="error-close-button"
            data-analytics-id="error-close-button"
            onClick={() => setError(null)}
            style={{ marginLeft: '1rem', padding: '0.25rem 0.5rem' }}
          >
            ✕
          </button>
        </div>
      )}
      
      <div className="section">
        <h4>Продукти</h4>
        <button 
          id="view-item-list-button"
          data-analytics-id="view-item-list-button"
          onClick={handleViewItemList} 
          className="action-button"
        >
          View Item List
        </button>
        <div className="products-grid">
          {products.length === 0 ? (
            <p>Продуктів не знайдено</p>
          ) : (
            products.map(product => (
              <div 
                key={product.id} 
                id={`product-card-${product.id}`}
                data-analytics-id={`product-card-${product.id}`}
                className="product-card"
              >
                <h5>{product.name}</h5>
                <p>Ціна: {product.price} UAH</p>
                <p>Категорія: {product.category}</p>
                <button 
                  id={`add-to-cart-button-${product.id}`}
                  data-analytics-id={`add-to-cart-button-${product.id}`}
                  onClick={() => handleAddToCart(product)}
                >
                  Додати до кошика
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="section">
        <h4>Кошик ({cart.length} товарів)</h4>
        {cart.length === 0 ? (
          <p>Кошик порожній</p>
        ) : (
          <>
            <ul>
              {cart.map((item, index) => (
                <li 
                  key={index}
                  id={`cart-item-${item.item_id}`}
                  data-analytics-id={`cart-item-${item.item_id}`}
                >
                  {item.item_name} - {item.price} UAH (x{item.quantity || 1})
                  <button 
                    id={`remove-from-cart-button-${item.item_id}`}
                    data-analytics-id={`remove-from-cart-button-${item.item_id}`}
                    onClick={() => handleRemoveFromCart(item.item_id)}
                  >
                    Видалити
                  </button>
                </li>
              ))}
            </ul>
            <div className="cart-actions">
              <button 
                id="begin-checkout-button"
                data-analytics-id="begin-checkout-button"
                onClick={handleBeginCheckout}
              >
                Почати оформлення
              </button>
              <button 
                id="complete-purchase-button"
                data-analytics-id="complete-purchase-button"
                onClick={handlePurchase}
              >
                Завершити покупку
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default EcommerceDemo
