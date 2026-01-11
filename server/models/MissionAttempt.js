const mongoose = require('mongoose');

const missionAttemptSchema = new mongoose.Schema({
  attempt_id: {
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
  mission_id: {
    type: String,
    required: true,
    index: true,
  },
  submitted_at: {
    type: Date,
    default: Date.now,
    index: true,
  },
  completed_at: {
    type: Date,
    default: null,
  },
  proof: {
    url: String,
    type: String,
    timestamp: Date,
    raw_data: mongoose.Schema.Types.Mixed,
  },
  verification_status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING',
    index: true,
  },
  fraud_score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  api_response: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  notes: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

missionAttemptSchema.index(
  { user_id: 1, mission_id: 1, submitted_at: 1 },
  { unique: false }
);

missionAttemptSchema.index({ verification_status: 1, submitted_at: 1 });

module.exports = mongoose.model('MissionAttempt', missionAttemptSchema);
