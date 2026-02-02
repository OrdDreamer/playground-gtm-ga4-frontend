import { useState } from 'react'
import { pushToDataLayer } from '../utils/gtm'

const mockProducts = [
  { id: 'prod1', name: 'Тестовий продукт 1', price: 99.99, category: 'Електроніка' },
  { id: 'prod2', name: 'Тестовий продукт 2', price: 149.99, category: 'Одяг' },
  { id: 'prod3', name: 'Тестовий продукт 3', price: 79.99, category: 'Аксесуари' }
]

function EcommerceDemo() {
  const [cart, setCart] = useState([])

  const handleAddToCart = (product) => {
    const item = {
      item_id: product.id,
      item_name: product.name,
      price: product.price,
      item_category: product.category,
      quantity: 1
    }

    pushToDataLayer({
      event: 'add_to_cart',
      currency: 'UAH',
      value: product.price,
      items: [item]
    })

    setCart([...cart, item])
  }

  const handleRemoveFromCart = (productId) => {
    const product = cart.find(item => item.item_id === productId)
    if (product) {
      pushToDataLayer({
        event: 'remove_from_cart',
        currency: 'UAH',
        value: product.price,
        items: [product]
      })
      setCart(cart.filter(item => item.item_id !== productId))
    }
  }

  const handleBeginCheckout = () => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    pushToDataLayer({
      event: 'begin_checkout',
      currency: 'UAH',
      value: total,
      items: cart
    })
  }

  const handlePurchase = () => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const transactionId = `TXN-${Date.now()}`
    
    pushToDataLayer({
      event: 'purchase',
      transaction_id: transactionId,
      currency: 'UAH',
      value: total,
      items: cart
    })

    setCart([])
    alert(`Замовлення оформлено! ID: ${transactionId}`)
  }

  const handleViewItemList = () => {
    pushToDataLayer({
      event: 'view_item_list',
      item_list_id: 'products_page',
      item_list_name: 'Сторінка продуктів',
      items: mockProducts.map(p => ({
        item_id: p.id,
        item_name: p.name,
        price: p.price,
        item_category: p.category
      }))
    })
  }

  return (
    <div className="ecommerce-demo">
      <h3>E-commerce події</h3>
      
      <div className="section">
        <h4>Продукти</h4>
        <button onClick={handleViewItemList} className="action-button">
          View Item List
        </button>
        <div className="products-grid">
          {mockProducts.map(product => (
            <div key={product.id} className="product-card">
              <h5>{product.name}</h5>
              <p>Ціна: {product.price} UAH</p>
              <p>Категорія: {product.category}</p>
              <button onClick={() => handleAddToCart(product)}>
                Додати до кошика
              </button>
            </div>
          ))}
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
                <li key={index}>
                  {item.item_name} - {item.price} UAH
                  <button onClick={() => handleRemoveFromCart(item.item_id)}>
                    Видалити
                  </button>
                </li>
              ))}
            </ul>
            <div className="cart-actions">
              <button onClick={handleBeginCheckout}>
                Почати оформлення
              </button>
              <button onClick={handlePurchase}>
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
