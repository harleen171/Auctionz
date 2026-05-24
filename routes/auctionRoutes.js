/**
 * Auction Routes
 * 
 * Defines all auction-related API endpoints:
 * - GET /api/auctions - Get all auctions
 * - POST /api/auctions - Create auction (protected)
 * - GET /api/auctions/:id - Get single auction
 * - PUT /api/auctions/:id - Update auction (protected)
 * - DELETE /api/auctions/:id - Delete auction (protected)
 * - GET /api/auctions/user/my-auctions - Get user's auctions (protected)
 */

const express = require('express');
const router = express.Router();

// Import controller
const auctionController = require('../controllers/auctionController');

// Import middleware
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * PUBLIC ROUTES
 */

// GET all auctions with pagination
// Query params: ?page=1&limit=10&category=Electronics&status=active
router.get('/', auctionController.getAllAuctions);

/**
 * PROTECTED ROUTES
 */

// GET user's own auctions (Must come BEFORE /:id route)
router.get('/user/my-auctions', verifyToken, auctionController.getUserAuctions);

/**
 * PUBLIC ROUTES (continued)
 */

// GET single auction by ID
router.get('/:id', auctionController.getAuctionById);

// POST create new auction
router.post('/', verifyToken, auctionController.createAuction);

// PUT update auction
router.put('/:id', verifyToken, auctionController.updateAuction);

// DELETE auction
router.delete('/:id', verifyToken, auctionController.deleteAuction);

module.exports = router;

