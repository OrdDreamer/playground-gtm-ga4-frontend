import { useEffect } from 'react'
import EventTester from '../components/EventTester'
import FormTracker from '../components/FormTracker'

function Home() {
  useEffect(() => {
    document.title = 'Головна - GTM/GA4 Test'
  }, [])

  return (
    <div className="page">
      <h1>Головна сторінка</h1>
      <p>Ласкаво просимо до тестового середовища GTM/GA4</p>
      
      <div className="section">
        <h2>Тестування подій</h2>
        <EventTester />
      </div>

      <div className="section">
        <h2>Відстеження форми</h2>
        <FormTracker />
      </div>
    </div>
  )
}

export default Home
