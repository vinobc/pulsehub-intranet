import { useState, useEffect } from 'react'
import { PWAService } from '../services/pwaService'

export function PWAInstallPrompt() {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    const pwaService = PWAService.getInstance()
    
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      PWAService.getInstance().showNotification('PulseHub installed successfully!', {
        body: 'You can now access PulseHub from your home screen'
      })
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    pwaService.registerServiceWorker()
    pwaService.isInstalled().then(setIsInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      ;(deferredPrompt as Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> }).prompt()
      const { outcome } = await (deferredPrompt as Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> }).userChoice
      if (outcome === 'accepted') {
        setShowInstallPrompt(false)
      }
      setDeferredPrompt(null)
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
  }

  const requestNotifications = async () => {
    const permission = await PWAService.getInstance().requestNotificationPermission()
    if (permission === 'granted') {
      await PWAService.getInstance().subscribeToPushNotifications()
      PWAService.getInstance().showNotification('Notifications enabled!', {
        body: 'You\'ll now receive updates from PulseHub'
      })
    }
  }

  if (isInstalled || !showInstallPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Install PulseHub
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Add to your home screen for quick access
          </p>
          <div className="flex space-x-2 mt-3">
            <button
              onClick={handleInstall}
              className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
            >
              Install
            </button>
            <button
              onClick={requestNotifications}
              className="text-xs bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors"
            >
              Enable Notifications
            </button>
            <button
              onClick={handleDismiss}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}