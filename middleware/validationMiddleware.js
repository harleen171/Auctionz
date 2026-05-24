/**
 * Request Validation Middleware
 * 
 * Demonstrates:
 * - Input validation
 * - Data sanitization
 * - Preventing invalid data from reaching database
 * 
 * FLOW:
 * Client sends request
 *     ↓
 * [Validation Middleware]
 *     ↓
 * If invalid → Reject with 400
 * If valid → Continue to route handler
 */

const { body, validationResult } = require('express-validator');

/**
 * Validation Rules for User Signup
 * Separate export so they can be reused in routes
 */
const validateSignup = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address'),

  body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  body('fullName')
    .optional({ checkFalsy: true })
    .trim(),

  body('username')
    .optional({ checkFalsy: true })
    .trim(),

  body('name')
    .optional({ checkFalsy: true })
    .trim(),
];

/**
 * Validation Rules for User Login
 */
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

/**
 * Handle Validation Errors Middleware
 * If validation fails, catch it here and send 400 response
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log('❌ Validation errors:', JSON.stringify(errors.array(), null, 2));
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
        value: err.value,
      })),
    });
  }

  next(); // All validations passed, continue
}

module.exports = {
  validateSignup,
  validateLogin,
  handleValidationErrors,
};
