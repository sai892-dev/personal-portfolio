import { Loader2 } from 'lucide-react';

const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`${sizes[size]} animate-spin text-primary-500`} />
    </div>
  );
};

export const PageSpinner = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary-200 dark:border-primary-900 rounded-full" />
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="text-sm text-surface-500 dark:text-surface-400 animate-pulse">
        Loading...
      </p>
    </div>
  </div>
);

export default Spinner;
