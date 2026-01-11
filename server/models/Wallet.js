const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  wallet_id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  user_id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  total_balance: {
    type: Number,
    default: 0,
    min: 0,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  currency: {
    type: String,
    default: 'SHARP_COINS',
  },
  transaction_history: [{
    type: String,
  }],
}, {
  timestamps: true,
});

walletSchema.index({ user_id: 1 }, { unique: true });

module.exports = mongoose.model('Wallet', walletSchema);
