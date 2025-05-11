import { useEffect, useRef } from 'react';
import { useNotificationStore } from '../../stores/notificationStore';
import { formatDate } from '../../lib/utils';
import { Bell, CheckCheck, Info, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';

interface NotificationDropdownProps {
  onClose: () => void;
}

export default function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotificationStore();
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50 animate-fade-in"
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
        <h3 className="text-sm font-semibold">Notifications</h3>
        <button
          onClick={markAllAsRead}
          className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"
        >
          <CheckCheck className="h-3.5 w-3.5" />
          <span>Mark all as read</span>
        </button>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-gray-500">
            <Bell className="h-6 w-6 mx-auto mb-2 text-gray-400" />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`px-4 py-3 border-b border-gray-100 last:border-0 ${
                notification.read ? 'bg-white' : 'bg-blue-50'
              }`}
            >
              <div className="flex">
                <div className="flex-shrink-0 mr-3">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(notification.createdAt, 'PPp')}
                  </p>
                </div>
                
                <div className="flex-shrink-0 ml-2 flex flex-col gap-1">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-xs text-primary-600 hover:text-primary-700"
                    >
                      <CheckCheck className="h-4 w-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="text-xs text-gray-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="px-4 py-2 border-t border-gray-200">
        <a href="#" className="text-xs text-primary-600 hover:text-primary-700">
          View all notifications
        </a>
      </div>
    </div>
  );
}