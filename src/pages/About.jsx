import { useEffect } from 'react'
import ScrollTracker from '../components/ScrollTracker'

function About() {
  useEffect(() => {
    document.title = 'Про нас - GTM/GA4 Test'
  }, [])

  return (
    <div className="page">
      <h1>Про нас</h1>
      <p>Сторінка для тестування scroll tracking</p>
      
      <div className="section">
        <ScrollTracker />
      </div>
    </div>
  )
}

export default About
