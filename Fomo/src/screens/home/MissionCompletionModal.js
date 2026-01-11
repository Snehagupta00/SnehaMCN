import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Colors } from '../../constants/colors';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
import {
  setCompletionFlowStep,
  setCompletionFlowLoading,
  setCompletionFlowResult,
  resetCompletionFlow,
} from '../../store/slices/uiSlice';
import { completeMission } from '../../store/slices/missionSlice';
import { incrementStreak } from '../../store/slices/streakSlice';
import { addReward } from '../../store/slices/rewardSlice';

/**
 * Mission Completion Modal
 * 4-step flow: Permission Request → Loading → Success/Failure
 */
export default function MissionCompletionModal({ navigation, route }) {
  const { missionId } = route.params;
  const dispatch = useDispatch();
  const { step, loading, result } = useSelector((state) => state.ui.completionFlow);
  const missions = useSelector((state) => state.missions.daily);
  const { multiplier } = useSelector((state) => state.streaks);
  const mission = missions.find((m) => m.mission_id === missionId);

  useEffect(() => {
    // Reset flow when modal opens
    dispatch(resetCompletionFlow());
    return () => {
      dispatch(resetCompletionFlow());
    };
  }, []);

  const handleAllowAccess = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    dispatch(setCompletionFlowStep(2));
    dispatch(setCompletionFlowLoading(true));

    // Simulate verification
    setTimeout(() => {
      dispatch(setCompletionFlowLoading(false));
      // Simulate success (80% chance) or failure (20% chance)
      const isSuccess = Math.random() > 0.2;
      dispatch(setCompletionFlowResult(isSuccess ? 'success' : 'failure'));
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      dispatch(setCompletionFlowStep(isSuccess ? 3 : 4));

      if (isSuccess) {
        // Complete mission
        const proof = {
          type: 'AUTO_VERIFIED',
          timestamp: new Date().toISOString(),
        };
        dispatch(completeMission({ missionId, proof }));
        dispatch(incrementStreak());
        const rewardAmount = Math.floor(mission.base_reward * multiplier);
        dispatch(addReward({ amount: rewardAmount, mission_id: missionId }));
      }
    }, 3000);
  };

  const handleManualEntry = () => {
    // Navigate to manual entry screen
    navigation.navigate('ProofCapture', { missionId });
  };

  const handleContinue = () => {
    navigation.goBack();
    dispatch(resetCompletionFlow());
  };

  const handleTryAgain = () => {
    dispatch(resetCompletionFlow());
    dispatch(setCompletionFlowStep(1));
  };

  if (!mission) return null;

  const totalReward = Math.floor(mission.base_reward * multiplier);

  // Step 1: Permission Request
  if (step === 1) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>VERIFY YOUR COMPLETION</Text>
        </View>
        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          <Card style={styles.permissionCard}>
            <Ionicons name="link" size={48} color="#1E88E5" style={styles.icon} />
            <Text style={styles.permissionTitle}>Connect Google Fit</Text>
            <Text style={styles.permissionText}>
              We need permission to check your step count from Google Fit. Your privacy is
              protected.
            </Text>

            <Button
              title="ALLOW ACCESS"
              onPress={handleAllowAccess}
              variant="primary"
              style={styles.button}
            />
            <Button
              title="MANUAL ENTRY (for iOS)"
              onPress={handleManualEntry}
              variant="outline"
              style={styles.button}
            />
            <Button
              title="CANCEL"
              onPress={() => navigation.goBack()}
              variant="secondary"
              style={styles.button}
            />
          </Card>
        </ScrollView>
      </View>
    );
  }

  // Step 2: Loading Verification
  if (step === 2 && loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>⏳ VERIFYING...</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E88E5" />
          <Text style={styles.loadingText}>Checking your step count</Text>
          <Text style={styles.loadingSubtext}>Don't close the app</Text>
          <Text style={styles.loadingSubtext}>(Takes 5-10 seconds)</Text>
        </View>
      </View>
    );
  }

  // Step 3: Success
  if (step === 3 && result === 'success') {
    return (
      <LinearGradient colors={[Colors.GROW_START, Colors.GROW_END]} style={styles.container}>
        <View style={[styles.header, { backgroundColor: 'transparent', borderBottomWidth: 0 }]}>
          <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>🎉 MISSION COMPLETED!</Text>
        </View>
        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          <Card style={styles.successCard}>
            <View style={styles.successHeader}>
              <Ionicons name="checkmark-circle" size={64} color={Colors.SUCCESS_GREEN} />
              <Text style={styles.verifiedText}>Verified: 1,256 steps today</Text>
            </View>

            <View style={styles.rewardsSection}>
              <Text style={styles.rewardsTitle}>YOU EARNED:</Text>
              <View style={styles.rewardRow}>
                <Text style={styles.rewardText}>• 💰 {mission.base_reward} Coins (base)</Text>
              </View>
              <View style={styles.rewardRow}>
                <Text style={styles.rewardText}>
                  • 💰 {totalReward - mission.base_reward} Coins ({multiplier}x multiplier)
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.rewardRow}>
                <Text style={styles.totalRewardText}>• 💰 {totalReward} TOTAL</Text>
              </View>
            </View>

            <View style={styles.streakSection}>
              <Text style={styles.streakTitle}>YOUR STREAK:</Text>
              <Text style={styles.streakText}>🔥 7 Days → 8 Days (keep it up!)</Text>
            </View>

            <View style={styles.milestoneSection}>
              <Text style={styles.milestoneTitle}>NEXT MILESTONE:</Text>
              <Text style={styles.milestoneText}>📊 30-day streak unlocks 2.5x!</Text>
            </View>

            <Button title="CONTINUE" onPress={handleContinue} variant="primary" style={styles.button} />
          </Card>
        </ScrollView>
      </LinearGradient>
    );
  }

  // Step 4: Failure
  if (step === 4 && result === 'failure') {
    return (
      <LinearGradient colors={[Colors.CRITICAL_RED, Colors.WARNING_RED]} style={styles.container}>
        <View style={[styles.header, { backgroundColor: 'transparent', borderBottomWidth: 0 }]}>
          <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>❌ MISSION NOT COMPLETED</Text>
        </View>
        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          <Card style={styles.failureCard}>
            <Ionicons name="close-circle" size={64} color={Colors.WARNING_RED} style={styles.icon} />
            <Text style={styles.failureText}>
              We found only 856 steps today. You need 1,000 steps.
            </Text>

            <View style={styles.timeRemainingSection}>
              <Text style={styles.timeRemainingText}>
                ⏱️ You still have {Math.floor(mission.time_remaining_hours || 0)} hours{' '}
                {Math.floor(((mission.time_remaining_hours || 0) % 1) * 60)}m!
              </Text>
              <Text style={styles.encouragementText}>Keep walking & try again.</Text>
            </View>

            <Button
              title="TRY AGAIN LATER"
              onPress={handleTryAgain}
              variant="primary"
              style={styles.button}
            />
            <Button
              title="MANUAL ENTRY (contact support)"
              onPress={handleManualEntry}
              variant="outline"
              style={styles.button}
            />
          </Card>
        </ScrollView>
      </LinearGradient>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  permissionCard: {
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    marginBottom: 16,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  button: {
    width: '100%',
    marginBottom: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
    marginTop: 16,
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#999999',
    marginTop: 4,
  },
  successCard: {
    padding: 24,
  },
  successHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  verifiedText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
    marginTop: 12,
  },
  rewardsSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  rewardsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  rewardRow: {
    marginBottom: 8,
  },
  rewardText: {
    fontSize: 16,
    color: '#666666',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  totalRewardText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E88E5',
  },
  streakSection: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
  },
  streakTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 8,
  },
  streakText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  milestoneSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 8,
  },
  milestoneText: {
    fontSize: 16,
    color: '#1E88E5',
    fontWeight: '600',
  },
  failureCard: {
    alignItems: 'center',
    padding: 24,
  },
  failureText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  timeRemainingSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    alignItems: 'center',
  },
  timeRemainingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9800',
    marginBottom: 8,
    textAlign: 'center',
  },
  encouragementText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});