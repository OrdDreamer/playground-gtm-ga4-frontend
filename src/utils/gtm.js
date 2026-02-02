/**
 * GTM Helper функції для роботи з dataLayer
 */

// Перевіряємо, чи існує dataLayer, якщо ні - створюємо
window.dataLayer = window.dataLayer || []

/**
 * Додає подію до dataLayer
 * @param {Object} data - Дані події
 */
export function pushToDataLayer(data) {
  if (window.dataLayer) {
    window.dataLayer.push(data)
    console.log('GTM Event pushed:', data)
  } else {
    console.warn('dataLayer не ініціалізовано')
  }
}

/**
 * Відправляє page_view подію
 * @param {Object} options - Додаткові параметри
 */
export function trackPageView(options = {}) {
  pushToDataLayer({
    event: 'page_view',
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname,
    ...options
  })
}

/**
 * Відправляє віртуальну page_view подію для SPA
 * @param {string} pagePath - Шлях сторінки
 * @param {string} pageTitle - Заголовок сторінки
 */
export function trackVirtualPageView(pagePath, pageTitle) {
  pushToDataLayer({
    event: 'virtual_pageview',
    page_title: pageTitle,
    page_location: window.location.origin + pagePath,
    page_path: pagePath
  })
}

/**
 * Відправляє click подію
 * @param {Object} options - Параметри кліку
 */
export function trackClick(options = {}) {
  pushToDataLayer({
    event: 'click',
    ...options
  })
}

/**
 * Ініціалізує GTM контейнер
 * @param {string} containerId - GTM Container ID
 */
export function initGTM(containerId) {
  if (!containerId) {
    console.warn('GTM Container ID не вказано')
    return
  }

  // Додаємо GTM script
  const script1 = document.createElement('script')
  script1.async = true
  script1.src = `https://www.googletagmanager.com/gtm.js?id=${containerId}`
  document.head.appendChild(script1)

  // Додаємо noscript fallback
  const noscript = document.createElement('noscript')
  noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${containerId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`
  document.body.insertBefore(noscript, document.body.firstChild)

  console.log('GTM ініціалізовано:', containerId)
}

/**
 * Ініціалізує відстеження History API для SPA
 */
export function initHistoryTracking() {
  // Зберігаємо оригінальний pushState
  const originalPushState = history.pushState
  const originalReplaceState = history.replaceState

  // Перевизначаємо pushState
  history.pushState = function(...args) {
    originalPushState.apply(history, args)
    const [state, title, url] = args
    if (url) {
      trackVirtualPageView(url, title || document.title)
    }
  }

  // Перевизначаємо replaceState
  history.replaceState = function(...args) {
    originalReplaceState.apply(history, args)
    const [state, title, url] = args
    if (url) {
      trackVirtualPageView(url, title || document.title)
    }
  }

  // Відстеження popstate (назад/вперед)
  window.addEventListener('popstate', () => {
    trackVirtualPageView(window.location.pathname, document.title)
  })

  console.log('History API tracking ініціалізовано')
}
