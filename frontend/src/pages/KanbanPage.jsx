import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';
import KanbanBoard from '../components/tasks/KanbanBoard';
import TaskForm from '../components/tasks/TaskForm';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Button from '../components/ui/Button';
import { PageSpinner } from '../components/ui/Spinner';
import { Plus, Columns3 } from 'lucide-react';
import toast from 'react-hot-toast';

const KanbanPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchAllTasks = useCallback(async () => {
    try {
      const data = await taskService.getTasks({ limit: 100, sort: 'order' });
      setTasks(data.tasks);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllTasks();
  }, [fetchAllTasks]);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Optimistic update
    const tasksCopy = [...tasks];
    const draggedTask = tasksCopy.find((t) => t._id === draggableId);

    if (!draggedTask) return;

    // Get tasks in source column
    const sourceTasks = tasksCopy
      .filter((t) => t.status === source.droppableId)
      .sort((a, b) => a.order - b.order);

    // Remove from source
    sourceTasks.splice(source.index, 1);

    // Update status
    draggedTask.status = destination.droppableId;

    // Get tasks in destination column
    const destTasks = source.droppableId === destination.droppableId
      ? sourceTasks
      : tasksCopy
          .filter((t) => t.status === destination.droppableId && t._id !== draggableId)
          .sort((a, b) => a.order - b.order);

    // Insert at destination
    destTasks.splice(destination.index, 0, draggedTask);

    // Update orders
    const updatedTasks = destTasks.map((t, i) => ({
      ...t,
      order: i,
    }));

    // Merge back
    const finalTasks = tasksCopy.map((t) => {
      const updated = updatedTasks.find((u) => u._id === t._id);
      return updated || t;
    });

    // Also update source column orders if cross-column
    if (source.droppableId !== destination.droppableId) {
      const sourceUpdated = sourceTasks.map((t, i) => ({ ...t, order: i }));
      sourceUpdated.forEach((su) => {
        const idx = finalTasks.findIndex((t) => t._id === su._id);
        if (idx !== -1) finalTasks[idx] = su;
      });
    }

    setTasks(finalTasks);

    // Build reorder payload
    const reorderPayload = updatedTasks.map((t) => ({
      id: t._id,
      status: t.status,
      order: t.order,
    }));

    if (source.droppableId !== destination.droppableId) {
      sourceTasks.forEach((t, i) => {
        reorderPayload.push({ id: t._id, status: source.droppableId, order: i });
      });
    }

    try {
      await taskService.reorderTasks(reorderPayload);
    } catch (error) {
      toast.error('Failed to reorder');
      fetchAllTasks();
    }
  };

  const handleCreate = async (data) => {
    try {
      await taskService.createTask(data);
      toast.success('Task created');
      fetchAllTasks();
    } catch (error) {
      toast.error('Failed to create task');
      throw error;
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleUpdate = async (data) => {
    try {
      await taskService.updateTask(editingTask._id, data);
      toast.success('Task updated');
      fetchAllTasks();
      setEditingTask(null);
    } catch (error) {
      toast.error('Failed to update');
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!deletingTask) return;
    setDeleteLoading(true);
    try {
      await taskService.deleteTask(deletingTask._id);
      setTasks((prev) => prev.filter((t) => t._id !== deletingTask._id));
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete');
    } finally {
      setDeleteLoading(false);
      setDeletingTask(null);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await taskService.updateTask(id, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
      toast.success(`Status changed to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <PageSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-surface-900 dark:text-white flex items-center gap-3">
            <Columns3 className="w-8 h-8 text-primary-500" />
            Kanban Board
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            Drag and drop tasks between columns
          </p>
        </div>
        <Button icon={Plus} onClick={() => { setEditingTask(null); setShowForm(true); }}>
          New Task
        </Button>
      </div>

      {/* Kanban Board */}
      <KanbanBoard
        tasks={tasks}
        onDragEnd={handleDragEnd}
        onEdit={handleEdit}
        onDelete={(task) => setDeletingTask(task)}
        onStatusChange={handleStatusChange}
      />

      {/* Task Form */}
      <TaskForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingTask(null); }}
        onSubmit={editingTask ? handleUpdate : handleCreate}
        task={editingTask}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${deletingTask?.title}"?`}
        confirmText="Delete"
        loading={deleteLoading}
      />
    </div>
  );
};

export default KanbanPage;
