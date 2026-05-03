// server/middleware/errorMiddleware.js

const errorHandler = (err, req, res, next) => {
  // Default to 500 if statusCode not set
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err.message,
    // Only show stack trace in development
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

// Helper to create an error with a custom status code
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

module.exports = { errorHandler, createError };
