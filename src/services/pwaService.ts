export class PWAService {
  private static instance: PWAService

  static getInstance(): PWAService {
    if (!PWAService.instance) {
      PWAService.instance = new PWAService()
    }
    return PWAService.instance
  }

  async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js')
        console.log('Service Worker registered:', registration)
        
        registration.addEventListener('updatefound', () => {
          console.log('New service worker found')
        })
      } catch (error) {
        console.error('Service Worker registration failed:', error)
      }
    }
  }

  async requestNotificationPermission(): Promise<NotificationPermission> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission
    }
    return 'denied'
  }

  async subscribeToPushNotifications(): Promise<PushSubscription | null> {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(
            'BEhzW_8pYYaWF_1cQ7vJxzJJ0l-TqfwU0wYJP3yOhkEQYgQgJhG_J6K-cqnXJ4FGqCk_MJtVhSWdCHdKjNlhG_k'
          )
        })
        return subscription
      } catch (error) {
        console.error('Push subscription failed:', error)
        return null
      }
    }
    return null
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  showNotification(title: string, options?: NotificationOptions): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/vite.svg',
        badge: '/vite.svg',
        ...options
      })
    }
  }

  isInstallable(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window
  }

  async isInstalled(): Promise<boolean> {
    if ('getInstalledRelatedApps' in navigator) {
      const apps = await (navigator as Navigator & { getInstalledRelatedApps: () => Promise<unknown[]> }).getInstalledRelatedApps()
      return apps.length > 0
    }
    return false
  }
}