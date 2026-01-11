import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem('auth_token');
  } catch (error) {
    return null;
  }
};

const apiRequest = async (endpoint, options = {}) => {
  const token = await getAuthToken();
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const fetchOptions = {
      ...options,
      headers,
      signal: controller.signal,
    };

    const response = await fetch(url, fetchOptions);

    clearTimeout(timeoutId);

    let data;
    try {
      const text = await response.text();
      if (text) {
        data = JSON.parse(text);
      } else {
        data = {};
      }
    } catch (parseError) {
      data = { error: 'Invalid response from server' };
    }

    if (!response.ok) {
      if (response.status === 401 && token) {
        await AsyncStorage.multiRemove(['auth_token', 'user_data']);
      }
      const errorMessage = data.error || data.message || `HTTP ${response.status}: ${response.statusText}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return { data, response };
  } catch (error) {
    if (error.name === 'AbortError') {
      const baseUrl = API_BASE_URL.replace('/api/v1', '');
      throw new Error(`Request timeout. Server may be slow or not responding. Check if backend is running at ${baseUrl}`);
    }
    if (error.message?.includes('Network request failed') || error.message?.includes('fetch') || error.message?.includes('Failed to fetch')) {
      const baseUrl = API_BASE_URL.replace('/api/v1', '');
      const troubleshooting = `Cannot connect to server at ${baseUrl}.\n\nTroubleshooting:\n1. Verify server is running: Open ${baseUrl}/health in browser\n2. For iOS Simulator: Try using 127.0.0.1 instead of localhost\n3. Check if firewall/antivirus is blocking port 3000\n4. Try restarting the iOS simulator\n5. Check server logs for errors\n\nError: ${error.message || error.name || 'Network error'}`;
      throw new Error(troubleshooting);
    }
    if (error.message?.includes('Route not found') || error.data?.error === 'Route not found') {
      throw new Error(`API endpoint not found: ${url}. Check if the server is running and the route exists.`);
    }
    throw error;
  }
};

const api = {
  login: async (email, password, deviceId) => {
    try {
      const { data } = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, deviceId }),
      });
      if (!data || (!data.data && !data.user)) {
        throw new Error('Invalid response from server');
      }
      return data.data || data;
    } catch (error) {
      throw error;
    }
  },

  register: async (userData) => {
    const { data } = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return data.data || data;
  },

  updateUsername: async (username) => {
    const { data } = await apiRequest('/auth/username', {
      method: 'PUT',
      body: JSON.stringify({ username }),
    });
    return data.data || data;
  },

  fetchDailyMissions: async () => {
    const { data } = await apiRequest('/missions/daily');
    // Backend returns: { success: true, data: { missions: [...], count: ... } }
    if (data && data.data && data.data.missions) {
      return data.data.missions;
    }
    if (data && data.missions) {
      return data.missions;
    }
    if (Array.isArray(data)) {
      return data;
    }
    return [];
  },

  getMissionDetails: async (missionId) => {
    const { data } = await apiRequest(`/missions/${missionId}`);
    return data;
  },

  completeMission: async (missionId, proof) => {
    const { data } = await apiRequest(`/missions/${missionId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ proof }),
    });
    return data;
  },

  fetchWallet: async () => {
    const { data } = await apiRequest('/rewards/wallet');
    return data.data || data;
  },

  fetchTransactionHistory: async () => {
    const { data } = await apiRequest('/rewards/history');
    return data.rewards || data.transactions || [];
  },

  fetchStreak: async () => {
    const { data } = await apiRequest('/streaks/current');
    return data.data || data;
  },

  fetchLeaderboard: async () => {
    const { data } = await apiRequest('/streaks/leaderboard');
    return data.leaderboard || [];
  },

  syncPhoneActivity: async (activityData) => {
    const { data } = await apiRequest('/phone-activity/sync', {
      method: 'POST',
      body: JSON.stringify(activityData),
    });
    return data.data || data;
  },

  getPhoneActivity: async (date) => {
    const endpoint = date ? `/phone-activity/${date}` : '/phone-activity';
    const { data } = await apiRequest(endpoint);
    return data.data || data;
  },

  getPhoneActivityStats: async () => {
    const { data } = await apiRequest('/phone-activity/stats/summary');
    return data.data || data;
  },
};

export default api;
export { API_BASE_URL };
