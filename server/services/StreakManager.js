const { v4: uuidv4 } = require('uuid');
const Streak = require('../models/Streak');

class StreakManager {
  async getStreak(userId) {
    try {
      let streak = await Streak.findOne({ user_id: userId });
      if (!streak) {
        streak = new Streak({
          streak_id: uuidv4(),
          user_id: userId,
          current_streak_count: 0,
          max_streak_ever: 0,
          multiplier: 1.0,
          badges_earned: [],
        });
        await streak.save();
      }

      return {
        streak_id: streak.streak_id,
        user_id: streak.user_id,
        current_streak_count: streak.current_streak_count || 0,
        max_streak_ever: streak.max_streak_ever || 0,
        multiplier: streak.multiplier || 1.0,
        last_completion_date: streak.last_completion_date || null,
        streak_started_at: streak.streak_started_at || null,
        badges_earned: streak.badges_earned || [],
      };
    } catch (error) {
      console.error('Error fetching streak:', error);
      throw error;
    }
  }

  async incrementStreak(userId, completionDate = new Date()) {
    const session = await Streak.db.startSession();
    session.startTransaction();

    try {
      let streak = await Streak.findOne({ user_id: userId }).session(session);
      if (!streak) {
        streak = new Streak({
          streak_id: uuidv4(),
          user_id: userId,
          current_streak_count: 0,
          max_streak_ever: 0,
          multiplier: 1.0,
          badges_earned: [],
        });
      }

      const today = new Date(completionDate);
      today.setHours(0, 0, 0, 0);

      const lastCompletion = streak.last_completion_date
        ? new Date(streak.last_completion_date)
        : null;
      const lastCompletionDate = lastCompletion ? new Date(lastCompletion) : null;
      if (lastCompletionDate) {
        lastCompletionDate.setHours(0, 0, 0, 0);
      }

      const daysDiff = lastCompletionDate
        ? Math.floor((today - lastCompletionDate) / (1000 * 60 * 60 * 24))
        : 1;

      if (daysDiff === 1) {
        streak.current_streak_count += 1;
      } else if (daysDiff > 1) {
        streak.current_streak_count = 1;
        streak.streak_started_at = today;
      } else if (daysDiff === 0) {
      } else {
        streak.current_streak_count = 1;
        streak.streak_started_at = today;
      }

      if (streak.current_streak_count > streak.max_streak_ever) {
        streak.max_streak_ever = streak.current_streak_count;
      }

      if (streak.current_streak_count >= 30) {
        streak.multiplier = 2.5;
      } else if (streak.current_streak_count >= 14) {
        streak.multiplier = 2.0;
      } else if (streak.current_streak_count >= 7) {
        streak.multiplier = 1.5;
      } else {
        streak.multiplier = 1.0;
      }

      if (streak.current_streak_count === 7 && !streak.badges_earned.includes('WEEK_WARRIOR')) {
        streak.badges_earned.push('WEEK_WARRIOR');
      }
      if (streak.current_streak_count === 14 && !streak.badges_earned.includes('FORTNIGHT_FIGHTER')) {
        streak.badges_earned.push('FORTNIGHT_FIGHTER');
      }
      if (streak.current_streak_count === 30 && !streak.badges_earned.includes('MONTHLY_MASTER')) {
        streak.badges_earned.push('MONTHLY_MASTER');
      }

      streak.last_completion_date = today;
      await streak.save({ session });

      await session.commitTransaction();

      return {
        streak_id: streak.streak_id,
        current_streak_count: streak.current_streak_count,
        max_streak_ever: streak.max_streak_ever,
        multiplier: streak.multiplier,
        badges_earned: streak.badges_earned,
      };
    } catch (error) {
      await session.abortTransaction();
      console.error('Error incrementing streak:', error);
      throw error;
    } finally {
      session.endSession();
    }
  }

  async breakStreak(userId) {
    try {
      const streak = await Streak.findOne({ user_id: userId });
      if (!streak) {
        return null;
      }

      streak.current_streak_count = 0;
      streak.multiplier = 1.0;
      await streak.save();

      return streak;
    } catch (error) {
      console.error('Error breaking streak:', error);
      throw error;
    }
  }

  async shouldBreakStreak(userId, today = new Date()) {
    try {
      const streak = await Streak.findOne({ user_id: userId });
      if (!streak || streak.current_streak_count === 0) {
        return false;
      }

      if (!streak.last_completion_date) {
        return true;
      }

      const lastCompletion = new Date(streak.last_completion_date);
      lastCompletion.setHours(0, 0, 0, 0);
      const todayDate = new Date(today);
      todayDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor((todayDate - lastCompletion) / (1000 * 60 * 60 * 24));
      return daysDiff > 1;
    } catch (error) {
      console.error('Error checking streak break:', error);
      return false;
    }
  }
}

module.exports = new StreakManager();
