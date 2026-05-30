import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { taskService } from '../services/taskService';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Calendar, ClipboardList, Shield } from 'lucide-react';
import { formatDate, getInitials } from '../utils/helpers';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user) {
      setForm((prev) => ({ ...prev, name: user.name, email: user.email }));
    }
    const fetchStats = async () => {
      try {
        const data = await taskService.getStats();
        setStats(data);
      } catch (e) {
        // ignore
      }
    };
    fetchStats();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password && form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (form.password && form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const updateData = { name: form.name, email: form.email };
      if (form.password) updateData.password = form.password;

      const updated = await authService.updateProfile(updateData);
      updateUser(updated);
      if (updated.token) localStorage.setItem('token', updated.token);
      setForm((prev) => ({ ...prev, password: '', confirmPassword: '' }));
      toast.success('Profile updated successfully');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-surface-900 dark:text-white">
          Profile
        </h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1">
          Manage your account settings
        </p>
      </div>

      {/* Profile header card */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden">
        {/* Banner */}
        <div className="h-32 gradient-primary relative">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }} />
        </div>

        {/* Avatar + Info */}
        <div className="px-6 pb-6 -mt-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="w-24 h-24 rounded-2xl gradient-accent flex items-center justify-center text-white text-3xl font-bold border-4 border-white dark:border-surface-800 shadow-xl">
              {getInitials(user?.name)}
            </div>
            <div className="flex-1 pb-1">
              <h2 className="text-xl font-bold text-surface-900 dark:text-white">
                {user?.name}
              </h2>
              <p className="text-sm text-surface-500 dark:text-surface-400">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-surface-200 dark:border-surface-700">
            {[
              { label: 'Total Tasks', value: stats?.total || 0, icon: ClipboardList },
              { label: 'Completed', value: stats?.completed || 0, icon: ClipboardList },
              { label: 'Member Since', value: formatDate(user?.createdAt), icon: Calendar },
              { label: 'Account', value: 'Active', icon: Shield },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <p className="text-xl font-bold text-surface-800 dark:text-surface-200">{item.value}</p>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface-100 dark:bg-surface-800 rounded-xl w-fit">
        {[
          { id: 'profile', label: 'Edit Profile' },
          { id: 'security', label: 'Security' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm'
                : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-6">
          {activeTab === 'profile' ? (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
                Personal Information
              </h3>
              <Input
                label="Full Name"
                icon={User}
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Your name"
              />
              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="you@example.com"
              />
            </div>
          ) : (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
                Change Password
              </h3>
              <Input
                label="New Password"
                type="password"
                icon={Lock}
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="Enter new password"
              />
              <Input
                label="Confirm New Password"
                type="password"
                icon={Lock}
                value={form.confirmPassword}
                onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm new password"
              />
              <p className="text-xs text-surface-400 dark:text-surface-500">
                Leave blank to keep current password. Minimum 6 characters.
              </p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-surface-200 dark:border-surface-700 flex justify-end">
            <Button type="submit" loading={loading}>
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
