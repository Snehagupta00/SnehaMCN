import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';

/**
 * Mission Detail Modal
 * Displays detailed mission information with countdown, instructions, and verification steps
 */
export default function MissionDetailModal({ navigation, route }) {
  const { missionId } = route.params;
  const missions = useSelector((state) => state.missions.daily);
  const { multiplier } = useSelector((state) => state.streaks);
  const mission = missions.find((m) => m.mission_id === missionId);
  const [timeRemaining, setTimeRemaining] = useState(mission?.time_remaining_hours || 0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (mission?.expires_at && !mission.is_expired) {
        const now = new Date();
        const expiresAt = new Date(mission.expires_at);
        const remaining = Math.max(0, expiresAt - now);
        setTimeRemaining(Math.floor(remaining / (1000 * 60 * 60)));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [mission]);

  if (!mission) return null;

  const getDifficultyColor = () => {
    switch (mission.difficulty) {
      case 'EASY':
        return '#4CAF50';
      case 'MEDIUM':
        return '#FF9800';
      case 'HARD':
        return '#FF5252';
      default:
        return '#BDBDBD';
    }
  };

  const getDifficultyEmoji = () => {
    switch (mission.difficulty) {
      case 'EASY':
        return '🟢';
      case 'MEDIUM':
        return '🟡';
      case 'HARD':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const timeLeftMs = useMemo(() => {
    if (!mission?.expires_at) return 0;
    const now = new Date();
    const expiresAt = new Date(mission.expires_at);
    return Math.max(0, expiresAt - now);
  }, [mission, timeRemaining]);

  const formatTime = () => {
    const totalSeconds = Math.floor(timeLeftMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const progress = mission.expires_at
    ? Math.max(0, Math.min(100, (timeLeftMs / (24 * 60 * 60 * 1000)) * 100))
    : 0;

  const totalReward = Math.floor(mission.base_reward * multiplier);

  // Get dynamic instructions based on mission type
  const getInstructions = () => {
    switch (mission.requirement_type) {
      case 'STEPS':
        return [
          'Open your phone\'s step counter',
          'Go for a walk',
          `Accumulate ${mission.requirement_value?.toLocaleString() || '1,000'}+ steps today`,
        ];
      case 'PHONE_FREE':
        return [
          'Put your phone away',
          'Set a timer for the required duration',
          'Focus on the present moment',
        ];
      case 'EXPENSE_TRACK':
        return [
          'Open your expense tracking app',
          `Log at least ${mission.requirement_value} expenses`,
          'Categorize them properly',
        ];
      case 'QUIZ':
        return [
          'Answer financial literacy questions',
          `Complete ${mission.requirement_value} questions correctly`,
          'Learn while earning!',
        ];
      case 'PRODUCTIVITY':
        return [
          'Complete tasks from your to-do list',
          `Finish ${mission.requirement_value} important tasks`,
          'Track your progress',
        ];
      default:
        return [
          'Follow the mission requirements',
          'Complete the task',
          'Submit proof when done',
        ];
    }
  };

  const getVerificationMethod = () => {
    if (mission.proof_requirement === 'API_VERIFICATION') {
      return 'We\'ll auto-verify via Google Fit when you complete!';
    }
    return 'We\'ll verify your completion manually.';
  };

  const isUrgent = timeLeftMs < 2 * 60 * 60 * 1000; // <2 hours
  const isCritical = timeLeftMs < 30 * 60 * 1000; // <30 min

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.SHARP_BLUE, Colors.EARN_END]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={Colors.BACKGROUND} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mission Details</Text>
          <View style={{ width: 28 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.missionHeaderCard}>
          <Text style={styles.title}>{mission.title}</Text>

          <View style={styles.metaContainer}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Difficulty:</Text>
              <Text style={[styles.metaValue, { color: getDifficultyColor() }]}>
                {getDifficultyEmoji()} {mission.difficulty}
              </Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Reward:</Text>
              <Text style={styles.metaValue}>
                💰 {mission.base_reward} Coins ({multiplier}x) = {totalReward} Coins
              </Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Status:</Text>
              <Text style={[styles.metaValue, isUrgent && styles.urgentText]}>
                {isCritical ? '🚨' : isUrgent ? '⏰' : '🔴'} {formatTime()} LEFT
              </Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  progressAnimation,
                  {
                    backgroundColor: isCritical ? Colors.CRITICAL_RED : isUrgent ? Colors.AMBER : Colors.SUCCESS_GREEN,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressText, isUrgent && styles.urgentText]}>
              {formatTime()}
            </Text>
          </View>
        </Card>

        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>WHAT TO DO:</Text>
          {getInstructions().map((instruction, index) => (
            <Text key={index} style={styles.instructionText}>
              • {instruction}
            </Text>
          ))}
        </Card>

        <Card style={styles.sectionCard}>
          <View style={styles.verificationInfo}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.SUCCESS_GREEN} />
            <Text style={styles.verificationText}>
              {getVerificationMethod()}
            </Text>
          </View>
        </Card>

        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>WHY IT MATTERS:</Text>
          <Text style={styles.descriptionText}>
            Daily movement improves health & mental clarity. Build the habit of staying active! 🚶
          </Text>
        </Card>

        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>HOW VERIFICATION WORKS:</Text>
          <Text style={styles.stepText}>1. Complete your 1K steps</Text>
          <Text style={styles.stepText}>2. Tap "Complete Mission"</Text>
          <Text style={styles.stepText}>3. We'll verify from Google Fit</Text>
          <Text style={styles.stepText}>4. Coins credited instantly</Text>
          <Text style={styles.stepText}>5. Streak counts +1 day</Text>
        </Card>

        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>SHARE YOUR PROGRESS:</Text>
          <View style={styles.shareButtons}>
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name="camera" size={20} color="#1E88E5" />
              <Text style={styles.shareButtonText}>📸 Screenshot</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name="link" size={20} color="#1E88E5" />
              <Text style={styles.shareButtonText}>🔗 Link</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card style={styles.ctaCard}>
          <Button
            title="COMPLETE MISSION"
            onPress={() => navigation.navigate('MissionCompletion', { missionId })}
            variant="primary"
            style={styles.completeButton}
          />
          <Text style={styles.ctaSubtext}>(takes 30 seconds)</Text>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_LIGHT,
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.title,
    fontSize: 20,
    color: Colors.BACKGROUND,
    fontFamily: 'Poppins-Bold',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  missionHeaderCard: {
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.headline,
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.lg,
  },
  metaContainer: {
    marginBottom: Spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  metaLabel: {
    ...Typography.label,
    fontSize: 14,
    color: Colors.TEXT_SECONDARY,
    fontFamily: 'Roboto-Medium',
  },
  metaValue: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.TEXT_PRIMARY,
    fontFamily: 'Roboto-SemiBold',
    fontWeight: '600',
  },
  urgentText: {
    color: Colors.CRITICAL_RED,
    fontWeight: '700',
  },
  progressContainer: {
    marginTop: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 12,
    backgroundColor: Colors.BACKGROUND_LIGHT,
    borderRadius: 6,
    marginRight: Spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    ...Typography.label,
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: Colors.TEXT_PRIMARY,
    minWidth: 80,
  },
  sectionCard: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.subheading,
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  instructionText: {
    ...Typography.body,
    fontSize: 15,
    color: Colors.TEXT_BODY,
    marginBottom: Spacing.sm,
    lineHeight: 22,
    fontFamily: 'Roboto-Regular',
  },
  verificationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
  },
  verificationText: {
    ...Typography.body,
    fontSize: 15,
    color: Colors.SUCCESS_GREEN,
    marginLeft: Spacing.sm,
    fontFamily: 'Roboto-SemiBold',
    fontWeight: '600',
  },
  descriptionText: {
    ...Typography.body,
    fontSize: 15,
    color: Colors.TEXT_BODY,
    lineHeight: 22,
    fontFamily: 'Roboto-Regular',
  },
  stepText: {
    ...Typography.body,
    fontSize: 15,
    color: Colors.TEXT_BODY,
    marginBottom: Spacing.sm,
    lineHeight: 22,
    fontFamily: 'Roboto-Regular',
  },
  shareButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  shareButtonText: {
    fontSize: 14,
    color: '#1E88E5',
    marginLeft: 8,
    fontWeight: '600',
  },
  ctaCard: {
    marginBottom: 16,
    alignItems: 'center',
  },
  completeButton: {
    width: '100%',
    marginBottom: 8,
  },
  ctaSubtext: {
    fontSize: 12,
    color: '#999999',
    fontStyle: 'italic',
  },
});
