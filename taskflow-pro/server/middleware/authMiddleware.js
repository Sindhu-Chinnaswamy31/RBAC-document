// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  try {
    // Read token from httpOnly cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'No token, access denied' });
    }

    // Verify the token signature using the secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to req — available in all downstream handlers
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next(); // Pass to next middleware or controller
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { verifyToken };
