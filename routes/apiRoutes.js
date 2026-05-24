/**
 * API Routes Index
 * 
 * Central hub for all API route definitions
 * Routes are mounted at /api prefix in the main server.js
 * 
 * Route Structure:
 * /api/auth/* → Authentication routes
 * /api/auctions/* → Auction routes
 * /api/protected → Test protected route
 */

const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./authRoutes');
const auctionRoutes = require('./auctionRoutes');

// Import middleware
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * Mount route modules
 */
router.use('/auth', authRoutes);
router.use('/auctions', auctionRoutes);

/**
 * EXAMPLE: Protected Test Route
 * 
 * This demonstrates how to protect a route using JWT middleware
 * 
 * GET /api/protected
 * Headers: Authorization: Bearer {jwt_token}
 */
router.get('/protected', verifyToken, (req, res) => {
  res.json({
    success: true,
    message: '✅ You accessed a protected route!',
    user: {
      userId: req.user.userId,
      email: req.user.email,
    },
    info: {
      description: 'This route is protected by JWT middleware',
      howItWorks: [
        '1. Client sends JWT token in Authorization header',
        '2. verifyToken middleware extracts and verifies token',
        '3. If valid, middleware adds user data to req.user',
        '4. Route handler executes with access to user data',
      ],
    },
  });
});

/**
 * EXAMPLE: Public Test Route
 */
router.get('/public-test', (req, res) => {
  res.json({
    success: true,
    message: '✅ This is a public route - no authentication needed',
    timestamp: new Date(),
  });
});

/**
 * EXAMPLE: Block vs Non-blocking Code
 * 
 * Demonstrates difference between blocking and non-blocking operations
 */
router.get('/blocking-demo', (req, res) => {
  /**
   * BLOCKING: Stops all requests while processing
   * (Don't use in production - server becomes unresponsive)
   */
  let sum = 0;
  const start = Date.now();
  
  // Heavy calculation - blocks event loop
  for (let i = 0; i < 1000000000; i++) {
    sum += i;
  }
  
  const duration = Date.now() - start;

  res.json({
    message: 'This was a blocking operation',
    duration: `${duration}ms`,
    warning: '⚠️ All other requests waited for this to complete!',
  });
});

/**
 * EXAMPLE: Non-blocking Pattern
 * 
 * Uses setTimeout to simulate async work (non-blocking)
 */
router.get('/non-blocking-demo', (req, res) => {
  // This happens immediately
  console.log('⏰ Starting async work...');

  // This happens after 2 seconds, but doesn't block other requests
  setTimeout(() => {
    console.log('✅ Async work done!');
  }, 2000);

  // Send response immediately (doesn't wait for setTimeout)
  res.json({
    message: 'Check console after 2 seconds!',
    info: 'Other requests can be served meanwhile',
  });
});

/**
 * Demo store: cart, items, bids, checkout (JSON file–backed)
 * Mounted last so /api/auth and /api/auctions take precedence.
 */
const storeApiRoutes = require('../auctionRoutes');
router.use('/', storeApiRoutes);

module.exports = router;
