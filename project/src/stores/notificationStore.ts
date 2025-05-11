import { create } from 'zustand';
import { Notification } from '../types';
import { generateId } from '../lib/utils';

interface NotificationState {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  deleteAllNotifications: () => void;
  getUnreadCount: () => number;
}

// Mock data for demonstration
const initialNotifications: Notification[] = [
  {
    id: 'notification-1',
    title: 'Task due soon',
    message: 'Your task "Create project plan" is due in 2 days',
    type: 'warning',
    read: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'notification-2',
    title: 'New project member',
    message: 'John Doe joined the "Website Redesign" project',
    type: 'info',
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
  },
  {
    id: 'notification-3',
    title: 'Task completed',
    message: 'Your task "Write documentation" was marked as completed',
    type: 'success',
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  }
];

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: initialNotifications,
  isLoading: false,
  error: null,
  
  addNotification: (notification) => {
    const newNotification: Notification = {
      id: generateId('notification-'),
      ...notification,
      read: false,
      createdAt: new Date().toISOString(),
    };
    
    set((state) => ({ 
      notifications: [newNotification, ...state.notifications] 
    }));
  },
  
  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((notification) => 
        notification.id === id
          ? { ...notification, read: true }
          : notification
      ),
    }));
  },
  
  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        read: true
      })),
    }));
  },
  
  deleteNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.id !== id
      ),
    }));
  },
  
  deleteAllNotifications: () => {
    set({ notifications: [] });
  },
  
  getUnreadCount: () => {
    return get().notifications.filter((notification) => !notification.read).length;
  },
}));