import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';
import toast from 'react-hot-toast';

export const useTasks = (initialParams = {}) => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [params, setParams] = useState({
    status: 'All',
    priority: 'All',
    search: '',
    sort: 'newest',
    page: 1,
    ...initialParams,
  });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = { ...params };
      if (queryParams.status === 'All') delete queryParams.status;
      if (queryParams.priority === 'All') delete queryParams.priority;
      if (!queryParams.search) delete queryParams.search;

      const data = await taskService.getTasks(queryParams);
      setTasks(data.tasks);
      setPagination({ page: data.page, pages: data.pages, total: data.total });
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [params]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await taskService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (taskData) => {
    try {
      const newTask = await taskService.createTask(taskData);
      toast.success('Task created successfully');
      fetchTasks();
      fetchStats();
      return newTask;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create task';
      toast.error(message);
      throw error;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const updated = await taskService.updateTask(id, taskData);
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
      toast.success('Task updated');
      fetchStats();
      return updated;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update task';
      toast.error(message);
      throw error;
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success('Task deleted');
      fetchStats();
    } catch (error) {
      toast.error('Failed to delete task');
      throw error;
    }
  };

  const reorderTasks = async (reorderedTasks) => {
    try {
      await taskService.reorderTasks(reorderedTasks);
    } catch (error) {
      toast.error('Failed to reorder tasks');
      fetchTasks();
    }
  };

  const updateParams = (newParams) => {
    setParams((prev) => ({ ...prev, ...newParams, page: newParams.page || 1 }));
  };

  return {
    tasks,
    setTasks,
    stats,
    loading,
    pagination,
    params,
    fetchTasks,
    fetchStats,
    createTask,
    updateTask,
    deleteTask,
    reorderTasks,
    updateParams,
  };
};
