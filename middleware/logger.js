/**
 * Request Logging Middleware (Enhanced)
 * 
 * Demonstrates:
 * - Application-level middleware
 * - How middleware runs for every request
 * - Request lifecycle logging
 * - Timing request duration
 * 
 * MIDDLEWARE FLOW:
 * Browser Request
 *     ↓
 * [Logger Middleware] ← Happens first
 *     ↓
 * [Auth Middleware] ← Only if applied
 *     ↓
 * [Route Handler]
 *     ↓
 * Response
 */

function requestLogger(req, res, next) {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  // Log incoming request details
  console.log('\n━━━ INCOMING REQUEST ━━━');
  console.log(`⏰ Time: ${timestamp}`);
  console.log(`📍 ${req.method} ${req.originalUrl}`);
  console.log(`🔗 IP: ${req.ip}`);

  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`📦 Body:`, req.body);
  }

  // Hook into response.end() to log response details
  const originalEnd = res.end;

  res.end = function (chunk, encoding) {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    // Color code response status
    const statusColor = statusCode < 400 ? '✅' : statusCode < 500 ? '⚠️' : '❌';

    console.log(`${statusColor} Response: ${statusCode} - ${req.method} ${req.originalUrl}`);
    console.log(`⏱️ Duration: ${duration}ms`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━\n');

    // Call the original res.end()
    originalEnd.call(this, chunk, encoding);
  };

  // IMPORTANT: Call next() to pass control to next middleware
  next();
}

module.exports = requestLogger;

