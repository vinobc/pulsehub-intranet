const CACHE_NAME = 'pulsehub-v1'
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response
        }
        return fetch(event.request)
      })
  )
})

self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from PulseHub',
    icon: '/vite.svg',
    badge: '/vite.svg'
  }

  event.waitUntil(
    self.registration.showNotification('PulseHub', options)
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow('/')
  )
})