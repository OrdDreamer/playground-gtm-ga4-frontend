import { useEffect } from 'react'
import { pushToDataLayer } from '../utils/gtm'

function ScrollTracker() {
  useEffect(() => {
    let scrollTimeout
    let lastScrollPercent = 0

    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      
      scrollTimeout = setTimeout(() => {
        const windowHeight = window.innerHeight
        const documentHeight = document.documentElement.scrollHeight
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const scrollPercent = Math.round((scrollTop / (documentHeight - windowHeight)) * 100)

        // Відправляємо подію при досягненні 25%, 50%, 75%, 90%
        if (scrollPercent >= 25 && lastScrollPercent < 25) {
          pushToDataLayer({
            event: 'scroll',
            scroll_depth: 25
          })
        } else if (scrollPercent >= 50 && lastScrollPercent < 50) {
          pushToDataLayer({
            event: 'scroll',
            scroll_depth: 50
          })
        } else if (scrollPercent >= 75 && lastScrollPercent < 75) {
          pushToDataLayer({
            event: 'scroll',
            scroll_depth: 75
          })
        } else if (scrollPercent >= 90 && lastScrollPercent < 90) {
          pushToDataLayer({
            event: 'scroll',
            scroll_depth: 90
          })
        }

        lastScrollPercent = scrollPercent
      }, 100)
    }

    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])

  return (
    <div className="scroll-tracker">
      <h3>Scroll Tracking</h3>
      <p>Прокрутіть сторінку вниз, щоб протестувати scroll події</p>
      <div style={{ height: '2000px', padding: '20px', background: 'linear-gradient(to bottom, #f0f0f0, #e0e0e0)' }}>
        <p>Контент для прокрутки...</p>
        <p style={{ marginTop: '500px' }}>25% прокрутки</p>
        <p style={{ marginTop: '500px' }}>50% прокрутки</p>
        <p style={{ marginTop: '500px' }}>75% прокрутки</p>
        <p style={{ marginTop: '500px' }}>90% прокрутки</p>
      </div>
    </div>
  )
}

export default ScrollTracker
