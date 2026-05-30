import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import StatsCard from '../components/dashboard/StatsCard';
import { PageSpinner } from '../components/ui/Spinner';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  Loader,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { STATUS_COLORS, PRIORITY_COLORS } from '../utils/constants';
import { formatRelativeDate, getDueDateLabel } from '../utils/helpers';

const DashboardPage = () => {
  const { tasks, stats, loading, fetchStats, fetchTasks } = useTasks({ limit: 5 });

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading && !stats) return <PageSpinner />;

  const completionRate = stats?.total
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-surface-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            Overview of your tasks and productivity
          </p>
        </div>
        <Link
          to="/tasks"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold shadow-lg shadow-primary-500/25 transition-all hover:shadow-primary-500/40"
        >
          View All Tasks
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <StatsCard
          title="Total Tasks"
          value={stats?.total || 0}
          icon={ClipboardList}
          color="primary"
        />
        <StatsCard
          title="Pending"
          value={stats?.pending || 0}
          icon={Clock}
          color="warning"
        />
        <StatsCard
          title="In Progress"
          value={stats?.inProgress || 0}
          icon={Loader}
          color="primary"
        />
        <StatsCard
          title="Completed"
          value={stats?.completed || 0}
          icon={CheckCircle2}
          color="success"
        />
      </div>

      {/* Mid row: Progress + Priority Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Completion Progress */}
        <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 animate-slide-in-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-500" />
              Completion Rate
            </h2>
            <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {completionRate}%
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-4 mb-4 overflow-hidden">
            <div
              className="h-full rounded-full gradient-primary transition-all duration-1000 ease-out relative overflow-hidden"
              style={{ width: `${completionRate}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
          <div className="flex justify-between text-sm text-surface-500 dark:text-surface-400">
            <span>{stats?.completed || 0} completed</span>
            <span>{stats?.total || 0} total</span>
          </div>

          {/* Status breakdown bars */}
          <div className="mt-6 space-y-3">
            {[
              { label: 'Pending', count: stats?.pending || 0, color: 'bg-warning-500' },
              { label: 'In Progress', count: stats?.inProgress || 0, color: 'bg-primary-500' },
              { label: 'Completed', count: stats?.completed || 0, color: 'bg-success-500' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-xs text-surface-500 dark:text-surface-400 w-20 truncate">{item.label}</span>
                <div className="flex-1 bg-surface-100 dark:bg-surface-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-700`}
                    style={{ width: stats?.total ? `${(item.count / stats.total) * 100}%` : '0%' }}
                  />
                </div>
                <span className="text-xs font-semibold text-surface-600 dark:text-surface-300 w-6 text-right">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white flex items-center gap-2 mb-6">
            <AlertTriangle className="w-5 h-5 text-warning-500" />
            Priority Distribution
          </h2>
          <div className="flex items-center justify-center mb-6">
            {/* Simple donut visualization */}
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="12"
                  className="text-surface-100 dark:text-surface-700" />
                {stats?.total > 0 && (
                  <>
                    <circle cx="50" cy="50" r="40" fill="none" strokeWidth="12"
                      className="text-danger-500"
                      strokeDasharray={`${((stats?.highPriority || 0) / stats.total) * 251.2} 251.2`}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dasharray 1s ease' }}
                    />
                    <circle cx="50" cy="50" r="40" fill="none" strokeWidth="12"
                      className="text-warning-500"
                      strokeDasharray={`${((stats?.mediumPriority || 0) / stats.total) * 251.2} 251.2`}
                      strokeDashoffset={`${-((stats?.highPriority || 0) / stats.total) * 251.2}`}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dasharray 1s ease' }}
                    />
                    <circle cx="50" cy="50" r="40" fill="none" strokeWidth="12"
                      className="text-success-500"
                      strokeDasharray={`${((stats?.lowPriority || 0) / stats.total) * 251.2} 251.2`}
                      strokeDashoffset={`${-(((stats?.highPriority || 0) + (stats?.mediumPriority || 0)) / stats.total) * 251.2}`}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dasharray 1s ease' }}
                    />
                  </>
                )}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-surface-800 dark:text-surface-200">
                  {stats?.total || 0}
                </span>
              </div>
            </div>
          </div>
          {/* Legend */}
          <div className="space-y-2">
            {[
              { label: 'High', count: stats?.highPriority || 0, color: 'bg-danger-500' },
              { label: 'Medium', count: stats?.mediumPriority || 0, color: 'bg-warning-500' },
              { label: 'Low', count: stats?.lowPriority || 0, color: 'bg-success-500' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-surface-600 dark:text-surface-400">{item.label} Priority</span>
                </div>
                <span className="text-sm font-semibold text-surface-800 dark:text-surface-200">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-500" />
            Recent Tasks
          </h2>
          <Link to="/tasks" className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 transition-colors">
            View all →
          </Link>
        </div>

        {tasks.length === 0 ? (
          <p className="text-center text-surface-400 dark:text-surface-500 py-8">
            No tasks yet. Create your first task to get started!
          </p>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => {
              const statusColor = STATUS_COLORS[task.status];
              const priorityColor = PRIORITY_COLORS[task.priority];
              return (
                <Link
                  key={task._id}
                  to={`/tasks/${task._id}`}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors group"
                >
                  {/* Status dot */}
                  <div className={`w-2.5 h-2.5 rounded-full ${statusColor.dot} flex-shrink-0`} />

                  {/* Title + desc */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-surface-800 dark:text-surface-200 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-xs text-surface-400 dark:text-surface-500 truncate mt-0.5">
                        {task.description}
                      </p>
                    )}
                  </div>

                  {/* Priority */}
                  <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${priorityColor.bg} ${priorityColor.text} hidden sm:inline-block`}>
                    {task.priority}
                  </span>

                  {/* Time ago */}
                  <span className="text-xs text-surface-400 dark:text-surface-500 whitespace-nowrap hidden md:inline-block">
                    {formatRelativeDate(task.createdAt)}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
