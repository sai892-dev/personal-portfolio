import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { taskService } from '../services/taskService';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import TaskForm from '../components/tasks/TaskForm';
import { PageSpinner } from '../components/ui/Spinner';
import { STATUS_COLORS, PRIORITY_COLORS } from '../utils/constants';
import { formatDate, formatRelativeDate } from '../utils/helpers';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Calendar,
  Clock,
  Flag,
  FileText,
  CheckCircle2,
} from 'lucide-react';

const TaskDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await taskService.getTask(id);
        setTask(data);
      } catch (error) {
        toast.error('Task not found');
        navigate('/tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id, navigate]);

  const handleUpdate = async (data) => {
    try {
      const updated = await taskService.updateTask(id, data);
      setTask(updated);
      toast.success('Task updated');
    } catch (error) {
      toast.error('Failed to update');
      throw error;
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await taskService.deleteTask(id);
      toast.success('Task deleted');
      navigate('/tasks');
    } catch (error) {
      toast.error('Failed to delete');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <PageSpinner />;
  if (!task) return null;

  const statusColor = STATUS_COLORS[task.status];
  const priorityColor = PRIORITY_COLORS[task.priority];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Back button */}
      <Link
        to="/tasks"
        className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Tasks
      </Link>

      {/* Main card */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden">
        {/* Header */}
        <div className="p-6 lg:p-8 border-b border-surface-200 dark:border-surface-700">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-medium ${statusColor.bg} ${statusColor.text}`}>
                  <span className={`w-2 h-2 rounded-full ${statusColor.dot}`} />
                  {task.status}
                </span>
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${priorityColor.bg} ${priorityColor.text}`}>
                  {task.priority} Priority
                </span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-surface-900 dark:text-white">
                {task.title}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" icon={Edit3} size="sm" onClick={() => setShowEdit(true)}>
                Edit
              </Button>
              <Button variant="danger" icon={Trash2} size="sm" onClick={() => setShowDelete(true)}>
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-8 space-y-6">
          {/* Description */}
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-surface-500 dark:text-surface-400 mb-2">
              <FileText className="w-4 h-4" />
              Description
            </div>
            <p className="text-surface-700 dark:text-surface-300 leading-relaxed whitespace-pre-wrap">
              {task.description || 'No description provided.'}
            </p>
          </div>

          {/* Meta info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface-50 dark:bg-surface-700/30 rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400 mb-1">
                <Calendar className="w-4 h-4" />
                Due Date
              </div>
              <p className="text-sm font-semibold text-surface-800 dark:text-surface-200">
                {task.dueDate ? formatDate(task.dueDate) : 'No due date set'}
              </p>
            </div>
            <div className="bg-surface-50 dark:bg-surface-700/30 rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400 mb-1">
                <Flag className="w-4 h-4" />
                Priority Level
              </div>
              <p className="text-sm font-semibold text-surface-800 dark:text-surface-200">
                {task.priority}
              </p>
            </div>
            <div className="bg-surface-50 dark:bg-surface-700/30 rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400 mb-1">
                <Clock className="w-4 h-4" />
                Created
              </div>
              <p className="text-sm font-semibold text-surface-800 dark:text-surface-200">
                {formatDate(task.createdAt)}
                <span className="font-normal text-surface-400 ml-1">
                  ({formatRelativeDate(task.createdAt)})
                </span>
              </p>
            </div>
            <div className="bg-surface-50 dark:bg-surface-700/30 rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                Last Updated
              </div>
              <p className="text-sm font-semibold text-surface-800 dark:text-surface-200">
                {formatRelativeDate(task.updatedAt)}
              </p>
            </div>
          </div>

          {/* Quick status change */}
          <div>
            <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-3">
              Quick Status Change
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Pending', 'In Progress', 'Completed'].map((status) => {
                const sc = STATUS_COLORS[status];
                const isActive = task.status === status;
                return (
                  <button
                    key={status}
                    onClick={async () => {
                      if (isActive) return;
                      const updated = await taskService.updateTask(id, { status });
                      setTask(updated);
                      toast.success(`Status changed to ${status}`);
                    }}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                      transition-all cursor-pointer border-2
                      ${isActive
                        ? `${sc.bg} ${sc.text} border-current shadow-sm`
                        : 'border-surface-200 dark:border-surface-700 text-surface-500 dark:text-surface-400 hover:border-surface-300 dark:hover:border-surface-600'
                      }
                    `}
                  >
                    <span className={`w-2 h-2 rounded-full ${isActive ? sc.dot : 'bg-surface-300 dark:bg-surface-600'}`} />
                    {status}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <TaskForm
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        onSubmit={handleUpdate}
        task={task}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmText="Delete"
        loading={deleteLoading}
      />
    </div>
  );
};

export default TaskDetailPage;
