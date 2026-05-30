const StatsCard = ({ title, value, icon: Icon, color, trend }) => {
  const colorClasses = {
    primary: {
      bg: 'bg-primary-50 dark:bg-primary-900/20',
      icon: 'bg-primary-100 dark:bg-primary-800/40 text-primary-600 dark:text-primary-400',
      value: 'text-primary-700 dark:text-primary-300',
    },
    success: {
      bg: 'bg-success-400/5 dark:bg-success-900/20',
      icon: 'bg-success-100 dark:bg-success-800/40 text-success-600 dark:text-success-400',
      value: 'text-success-700 dark:text-success-300',
    },
    warning: {
      bg: 'bg-warning-400/5 dark:bg-warning-900/20',
      icon: 'bg-warning-100 dark:bg-warning-800/40 text-warning-600 dark:text-warning-400',
      value: 'text-warning-700 dark:text-warning-300',
    },
    danger: {
      bg: 'bg-danger-400/5 dark:bg-danger-900/20',
      icon: 'bg-danger-100 dark:bg-danger-800/40 text-danger-600 dark:text-danger-400',
      value: 'text-danger-700 dark:text-danger-300',
    },
  };

  const colors = colorClasses[color] || colorClasses.primary;

  return (
    <div className={`
      ${colors.bg} rounded-2xl p-5 border border-surface-200/50 dark:border-surface-700/50
      transition-all duration-300 hover:shadow-lg hover:scale-[1.02]
      animate-fade-in
    `}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl ${colors.icon} flex items-center justify-center`}>
          <Icon className="w-5.5 h-5.5" />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trend >= 0 ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400' : 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className={`text-3xl font-bold ${colors.value} mb-1`}>{value}</p>
      <p className="text-sm text-surface-500 dark:text-surface-400">{title}</p>
    </div>
  );
};

export default StatsCard;
