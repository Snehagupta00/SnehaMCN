import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStreak, fetchLeaderboard } from '../../store/slices/streakSlice';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import Card from '../../components/ui/Card';

/**
 * Streak Dashboard Screen
 * Displays streak, badges, leaderboards, and habit insights
 */
export default function StreakDashboardScreen({ navigation }) {
  const dispatch = useDispatch();
  const { current = 0, max = 0, multiplier = 1.0, badges = [], leaderboard = [] } = useSelector((state) => state.streaks);

  useEffect(() => {
    dispatch(fetchStreak());
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  const nextMilestone = current < 7 ? 7 : current < 14 ? 14 : current < 30 ? 30 : 60;
  const progressToNext = nextMilestone > 0 ? (current / nextMilestone) * 100 : 0;

  const earnedBadges = badges || [];
  // Map backend badge names to frontend badge IDs
  const badgeMap = {
    'WEEK_WARRIOR': 'week_warrior',
    'FORTNIGHT_FIGHTER': 'fortnight_fighter',
    'MONTHLY_MASTER': 'monthly_master',
  };
  const normalizedBadges = earnedBadges.map(badge => badgeMap[badge] || badge.toLowerCase());
  
  // Updated badge list as per requirements
  const allBadges = [
    { id: 'week_warrior', emoji: '🥇', name: 'Week Warrior', earned: normalizedBadges.includes('week_warrior') },
    { id: 'loyal_player', emoji: '🌟', name: 'Loyal Player', earned: normalizedBadges.includes('loyal_player') },
    { id: 'rising_star', emoji: '🎖️', name: 'Rising Star', earned: normalizedBadges.includes('rising_star') },
    { id: 'super_saver', emoji: '💰', name: 'Super Saver', earned: normalizedBadges.includes('super_saver') },
    { id: 'habit_master', emoji: '🧘', name: 'Habit Master', earned: normalizedBadges.includes('habit_master') },
    { id: 'streak_king', emoji: '👑', name: 'Streak King', earned: normalizedBadges.includes('streak_king') },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Streaks & Badges</Text>
        <TouchableOpacity>
          <Ionicons name="filter" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.streakCard}>
        <Text style={styles.title}>YOUR CURRENT STREAK</Text>
        <LinearGradient
          colors={[Colors.STREAK_START, Colors.STREAK_END]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.streakGradientContainer}
        >
          <Text style={styles.streakTextWhite}>🔥 {current} DAYS</Text>
        </LinearGradient>
        
        <View style={styles.statsRow}>
          <Text style={styles.info}>Multiplier: <Text style={{fontWeight: '700', color: Colors.SHARP_BLUE}}>{multiplier}x</Text></Text>
          <Text style={styles.info}>Record: <Text style={{fontWeight: '700'}}>{max} Days</Text></Text>
        </View>

        <View style={styles.milestoneContainer}>
          <Text style={styles.milestoneText}>Next Milestone: Day {nextMilestone}</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressToNext}%`, backgroundColor: Colors.STREAK_START }]} />
            </View>
            <Text style={styles.progressText}>{Math.round(progressToNext)}%</Text>
          </View>
        </View>
      </Card>

      <Card style={styles.badgesCard}>
        <Text style={styles.sectionTitle}>EARNED BADGES:</Text>
        <View style={styles.badgeGrid}>
          {allBadges.slice(0, 3).map((badge) => (
            <View key={badge.id} style={styles.badgeItem}>
              <Text style={styles.badgeEmoji}>{badge.emoji}</Text>
              <Text style={styles.badgeName}>{badge.name}</Text>
            </View>
          ))}
        </View>
        <View style={styles.badgeGrid}>
          {allBadges.slice(3, 6).map((badge) => (
            <View key={badge.id} style={styles.badgeItem}>
              <Text style={styles.badgeEmoji}>{badge.emoji}</Text>
              <Text style={styles.badgeName}>{badge.name}</Text>
              {!badge.earned && <Text style={styles.lockedText}>LOCKED</Text>}
            </View>
          ))}
        </View>
      </Card>

      <Card style={styles.leaderboardCard}>
        <Text style={styles.sectionTitle}>🏆 TOP STREAKS (This Month)</Text>
        {leaderboard.slice(0, 3).map((entry, index) => (
          <View key={entry.user_id || index} style={styles.leaderboardRow}>
            <Text style={styles.rank}>{index + 1}st:</Text>
            <Text style={styles.username}>@{entry.username || 'user_' + index}</Text>
            <Text style={styles.streakDays}>⭕ {entry.streak || 0} days</Text>
          </View>
        ))}
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => navigation.navigate('Leaderboard')}
        >
          <Text style={styles.viewAllText}>VIEW FULL LEADERBOARD →</Text>
        </TouchableOpacity>
      </Card>

      <Card style={styles.insightsCard}>
        <Text style={styles.sectionTitle}>HABIT INSIGHTS:</Text>
        <Text style={styles.insightText}>• Most completed: Steps (95%)</Text>
        <Text style={styles.insightText}>• Hardest mission: Productivity</Text>
        <Text style={styles.insightText}>• Best time to play: 8 AM</Text>
        <Text style={styles.insightText}>• Est. weekly earnings: 450 coins</Text>
      </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1E88E5',
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  streakCard: {
    marginTop: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  streakGradientContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    alignSelf: 'stretch',
  },
  streakTextWhite: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    color: '#666666',
  },
  milestoneContainer: {
    marginTop: 16,
  },
  milestoneText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    minWidth: 40,
  },
  badgesCard: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  badgeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  badgeItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  badgeEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#424242',
    textAlign: 'center',
  },
  lockedText: {
    fontSize: 10,
    color: '#BDBDBD',
    marginTop: 4,
    fontWeight: '600',
  },
  leaderboardCard: {
    marginTop: 8,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  rank: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginRight: 8,
    minWidth: 40,
  },
  username: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  streakDays: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E88E5',
  },
  viewAllButton: {
    marginTop: 8,
    padding: 12,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: '#1E88E5',
    fontWeight: '600',
  },
  insightsCard: {
    marginTop: 8,
    marginBottom: 16,
  },
  insightText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 20,
  },
});
