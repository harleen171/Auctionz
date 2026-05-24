/**
 * Bid Model
 * 
 * Demonstrates:
 * - Schema references
 * - Validation with min value
 * - Compound indexes for unique constraints
 */

const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema(
  {
    // Reference to the Auction being bid on
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Auction',
      required: true,
    },

    // Reference to the User who made the bid
    bidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Bid amount
    bidAmount: {
      type: Number,
      required: [true, 'Bid amount is required'],
      min: [0, 'Bid amount must be positive'],
    },

    // Bid status
    status: {
      type: String,
      enum: ['active', 'outbid', 'won', 'cancelled'],
      default: 'active',
    },

    // IP address for fraud detection (optional)
    ipAddress: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Indexes
 */
// Find bids for a specific auction
bidSchema.index({ auction: 1, bidAmount: -1 });
// Find bids by a specific user
bidSchema.index({ bidder: 1 });
// Compound index for finding highest bid of an auction
bidSchema.index({ auction: 1, status: 1, bidAmount: -1 });

const Bid = mongoose.model('Bid', bidSchema);

module.exports = Bid;
