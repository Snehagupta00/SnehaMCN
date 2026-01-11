const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
  mission_id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['EASY', 'MEDIUM', 'HARD'],
    required: true,
  },
  base_reward: {
    type: Number,
    required: true,
    min: 10,
    max: 50,
  },
  requirement_type: {
    type: String,
    enum: ['STEPS', 'PHONE_FREE', 'QUIZ', 'EXPENSE_TRACK', 'PRODUCTIVITY'],
    required: true,
  },
  requirement_value: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
    index: true,
  },
  expires_at: {
    type: Date,
    required: true,
    index: true,
  },
  proof_requirement: {
    type: String,
    enum: ['API_VERIFICATION', 'MANUAL_CONFIRMATION', 'SCREENSHOT'],
    required: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  metadata: {
    tags: [String],
    category: String,
    icon_url: String,
  },
}, {
  timestamps: true,
});

missionSchema.index({ expires_at: 1 }, { expireAfterSeconds: 86400 });
missionSchema.index({ is_active: 1, expires_at: 1 });

module.exports = mongoose.model('Mission', missionSchema);
