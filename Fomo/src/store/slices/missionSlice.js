import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

/**
 * Fetch daily missions
 */
export const fetchDailyMissions = createAsyncThunk(
  'missions/fetchDaily',
  async (_, { rejectWithValue }) => {
    try {
      const missions = await api.fetchDailyMissions();
      if (!Array.isArray(missions)) {
        console.warn('Missions API returned non-array:', missions);
        return rejectWithValue('Invalid missions data format');
      }
      if (missions.length === 0) {
        console.log('No missions returned from API');
      } else {
        console.log(`Fetched ${missions.length} missions from API`);
      }
      return missions;
    } catch (error) {
      console.error('Error fetching missions:', error);
      return rejectWithValue(error.message || 'Failed to fetch missions');
    }
  }
);

/**
 * Complete mission
 */
export const completeMission = createAsyncThunk(
  'missions/complete',
  async ({ missionId, proof }, { rejectWithValue }) => {
    try {
      const data = await api.completeMission(missionId, proof);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Mission Slice
 * Manages mission state
 */
const missionSlice = createSlice({
  name: 'missions',
  initialState: {
    daily: [],
    userAttempts: {},
    completedToday: 0,
    loading: false,
    error: null,
  },
  reducers: {
    updateMissionTimeRemaining: (state, action) => {
      const { missionId, timeRemaining } = action.payload;
      const mission = state.daily.find((m) => m.mission_id === missionId);
      if (mission) {
        const newHours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const newExpired = timeRemaining === 0;
        // Only update if values actually changed to prevent unnecessary re-renders
        if (mission.time_remaining_hours !== newHours || mission.is_expired !== newExpired) {
          mission.time_remaining_ms = timeRemaining;
          mission.time_remaining_hours = newHours;
          mission.is_expired = newExpired;
        }
      }
    },
    markMissionCompleted: (state, action) => {
      const missionId = action.payload;
      const mission = state.daily.find((m) => m.mission_id === missionId);
      if (mission) {
        mission.has_attempted = true;
        state.completedToday += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDailyMissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDailyMissions.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const missions = Array.isArray(action.payload) ? action.payload : [];
        state.daily = missions;
        state.completedToday = missions.filter((m) => m.has_attempted).length;
      })
      .addCase(fetchDailyMissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(completeMission.fulfilled, (state, action) => {
        const { mission_id } = action.payload;
        state.userAttempts[mission_id] = action.payload;
        const mission = state.daily.find((m) => m.mission_id === mission_id);
        if (mission) {
          mission.has_attempted = true;
          state.completedToday += 1;
        }
      });
  },
});

export const { updateMissionTimeRemaining, markMissionCompleted } = missionSlice.actions;
export default missionSlice.reducer;
