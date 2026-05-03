// server/seed.js
const mongoose = require('mongoose');
const User = require('./models/User');
const Task = require('./models/Task');
require('dotenv').config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Task.deleteMany({});

  // Create test users
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin'
  });

  const manager = await User.create({
    name: 'Manager User',
    email: 'manager@test.com',
    password: 'password123',
    role: 'manager'
  });

  const employee = await User.create({
    name: 'Employee User',
    email: 'employee@test.com',
    password: 'password123',
    role: 'employee'
  });

  // Create sample tasks
  await Task.create([
    {
      title: 'Set up CI/CD pipeline',
      description: 'Configure GitHub Actions for automated deployment',
      status: 'todo',
      priority: 'high',
      assignedTo: employee._id,
      createdBy: admin._id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Write unit tests for auth module',
      description: 'Cover register, login, and token verification',
      status: 'in-progress',
      priority: 'high',
      assignedTo: employee._id,
      createdBy: manager._id,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Design dashboard UI mockup',
      description: 'Create Figma mockups for the analytics dashboard',
      status: 'done',
      priority: 'medium',
      assignedTo: manager._id,
      createdBy: admin._id
    },
    {
      title: 'Optimize database queries',
      description: 'Add indexes and review slow queries',
      status: 'todo',
      priority: 'medium',
      assignedTo: employee._id,
      createdBy: admin._id,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Update project documentation',
      description: 'Update README and API docs with latest changes',
      status: 'todo',
      priority: 'low',
      assignedTo: employee._id,
      createdBy: manager._id
    }
  ]);

  console.log('✅ Seed complete!');
  console.log('');
  console.log('Test accounts:');
  console.log('  admin@test.com    / password123  (role: admin)');
  console.log('  manager@test.com  / password123  (role: manager)');
  console.log('  employee@test.com / password123  (role: employee)');

  process.exit(0);
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
