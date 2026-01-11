const PhoneActivity = require('../models/PhoneActivity');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

class PhoneActivityController {
  async syncActivity(req, res) {
    try {
      const userId = req.user.user_id;
      const { date, totalSeconds, sessions, deviceInfo } = req.body;

      if (!date) {
        return res.status(400).json({
          success: false,
          error: 'Date is required',
        });
      }

      if (deviceInfo && deviceInfo.deviceId) {
        const user = await User.findOne({ user_id: userId });
        if (user && user.current_device_id && user.current_device_id !== deviceInfo.deviceId) {
          return res.status(409).json({
            success: false,
            error: 'This account is logged in on another device.',
            code: 'SESSION_CONFLICT',
          });
        }
      }

      let activity = await PhoneActivity.findOne({
        user_id: userId,
        date: date,
      });

      if (activity) {
        activity.total_seconds = totalSeconds || activity.total_seconds;
        activity.sessions = sessions || activity.sessions;
        if (deviceInfo) {
          activity.device_info = deviceInfo;
        }
        activity.last_updated = new Date();
        activity.synced_at = new Date();
      } else {
        activity = new PhoneActivity({
          activity_id: uuidv4(),
          user_id: userId,
          date: date,
          total_seconds: totalSeconds || 0,
          sessions: sessions || 0,
          device_info: deviceInfo || {},
          synced_at: new Date(),
        });
      }

      await activity.save();

      res.json({
        success: true,
        data: {
          activity: {
            activity_id: activity.activity_id,
            date: activity.date,
            total_seconds: activity.total_seconds,
            sessions: activity.sessions,
            synced_at: activity.synced_at,
          },
        },
      });
    } catch (error) {
      console.error('Error syncing phone activity:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to sync phone activity',
      });
    }
  }

  async getActivity(req, res) {
    try {
      const userId = req.user.user_id;
      const { date } = req.params;

      if (date) {
        const activity = await PhoneActivity.findOne({
          user_id: userId,
          date: date,
        });

        if (!activity) {
          return res.json({
            success: true,
            data: {
              activity: {
                date: date,
                total_seconds: 0,
                sessions: 0,
              },
            },
          });
        }

        return res.json({
          success: true,
          data: {
            activity: {
              activity_id: activity.activity_id,
              date: activity.date,
              total_seconds: activity.total_seconds,
              sessions: activity.sessions,
              device_info: activity.device_info,
              last_updated: activity.last_updated,
              synced_at: activity.synced_at,
            },
          },
        });
      } else {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const dateString = thirtyDaysAgo.toISOString().split('T')[0];

        const activities = await PhoneActivity.find({
          user_id: userId,
          date: { $gte: dateString },
        }).sort({ date: -1 });

        return res.json({
          success: true,
          data: {
            activities: activities.map(a => ({
              activity_id: a.activity_id,
              date: a.date,
              total_seconds: a.total_seconds,
              sessions: a.sessions,
              synced_at: a.synced_at,
            })),
          },
        });
      }
    } catch (error) {
      console.error('Error getting phone activity:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get phone activity',
      });
    }
  }

  async getStatsSummary(req, res) {
    try {
      const userId = req.user.user_id;

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const dateString = sevenDaysAgo.toISOString().split('T')[0];

      const activities = await PhoneActivity.find({
        user_id: userId,
        date: { $gte: dateString },
      });

      const totalSeconds = activities.reduce((sum, a) => sum + (a.total_seconds || 0), 0);
      const totalSessions = activities.reduce((sum, a) => sum + (a.sessions || 0), 0);
      const avgDailySeconds = activities.length > 0 ? totalSeconds / activities.length : 0;

      res.json({
        success: true,
        data: {
          summary: {
            total_seconds: totalSeconds,
            total_minutes: Math.floor(totalSeconds / 60),
            total_hours: Math.floor(totalSeconds / 3600),
            total_sessions: totalSessions,
            avg_daily_seconds: Math.floor(avgDailySeconds),
            avg_daily_minutes: Math.floor(avgDailySeconds / 60),
            days_tracked: activities.length,
          },
        },
      });
    } catch (error) {
      console.error('Error getting stats summary:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get stats summary',
      });
    }
  }
}

module.exports = new PhoneActivityController();
