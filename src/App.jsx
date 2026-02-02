import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import Products from './pages/Products'
import Checkout from './pages/Checkout'
import About from './pages/About'
import SPANavigation from './components/SPANavigation'
import { trackPageView } from './utils/gtm'
import './App.css'

function App() {
  useEffect(() => {
    // Відстеження початкового page_view
    trackPageView()
  }, [])

  return (
    <BrowserRouter>
      <SPANavigation />
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">GTM/GA4 Test</Link>
            <div className="nav-links">
              <Link to="/">Головна</Link>
              <Link to="/products">Продукти</Link>
              <Link to="/checkout">Оформлення</Link>
              <Link to="/about">Про нас</Link>
            </div>
          </div>
        </nav>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
