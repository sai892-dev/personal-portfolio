import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ListTodo,
  Columns3,
  User,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/tasks', label: 'Tasks', icon: ListTodo },
  { path: '/kanban', label: 'Kanban Board', icon: Columns3 },
  { path: '/profile', label: 'Profile', icon: User },
];

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`
          fixed lg:static top-0 left-0 h-full z-40
          bg-white dark:bg-surface-900
          border-r border-surface-200 dark:border-surface-800
          transition-all duration-300 ease-in-out
          flex flex-col flex-shrink-0
          ${isOpen ? 'w-64' : 'w-0 lg:w-20'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ backgroundColor: 'var(--color-surface-50, #ffffff)' }} // extra safeguard
      >
        {/* Logo */}
        <div className={`flex items-center h-16 px-4 border-b border-surface-200 dark:border-surface-800 ${isOpen ? '' : 'lg:justify-center'}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/25">
              <Zap className="w-5 h-5 text-white" />
            </div>
            {isOpen && (
              <span className="text-lg font-bold text-surface-900 dark:text-white whitespace-nowrap animate-fade-in">
                TaskFlow
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && onToggle()}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl
                  transition-all duration-200 group
                  ${isOpen ? '' : 'lg:justify-center'}
                  ${isActive
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 font-semibold shadow-sm'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-200'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary-500' : ''}`} />
                {isOpen && (
                  <span className="whitespace-nowrap text-sm">{item.label}</span>
                )}
                {!isOpen && (
                  <div className="absolute left-full ml-3 px-2.5 py-1 bg-surface-900 dark:bg-surface-100 text-white dark:text-surface-900 text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap hidden lg:block">
                    {item.label}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Collapse toggle (desktop only) */}
        <div className="hidden lg:flex items-center justify-center py-4 border-t border-surface-200 dark:border-surface-800">
          <button
            onClick={onToggle}
            className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-all cursor-pointer"
          >
            {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
