const Task = require('../models/Task');

// Helper: basic request validation
function validateTaskInput(body, isUpdate = false) {
  const errors = [];
  const allowedStatus = Task.STATUS || ['To Do', 'In Progress', 'Done'];

  if (!isUpdate) {
    if (body.title === undefined || body.title === null || String(body.title).trim() === '') {
      errors.push('title is required');
    }
  }

  if (body.status !== undefined && !allowedStatus.includes(body.status)) {
    errors.push(`status must be one of: ${allowedStatus.join(', ')}`);
  }

  if (body.deadline !== undefined && body.deadline !== null) {
    const d = new Date(body.deadline);
    if (Number.isNaN(d.getTime())) {
      errors.push('deadline must be a valid date');
    }
  }

  return errors;
}

// GET /api/tasks
async function getTasks(req, res, next) {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json( tasks );
  } catch (err) {
    next(err);
  }
}

// GET /api/tasks/:id
async function getTaskById(req, res, next) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

// POST /api/tasks
async function createTask(req, res, next) {
  try {
    const errors = validateTaskInput(req.body, false);
    if (errors.length) {
      return res.status(400).json({ success: false, errors });
    }

    const { title, description, status, deadline } = req.body;
    const payload = { title };

    if (description !== undefined) payload.description = description;
    if (status !== undefined) payload.status = status;
    if (deadline !== undefined) payload.deadline = deadline ? new Date(deadline) : undefined;

    const task = await Task.create(payload);
    res.status(201).json( task );
  } catch (err) {
    next(err);
  }
}

// PUT /api/tasks/:id
async function updateTask(req, res, next) {
  try {
    const errors = validateTaskInput(req.body, true);
    if (errors.length) {
      return res.status(400).json({ success: false, errors });
    }

    const { title, description, status, deadline } = req.body;
    const updates = {};

    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    if (deadline !== undefined) updates.deadline = deadline ? new Date(deadline) : null;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json( task );
  } catch (err) {
    next(err);
  }
}

// DELETE /api/tasks/:id
async function deleteTask(req, res, next) {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({ success: true, message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
