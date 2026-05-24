/**
 * Authentication Routes
 * 
 * Defines all authentication-related API endpoints:
 * - POST /api/auth/signup - Register new user
 * - POST /api/auth/login - Login user
 * - GET /api/auth/me - Get current user (protected)
 * - POST /api/auth/logout - Logout user
 * 
 * Demonstrates:
 * - Router-level middleware
 * - Route-level middleware (validations)
 * - Protected routes using JWT
 * - Chaining middleware and route handlers
 */

const express = require('express');
const router = express.Router();

// Import controllers
const authController = require('../controllers/authController');

// Import middleware
const { verifyToken } = require('../middleware/authMiddleware');
const {
  validateSignup,
  validateLogin,
  handleValidationErrors,
} = require('../middleware/validationMiddleware');

/**
 * PUBLIC ROUTES (No authentication required)
 */

/**
 * POST /api/auth/signup
 * Register a new user
 * 
 * Request body:
 * {
 *   fullName: string,
 *   username: string,
 *   email: string (must be unique),
 *   password: string (min 6 chars)
 * }
 */
router.post('/signup', 
  validateSignup,           // Validation middleware
  handleValidationErrors,   // Error handler middleware
  authController.signup     // Route handler
);

/**
 * POST /api/auth/login
 * Login user
 * 
 * Request body:
 * {
 *   email: string,
 *   password: string
 * }
 */
router.post('/login',
  validateLogin,            // Validation middleware
  handleValidationErrors,   // Error handler middleware
  authController.login      // Route handler
);

/**
 * PROTECTED ROUTES (Authentication required)
 */

/**
 * GET /api/auth/me
 * Get current logged-in user's information
 * 
 * Headers: Authorization: Bearer {jwt_token}
 */
router.get('/me', 
  verifyToken,               // Check JWT token
  authController.getCurrentUser // Route handler
);

/**
 * POST /api/auth/logout
 * Logout user (mainly for frontend cleanup)
 */
router.post('/logout',
  verifyToken,               // Check JWT token
  authController.logout      // Route handler
);

module.exports = router;
