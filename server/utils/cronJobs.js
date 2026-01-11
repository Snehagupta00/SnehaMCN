const cron = require('node-cron');
const Mission = require('../models/Mission');
const MissionAttempt = require('../models/MissionAttempt');
const StreakManager = require('../services/StreakManager');
const NotificationService = require('../services/NotificationService');
const User = require('../models/User');
const PhoneActivity = require('../models/PhoneActivity');
const getRedisClient = require('../config/redis');

cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    const expiredMissions = await Mission.find({
      expires_at: { $lte: now },
      is_active: true,
    });

    for (const mission of expiredMissions) {
      mission.is_active = false;
      await mission.save();

      const redisClient = await getRedisClient();
      if (redisClient) {
        const cacheKey = `missions:${mission.created_at.toISOString().split('T')[0]}`;
        await redisClient.del(cacheKey);
      }
    }

    if (expiredMissions.length > 0) {
      console.log(`✅ Expired ${expiredMissions.length} missions`);
    }
  } catch (error) {
    console.error('❌ Error in expire missions cron:', error);
  }
});

cron.schedule('59 23 * * *', async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const users = await User.find({ is_active: true });

    for (const user of users) {
      const shouldBreak = await StreakManager.shouldBreakStreak(user.user_id, today);
      
      if (shouldBreak) {
        const streak = await StreakManager.breakStreak(user.user_id);
        
        if (streak && streak.current_streak_count > 0) {
          await NotificationService.sendNotification(
            user.user_id,
            'STREAK_LOST',
            {
              previous_streak: streak.current_streak_count,
            }
          );
        }
      }
    }

    console.log('✅ Streak break check completed');
  } catch (error) {
    console.error('❌ Error in break streaks cron:', error);
  }
});

cron.schedule('0 8 * * *', async () => {
  try {
    const users = await User.find({
      is_active: true,
      'preferences.push_notifications': true,
      fcm_token: { $ne: null },
    });

    for (const user of users) {
      await NotificationService.sendNotification(
        user.user_id,
        'MISSION_READY',
        {}
      );
    }

    console.log(`✅ Sent mission reminders to ${users.length} users`);
  } catch (error) {
    console.error('❌ Error in mission reminder cron:', error);
  }
});

cron.schedule('0 0 * * *', async () => {
  try {
    console.log('🔄 Starting midnight phone activity sync...');
    
    const users = await User.find({ is_active: true });
    let syncedCount = 0;
    let errorCount = 0;

    for (const user of users) {
      try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const dateString = yesterday.toISOString().split('T')[0];

        const existing = await PhoneActivity.findOne({
          user_id: user.user_id,
          date: dateString,
        });

        if (!existing || !existing.synced_at) {
          if (!existing) {
            await PhoneActivity.create({
              activity_id: require('uuid').v4(),
              user_id: user.user_id,
              date: dateString,
              total_seconds: 0,
              sessions: 0,
              synced_at: new Date(),
            });
          }
          syncedCount++;
        }
      } catch (error) {
        console.error(`❌ Error syncing for user ${user.user_id}:`, error);
        errorCount++;
      }
    }

    console.log(`✅ Midnight sync completed: ${syncedCount} users synced, ${errorCount} errors`);
  } catch (error) {
    console.error('❌ Error in midnight phone activity sync cron:', error);
  }
});

console.log('✅ Cron jobs initialized');

module.exports = {};
