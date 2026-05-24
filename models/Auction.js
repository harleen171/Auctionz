/**
 * Auction Model
 * 
 * Demonstrates:
 * - Schema references (relationships between models)
 * - Nested objects in MongoDB
 * - Enum validation
 * - Advanced schema options
 * 
 * RELATIONSHIPS:
 * Auction belongs to a User (seller)
 * Auction can have multiple Bids
 */

const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema(
  {
    // Auction title
    title: {
      type: String,
      required: [true, 'Auction title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [100, 'Title must not exceed 100 characters'],
    },

    // Detailed description
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [5000, 'Description must not exceed 5000 characters'],
    },

    // Category of the item
    category: {
      type: String,
      required: true,
      enum: ['Electronics', 'Collectibles', 'Art', 'Fashion', 'Books', 'Other'],
    },

    // Starting/Base price
    startingPrice: {
      type: Number,
      required: [true, 'Starting price is required'],
      min: [0, 'Price cannot be negative'],
    },

    // Current highest bid
    currentBid: {
      type: Number,
      default: function () {
        return this.startingPrice;
      },
    },

    // Seller (Reference to User model)
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // References the User model
      required: true,
    },

    // Auction images
    images: {
      type: [String], // Array of image URLs
      default: [],
    },

    // Auction status
    status: {
      type: String,
      enum: ['upcoming', 'active', 'completed', 'cancelled'],
      default: 'upcoming',
    },

    // Start time
    startTime: {
      type: Date,
      required: true,
    },

    // End time
    endTime: {
      type: Date,
      required: true,
    },

    // Highest bidder
    highestBidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // Number of bids
    bidCount: {
      type: Number,
      default: 0,
    },

    // Condition
    condition: {
      type: String,
      enum: ['new', 'like-new', 'good', 'fair', 'poor'],
      required: true,
    },

    // Location
    location: {
      type: String,
      required: true,
    },

    // Is auction featured (paid feature)
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // Views count
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Index for frequently queried fields
 */
auctionSchema.index({ seller: 1 });
auctionSchema.index({ status: 1 });
auctionSchema.index({ category: 1 });
auctionSchema.index({ endTime: 1 });

/**
 * Middleware - Update status based on time
 */
auctionSchema.pre('find', function () {
  const now = new Date();
  this.updateMany(
    { endTime: { $lt: now }, status: 'active' },
    { $set: { status: 'completed' } }
  );
});

/**
 * Static method to find active auctions
 */
auctionSchema.statics.findActiveAuctions = function () {
  const now = new Date();
  return this.find({
    status: 'active',
    startTime: { $lt: now },
    endTime: { $gt: now },
  }).populate('seller', 'fullName username profilePicture');
};

/**
 * Instance method to check if auction is still accepting bids
 */
auctionSchema.methods.isAcceptingBids = function () {
  const now = new Date();
  return this.status === 'active' && now < new Date(this.endTime);
};

const Auction = mongoose.model('Auction', auctionSchema);

module.exports = Auction;
