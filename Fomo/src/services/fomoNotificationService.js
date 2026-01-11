/**
 * FOMO Notification Service
 * Handles push notifications and in-app toasts for mission urgency
 */

/**
 * Schedule notification for T-6 hours before expiry
 */
export const scheduleReminder6Hours = (mission) => {
  // This would integrate with react-native-push-notification
  // For now, return the notification config
  const fireDate = new Date(mission.expires_at - 6 * 60 * 60 * 1000);
  
  return {
    id: `${mission.mission_id}_6h`,
    title: '📱 Time to Earn!',
    message: `6 hours left to complete "${mission.title}" and earn ${mission.base_reward} coins`,
    date: fireDate,
    soundName: 'default',
    priority: 'high',
    channelId: 'mission_reminders',
    data: {
      missionId: mission.mission_id,
      type: 'REMINDER_6H',
    },
  };
};

/**
 * Schedule critical notification for T-2 hours before expiry
 */
export const scheduleWarning2Hours = (mission) => {
  const fireDate = new Date(mission.expires_at - 2 * 60 * 60 * 1000);
  
  return {
    id: `${mission.mission_id}_2h`,
    title: '⏰ Hurry! Only 2 Hours!',
    message: `Complete "${mission.title}" before it expires. +${mission.base_reward} coins waiting!`,
    date: fireDate,
    soundName: 'default',
    priority: 'high',
    channelId: 'mission_reminders',
    vibrate: [0, 250, 250, 250],
    data: {
      missionId: mission.mission_id,
      type: 'WARNING_2H',
    },
  };
};

/**
 * Schedule critical notification for T-30 minutes before expiry
 */
export const scheduleEmergency30Min = (mission) => {
  const fireDate = new Date(mission.expires_at - 30 * 60 * 1000);
  
  return {
    id: `${mission.mission_id}_30m`,
    title: '🚨 LAST CHANCE!',
    message: `Only 30 minutes left! Complete "${mission.title}" now for ${mission.base_reward} coins`,
    date: fireDate,
    soundName: 'alarm',
    priority: 'max',
    channelId: 'mission_urgent',
    vibrate: [0, 500, 100, 500],
    data: {
      missionId: mission.mission_id,
      type: 'EMERGENCY_30M',
    },
  };
};

/**
 * Celebration notification for streak milestones
 */
export const scheduleStreakCelebration = (days) => {
  return {
    title: `🎉 ${days}-Day Streak!`,
    message: `Amazing! Your rewards are now ${getMultiplier(days)}x!`,
    soundName: 'success',
    priority: 'high',
    channelId: 'celebrations',
    data: {
      type: 'STREAK_MILESTONE',
      days,
    },
  };
};

/**
 * Bonus notification for completing all missions
 */
export const scheduleAllMissionsBonusNotification = () => {
  return {
    title: '🏆 Perfect Day!',
    message: '+50 bonus coins! You completed all missions today!',
    soundName: 'celebration',
    priority: 'high',
    channelId: 'bonuses',
    vibrate: [0, 100, 100, 100, 100, 100],
    data: {
      type: 'DAILY_BONUS',
    },
  };
};

// Helper function
const getMultiplier = (days) => {
  if (days >= 30) return '2.5x';
  if (days >= 14) return '2.0x';
  if (days >= 7) return '1.5x';
  return '1.0x';
};
