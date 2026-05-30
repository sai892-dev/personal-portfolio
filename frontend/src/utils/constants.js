export const API_URL = import.meta.env.VITE_API_URL || '/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const TASK_STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};

export const TASK_PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

export const STATUS_OPTIONS = [
  { value: 'All', label: 'All Status' },
  { value: 'Pending', label: 'Pending' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
];

export const PRIORITY_OPTIONS = [
  { value: 'All', label: 'All Priorities' },
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'title', label: 'Title (A-Z)' },
];

export const STATUS_COLORS = {
  Pending: { bg: 'bg-warning-400/15', text: 'text-warning-600', dot: 'bg-warning-500' },
  'In Progress': { bg: 'bg-primary-400/15', text: 'text-primary-600', dot: 'bg-primary-500' },
  Completed: { bg: 'bg-success-400/15', text: 'text-success-600', dot: 'bg-success-500' },
};

export const PRIORITY_COLORS = {
  Low: { bg: 'bg-success-400/15', text: 'text-success-600', border: 'border-success-400' },
  Medium: { bg: 'bg-warning-400/15', text: 'text-warning-600', border: 'border-warning-400' },
  High: { bg: 'bg-danger-400/15', text: 'text-danger-600', border: 'border-danger-400' },
};
