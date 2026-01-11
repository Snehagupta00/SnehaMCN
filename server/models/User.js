const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      default: null,
      trim: true,
    },
    password_hash: {
      type: String,
      required: false,
    },
    timezone: {
      type: String,
      default: "UTC",
    },
    created_at: {
      type: Date,
      default: Date.now,
      index: true,
    },
    last_activity_at: {
      type: Date,
      default: Date.now,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    fcm_token: {
      type: String,
      default: null,
    },
    device_fingerprint: {
      type: String,
      default: null,
    },
    current_device_id: {
      type: String,
      default: null,
    },
    preferences: {
      push_notifications: {
        type: Boolean,
        default: true,
      },
      language: {
        type: String,
        default: "en",
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 });
userSchema.index({ created_at: 1 });
userSchema.index({ last_activity_at: 1 });

module.exports = mongoose.model("User", userSchema);
