const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  notification_id: {
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
  type: {
    type: String,
    enum: ['EXPIRY_WARNING', 'BONUS_EARNED', 'STREAK_REMINDER', 'STREAK_LOST', 'MISSION_READY'],
    required: true,
  },
  sent_at: {
    type: Date,
    default: Date.now,
  },
  fcm_token: {
    type: String,
    default: null,
  },
  is_delivered: {
    type: Boolean,
    default: false,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

notificationSchema.index({ user_id: 1, is_delivered: 1 });
notificationSchema.index({ sent_at: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
