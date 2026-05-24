/**
 * Auction Controller
 * 
 * Handles all auction-related operations:
 * - Create auction
 * - Get all auctions
 * - Get auction by ID
 * - Update auction
 * - Delete auction
 * - Get user's auctions
 */

const Auction = require('../models/Auction');
const constants = require('../config/constants');

/**
 * Create Auction
 * POST /api/auctions
 * Protected route - requires JWT token
 */
async function createAuction(req, res, next) {
  try {
    const {
      title,
      description,
      category,
      startingPrice,
      startTime,
      endTime,
      condition,
      location,
      images,
    } = req.body;

    const userId = req.user.userId; // From JWT token

    // Validate times
    if (new Date(endTime) <= new Date(startTime)) {
      const error = new Error('End time must be after start time');
      error.status = constants.HTTP_STATUS.BAD_REQUEST;
      throw error;
    }

    // Create new auction
    const auction = new Auction({
      title,
      description,
      category,
      startingPrice,
      currentBid: startingPrice,
      startTime,
      endTime,
      condition,
      location,
      images: images || [],
      seller: userId,
    });

    // Save to database
    await auction.save();

    // Populate seller information
    await auction.populate('seller', 'fullName username profilePicture');

    console.log(`✅ Auction created:`, { auctionId: auction._id, title });

    res.status(constants.HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Auction created successfully',
      auction: auction,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get All Auctions with Pagination
 * GET /api/auctions?page=1&limit=10&category=Electronics&status=active
 */
async function getAllAuctions(req, res, next) {
  try {
    const page = parseInt(req.query.page) || constants.PAGINATION.DEFAULT_PAGE;
    const limit = Math.min(
      parseInt(req.query.limit) || constants.PAGINATION.DEFAULT_LIMIT,
      constants.PAGINATION.MAX_LIMIT
    );

    // Build filter object
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;

    // Calculate skip
    const skip = (page - 1) * limit;

    // Query database
    const auctions = await Auction.find(filter)
      .populate('seller', 'fullName username profilePicture')
      .populate('highestBidder', 'username')
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Auction.countDocuments(filter);

    res.status(constants.HTTP_STATUS.OK).json({
      success: true,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      auctions,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get Single Auction by ID
 * GET /api/auctions/:id
 */
async function getAuctionById(req, res, next) {
  try {
    const { id } = req.params;

    const auction = await Auction.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } }, // Increment views
      { new: true }
    )
      .populate('seller', 'fullName username profilePicture bio')
      .populate('highestBidder', 'username');

    if (!auction) {
      const error = new Error('Auction not found');
      error.status = constants.HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    res.status(constants.HTTP_STATUS.OK).json({
      success: true,
      auction,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update Auction
 * PUT /api/auctions/:id
 * Protected - only seller can update
 */
async function updateAuction(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const updates = req.body;

    const auction = await Auction.findById(id);

    if (!auction) {
      const error = new Error('Auction not found');
      error.status = constants.HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    // Check if user is the seller
    if (auction.seller.toString() !== userId) {
      const error = new Error('Not authorized to update this auction');
      error.status = constants.HTTP_STATUS.FORBIDDEN;
      throw error;
    }

    // Can't update active auctions
    if (auction.status === 'active') {
      const error = new Error('Cannot update active auction');
      error.status = constants.HTTP_STATUS.BAD_REQUEST;
      throw error;
    }

    // Update fields
    const updatedAuction = await Auction.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate('seller', 'fullName username profilePicture');

    console.log(`✅ Auction updated:`, { auctionId: id });

    res.status(constants.HTTP_STATUS.OK).json({
      success: true,
      message: 'Auction updated successfully',
      auction: updatedAuction,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete Auction
 * DELETE /api/auctions/:id
 * Protected - only seller or admin can delete
 */
async function deleteAuction(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const auction = await Auction.findById(id);

    if (!auction) {
      const error = new Error('Auction not found');
      error.status = constants.HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    // Check authorization
    if (auction.seller.toString() !== userId) {
      const error = new Error('Not authorized to delete this auction');
      error.status = constants.HTTP_STATUS.FORBIDDEN;
      throw error;
    }

    // Delete
    await Auction.findByIdAndDelete(id);

    console.log(`✅ Auction deleted:`, { auctionId: id });

    res.status(constants.HTTP_STATUS.OK).json({
      success: true,
      message: 'Auction deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get User's Auctions
 * GET /api/auctions/user/my-auctions
 * Protected route
 */
async function getUserAuctions(req, res, next) {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const auctions = await Auction.find({ seller: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Auction.countDocuments({ seller: userId });

    res.status(constants.HTTP_STATUS.OK).json({
      success: true,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      auctions,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createAuction,
  getAllAuctions,
  getAuctionById,
  updateAuction,
  deleteAuction,
  getUserAuctions,
};

