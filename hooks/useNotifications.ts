import { useSettings } from './useSettings';

export function useNotifications() {
  const { settings } = useSettings();

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  };

  const showNotification = async (title: string, options?: NotificationOptions) => {
    if (!settings.notifications) return;

    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    });
  };

  return {
    showNotification,
    requestPermission,
  };
} 