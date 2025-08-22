import { useState, useCallback, useEffect } from 'react';
import { Motion, AnimatePresence } from '../../utils/animations';
import { X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationSystemProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxNotifications?: number;
}

export function NotificationSystem({ 
  position = 'top-right',
  maxNotifications = 5 
}: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 5000,
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      return updated.slice(0, maxNotifications);
    });

    const duration = newNotification.duration ?? 0;
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  }, [maxNotifications]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-success-container border-success-container text-on-success-container';
      case 'error':
        return 'bg-error-container border-error-container text-on-error-container';
      case 'warning':
        return 'bg-warning-container border-warning-container text-on-warning-container';
      case 'info':
        return 'bg-info-container border-info-container text-on-info-container';
    }
  };

  const getIconColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'text-success';
      case 'error':
        return 'text-error';
      case 'warning':
        return 'text-warning';
      case 'info':
        return 'text-info';
    }
  };

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  // Make notification system globally accessible
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).notificationSystem = { addNotification, removeNotification };
    }
  }, [addNotification, removeNotification]);

  return (
    <div className={`fixed z-50 space-y-2 ${positionClasses[position]}`}>
      <AnimatePresence mode="sync">
        {notifications.map((notification) => (
          <Motion
            key={notification.id}
            initial={{ opacity: 0, x: position.includes('right') ? 100 : position.includes('left') ? -100 : 0, y: position.includes('bottom') ? 100 : -100 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: position.includes('right') ? 100 : position.includes('left') ? -100 : 0, y: position.includes('bottom') ? 100 : -100 }}
            transition={{ duration: 0.3, ease: 'ease-out' }}
            className={`min-w-[300px] max-w-sm rounded-lg border p-4 shadow-lg ${getStyles(notification.type)}`}
          >
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 ${getIconColor(notification.type)}`}>
                {getIcon(notification.type)}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{notification.title}</h4>
                <p className="text-sm mt-1 opacity-90">{notification.message}</p>
                {notification.action && (
                  <button
                    onClick={() => {
                      notification.action?.onClick();
                      removeNotification(notification.id);
                    }}
                    className="text-sm font-medium mt-2 underline hover:no-underline"
                  >
                    {notification.action.label}
                  </button>
                )}
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="flex-shrink-0 ml-2 hover:opacity-70 transition-opacity"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </Motion>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Hook for using notifications
export function useNotifications() {
  const [notificationSystem, setNotificationSystem] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setNotificationSystem((window as any).notificationSystem);
    }
  }, []);

  const showNotification = (notification: Omit<Notification, 'id'>) => {
    if (notificationSystem) {
      notificationSystem.addNotification(notification);
    } else {
      console.warn('Notification system not initialized');
    }
  };

  return { showNotification };
}

export default NotificationSystem;