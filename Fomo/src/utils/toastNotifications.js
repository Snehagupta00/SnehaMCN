/**
 * Toast Notification Utilities
 * In-app toast notifications for FOMO triggers
 */

import Toast from 'react-native-toast-message';

export const showFOMOToasts = {
  /**
   * Warning: Mission expiring soon
   */
  expiringMission: (minutesLeft) => {
    Toast.show({
      type: 'warning',
      position: 'top',
      text1: `⏰ Only ${minutesLeft} minutes left!`,
      text2: 'Tap to complete your mission before it expires',
      duration: 4000,
      topOffset: 60,
      visibilityTime: 4000,
    });
  },

  /**
   * Critical: Mission expiring in <30 min
   */
  criticalExpiry: () => {
    Toast.show({
      type: 'error',
      position: 'top',
      text1: '🚨 LAST CHANCE!',
      text2: 'Your mission expires in less than 30 minutes',
      duration: 5000,
      topOffset: 60,
      visibilityTime: 5000,
    });
  },

  /**
   * Success: Streak milestone
   */
  streakMilestone: (days) => {
    Toast.show({
      type: 'success',
      position: 'top',
      text1: `🎉 ${days}-Day Streak!`,
      text2: `Your reward multiplier is now ${getMultiplier(days)}x!`,
      duration: 4000,
      visibilityTime: 4000,
    });
  },

  /**
   * Bonus: All missions completed
   */
  dailyBonus: () => {
    Toast.show({
      type: 'success',
      position: 'top',
      text1: '🏆 Perfect Day!',
      text2: '+50 bonus coins for completing all 5 missions!',
      duration: 4000,
      visibilityTime: 4000,
    });
  },

  /**
   * Warning: Streak about to break
   */
  streakAtRisk: () => {
    Toast.show({
      type: 'warning',
      position: 'top',
      text1: '⚠️ Streak in Danger!',
      text2: 'Complete a mission today to keep your streak alive',
      duration: 5000,
      visibilityTime: 5000,
    });
  },
};

// Helper function
const getMultiplier = (days) => {
  if (days >= 30) return '2.5x';
  if (days >= 14) return '2.0x';
  if (days >= 7) return '1.5x';
  return '1.0x';
};
