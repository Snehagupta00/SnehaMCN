const StreakManager = require('../services/StreakManager');
const Streak = require('../models/Streak');
const User = require('../models/User');

class StreakController {
  async getCurrentStreak(req, res) {
    try {
      const userId = req.user.user_id;
      const streak = await StreakManager.getStreak(userId);

      res.json({
        success: true,
        data: streak,
      });
    } catch (error) {
      console.error('Error fetching streak:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch streak',
      });
    }
  }

  async getLeaderboard(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      
      const topStreaks = await Streak.find({})
        .sort({ 
          max_streak_ever: -1, 
          current_streak_count: -1 
        })
        .limit(limit)
        .lean();

      const leaderboard = await Promise.all(
        topStreaks.map(async (streak) => {
          try {
            const user = await User.findOne({ user_id: streak.user_id }).lean();
            let username = user?.username;
            if (!username && user?.email) {
              const emailParts = user.email.split('@');
              username = emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1);
            }
            if (!username) {
              username = 'User';
            }
            
            return {
              rank: 0,
              user_id: streak.user_id,
              username: username,
              email: user?.email || 'Unknown',
              current_streak: streak.current_streak_count || 0,
              max_streak: streak.max_streak_ever || 0,
              multiplier: streak.multiplier || 1.0,
              badges: streak.badges_earned || [],
            };
          } catch (err) {
            console.warn(`Failed to fetch user ${streak.user_id}:`, err);
            return {
              rank: 0,
              user_id: streak.user_id,
              username: 'User',
              email: 'Unknown',
              current_streak: streak.current_streak_count || 0,
              max_streak: streak.max_streak_ever || 0,
              multiplier: streak.multiplier || 1.0,
              badges: streak.badges_earned || [],
            };
          }
        })
      );

      leaderboard.forEach((entry, index) => {
        entry.rank = index + 1;
      });

      res.json({
        success: true,
        leaderboard: leaderboard,
      });
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch leaderboard',
      });
    }
  }
}

module.exports = new StreakController();
