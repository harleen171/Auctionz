/**
 * Error Handling Middleware (Enhanced)
 * 
 * This demonstrates:
 * - Global error handler
 * - Error status codes
 * - Centralized error logging
 * - Consistent error response format
 * 
 * IMPORTANT: Error handlers MUST have exactly 4 parameters:
 * (err, req, res, next) - Express identifies it by the parameter count!
 * 
 * ERROR FLOW:
 * Route/Middleware throws or calls next(error)
 *     ↓
 * [Error Handler Middleware]
 *     ↓
 * Log error and send response
 */

const constants = require('../config/constants');

function errorHandler(err, req, res, next) {
  const timestamp = new Date().toISOString();
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error details (very important for debugging!)
  console.error('\n🔴 ERROR CAUGHT BY GLOBAL HANDLER');
  console.error(`⏰ Time: ${timestamp}`);
  console.error(`📍 ${req.method} ${req.originalUrl}`);
  console.error(`❌ Status: ${status}`);
  console.error(`📝 Message: ${message}`);
  console.error(`🔍 Stack:\n${err.stack}`);
  console.error('________________________________\n');

  // Send consistent error response to client
  res.status(status).json({
    success: false,
    error: {
      message: message,
      status: status,
      timestamp: timestamp,
      path: req.originalUrl,
      // Only show stack trace in development
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
}

module.exports = errorHandler;

