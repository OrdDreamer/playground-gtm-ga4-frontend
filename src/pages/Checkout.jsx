import { useEffect } from 'react'

function Checkout() {
  useEffect(() => {
    document.title = 'Оформлення - GTM/GA4 Test'
  }, [])

  return (
    <div className="page">
      <h1>Сторінка оформлення</h1>
      <p>Сторінка для тестування подій оформлення замовлення</p>
    </div>
  )
}

export default Checkout
