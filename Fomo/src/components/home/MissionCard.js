import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import {
  usePulsingBorder,
  useBlinkingIcon,
  useCountdownScale,
  useShakeAnimation,
} from '../../animations/fomoTriggers';

export default function MissionCard({ mission, onPress, onCompletePress }) {
  const {
    title,
    description,
    difficulty,
    base_reward,
    time_remaining_hours,
    time_remaining_ms,
    is_expired,
    has_attempted,
    is_active,
    is_locked,
    status,
  } = mission;

  const timeLeft = time_remaining_ms || (time_remaining_hours || 0) * 60 * 60 * 1000;
  const hoursLeft = time_remaining_hours || 0;
  const isCompleted = status === 'completed' || has_attempted;
  const isInProgress = status === 'in_progress' || is_active;
  const isNotStarted = status === 'not_started' && !is_active && !is_locked;
  const isLocked = status === 'locked' || is_locked;

  // Determine urgency level for FOMO triggers
  const urgencyLevel = useMemo(() => {
    if (is_expired || isCompleted) return 'normal';
    const minutesLeft = timeLeft / (1000 * 60);
    if (minutesLeft < 30) return 'critical';
    if (minutesLeft < 120) return 'warning'; // <2 hours
    return 'normal';
  }, [timeLeft, is_expired, isCompleted]);

  // FOMO Animations
  const pulsingBorder = usePulsingBorder(urgencyLevel !== 'normal' && !isCompleted);
  const blinkingIcon = useBlinkingIcon(urgencyLevel === 'critical');
  const countdownScale = useCountdownScale(timeLeft);
  const shakeAnimation = useShakeAnimation(urgencyLevel === 'critical' && !isCompleted);

  const getCardStyle = () => {
    if (isCompleted) return styles.cardCompleted;
    if (urgencyLevel === 'critical') return styles.cardCritical;
    if (urgencyLevel === 'warning') return styles.cardWarning;
    if (isLocked) return styles.cardLocked;
    return styles.cardNormal;
  };

  const getTextColor = () => {
    if (urgencyLevel === 'critical') return Colors.CRITICAL_RED;
    if (urgencyLevel === 'warning') return Colors.AMBER;
    return Colors.TEXT_PRIMARY;
  };

  const getStatusIcon = () => {
    if (isCompleted) return '✓';
    if (urgencyLevel === 'critical') return '⚠️';
    if (urgencyLevel === 'warning') return '⏱️';
    if (isInProgress) return '⏳';
    if (isNotStarted) return '→';
    if (isLocked) return '❌';
    return '→';
  };

  const getStatusText = () => {
    if (isCompleted) return '✓ COMPLETED';
    if (urgencyLevel === 'critical') return '⚠️ CRITICAL';
    if (urgencyLevel === 'warning') return '⏰ HURRY';
    if (isInProgress) return '⏳ IN PROGRESS';
    if (isNotStarted) return '⏸️ NOT STARTED';
    if (isLocked) return '❌ LOCKED';
    return '⏸️ NOT STARTED';
  };

  const getStatusColor = () => {
    if (status === 'completed' || has_attempted) return Colors.SUCCESS_GREEN;
    if (status === 'in_progress') return Colors.SHARP_BLUE;
    if (status === 'not_started') return Colors.MEDIUM_GRAY;
    if (status === 'locked') return Colors.MEDIUM_GRAY;
    return Colors.MEDIUM_GRAY;
  };

  const formatTimeRemaining = () => {
    if (is_expired) return 'Expired';
    const totalSeconds = Math.floor(timeLeft / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    }
    return `${minutes}m left`;
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'EASY':
        return Colors.SUCCESS_GREEN;
      case 'MEDIUM':
        return Colors.GOLD;
      case 'HARD':
        return Colors.WARNING_RED;
      default:
        return Colors.MEDIUM_GRAY;
    }
  };

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      layout={Layout.springify()}
      style={[styles.container, shakeAnimation]}
    >
      <Animated.View
        style={[
          styles.card,
          getCardStyle(),
          urgencyLevel !== 'normal' && !isCompleted && pulsingBorder,
        ]}
      >
        <TouchableOpacity onPress={onPress} activeOpacity={0.7} disabled={is_expired}>
          <View style={styles.header}>
            <View style={styles.statusBadge}>
              <Animated.Text
                style={[
                  styles.statusIcon,
                  { color: getStatusColor() },
                  urgencyLevel === 'critical' && blinkingIcon,
                ]}
              >
                {getStatusIcon()}
              </Animated.Text>
            </View>
            <View style={styles.titleContainer}>
              <Text style={[styles.statusLabel, { color: getTextColor() }]}>
                {getStatusText()}
              </Text>
              <Text style={styles.title}>{title}</Text>
            </View>
          </View>

          <View style={styles.body}>
            <View style={styles.rewardRow}>
              <Text style={styles.rewardAmount}>+{base_reward} Coins</Text>
              {!isCompleted && (
                <Text style={[styles.multiplier, { color: getTextColor() }]}>
                  (2.0x)
                </Text>
              )}
              {isCompleted && (
                <Text style={styles.verified}>📍 Verified</Text>
              )}
            </View>

            {/* Countdown Timer with FOMO scale */}
            {!isCompleted && !is_expired && (
              <Animated.View style={[countdownScale]}>
                <Text style={[styles.countdown, { color: getTextColor() }]}>
                  {formatTimeRemaining()}
                </Text>
              </Animated.View>
            )}

            {is_expired && (
              <Text style={styles.expired}>MISSION EXPIRED</Text>
            )}
          </View>

          {/* Footer: CTA Button */}
          {!isCompleted && !is_expired && (
            <View style={styles.footer}>
              <TouchableOpacity
                style={[
                  styles.ctaButton,
                  urgencyLevel === 'critical' && styles.ctaButtonCritical,
                  urgencyLevel === 'warning' && styles.ctaButtonWarning,
                  isLocked && styles.ctaButtonLocked,
                ]}
                onPress={onCompletePress || onPress}
                activeOpacity={0.8}
                disabled={isLocked}
              >
                <Text style={styles.ctaText}>
                  {urgencyLevel === 'critical' ? 'COMPLETE NOW!' : isInProgress ? 'COMPLETE' : isLocked ? 'LOCKED' : 'START'}
                </Text>
                {!isLocked && <Text style={styles.ctaArrow}>→</Text>}
              </TouchableOpacity>
            </View>
          )}

          {isLocked && (
            <View style={styles.lockedMessage}>
              <Text style={styles.lockedMessageText}>Complete 3 first →</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
  },
  card: {
    borderRadius: 12,
    padding: Spacing.md,
    backgroundColor: Colors.BACKGROUND,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardNormal: {
    borderLeftWidth: 4,
    borderLeftColor: '#E0E0E0',
  },
  cardWarning: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.AMBER,
    backgroundColor: '#FFF3E0',
  },
  cardCritical: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.CRITICAL_RED,
    backgroundColor: '#FFEBEE',
  },
  cardCompleted: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.SUCCESS_GREEN,
    backgroundColor: '#F0FDF4',
    opacity: 0.95,
  },
  cardLocked: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.MEDIUM_GRAY,
    opacity: 0.6,
    backgroundColor: Colors.BACKGROUND_LIGHT,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  statusBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.BACKGROUND_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  statusIcon: {
    fontSize: 20,
  },
  titleContainer: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontFamily: 'Poppins-SemiBold',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    fontFamily: 'Roboto-Medium',
  },
  body: {
    marginBottom: Spacing.md,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  rewardAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.SUCCESS_GREEN,
    fontFamily: 'Roboto-Bold',
  },
  multiplier: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  verified: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.SUCCESS_GREEN,
    fontFamily: 'Roboto-Medium',
  },
  countdown: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: Spacing.xs,
    fontFamily: 'Roboto-Bold',
  },
  expired: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.MEDIUM_GRAY,
    marginTop: Spacing.xs,
    fontFamily: 'Roboto-Medium',
  },
  footer: {
    marginTop: Spacing.sm,
  },
  ctaButton: {
    flexDirection: 'row',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.SHARP_BLUE,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaButtonWarning: {
    backgroundColor: Colors.AMBER,
  },
  ctaButtonCritical: {
    backgroundColor: Colors.CRITICAL_RED,
  },
  ctaButtonLocked: {
    backgroundColor: Colors.MEDIUM_GRAY,
    opacity: 0.5,
  },
  ctaText: {
    color: Colors.BACKGROUND,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Poppins-SemiBold',
  },
  ctaArrow: {
    color: Colors.BACKGROUND,
    fontSize: 14,
    marginLeft: Spacing.xs,
  },
  lockedMessage: {
    marginTop: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: Colors.BACKGROUND_LIGHT,
    borderRadius: 8,
  },
  lockedMessageText: {
    fontSize: 12,
    color: Colors.MEDIUM_GRAY,
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
  },
});
