// server/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');
const {
  getTasks, createTask, updateTask, deleteTask, getDashboardStats
} = require('../controllers/taskController');

// All routes require authentication
router.use(verifyToken);

router.get('/dashboard', getDashboardStats);
router.get('/',         getTasks);
router.post('/',        checkRole('admin', 'manager'), createTask);
router.put('/:id',      updateTask);
router.delete('/:id',   checkRole('admin', 'manager'), deleteTask);

module.exports = router;
