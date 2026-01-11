const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const Notification = require('../models/Notification');
const User = require('../models/User');

class NotificationService {
  initialize() {
    if (!admin.apps.length) {
      try {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          }),
        });
        console.log('✅ Firebase Admin initialized');
      } catch (error) {
        console.error('❌ Firebase Admin initialization error:', error);
      }
    }
  }

  async sendNotification(userId, type, data = {}) {
    try {
      const user = await User.findOne({ user_id: userId });
      if (!user || !user.fcm_token) {
        return { success: false, error: 'User or FCM token not found' };
      }

      const message = this.buildMessage(type, data, user.fcm_token);
      const response = await admin.messaging().send(message);

      const notification = new Notification({
        notification_id: uuidv4(),
        user_id: userId,
        type: type,
        fcm_token: user.fcm_token,
        is_delivered: true,
        metadata: data,
      });
      await notification.save();

      return { success: true, messageId: response };
    } catch (error) {
      console.error('Error sending notification:', error);
      
      try {
        const user = await User.findOne({ user_id: userId });
        const notification = new Notification({
          notification_id: uuidv4(),
          user_id: userId,
          type: type,
          fcm_token: user?.fcm_token || null,
          is_delivered: false,
          metadata: { ...data, error: error.message },
        });
        await notification.save();
      } catch (saveError) {
        console.error('Error saving notification record:', saveError);
      }

      return { success: false, error: error.message };
    }
  }

  buildMessage(type, data, fcmToken) {
    const messages = {
      EXPIRY_WARNING: {
        title: '⏰ Mission Expiring Soon!',
        body: `Only ${data.hours_left || 2} hours left to complete "${data.mission_title || 'your mission'}"!`,
      },
      BONUS_EARNED: {
        title: '🎉 Bonus Earned!',
        body: `You earned ${data.coins || 50} bonus coins for completing all missions today!`,
      },
      STREAK_REMINDER: {
        title: '🔥 Keep Your Streak Alive!',
        body: `Complete today's missions to maintain your ${data.streak_count || 0}-day streak!`,
      },
      STREAK_LOST: {
        title: '💔 Streak Lost',
        body: 'Your streak has been reset. Complete today\'s missions to start a new one!',
      },
      MISSION_READY: {
        title: '✨ New Missions Available!',
        body: 'Your daily missions are ready. Start earning Sharp Coins now!',
      },
    };

    const message = messages[type] || {
      title: 'Sharp Rewards',
      body: 'You have a new notification',
    };

    return {
      token: fcmToken,
      notification: {
        title: message.title,
        body: message.body,
      },
      data: {
        type: type,
        ...data,
      },
      android: {
        priority: 'high',
      },
      apns: {
        headers: {
          'apns-priority': '10',
        },
      },
    };
  }

  async scheduleExpiryWarning(userId, missionId, expiresAt) {
    try {
      const now = new Date();
      const hoursUntilExpiry = (expiresAt - now) / (1000 * 60 * 60);

      if (hoursUntilExpiry > 2 && hoursUntilExpiry <= 24) {
        const scheduleTime = new Date(expiresAt.getTime() - 2 * 60 * 60 * 1000);
        console.log(`Scheduled expiry warning for user ${userId} at ${scheduleTime}`);
      }

      if (hoursUntilExpiry > 6 && hoursUntilExpiry <= 24) {
        const scheduleTime = new Date(expiresAt.getTime() - 6 * 60 * 60 * 1000);
        console.log(`Scheduled 6h expiry warning for user ${userId} at ${scheduleTime}`);
      }
    } catch (error) {
      console.error('Error scheduling expiry warning:', error);
    }
  }
}

const notificationService = new NotificationService();
if (process.env.FIREBASE_PROJECT_ID) {
  notificationService.initialize();
}

module.exports = notificationService;
