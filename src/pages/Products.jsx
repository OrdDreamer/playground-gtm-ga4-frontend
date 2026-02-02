import { useEffect } from 'react'
import EcommerceDemo from '../components/EcommerceDemo'

function Products() {
  useEffect(() => {
    document.title = 'Продукти - GTM/GA4 Test'
  }, [])

  return (
    <div className="page">
      <h1>Сторінка продуктів</h1>
      <p>Тестування e-commerce подій</p>
      
      <div className="section">
        <EcommerceDemo />
      </div>
    </div>
  )
}

export default Products
