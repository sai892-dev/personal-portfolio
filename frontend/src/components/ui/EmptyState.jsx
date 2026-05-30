import { ClipboardList } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  title = 'No tasks yet',
  description = 'Create your first task to get started',
  icon: Icon = ClipboardList,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-primary-500" />
      </div>
      <h3 className="text-xl font-semibold text-surface-800 dark:text-surface-200 mb-2">
        {title}
      </h3>
      <p className="text-surface-500 dark:text-surface-400 text-center max-w-sm mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
};

export default EmptyState;
