/**
 * User Model
 * 
 * Demonstrates:
 * - Mongoose Schema definition
 * - Schema validation
 * - Pre-save hooks (middleware)
 * - Methods on schema
 * - Indexes for performance
 * 
 * DATABASE SCHEMA (How data is structured):
 * {
 *   _id: ObjectId (auto-generated unique identifier)
 *   fullName: String
 *   email: String (unique)
 *   username: String (unique)
 *   password: String (hashed with bcrypt)
 *   role: String (user/admin)
 *   createdAt: DateTime (auto-generated)
 *   updatedAt: DateTime (auto-updated)
 * }
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema Definition
 * Defines the structure and validation rules for User documents
 */
const userSchema = new mongoose.Schema(
  {
    // Full name of the user
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
    },

    // Email address (must be unique for login)
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // No two users can have same email
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },

    // Username (must be unique)
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
    },

    // Password (will be hashed before saving)
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password in queries by default (security)
    },

    // User role (for authorization)
    role: {
      type: String,
      enum: ['user', 'admin', 'moderator'],
      default: 'user',
    },

    // Contact information
    phone: {
      type: String,
      default: null,
    },

    // Bio/About section
    bio: {
      type: String,
      default: null,
      maxlength: 500,
    },

    // Profile picture URL
    profilePicture: {
      type: String,
      default: null,
    },

    // Account status
    isActive: {
      type: Boolean,
      default: true,
    },

    // When user last logged in
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

/**
 * INDEXES FOR PERFORMANCE
 * Indexes speed up database queries
 */
// Email lookups are common, so index it
userSchema.index({ email: 1 });
// Username lookups for login
userSchema.index({ username: 1 });

/**
 * PRE-SAVE HOOK (Middleware)
 * Runs BEFORE saving user to database
 * 
 * This demonstrates:
 * - Async operations before saving
 * - Password hashing with bcrypt
 * - Mongoose hooks/middleware
 */
userSchema.pre('save', async function (next) {
  // Only hash password if it's modified (new password or updating password)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt (10 rounds is standard)
    const salt = await bcrypt.genSalt(10);

    // Hash the password
    // This replaces the plain text password with the hash
    this.password = await bcrypt.hash(this.password, salt);

    console.log(`🔐 Password hashed for user: ${this.email}`);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * INSTANCE METHOD
 * Can be called on individual user documents
 * 
 * Example: const user = await User.findOne({ email });
 *          const isMatch = await user.comparePassword(plainPassword);
 */
userSchema.methods.comparePassword = async function (plainPassword) {
  try {
    // Compare plain text password with hashed password
    // Returns true or false
    const isMatch = await bcrypt.compare(plainPassword, this.password);
    return isMatch;
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

/**
 * INSTANCE METHOD
 * Get user data without sensitive information
 */
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  // Remove password from response
  delete userObject.password;
  return userObject;
};

/**
 * STATIC METHOD
 * Called on the Model itself
 * 
 * Example: const users = await User.findByRole('admin');
 */
userSchema.statics.findByRole = function (role) {
  return this.find({ role: role, isActive: true });
};

/**
 * Create Model from Schema
 * This is what we export and use in controllers
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
