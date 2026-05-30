import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../hooks/useSocket';
import { PageSpinner } from '../ui/Spinner';

const AppLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const { isConnected } = useSocket();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (loading) return <PageSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />

      <div
        className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}
      >
        <Navbar onMenuClick={() => setSidebarOpen((prev) => !prev)} isConnected={isConnected} />

        <main className="p-4 lg:p-6 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
