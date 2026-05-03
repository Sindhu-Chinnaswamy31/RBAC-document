// server/middleware/roleMiddleware.js

// checkRole is a factory function — it returns middleware
// Usage: router.delete('/:id', verifyToken, checkRole('admin'), handler)
const checkRole = (...roles) => {
  return (req, res, next) => {
    // req.user was set by verifyToken middleware above
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }
    next();
  };
};

module.exports = { checkRole };
