import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
};

export const formatRelativeDate = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const getDueDateLabel = (date) => {
  if (!date) return null;
  const d = new Date(date);
  if (isPast(d) && !isToday(d)) return { text: 'Overdue', color: 'text-danger-500' };
  if (isToday(d)) return { text: 'Due Today', color: 'text-warning-500' };
  if (isTomorrow(d)) return { text: 'Due Tomorrow', color: 'text-primary-500' };
  return { text: formatDate(date), color: 'text-surface-500' };
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const truncate = (str, length = 100) => {
  if (!str) return '';
  return str.length > length ? str.substring(0, length) + '...' : str;
};
