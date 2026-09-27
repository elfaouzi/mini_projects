// Not found middleware
function notFound(req, res, next) {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
}

// Centralized error handler
function errorHandler(err, req, res, next) {
  console.error(err);
  const status = res.statusCode >= 400 ? res.statusCode : 500;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid ID format' });
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map((e) => e.message);
    return res.status(400).json({ success: false, errors: messages });
  }

  res.status(status).json({ success: false, message: err.message || 'Server error' });
}

module.exports = { notFound, errorHandler };
