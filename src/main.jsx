import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initGTM, initHistoryTracking } from './utils/gtm'

// Ініціалізація GTM (Container ID буде налаштовано через змінні оточення)
// Для тестування можна використовувати тестовий ID або залишити порожнім
const GTM_CONTAINER_ID = import.meta.env.VITE_GTM_CONTAINER_ID || ''

if (GTM_CONTAINER_ID) {
  initGTM(GTM_CONTAINER_ID)
} else {
  console.warn('GTM Container ID не налаштовано. Встановіть VITE_GTM_CONTAINER_ID в .env файлі')
}

// Ініціалізація History API tracking для SPA
initHistoryTracking()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
