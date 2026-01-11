import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StreakDashboardScreen from '../../screens/streak/StreakDashboardScreen';
import LeaderboardScreen from '../../screens/streak/LeaderboardScreen';
import AchievementBadgesScreen from '../../screens/streak/AchievementBadgesScreen';
import StatisticsScreen from '../../screens/streak/StatisticsScreen';

const Stack = createNativeStackNavigator();

/**
 * Streak Stack Navigator
 * Contains streak and leaderboard-related screens
 */
export default function StreakStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'card',
      }}
    >
      <Stack.Screen
        name="StreakMain"
        component={StreakDashboardScreen}
      />
      <Stack.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
      />
      <Stack.Screen
        name="AchievementBadges"
        component={AchievementBadgesScreen}
      />
      <Stack.Screen
        name="Statistics"
        component={StatisticsScreen}
      />
    </Stack.Navigator>
  );
}
