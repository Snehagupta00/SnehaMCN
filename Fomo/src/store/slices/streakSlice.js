import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

/**
 * Fetch current streak
 */
export const fetchStreak = createAsyncThunk(
  'streaks/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.fetchStreak();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Fetch leaderboard
 */
export const fetchLeaderboard = createAsyncThunk(
  'streaks/fetchLeaderboard',
  async (_, { rejectWithValue }) => {
    try {
      const leaderboard = await api.fetchLeaderboard();
      return leaderboard;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Streak Slice
 * Manages streak and leaderboard state
 */
const streakSlice = createSlice({
  name: 'streaks',
  initialState: {
    current: 0,
    max: 0,
    multiplier: 1.0,
    badges: [],
    leaderboard: [],
    lastCompletionDate: null,
    loading: false,
    error: null,
  },
  reducers: {
    incrementStreak: (state) => {
      state.current += 1;
      if (state.current > state.max) {
        state.max = state.current;
      }
      state.lastCompletionDate = new Date().toISOString();
      // Update multiplier based on streak
      if (state.current >= 30) {
        state.multiplier = 2.5;
      } else if (state.current >= 14) {
        state.multiplier = 2.0;
      } else if (state.current >= 7) {
        state.multiplier = 1.5;
      } else {
        state.multiplier = 1.0;
      }
    },
    resetStreak: (state) => {
      state.current = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStreak.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStreak.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload.current_streak_count || 0;
        state.max = action.payload.max_streak_ever || 0;
        state.multiplier = action.payload.multiplier || 1.0;
        state.badges = action.payload.badges_earned || [];
        state.lastCompletionDate = action.payload.last_completion_date;
      })
      .addCase(fetchStreak.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.leaderboard = action.payload;
      });
  },
});

export const { incrementStreak, resetStreak } = streakSlice.actions;
export default streakSlice.reducer;
