import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackVirtualPageView } from '../utils/gtm'

function SPANavigation() {
  const location = useLocation()

  useEffect(() => {
    // Відстеження зміни маршруту в SPA
    const pageTitle = document.title || 'GTM/GA4 Test'
    const pagePath = location.pathname

    trackVirtualPageView(pagePath, pageTitle)

    // Також відправляємо стандартну page_view подію
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: 'page_view',
      page_title: pageTitle,
      page_location: window.location.origin + pagePath,
      page_path: pagePath,
      spa_navigation: true
    })
  }, [location])

  return null // Цей компонент не рендерить нічого
}

export default SPANavigation
