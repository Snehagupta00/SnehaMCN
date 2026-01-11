const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  reward_id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  user_id: {
    type: String,
    required: true,
    index: true,
  },
  attempt_id: {
    type: String,
    required: true,
    index: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  type: {
    type: String,
    enum: ['COINS', 'MULTIPLIER', 'BADGE'],
    required: true,
  },
  source: {
    type: String,
    enum: ['MISSION_COMPLETION', 'STREAK_BONUS', 'REFERRAL', 'ALL_MISSIONS_BONUS'],
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
    index: true,
  },
  is_credited: {
    type: Boolean,
    default: false,
  },
  reason: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

rewardSchema.index({ user_id: 1, created_at: -1 });
rewardSchema.index({ created_at: 1 });
rewardSchema.index({ is_credited: 1 });

module.exports = mongoose.model('Reward', rewardSchema);
