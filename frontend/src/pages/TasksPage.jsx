import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../components/tasks/TaskCard';
import TaskForm from '../components/tasks/TaskForm';
import TaskFilters from '../components/tasks/TaskFilters';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { PageSpinner } from '../components/ui/Spinner';
import { Plus, ChevronLeft, ChevronRight, ListTodo } from 'lucide-react';

const TasksPage = () => {
  const { tasks, loading, pagination, params, createTask, updateTask, deleteTask, updateParams } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleCreateOrUpdate = async (data) => {
    if (editingTask) {
      await updateTask(editingTask._id, data);
    } else {
      await createTask(data);
    }
    setEditingTask(null);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deletingTask) return;
    setDeleteLoading(true);
    try {
      await deleteTask(deletingTask._id);
    } finally {
      setDeleteLoading(false);
      setDeletingTask(null);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateTask(id, { status: newStatus });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-surface-900 dark:text-white">
            Tasks
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            {pagination.total} task{pagination.total !== 1 ? 's' : ''} total
          </p>
        </div>
        <Button
          icon={Plus}
          onClick={() => { setEditingTask(null); setShowForm(true); }}
        >
          New Task
        </Button>
      </div>

      {/* Filters */}
      <TaskFilters params={params} onFilterChange={updateParams} />

      {/* Task Grid */}
      {loading ? (
        <PageSpinner />
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title={params.search || params.status !== 'All' || params.priority !== 'All' ? 'No tasks match your filters' : 'No tasks yet'}
          description={params.search ? 'Try adjusting your search or filters' : 'Create your first task to get started!'}
          actionLabel={!params.search ? 'Create Task' : undefined}
          onAction={() => { setEditingTask(null); setShowForm(true); }}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleEdit}
                onDelete={(task) => setDeletingTask(task)}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => updateParams({ page: pagination.page - 1 })}
                disabled={pagination.page <= 1}
                className="p-2 rounded-xl border border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer text-surface-600 dark:text-surface-400"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => updateParams({ page })}
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    page === pagination.page
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                      : 'border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => updateParams({ page: pagination.page + 1 })}
                disabled={pagination.page >= pagination.pages}
                className="p-2 rounded-xl border border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer text-surface-600 dark:text-surface-400"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Task Form Modal */}
      <TaskForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingTask(null); }}
        onSubmit={handleCreateOrUpdate}
        task={editingTask}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${deletingTask?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        loading={deleteLoading}
      />
    </div>
  );
};

export default TasksPage;
