import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api';
import PhoneActivityService from '../../services/PhoneActivityService';

/**
 * Login async thunk
 */
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const deviceId = await PhoneActivityService.getDeviceId();
      const data = await api.login(email, password, deviceId);
      return data;
    } catch (error) {
      const errorMessage = error.message || error.data?.error || error.data?.message || 'Login failed. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Register async thunk
 */
export const register = createAsyncThunk(
  'auth/register',
  async ({ email, password, timezone }, { rejectWithValue }) => {
    try {
      const deviceId = await PhoneActivityService.getDeviceId();
      const data = await api.register({ email, password, timezone, deviceId });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Update username async thunk
 */
export const updateUsername = createAsyncThunk(
  'auth/updateUsername',
  async (username, { rejectWithValue }) => {
    try {
      const data = await api.updateUsername(username);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Auth Slice
 * Manages authentication state
 */
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      AsyncStorage.removeItem('auth_token');
      AsyncStorage.removeItem('user_data');
    },
    restoreSession: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = !!token;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        const user = payload.user || payload.data?.user;
        const token = payload.token || payload.data?.token;
        
        if (user && token) {
          state.user = user;
          state.token = token;
          state.isAuthenticated = true;
          AsyncStorage.setItem('auth_token', token);
          AsyncStorage.setItem('user_data', JSON.stringify(user));
        } else {
          state.error = 'Invalid response from server';
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || action.payload.data?.user;
        state.token = action.payload.token || action.payload.data?.token;
        state.isAuthenticated = true;
        const token = action.payload.token || action.payload.data?.token;
        const user = action.payload.user || action.payload.data?.user;
        if (token) AsyncStorage.setItem('auth_token', token);
        if (user) AsyncStorage.setItem('user_data', JSON.stringify(user));
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUsername.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUsername.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload.user || action.payload.data?.user;
        if (updatedUser) {
          state.user = { ...state.user, ...updatedUser };
          // Update AsyncStorage
          AsyncStorage.setItem('user_data', JSON.stringify(state.user));
        }
      })
      .addCase(updateUsername.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, restoreSession, clearError } = authSlice.actions;
export default authSlice.reducer;
