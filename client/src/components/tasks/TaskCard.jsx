import { Calendar, Edit3, Trash2, GripVertical } from 'lucide-react';
import { STATUS_COLORS, PRIORITY_COLORS } from '../../utils/constants';
import { getDueDateLabel, truncate } from '../../utils/helpers';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange, isDragging = false, dragHandleProps = {} }) => {
  const statusColor = STATUS_COLORS[task.status];
  const priorityColor = PRIORITY_COLORS[task.priority];
  const dueLabel = getDueDateLabel(task.dueDate);

  return (
    <div
      className={`
        group bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700
        p-4 transition-all duration-200
        hover:shadow-lg hover:shadow-surface-200/50 dark:hover:shadow-surface-900/50
        hover:border-surface-300 dark:hover:border-surface-600
        ${isDragging ? 'shadow-2xl rotate-2 scale-105 opacity-90' : ''}
      `}
    >
      {/* Top row: priority + actions */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing text-surface-300 dark:text-surface-600 hover:text-surface-500 transition-colors">
            <GripVertical className="w-4 h-4" />
          </div>
          <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${priorityColor.bg} ${priorityColor.text}`}>
            {task.priority}
          </span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-400 hover:text-primary-500 transition-all cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-400 hover:text-danger-500 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-1.5 line-clamp-2">
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-surface-500 dark:text-surface-400 mb-3 line-clamp-2">
          {truncate(task.description, 80)}
        </p>
      )}

      {/* Bottom row: status + due date */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-surface-100 dark:border-surface-700/50">
        {/* Status badge - clickable */}
        <button
          onClick={() => {
            const statuses = ['Pending', 'In Progress', 'Completed'];
            const currentIndex = statuses.indexOf(task.status);
            const nextStatus = statuses[(currentIndex + 1) % statuses.length];
            onStatusChange(task._id, nextStatus);
          }}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium ${statusColor.bg} ${statusColor.text} hover:opacity-80 transition-opacity cursor-pointer`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusColor.dot}`} />
          {task.status}
        </button>

        {/* Due date */}
        {dueLabel && (
          <span className={`flex items-center gap-1 text-xs ${dueLabel.color}`}>
            <Calendar className="w-3 h-3" />
            {dueLabel.text}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
