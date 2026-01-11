import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

/**
 * Fetch wallet balance
 */
export const fetchWallet = createAsyncThunk(
  'rewards/fetchWallet',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.fetchWallet();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Fetch transaction history
 */
export const fetchTransactionHistory = createAsyncThunk(
  'rewards/fetchHistory',
  async (_, { rejectWithValue }) => {
    try {
      const transactions = await api.fetchTransactionHistory();
      return transactions;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Reward Slice
 * Manages wallet and rewards state
 */
const rewardSlice = createSlice({
  name: 'rewards',
  initialState: {
    wallet: {
      balance: 0,
      total_balance: 0,
      lastUpdated: null,
    },
    recentRewards: [],
    availableVouchers: [],
    redeemedItems: [],
    loading: false,
    error: null,
  },
  reducers: {
    updateBalance: (state, action) => {
      state.wallet.balance = action.payload;
      state.wallet.lastUpdated = new Date().toISOString();
    },
    addReward: (state, action) => {
      state.recentRewards.unshift(action.payload);
      state.wallet.balance += action.payload.amount;
    },
    addFakeMoney: (state, action) => {
      const amount = action.payload;
      state.wallet.balance += amount;
      state.recentRewards.unshift({
        id: Date.now().toString(),
        amount: amount,
        type: 'DEPOSIT',
        description: 'Demo Money Added',
        timestamp: new Date().toISOString(),
        mission_title: 'Demo Deposit',
        multiplier: 1.0,
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallet.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.loading = false;
        const totalBalance = action.payload.total_balance || action.payload.balance || 0;
        state.wallet.balance = totalBalance;
        state.wallet.total_balance = totalBalance;
        state.wallet.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTransactionHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactionHistory.fulfilled, (state, action) => {
        state.loading = false;
        // Transform rewards to transaction format
        const transactions = Array.isArray(action.payload) ? action.payload.map((reward) => ({
          id: reward.reward_id,
          amount: reward.amount,
          type: reward.source === 'MISSION_COMPLETION' || reward.source === 'ALL_MISSIONS_BONUS' ? 'earned' : 'redeemed',
          description: reward.reason || 'Mission Reward',
          timestamp: reward.created_at || Date.now(),
          mission_title: reward.reason || 'Mission completed',
          multiplier: 1.0,
        })) : [];
        state.recentRewards = transactions;
      })
      .addCase(fetchTransactionHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateBalance, addReward, addFakeMoney } = rewardSlice.actions;
export default rewardSlice.reducer;
