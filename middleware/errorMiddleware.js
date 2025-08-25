// Error handling middleware
const errorHandler = (err, req, res, next) => {
  // If no status was set, default to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message,
    // Show stack trace only in development
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;
