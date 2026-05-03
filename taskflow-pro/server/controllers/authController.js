// server/controllers/authController.js
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('Email already registered');
    }

    // Password is hashed by the pre-save hook in User model
    const user = await User.create({ name, email, password, role });
    generateToken(user._id, res);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    next(error); // Pass to global error handler
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // select('+password') overrides schema's select: false
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    generateToken(user._id, res);
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/logout
const logout = (req, res) => {
  res.cookie('token', '', { maxAge: 0 }); // Clear the cookie
  res.json({ message: 'Logged out successfully' });
};

// GET /api/auth/me
const getMe = (req, res) => {
  res.json(req.user); // req.user set by verifyToken middleware
};

module.exports = { register, login, logout, getMe };
