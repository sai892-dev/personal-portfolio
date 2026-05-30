const Task = require('../models/Task');

// @desc    Get all tasks for current user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search, sort, page = 1, limit = 12 } = req.query;

    const query = { createdBy: req.user._id };

    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Filter by priority
    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Sort options
    let sortOption = { createdAt: -1 };
    if (sort === 'dueDate') sortOption = { dueDate: 1 };
    if (sort === 'priority') sortOption = { priority: 1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'title') sortOption = { title: 1 };
    if (sort === 'order') sortOption = { order: 1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Task.countDocuments(query);

    const tasks = await Task.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      tasks,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, createdBy: req.user._id });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    // Get the max order for the user's tasks in the same status
    const maxOrder = await Task.findOne({ createdBy: req.user._id, status: status || 'Pending' })
      .sort({ order: -1 })
      .select('order');

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      order: maxOrder ? maxOrder.order + 1 : 0,
      createdBy: req.user._id,
    });

    // Emit socket event
    if (req.io) {
      req.io.to(req.user._id.toString()).emit('task:created', task);
    }

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, createdBy: req.user._id });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    const { title, description, status, priority, dueDate, order } = req.body;

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;
    task.priority = priority ?? task.priority;
    task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;
    task.order = order ?? task.order;

    const updatedTask = await task.save();

    // Emit socket event
    if (req.io) {
      req.io.to(req.user._id.toString()).emit('task:updated', updatedTask);
    }

    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, createdBy: req.user._id });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    await task.deleteOne();

    // Emit socket event
    if (req.io) {
      req.io.to(req.user._id.toString()).emit('task:deleted', req.params.id);
    }

    res.json({ message: 'Task deleted successfully', id: req.params.id });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder tasks (for Kanban drag and drop)
// @route   PUT /api/tasks/reorder
// @access  Private
const reorderTasks = async (req, res, next) => {
  try {
    const { tasks } = req.body; // Array of { id, status, order }

    if (!tasks || !Array.isArray(tasks)) {
      res.status(400);
      throw new Error('Tasks array is required');
    }

    const bulkOps = tasks.map((t) => ({
      updateOne: {
        filter: { _id: t.id, createdBy: req.user._id },
        update: { $set: { status: t.status, order: t.order } },
      },
    }));

    await Task.bulkWrite(bulkOps);

    // Emit socket event
    if (req.io) {
      req.io.to(req.user._id.toString()).emit('task:reordered', tasks);
    }

    res.json({ message: 'Tasks reordered successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get task stats for dashboard
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [stats] = await Task.aggregate([
      { $match: { createdBy: userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } },
          highPriority: { $sum: { $cond: [{ $eq: ['$priority', 'High'] }, 1, 0] } },
          mediumPriority: { $sum: { $cond: [{ $eq: ['$priority', 'Medium'] }, 1, 0] } },
          lowPriority: { $sum: { $cond: [{ $eq: ['$priority', 'Low'] }, 1, 0] } },
        },
      },
    ]);

    res.json(stats || {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      highPriority: 0,
      mediumPriority: 0,
      lowPriority: 0,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, reorderTasks, getTaskStats };
