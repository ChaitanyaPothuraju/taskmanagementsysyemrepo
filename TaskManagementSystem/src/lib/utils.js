import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, isToday, isYesterday, isTomorrow, addDays } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, formatString = 'PPP'): string {
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