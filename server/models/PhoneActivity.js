const mongoose = require('mongoose');

const phoneActivitySchema = new mongoose.Schema({
  activity_id: {
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
  date: {
    type: String,
    required: true,
    index: true,
  },
  total_seconds: {
    type: Number,
    default: 0,
  },
  sessions: {
    type: Number,
    default: 0,
  },
  device_info: {
    platform: String,
    deviceName: String,
    brand: String,
    modelName: String,
    osVersion: String,
    appVersion: String,
  },
  last_updated: {
    type: Date,
    default: Date.now,
  },
  synced_at: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

phoneActivitySchema.index({ user_id: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('PhoneActivity', phoneActivitySchema);
