const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
  getTaskStats,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { validateTask } = require('../middleware/validate');

// All routes require authentication
router.use(protect);

router.get('/stats', getTaskStats);
router.put('/reorder', reorderTasks);
router.route('/').get(getTasks).post(validateTask, createTask);
router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);

module.exports = router;
