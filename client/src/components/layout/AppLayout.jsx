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
    <div className="min-h-screen flex bg-surface-50 dark:bg-surface-950">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />

      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}
      >
        <Navbar onMenuClick={() => setSidebarOpen((prev) => !prev)} isConnected={isConnected} />

        <main className="flex-1 p-4 lg:p-8 w-full max-w-[1600px] mx-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
