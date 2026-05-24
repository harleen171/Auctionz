/**
 * Authentication Controller
 * 
 * Handles:
 * - User signup (registration)
 * - User login
 * - Password hashing with bcrypt
 * - JWT token generation
 * 
 * FLOW:
 * 1. User sends credentials to /api/auth/signup or /api/auth/login
 * 2. Controller validates input data
 * 3. Controller queries database (MongoDB)
 * 4. Controller checks credentials
 * 5. Controller generates JWT token
 * 6. Controller sends response with token
 */

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const constants = require('../config/constants');

/**
 * Generate JWT Token
 * 
 * Creates a signed JWT token that client stores and sends with requests
 * Token contains: userId, email, iat (issued at), exp (expiry)
 */
function generateToken(userId, email) {
  const payload = {
    userId: userId,
    email: email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN || '7d',
  });

  return token;
}

function createUsername(fullName, email) {
  if (fullName) {
    const cleanName = fullName
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '')
      .slice(0, 30);

    if (cleanName.length >= 3) {
      return cleanName;
    }
  }

  if (email) {
    return email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 30);
  }

  return `user_${Date.now()}`;
}

/**
 * SIGNUP CONTROLLER
 * 
 * HTTP Endpoint: POST /api/auth/signup
 * Request Body: { fullName, username, email, password } or { name, email, password }
 * Response: { success: true, message, token, user }
 * 
 * Demonstrates:
 * - Async/await for database operations
 * - Error handling with try-catch
 * - Input validation
 * - Mongoose unique constraint checking
 * - Password hashing (automatic via User model middleware)
 * - JWT token generation
 */
async function signup(req, res, next) {
  try {
    const fullName = req.body.fullName || req.body.name;
    let username = req.body.username;
    const { email, password } = req.body;

    if (!username) {
      username = createUsername(fullName, email);
    }

    console.log(`📝 Signup attempt:`, { email, username, fullName });

    // Check if user already exists
    // Query database: find user by email OR username
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      // User already exists
      const error = new Error(constants.ERROR_MESSAGES.USER_EXISTS);
      error.status = constants.HTTP_STATUS.CONFLICT;
      throw error;
    }

    // Create new user document
    // Password hashing happens automatically in the pre-save hook
    const newUser = new User({
      fullName,
      username,
      email,
      password, // Will be hashed in pre-save
    });

    // Save to database
    // This triggers the pre-save middleware that hashes the password
    await newUser.save();

    console.log(`✅ User created successfully:`, { email, username });

    // Generate JWT token
    const token = generateToken(newUser._id, newUser.email);

    // Send response
    res.status(constants.HTTP_STATUS.CREATED).json({
      success: true,
      message: constants.SUCCESS_MESSAGES.SIGNUP_SUCCESS,
      token: token,
      user: newUser.toJSON(), // Remove password from response
    });
  } catch (error) {
    console.error('❌ Signup error:', error.message);
    // Pass error to error handler middleware
    next(error);
  }
}

/**
 * LOGIN CONTROLLER
 * 
 * HTTP Endpoint: POST /api/auth/login
 * Request Body: { email, password }
 * Response: { success: true, message, token, user }
 * 
 * Demonstrates:
 * - Finding user by email
 * - Comparing passwords with bcrypt
 * - Error handling for invalid credentials
 * - Selecting hidden fields (password)
 * - Updating lastLogin timestamp
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    console.log(`🔐 Login attempt:`, { email });

    // Find user by email
    // .select('+password') is needed because password has select: false in schema
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists
    if (!user) {
      console.log(`❌ Login failed - User not found:`, { email });
      const error = new Error(constants.ERROR_MESSAGES.INVALID_CREDENTIALS);
      error.status = constants.HTTP_STATUS.UNAUTHORIZED;
      throw error;
    }

    // Compare password using the instance method we defined in User model
    // comparePassword returns true/false
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      console.log(`❌ Login failed - Invalid password:`, { email });
      const error = new Error(constants.ERROR_MESSAGES.INVALID_CREDENTIALS);
      error.status = constants.HTTP_STATUS.UNAUTHORIZED;
      throw error;
    }

    console.log(`✅ Login successful:`, { email });

    // Update lastLogin timestamp
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id, user.email);

    // Send response
    res.status(constants.HTTP_STATUS.OK).json({
      success: true,
      message: constants.SUCCESS_MESSAGES.LOGIN_SUCCESS,
      token: token,
      user: user.toJSON(), // Remove password from response
    });
  } catch (error) {
    console.error('❌ Login error:', error.message);
    next(error);
  }
}

/**
 * GET CURRENT USER
 * 
 * HTTP Endpoint: GET /api/auth/me
 * Headers: Authorization: Bearer {token}
 * Response: { success: true, user }
 * 
 * This is a protected route that uses the verifyToken middleware
 * The middleware adds req.user with decoded token data
 */
async function getCurrentUser(req, res, next) {
  try {
    // req.user is set by the verifyToken middleware
    const userId = req.user.userId;

    // Fetch user from database
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error(constants.ERROR_MESSAGES.USER_NOT_FOUND);
      error.status = constants.HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    res.status(constants.HTTP_STATUS.OK).json({
      success: true,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * LOGOUT
 * 
 * Since we're using JWT (stateless), logout is mainly for frontend
 * Frontend should delete the token from localStorage
 * But we can implement backend token blacklisting if needed
 */
function logout(req, res) {
  // With JWT, logout is handled on the client side
  // Client deletes the token from localStorage
  // Server doesn't need to do anything special

  res.status(constants.HTTP_STATUS.OK).json({
    success: true,
    message: 'Logged out successfully',
  });
}

module.exports = {
  signup,
  login,
  getCurrentUser,
  logout,
};
