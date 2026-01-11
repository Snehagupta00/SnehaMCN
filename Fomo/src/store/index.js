import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import missionReducer from './slices/missionSlice';
import rewardReducer from './slices/rewardSlice';
import streakReducer from './slices/streakSlice';
import uiReducer from './slices/uiSlice';

/**
 * Redux Store Configuration
 * Centralized state management for the application
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    missions: missionReducer,
    rewards: rewardReducer,
    streaks: streakReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['missions/setMissions', 'ui/setSelectedMission'],
      },
    }),
});
