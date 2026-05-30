import { Menu, Moon, Sun, LogOut, Bell, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getInitials } from '../../utils/helpers';

const Navbar = ({ onMenuClick, isConnected }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-surface-200 dark:border-surface-800">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-600 dark:text-surface-400 transition-all lg:hidden cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Connection status */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium ${isConnected ? 'text-success-600 bg-success-400/10' : 'text-surface-400 bg-surface-100 dark:bg-surface-800'}`}>
            {isConnected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isConnected ? 'Live' : 'Offline'}</span>
          </div>

          {/* Notifications placeholder */}
          <button className="relative p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-500 dark:text-surface-400 transition-all cursor-pointer">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-500 dark:text-surface-400 transition-all cursor-pointer"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* User menu */}
          <div className="flex items-center gap-3 ml-2 pl-3 border-l border-surface-200 dark:border-surface-700">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-surface-800 dark:text-surface-200">
                {user?.name}
              </p>
              <p className="text-xs text-surface-500 dark:text-surface-400">
                {user?.email}
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center text-white text-sm font-bold shadow-md">
              {getInitials(user?.name)}
            </div>
            <button
              onClick={logout}
              className="p-2.5 rounded-xl hover:bg-danger-50 dark:hover:bg-danger-900/20 text-surface-400 hover:text-danger-500 transition-all cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
