// Offline support utilities

// Register service worker
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('SW registered:', registration);
          
          // Request notification permission
          if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
          }
        })
        .catch((error) => {
          console.log('SW registration failed:', error);
        });
    });
  }
};

// Check if app is online
export const isOnline = () => {
  return navigator.onLine;
};

// Local storage helpers
export const saveToLocal = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

export const getFromLocal = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

export const removeFromLocal = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};

// Queue offline actions
const OFFLINE_QUEUE_KEY = 'offline_queue';

export const queueOfflineAction = (action) => {
  const queue = getFromLocal(OFFLINE_QUEUE_KEY) || [];
  queue.push({
    ...action,
    timestamp: new Date().toISOString()
  });
  saveToLocal(OFFLINE_QUEUE_KEY, queue);
};

export const getOfflineQueue = () => {
  return getFromLocal(OFFLINE_QUEUE_KEY) || [];
};

export const clearOfflineQueue = () => {
  removeFromLocal(OFFLINE_QUEUE_KEY);
};

// Push notification subscription
export const subscribeToPushNotifications = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('Push notifications not supported');
    return null;
  }
  
  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Check if already subscribed
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      // Subscribe to push notifications
      // Note: You'll need to generate VAPID keys for production
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          'BEl62iUYgUivxIkv69yViEuiBIa-Ib37J8xQmrLSVPFIRgQqOwGIwXlNkfOoSHwPpOejXIgLJy7o0L9OYS7YWkA'
        )
      });
    }
    
    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
    return null;
  }
};

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Schedule daily reminder (using local notification as fallback)
export const scheduleDailyReminder = (time = '09:00') => {
  if ('Notification' in window && Notification.permission === 'granted') {
    // Calculate time until next reminder
    const now = new Date();
    const [hours, minutes] = time.split(':');
    const reminderTime = new Date();
    reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }
    
    const timeUntilReminder = reminderTime.getTime() - now.getTime();
    
    setTimeout(() => {
      new Notification('Daily Wellness Check-in 💕', {
        body: 'Time to log your habits and track your progress!',
        icon: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'48\' fill=\'%23D8B4F8\'/%3E%3Ctext x=\'50\' y=\'65\' font-size=\'50\' text-anchor=\'middle\' fill=\'white\'%3E💕%3C/text%3E%3C/svg%3E',
        requireInteraction: false
      });
      
      // Schedule next day's reminder
      scheduleDailyReminder(time);
    }, timeUntilReminder);
  }
};

// Install prompt
let deferredPrompt;

export const setupInstallPrompt = (callback) => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (callback) callback(true);
  });
  
  window.addEventListener('appinstalled', () => {
    console.log('PWA installed');
    deferredPrompt = null;
  });
};

export const showInstallPrompt = async () => {
  if (!deferredPrompt) {
    return false;
  }
  
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  
  console.log(`User ${outcome} the install prompt`);
  deferredPrompt = null;
  
  return outcome === 'accepted';
};