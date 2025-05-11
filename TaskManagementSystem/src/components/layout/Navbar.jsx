import { Bell, Menu } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useState } from 'react';
import { useNotificationStore } from '../../stores/notificationStore';
import NotificationDropdown from '../notifications/NotificationDropdown';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuthStore();
  const { getUnreadCount } = useNotificationStore();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = getUnreadCount();

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Left - Menu and Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary-600"
            >
              <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <span className="text-lg font-semibold text-gray-900">
              TaskFlow
            </span>
          </div>
        </div>

        {/* Right - Notifications and user info */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && <NotificationDropdown />}
          </div>

          <div className="text-sm text-gray-700">
            {user?.name || 'User'}
          </div>
          <button
            onClick={logout}
            className="text-sm text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
