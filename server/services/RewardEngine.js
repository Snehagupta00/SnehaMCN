const { v4: uuidv4 } = require('uuid');
const Wallet = require('../models/Wallet');
const Reward = require('../models/Reward');
const Mission = require('../models/Mission');
const MissionAttempt = require('../models/MissionAttempt');
const MissionEngine = require('./MissionEngine');
const StreakManager = require('./StreakManager');

class RewardEngine {
  async calculateReward(userId, missionId, attemptId) {
    try {
      const mission = await Mission.findOne({ mission_id: missionId });
      if (!mission) {
        throw new Error('Mission not found');
      }

      const baseCoins = mission.base_reward;

      const streak = await StreakManager.getStreak(userId);
      const streakCount = streak.current_streak_count;

      let multiplier = 1.0;
      if (streakCount >= 30) {
        multiplier = 2.5;
      } else if (streakCount >= 14) {
        multiplier = 2.0;
      } else if (streakCount >= 7) {
        multiplier = 1.5;
      }

      const earnedCoins = Math.floor(baseCoins * multiplier);

      const allMissionsCompleted = await MissionEngine.areAllMissionsCompleted(userId);
      const bonusCoins = allMissionsCompleted ? parseInt(process.env.BONUS_COINS_ALL_MISSIONS || 50) : 0;

      const totalCoins = earnedCoins + bonusCoins;

      return {
        earned_coins: earnedCoins,
        bonus_coins: bonusCoins,
        total_coins: totalCoins,
        multiplier: multiplier,
        streak_after: streakCount + 1,
        base_reward: baseCoins,
      };
    } catch (error) {
      console.error('Error calculating reward:', error);
      throw error;
    }
  }

  async creditReward(userId, attemptId, rewardCalculation) {
    const session = await Wallet.db.startSession();
    session.startTransaction();

    try {
      let wallet = await Wallet.findOne({ user_id: userId }).session(session);
      if (!wallet) {
        wallet = new Wallet({
          wallet_id: uuidv4(),
          user_id: userId,
          total_balance: 0,
        });
      }

      wallet.total_balance += rewardCalculation.total_coins;
      wallet.updated_at = new Date();
      wallet.transaction_history.push(rewardCalculation.reward_id || uuidv4());
      await wallet.save({ session });

      const reward = new Reward({
        reward_id: uuidv4(),
        user_id: userId,
        attempt_id: attemptId,
        amount: rewardCalculation.total_coins,
        type: 'COINS',
        source: rewardCalculation.bonus_coins > 0 ? 'ALL_MISSIONS_BONUS' : 'MISSION_COMPLETION',
        is_credited: true,
        reason: `Mission completion: ${rewardCalculation.earned_coins} coins (${rewardCalculation.multiplier}x multiplier)${rewardCalculation.bonus_coins > 0 ? ` + ${rewardCalculation.bonus_coins} bonus` : ''}`,
      });
      await reward.save({ session });

      await session.commitTransaction();

      return {
        wallet: {
          wallet_id: wallet.wallet_id,
          total_balance: wallet.total_balance,
          updated_at: wallet.updated_at,
        },
        reward: {
          reward_id: reward.reward_id,
          amount: reward.amount,
          type: reward.type,
          source: reward.source,
        },
      };
    } catch (error) {
      await session.abortTransaction();
      console.error('Error crediting reward:', error);
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getWallet(userId) {
    try {
      let wallet = await Wallet.findOne({ user_id: userId });
      if (!wallet) {
        wallet = new Wallet({
          wallet_id: uuidv4(),
          user_id: userId,
          total_balance: 0,
        });
        await wallet.save();
      }

      return {
        wallet_id: wallet.wallet_id,
        user_id: wallet.user_id,
        total_balance: wallet.total_balance,
        currency: wallet.currency,
        updated_at: wallet.updated_at,
      };
    } catch (error) {
      console.error('Error fetching wallet:', error);
      throw error;
    }
  }

  async getRewardHistory(userId, limit = 50) {
    try {
      const rewards = await Reward.find({ user_id: userId })
        .sort({ created_at: -1 })
        .limit(limit);

      return rewards.map((reward) => ({
        reward_id: reward.reward_id,
        amount: reward.amount,
        type: reward.type,
        source: reward.source,
        reason: reward.reason,
        created_at: reward.created_at,
      }));
    } catch (error) {
      console.error('Error fetching reward history:', error);
      return [];
    }
  }
}

module.exports = new RewardEngine();
