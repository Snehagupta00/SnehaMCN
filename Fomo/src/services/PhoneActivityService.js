import * as Application from 'expo-application';
import * as Device from 'expo-device';
import { Platform, AppState, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';

/**
 * Phone Activity Service
 * Tracks app usage and phone activity data
 */
class PhoneActivityService {
  constructor() {
    this.isTracking = false;
    this.startTime = null;
    this.dailyUsage = {};
    this.appStateSubscription = null;
    this.logoutHandler = null;
  }

  setLogoutHandler(handler) {
    this.logoutHandler = handler;
  }

  /**
   * Get persistent Device ID
   */
  async getDeviceId() {
    try {
      let deviceId = await AsyncStorage.getItem('device_unique_id');
      if (!deviceId) {
        // Generate a random ID as simple fallback or use Expo utils
        deviceId = 'dev_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
        await AsyncStorage.setItem('device_unique_id', deviceId);
      }
      return deviceId;
    } catch (e) {
      return null;
    }
  }

  /**
   * Request usage stats permission (Android)
   * Note: iOS Screen Time API requires special entitlements and is very restricted
   */
  async requestPermissions() {
    if (Platform.OS === 'android') {
      // For Android, we need USAGE_STATS permission
      // This requires user to manually grant in Settings
      // Note: We can't programmatically check this permission without native module
      // So we'll always show the option to enable it
      try {
        // Check if user has previously granted (stored preference)
        const permissionPreference = await AsyncStorage.getItem('usage_stats_permission_granted_v2');
        
        if (permissionPreference === 'true') {
          // User says they granted it
          return {
            granted: true,
            message: 'Usage access permission enabled. Tracking phone activity.',
            needsManualGrant: false,
            canTrack: true,
          };
        }
        
        // Permission not granted - need to request
        return {
          granted: false,
          message: 'To track detailed phone activity, please enable "Usage Access" permission in Settings.',
          needsManualGrant: true,
          canTrack: true, // We can still track our own app's usage
        };
      } catch (error) {
        return {
          granted: false,
          error: error.message,
          needsManualGrant: true,
          canTrack: true, // Still can track our own app
        };
      }
    } else if (Platform.OS === 'ios') {
      // iOS Screen Time API is very restricted and requires special entitlements
      // We can track our own app usage, but full device usage requires Screen Time permission
      try {
        // Check if user has previously enabled Screen Time (stored preference)
        const screenTimeEnabled = await AsyncStorage.getItem('ios_screen_time_enabled_v2');
        
        if (screenTimeEnabled === 'true') {
          return {
            granted: true,
            message: 'Screen Time permission enabled. Tracking phone activity.',
            needsManualGrant: false,
            canTrack: true,
          };
        }
        
        // Screen Time not enabled - provide instructions
        return {
          granted: false,
          message: 'To track detailed phone activity, enable Screen Time in iOS Settings.',
          needsManualGrant: true,
          canTrack: true, // We can still track our own app's usage
          iosScreenTime: true,
        };
      } catch (error) {
        return {
          granted: false,
          error: error.message,
          needsManualGrant: true,
          canTrack: true,
          iosScreenTime: true,
        };
      }
    }
    return { 
      granted: false,
      needsManualGrant: false,
      canTrack: true, // Can track our own app usage
    };
  }

  /**
   * Start tracking app usage
   */
  startTracking() {
    if (this.isTracking) return;

    this.isTracking = true;
    this.startTime = Date.now();

    // Track app state changes
    this.appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      this.handleAppStateChange(nextAppState);
    });

    // Initialize today's usage
    this.initializeDailyUsage();

    // Start real-time sync (every 5 minutes)
    this.startRealtimeSync();
  }

  /**
   * Stop tracking
   */
  stopTracking() {
    if (!this.isTracking) return;

    this.isTracking = false;
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
  }

  /**
   * Handle app state changes
   */
  handleAppStateChange(nextAppState) {
    const now = Date.now();
    const today = this.getTodayKey();

    if (nextAppState === 'active') {
      // App came to foreground
      this.startTime = now;
      
      // Check if it's a new day (midnight check)
      this.checkMidnightSync();
      
      // Sync current data when app comes to foreground
      this.syncToBackend();
    } else if (nextAppState === 'background' || nextAppState === 'inactive') {
      // App went to background
      if (this.startTime) {
        const sessionDuration = Math.floor((now - this.startTime) / 1000); // seconds
        this.recordSession(today, sessionDuration);
        this.startTime = null;
        
        // Sync before going to background
        this.syncToBackend();
      }
    }
  }

  /**
   * Check if it's a new day and sync yesterday's data
   */
  async checkMidnightSync() {
    try {
      const today = this.getTodayKey();
      const lastSyncDate = await AsyncStorage.getItem('last_midnight_sync');
      
      if (lastSyncDate !== today) {
        // It's a new day, sync yesterday's data
        await this.syncYesterday();
        await AsyncStorage.setItem('last_midnight_sync', today);
      }
    } catch (error) {
    }
  }

  /**
   * Record a usage session
   */
  async recordSession(dateKey, durationSeconds) {
    try {
      const usage = await this.getDailyUsage(dateKey);
      usage.totalSeconds = (usage.totalSeconds || 0) + durationSeconds;
      usage.sessions = (usage.sessions || 0) + 1;
      usage.lastUpdated = new Date().toISOString();

      await AsyncStorage.setItem(`usage_${dateKey}`, JSON.stringify(usage));
      this.dailyUsage[dateKey] = usage;
    } catch (error) {
    }
  }

  /**
   * Initialize daily usage data
   */
  async initializeDailyUsage() {
    const today = this.getTodayKey();
    const usage = await this.getDailyUsage(today);
    this.dailyUsage[today] = usage;
  }

  /**
   * Get daily usage data
   */
  async getDailyUsage(dateKey) {
    try {
      const stored = await AsyncStorage.getItem(`usage_${dateKey}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
    }

    return {
      date: dateKey,
      totalSeconds: 0,
      sessions: 0,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Get today's usage
   */
  async getTodayUsage() {
    const today = this.getTodayKey();
    return await this.getDailyUsage(today);
  }

  /**
   * Get usage for date range
   */
  async getUsageRange(startDate, endDate) {
    const usageData = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateKey = this.formatDateKey(d);
      const usage = await this.getDailyUsage(dateKey);
      usageData.push(usage);
    }

    return usageData;
  }

  /**
   * Get current session duration
   */
  getCurrentSessionDuration() {
    if (!this.startTime) return 0;
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  /**
   * Get device information
   */
  async getDeviceInfo() {
    const deviceId = await this.getDeviceId();
    return {
      deviceId: deviceId,
      platform: Platform.OS,
      deviceName: Device.deviceName || 'Unknown',
      brand: Device.brand || 'Unknown',
      modelName: Device.modelName || 'Unknown',
      osVersion: Device.osVersion || 'Unknown',
      appVersion: Application.nativeApplicationVersion || '1.0.0',
      appBuild: Application.nativeBuildVersion || '1',
    };
  }

  /**
   * Get app usage statistics
   */
  async getUsageStats() {
    const today = await this.getTodayUsage();
    const weekData = await this.getUsageRange(
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      new Date()
    );

    const totalWeekSeconds = weekData.reduce((sum, day) => sum + (day.totalSeconds || 0), 0);
    const daysCount = weekData.length || 1;
    const avgDailySeconds = totalWeekSeconds / daysCount;

    return {
      today: {
        seconds: today.totalSeconds || 0,
        minutes: Math.floor((today.totalSeconds || 0) / 60),
        hours: Math.floor((today.totalSeconds || 0) / 3600),
        sessions: today.sessions || 0,
      },
      week: {
        totalSeconds: totalWeekSeconds,
        totalMinutes: Math.floor(totalWeekSeconds / 60),
        totalHours: Math.floor(totalWeekSeconds / 3600),
        avgDailySeconds: avgDailySeconds,
        avgDailyMinutes: Math.floor(avgDailySeconds / 60),
        avgDailyHours: Math.floor(avgDailySeconds / 3600),
      },
      currentSession: {
        seconds: this.getCurrentSessionDuration(),
        minutes: Math.floor(this.getCurrentSessionDuration() / 60),
      },
    };
  }

  /**
   * Format date as YYYY-MM-DD key
   */
  formatDateKey(date) {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  /**
   * Get today's date key
   */
  getTodayKey() {
    return this.formatDateKey(new Date());
  }

  /**
   * Clear all usage data
   */
  async clearAllData() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const usageKeys = keys.filter(key => key.startsWith('usage_'));
      await AsyncStorage.multiRemove(usageKeys);
      this.dailyUsage = {};
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Sync data to backend
   */
  async syncToBackend(dateKey = null) {
    try {
      const date = dateKey || this.getTodayKey();
      const usage = await this.getDailyUsage(date);
      const deviceInfo = await this.getDeviceInfo();

      // Check if we have auth token
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        return false;
      }

      // Sync to backend
      await api.syncPhoneActivity({
        date: date,
        totalSeconds: usage.totalSeconds || 0,
        sessions: usage.sessions || 0,
        deviceInfo: deviceInfo,
      });

      // Mark as synced
      this.lastSyncDate = date;
      await AsyncStorage.setItem(`last_sync_${date}`, new Date().toISOString());

      return true;
    } catch (error) {
      if (error.status === 409 && error.data?.code === 'SESSION_CONFLICT') {
        this.handleSessionConflict();
      }
      return false;
    }
  }

  handleSessionConflict() {
    Alert.alert(
      'Logged In Elsewhere',
      'You are logged in with the same account on another device. Please log out from this device.',
      [
        {
          text: 'Log Out',
          onPress: () => {
             if (this.logoutHandler) {
               this.logoutHandler();
             }
          }
        },
      ],
      { cancelable: false }
    );
  }

  /**
   * Start real-time sync interval
   */
  startRealtimeSync() {
    // Sync immediately
    this.syncToBackend();

    // Then sync every 5 minutes
    this.syncInterval = setInterval(() => {
      this.syncToBackend();
    }, 5 * 60 * 1000); // 5 minutes
  }

  /**
   * Sync yesterday's data (for midnight sync)
   */
  async syncYesterday() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateKey = this.formatDateKey(yesterday);
    return await this.syncToBackend(dateKey);
  }
}

export default new PhoneActivityService();
