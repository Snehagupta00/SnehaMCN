import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../ui/Card';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';

export default function StreakCard({ streak, multiplier, completedMissions, totalMissions }) {
  const displayStreak = typeof streak === 'number' ? streak : 0;
  const displayMultiplier = typeof multiplier === 'number' ? multiplier : 1.0;
  const displayCompleted = typeof completedMissions === 'number' ? completedMissions : 0;
  const displayTotal = typeof totalMissions === 'number' ? totalMissions : 0;
  const completionPercentage = displayTotal > 0 ? (displayCompleted / displayTotal) * 100 : 0;

  return (
    <View style={styles.container}>
      {/* Streak Card */}
      <Card style={styles.streakCard}>
        <Text style={styles.title}>YOUR CURRENT STREAK</Text>
        <LinearGradient
          colors={[Colors.STREAK_START, Colors.STREAK_END]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.streakGradient}
        >
          <View style={styles.streakContent}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={styles.streakNumber}>{displayStreak}</Text>
            <Text style={styles.streakLabel}>DAYS</Text>
          </View>
        </LinearGradient>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Multiplier</Text>
            <Text style={styles.statValue}>{displayMultiplier.toFixed(1)}x</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Missions Today</Text>
            <Text style={styles.statValue}>{displayCompleted}/{displayTotal}</Text>
          </View>
        </View>
      </Card>

      {/* Progress Card */}
      <Card style={styles.progressCard}>
        <Text style={styles.progressTitle}>Today&apos;s Progress</Text>
        
        <View style={styles.milestoneContainer}>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${completionPercentage}%` },
              ]}
            />
          </View>
          <Text style={styles.progressPercent}>{Math.round(completionPercentage)}%</Text>
        </View>

        <Text style={styles.progressText}>
          {displayCompleted === displayTotal && displayTotal > 0 
            ? '🎉 All missions completed!' 
            : `${displayCompleted} of ${displayTotal} missions completed`}
        </Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
    gap: 0,
    marginHorizontal: -Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  streakCard: {
    marginBottom: Spacing.sm,
    marginHorizontal: 0,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Poppins-SemiBold',
    color: Colors.TEXT_SECONDARY,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  streakGradient: {
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },
  streakContent: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  streakEmoji: {
    fontSize: 48,
    marginBottom: Spacing.xs,
  },
  streakNumber: {
    fontSize: 42,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: Colors.BACKGROUND,
    lineHeight: 42,
  },
  streakLabel: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Poppins-SemiBold',
    color: Colors.BACKGROUND,
    marginTop: Spacing.xs,
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.BACKGROUND_LIGHT,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.BACKGROUND_LIGHT,
    marginHorizontal: Spacing.sm,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Roboto-Regular',
    color: Colors.TEXT_SECONDARY,
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Roboto-Bold',
    color: Colors.TEXT_PRIMARY,
  },
  progressCard: {
    marginBottom: 0,
    marginHorizontal: 0,
  },
  progressTitle: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Poppins-SemiBold',
    color: Colors.TEXT_SECONDARY,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  milestoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.BACKGROUND_LIGHT,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.SHARP_BLUE,
    borderRadius: 4,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Roboto-Bold',
    color: Colors.SHARP_BLUE,
    minWidth: 40,
  },
  progressText: {
    fontSize: 13,
    fontFamily: 'Roboto-Regular',
    color: Colors.TEXT_SECONDARY,
    textAlign: 'center',
  },
});
