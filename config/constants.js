/**
 * Application Constants
 * Centralized configuration constants used throughout the app
 * 
 * Benefits:
 * - Single source of truth
 * - Easy to update values
 * - Prevent magic strings/numbers in code
 */

module.exports = {
  // HTTP Status Codes (for clarity)
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    SERVER_ERROR: 500,
  },

  // Error Messages
  ERROR_MESSAGES: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_NOT_FOUND: 'User not found',
    USER_EXISTS: 'User already exists',
    UNAUTHORIZED: 'Unauthorized - Please login first',
    INVALID_TOKEN: 'Invalid or expired token',
    SERVER_ERROR: 'Internal server error',
    VALIDATION_ERROR: 'Validation failed',
  },

  // Success Messages
  SUCCESS_MESSAGES: {
    LOGIN_SUCCESS: 'Login successful',
    SIGNUP_SUCCESS: 'Signup successful',
    USER_CREATED: 'User created successfully',
    USER_UPDATED: 'User updated successfully',
    USER_DELETED: 'User deleted successfully',
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },

  // Security
  SECURITY: {
    BCRYPT_ROUNDS: 10, // Salt rounds for password hashing
    JWT_EXPIRY: '7d',
    SESSION_EXPIRY: 1000 * 60 * 60 * 24, // 24 hours in milliseconds
  },

  // User Roles
  USER_ROLES: {
    USER: 'user',
    ADMIN: 'admin',
    MODERATOR: 'moderator',
  },
};
