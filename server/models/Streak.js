const mongoose = require('mongoose');

const streakSchema = new mongoose.Schema({
  streak_id: {
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
  current_streak_count: {
    type: Number,
    default: 0,
    min: 0,
  },
  max_streak_ever: {
    type: Number,
    default: 0,
    min: 0,
  },
  last_completion_date: {
    type: Date,
    default: null,
  },
  streak_started_at: {
    type: Date,
    default: null,
  },
  multiplier: {
    type: Number,
    default: 1.0,
    min: 1.0,
    max: 2.5,
  },
  badges_earned: [{
    type: String,
  }],
}, {
  timestamps: true,
});

streakSchema.index({ user_id: 1 }, { unique: true });
streakSchema.index({ last_completion_date: 1 });

module.exports = mongoose.model('Streak', streakSchema);
