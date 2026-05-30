import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({
  label,
  error,
  icon: Icon,
  type = 'text',
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400">
            <Icon className="w-4.5 h-4.5" />
          </div>
        )}
        <input
          type={isPassword && showPassword ? 'text' : type}
          className={`
            w-full rounded-xl border border-surface-300 bg-white
            px-4 py-2.5 text-sm text-surface-900 placeholder:text-surface-400
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            transition-all duration-200
            dark:bg-surface-800 dark:border-surface-600 dark:text-surface-100
            dark:placeholder:text-surface-500 dark:focus:ring-primary-400
            ${Icon ? 'pl-11' : ''}
            ${isPassword ? 'pr-11' : ''}
            ${error ? 'border-danger-400 focus:ring-danger-500' : ''}
            ${className}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-danger-500 mt-1">{error}</p>}
    </div>
  );
};

export default Input;
