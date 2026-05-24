/**
 * JWT Authentication Middleware
 * 
 * This middleware demonstrates:
 * - How to protect routes using JWT
 * - Token extraction from headers
 * - Token verification
 * - Adding user data to request object
 * 
 * FLOW: Client sends JWT in Authorization header
 *       → Middleware extracts token
 *       → Verifies signature & expiry
 *       → Adds user data to req.user
 *       → Passes to next middleware/route
 */

const jwt = require('jsonwebtoken');
const constants = require('../config/constants');

/**
 * Verify JWT Token Middleware
 * 
 * How it works:
 * 1. Check if Authorization header exists
 * 2. Extract token from "Bearer <token>"
 * 3. Verify token using JWT_SECRET
 * 4. Decode token and attach user to request
 * 5. Call next() to proceed; or next(err) to skip
 */
function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // Check if authorization header exists
    if (!authHeader) {
      return res.status(constants.HTTP_STATUS.UNAUTHORIZED).json({
        error: constants.ERROR_MESSAGES.UNAUTHORIZED,
      });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(constants.HTTP_STATUS.UNAUTHORIZED).json({
        error: constants.ERROR_MESSAGES.UNAUTHORIZED,
      });
    }

    // Verify token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user data to request object
    // This allows route handlers to access user info via req.user
    req.user = decoded;

    console.log(`✅ JWT verified for user: ${decoded.email}`);
    next(); // Pass control to next middleware/route
  } catch (error) {
    console.error('❌ JWT verification failed:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(constants.HTTP_STATUS.UNAUTHORIZED).json({
        error: 'Token has expired. Please login again.',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(constants.HTTP_STATUS.UNAUTHORIZED).json({
        error: constants.ERROR_MESSAGES.INVALID_TOKEN,
      });
    }

    res.status(constants.HTTP_STATUS.UNAUTHORIZED).json({
      error: constants.ERROR_MESSAGES.UNAUTHORIZED,
    });
  }
}

module.exports = { verifyToken };
