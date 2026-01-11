const MissionEngine = require('../services/MissionEngine');
const ActivityVerification = require('../services/ActivityVerification');
const RewardEngine = require('../services/RewardEngine');
const StreakManager = require('../services/StreakManager');
const CloudinaryService = require('../services/CloudinaryService');
const Mission = require('../models/Mission');
const MissionAttempt = require('../models/MissionAttempt');

class MissionController {
  async getDailyMissions(req, res) {
    try {
      const userId = req.user.user_id;
      const missions = await MissionEngine.getDailyMissions(userId);
      
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

      const attempts = await MissionAttempt.find({
        user_id: userId,
        submitted_at: { $gte: today, $lt: tomorrow },
      });

      const attemptMap = new Map();
      attempts.forEach((attempt) => {
        attemptMap.set(attempt.mission_id, {
          verification_status: attempt.verification_status,
        });
      });

      const approvedCount = attempts.filter(a => a.verification_status === 'APPROVED').length;

      const missionsWithStatus = missions.map((mission) => {
        const attempt = attemptMap.get(mission.mission_id);
        const isApproved = attempt?.verification_status === 'APPROVED';
        const isPending = attempt?.verification_status === 'PENDING';
        
        let isLocked = false;
        if (mission.difficulty === 'HARD') {
          isLocked = approvedCount < 3;
        }
        
        return {
          ...mission,
          has_attempted: isApproved,
          is_active: isPending,
          is_locked: isLocked,
        };
      });

      res.json({
        success: true,
        data: {
          missions: missionsWithStatus,
          count: missionsWithStatus.length,
        },
      });
    } catch (error) {
      console.error('Error fetching daily missions:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch daily missions',
      });
    }
  }

  async completeMission(req, res) {
    try {
      const userId = req.user.user_id;
      const missionId = req.params.id;
      
      let proof = req.proof || req.body.proof;

      if (req.body.proof && req.body.proof.type === 'SCREENSHOT' && req.body.proof.base64) {
        try {
          const uploadResult = await CloudinaryService.uploadImageFromBase64(
            req.body.proof.base64,
            'mission-proofs',
            userId,
            missionId
          );
          proof = {
            type: 'SCREENSHOT',
            url: uploadResult.url,
            public_id: uploadResult.public_id,
            timestamp: new Date().toISOString(),
            metadata: {
              width: uploadResult.width,
              height: uploadResult.height,
              format: uploadResult.format,
              bytes: uploadResult.bytes,
            },
          };
        } catch (uploadError) {
          return res.status(400).json({
            success: false,
            error: 'Failed to upload image',
            details: uploadError.message,
          });
        }
      }

      if (!proof) {
        return res.status(400).json({
          success: false,
          error: 'Proof is required',
        });
      }

      const attempt = await MissionEngine.createAttempt(userId, missionId, proof);

      const mission = await Mission.findOne({ mission_id: missionId });
      if (!mission) {
        return res.status(404).json({
          success: false,
          error: 'Mission not found',
        });
      }

      const verification = await ActivityVerification.verifyProof(
        attempt.attempt_id,
        proof,
        mission.requirement_type,
        mission.requirement_value
      );

      if (!verification.is_valid) {
        return res.status(400).json({
          success: false,
          error: 'Mission verification failed',
          details: verification.notes,
        });
      }

      const rewardCalculation = await RewardEngine.calculateReward(
        userId,
        missionId,
        attempt.attempt_id
      );

      const creditResult = await RewardEngine.creditReward(
        userId,
        attempt.attempt_id,
        rewardCalculation
      );

      const streakUpdate = await StreakManager.incrementStreak(userId);

      const allCompleted = await MissionEngine.areAllMissionsCompleted(userId);

      res.json({
        success: true,
        data: {
          attempt_id: attempt.attempt_id,
          reward: {
            earned_coins: rewardCalculation.earned_coins,
            bonus_coins: rewardCalculation.bonus_coins,
            total_coins: rewardCalculation.total_coins,
            multiplier: rewardCalculation.multiplier,
          },
          wallet: creditResult.wallet,
          streak: {
            current_count: streakUpdate.current_streak_count,
            multiplier: streakUpdate.multiplier,
            badges_earned: streakUpdate.badges_earned,
          },
          all_missions_completed: allCompleted,
        },
      });
    } catch (error) {
      console.error('Error completing mission:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to complete mission',
      });
    }
  }

  async getMissionDetails(req, res) {
    try {
      const missionId = req.params.id;
      const mission = await Mission.findOne({ mission_id: missionId });

      if (!mission) {
        return res.status(404).json({
          success: false,
          error: 'Mission not found',
        });
      }

      const isExpired = await MissionEngine.isMissionExpired(missionId);
      const hasAttempted = await MissionEngine.hasUserAttemptedToday(
        req.user.user_id,
        missionId
      );

      res.json({
        success: true,
        data: {
          mission: {
            mission_id: mission.mission_id,
            title: mission.title,
            description: mission.description,
            difficulty: mission.difficulty,
            base_reward: mission.base_reward,
            requirement_type: mission.requirement_type,
            requirement_value: mission.requirement_value,
            proof_requirement: mission.proof_requirement,
            expires_at: mission.expires_at,
            is_expired: isExpired,
            has_attempted: hasAttempted,
            metadata: mission.metadata,
          },
        },
      });
    } catch (error) {
      console.error('Error fetching mission details:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch mission details',
      });
    }
  }
}

module.exports = new MissionController();
