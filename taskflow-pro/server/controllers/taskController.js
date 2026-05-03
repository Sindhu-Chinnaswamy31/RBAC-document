// server/controllers/taskController.js
const Task = require('../models/Task');

// GET /api/tasks?page=1&limit=10&search=keyword&status=todo
const getTasks = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip  = (page - 1) * limit;

    // Build dynamic query filter
    const filter = {};

    // Employees can only see their own tasks
    if (req.user.role === 'employee') {
      filter.assignedTo = req.user._id;
    }

    // Text search using MongoDB $text index
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Task.countDocuments(filter)
    ]);

    res.json({
      tasks,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/tasks/dashboard — Aggregation pipeline
const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await Task.aggregate([
      // Stage 1: Filter tasks for this user if employee
      ...(req.user.role === 'employee'
        ? [{ $match: { assignedTo: req.user._id } }]
        : []),

      // Stage 2: Group by status, count each
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },

      // Stage 3: Sort alphabetically
      { $sort: { _id: 1 } }
    ]);

    // Also get priority breakdown
    const priorityStats = await Task.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    res.json({ statusStats: stats, priorityStats });
  } catch (error) {
    next(error);
  }
};

// POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const task = await Task.create({
      ...req.body,
      createdBy: req.user._id
    });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Employees can only update tasks assigned to them
    if (req.user.role === 'employee' &&
        task.assignedTo.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this task');
    }

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Return updated doc
    );
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/tasks/:id — Admin and Manager only
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }
    res.json({ message: 'Task deleted', id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, getDashboardStats };
