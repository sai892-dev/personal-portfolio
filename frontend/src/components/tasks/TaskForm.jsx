import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { FileText, AlignLeft, Flag, Calendar as CalendarIcon } from 'lucide-react';

const TaskForm = ({ isOpen, onClose, onSubmit, task = null }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'Pending',
    priority: 'Medium',
    dueDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isEditing = !!task;

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'Pending',
        priority: task.priority || 'Medium',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      setForm({ title: '', description: '', status: 'Pending', priority: 'Medium', dueDate: '' });
    }
    setErrors({});
  }, [task, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (form.title.length > 100) newErrors.title = 'Title must be under 100 characters';
    if (form.description.length > 500) newErrors.description = 'Description must be under 500 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit({
        ...form,
        dueDate: form.dueDate || null,
      });
      onClose();
    } catch (error) {
      // Error handled by parent
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Task' : 'Create New Task'} size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Title"
          icon={FileText}
          placeholder="Enter task title..."
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          error={errors.title}
          required
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
            Description
          </label>
          <div className="relative">
            <AlignLeft className="absolute left-3.5 top-3 text-surface-400 w-4.5 h-4.5" />
            <textarea
              placeholder="Add a description..."
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full rounded-xl border border-surface-300 bg-white pl-11 pr-4 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 dark:bg-surface-800 dark:border-surface-600 dark:text-surface-100 dark:placeholder:text-surface-500 resize-none"
            />
          </div>
          {errors.description && <p className="text-xs text-danger-500">{errors.description}</p>}
          <p className="text-xs text-surface-400 text-right">{form.description.length}/500</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
              className="w-full rounded-xl border border-surface-300 bg-white px-4 py-2.5 text-sm text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:bg-surface-800 dark:border-surface-600 dark:text-surface-100 cursor-pointer"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
              Priority
            </label>
            <select
              value={form.priority}
              onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value }))}
              className="w-full rounded-xl border border-surface-300 bg-white px-4 py-2.5 text-sm text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:bg-surface-800 dark:border-surface-600 dark:text-surface-100 cursor-pointer"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <Input
          label="Due Date"
          type="date"
          icon={CalendarIcon}
          value={form.dueDate}
          onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
        />

        <div className="flex items-center gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" loading={loading} className="flex-1">
            {isEditing ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskForm;
