import { Bell, Menu, X } from 'lucide-react';
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
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const unreadCount = getUnreadCount();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Left side - Logo and menu button */}
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
            <span className="text-lg font-semibold text-gray-900">TaskFlow</span>
          </div>
        </div>
        
        {/* Right side - Notifications and Profile */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button
              className="p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none relative"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <NotificationDropdown onClose={() => setShowNotifications(false)} />
            )}
          </div>
          
          {/* Profile */}
          <div className="relative">
            <button
              className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none"
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
            >
              <img
                src={user?.picture || "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150"}
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover border border-gray-200"
              />
            </button>
            
            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-semibold">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
                </div>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile Settings
                </a>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}