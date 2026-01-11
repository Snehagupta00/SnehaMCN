const { v4: uuidv4 } = require('uuid');
const Mission = require('../models/Mission');
const MissionAttempt = require('../models/MissionAttempt');

class MissionEngine {
  async getDailyMissions(userId) {
    try {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

      const missions = await Mission.find({
        created_at: { $gte: today, $lt: tomorrow },
        is_active: true,
      }).sort({ created_at: 1 });

      const now = new Date();
      const missionsWithTime = missions.map((mission) => {
        const expiresAt = new Date(mission.expires_at);
        const timeRemaining = Math.max(0, expiresAt - now);

        return {
          mission_id: mission.mission_id,
          title: mission.title,
          description: mission.description,
          difficulty: mission.difficulty,
          base_reward: mission.base_reward,
          requirement_type: mission.requirement_type,
          requirement_value: mission.requirement_value,
          proof_requirement: mission.proof_requirement,
          created_at: mission.created_at,
          expires_at: mission.expires_at,
          time_remaining_ms: timeRemaining,
          time_remaining_hours: Math.floor(timeRemaining / (1000 * 60 * 60)),
          is_expired: timeRemaining === 0,
          metadata: mission.metadata,
        };
      });

      return missionsWithTime;
    } catch (error) {
      console.error('Error fetching daily missions:', error);
      throw new Error('Failed to fetch daily missions');
    }
  }

  async isMissionExpired(missionId) {
    try {
      const mission = await Mission.findOne({ mission_id: missionId });
      if (!mission) {
        return true;
      }

      const now = new Date();
      const expiresAt = new Date(mission.expires_at);
      return now > expiresAt;
    } catch (error) {
      console.error('Error checking mission expiration:', error);
      return true;
    }
  }

  async hasUserAttemptedToday(userId, missionId) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const attempt = await MissionAttempt.findOne({
        user_id: userId,
        mission_id: missionId,
        submitted_at: { $gte: today, $lt: tomorrow },
      });

      return !!attempt;
    } catch (error) {
      console.error('Error checking user attempt:', error);
      return false;
    }
  }

  async createAttempt(userId, missionId, proof) {
    try {
      const isExpired = await this.isMissionExpired(missionId);
      if (isExpired) {
        throw new Error('Mission has expired');
      }

      const hasAttempted = await this.hasUserAttemptedToday(userId, missionId);
      if (hasAttempted) {
        throw new Error('Mission already attempted today');
      }

      const attempt = new MissionAttempt({
        attempt_id: uuidv4(),
        user_id: userId,
        mission_id: missionId,
        submitted_at: new Date(),
        proof: proof,
        verification_status: 'PENDING',
      });

      await attempt.save();
      return attempt;
    } catch (error) {
      console.error('Error creating mission attempt:', error);
      throw error;
    }
  }

  async getCompletedMissionsToday(userId) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const attempts = await MissionAttempt.find({
        user_id: userId,
        submitted_at: { $gte: today, $lt: tomorrow },
        verification_status: 'APPROVED',
      });

      return attempts.map((attempt) => attempt.mission_id);
    } catch (error) {
      console.error('Error fetching completed missions:', error);
      return [];
    }
  }

  async areAllMissionsCompleted(userId) {
    try {
      const missions = await this.getDailyMissions(userId);
      const completed = await this.getCompletedMissionsToday(userId);
      const completedSet = new Set(completed);

      return missions.length > 0 && missions.every((m) => completedSet.has(m.mission_id));
    } catch (error) {
      console.error('Error checking all missions completion:', error);
      return false;
    }
  }
}

module.exports = new MissionEngine();
