import { createSlice } from '@reduxjs/toolkit';

/**
 * UI Slice
 * Manages UI state like modals, active tabs, and completion flow
 */
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    activeTab: 'home',
    selectedMissionModal: {
      visible: false,
      missionId: null,
    },
    completionFlow: {
      step: 1,
      loading: false,
      result: null, // 'success' | 'failure' | null
    },
    notifications: [],
    theme: 'light',
  },
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setSelectedMission: (state, action) => {
      state.selectedMissionModal = {
        visible: action.payload !== null,
        missionId: action.payload,
      };
    },
    closeMissionModal: (state) => {
      state.selectedMissionModal = {
        visible: false,
        missionId: null,
      };
    },
    setCompletionFlowStep: (state, action) => {
      state.completionFlow.step = action.payload;
    },
    setCompletionFlowLoading: (state, action) => {
      state.completionFlow.loading = action.payload;
    },
    setCompletionFlowResult: (state, action) => {
      state.completionFlow.result = action.payload;
    },
    resetCompletionFlow: (state) => {
      state.completionFlow = {
        step: 1,
        loading: false,
        result: null,
      };
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const {
  setActiveTab,
  setSelectedMission,
  closeMissionModal,
  setCompletionFlowStep,
  setCompletionFlowLoading,
  setCompletionFlowResult,
  resetCompletionFlow,
  addNotification,
  removeNotification,
  setTheme,
} = uiSlice.actions;
export default uiSlice.reducer;
