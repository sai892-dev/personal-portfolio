import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { STATUS_OPTIONS, PRIORITY_OPTIONS, SORT_OPTIONS } from '../../utils/constants';
import { useState } from 'react';

const TaskFilters = ({ params, onFilterChange }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchValue, setSearchValue] = useState(params.search || '');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    // Debounce search
    clearTimeout(window._searchTimeout);
    window._searchTimeout = setTimeout(() => {
      onFilterChange({ search: value });
    }, 300);
  };

  const clearFilters = () => {
    setSearchValue('');
    onFilterChange({ status: 'All', priority: 'All', search: '', sort: 'newest' });
  };

  const hasActiveFilters =
    params.status !== 'All' || params.priority !== 'All' || params.search || params.sort !== 'newest';

  return (
    <div className="space-y-3">
      {/* Search + Toggle */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-surface-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchValue}
            onChange={handleSearch}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-surface-200 bg-white dark:bg-surface-800 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
          {searchValue && (
            <button
              onClick={() => { setSearchValue(''); onFilterChange({ search: '' }); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium
            transition-all cursor-pointer
            ${showFilters || hasActiveFilters
              ? 'bg-primary-50 border-primary-200 text-primary-600 dark:bg-primary-900/20 dark:border-primary-800 dark:text-primary-400'
              : 'bg-white border-surface-200 text-surface-600 dark:bg-surface-800 dark:border-surface-700 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-750'
            }
          `}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-primary-500" />
          )}
        </button>
      </div>

      {/* Filter options */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-3 p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700 animate-slide-in-up">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Status</label>
            <select
              value={params.status}
              onChange={(e) => onFilterChange({ status: e.target.value })}
              className="px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Priority</label>
            <select
              value={params.priority}
              onChange={(e) => onFilterChange({ priority: e.target.value })}
              className="px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-surface-400" />
            <select
              value={params.sort}
              onChange={(e) => onFilterChange({ sort: e.target.value })}
              className="px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto text-xs text-primary-500 hover:text-primary-600 font-medium cursor-pointer transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskFilters;
