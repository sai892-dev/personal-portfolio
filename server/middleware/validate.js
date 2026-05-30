const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push('Name is required');
  }

  if (!email) {
    errors.push('Email is required');
  } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    errors.push('Please enter a valid email');
  }

  if (!password) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(', ') });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email) {
    errors.push('Email is required');
  }

  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(', ') });
  }

  next();
};

const validateTask = (req, res, next) => {
  const { title } = req.body;

  if (!title || title.trim().length === 0) {
    return res.status(400).json({ message: 'Task title is required' });
  }

  const validStatuses = ['Pending', 'In Progress', 'Completed'];
  const validPriorities = ['Low', 'Medium', 'High'];

  if (req.body.status && !validStatuses.includes(req.body.status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  if (req.body.priority && !validPriorities.includes(req.body.priority)) {
    return res.status(400).json({ message: 'Invalid priority value' });
  }

  next();
};

module.exports = { validateRegister, validateLogin, validateTask };
