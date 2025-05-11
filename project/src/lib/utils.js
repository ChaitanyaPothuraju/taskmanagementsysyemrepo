import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, isToday, isYesterday, isTomorrow, addDays } from 'date-fns';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date, formatString = 'PPP') {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isToday(dateObj)) {
      return `Today, ${format(dateObj, 'h:mm a')}`;
    }
    
    if (isYesterday(dateObj)) {
      return `Yesterday, ${format(dateObj, 'h:mm a')}`;
    }
    
    if (isTomorrow(dateObj)) {
      return `Tomorrow, ${format(dateObj, 'h:mm a')}`;
    }

    return format(dateObj, formatString);
  } catch (error) {
    return 'Invalid date';
  }
}

export function generateId(prefix = '') {
  return `${prefix}${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
}

export function getPriorityColor(priority) {
  switch (priority) {
    case 'low':
      return 'bg-blue-100 text-blue-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'high':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getStatusColor(status) {
  switch (status) {
    case 'todo':
      return 'bg-gray-100 text-gray-800';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800';
    case 'review':
      return 'bg-purple-100 text-purple-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function isDueDateNear(dueDate) {
  const today = new Date();
  const due = new Date(dueDate);
  const threeDaysFromNow = addDays(today, 3);
  
  return due <= threeDaysFromNow && due >= today;
}

export function isDueDatePast(dueDate) {
  const today = new Date();
  const due = new Date(dueDate);
  
  return due < today;
}