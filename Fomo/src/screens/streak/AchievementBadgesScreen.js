import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import Card from '../../components/ui/Card';

/**
 * Achievement Badges Screen
 * Displays all available badges and earned achievements
 */
export default function AchievementBadgesScreen({ navigation }) {
  const { badges: earnedBadges } = useSelector((state) => state.streaks);
  const { current: streakCount } = useSelector((state) => state.streaks);

  const allBadges = [
    {
      id: 'WEEK_WARRIOR',
      name: 'Week Warrior',
      description: 'Complete 7 days in a row',
      emoji: '🔥',
      requirement: 7,
      earned: earnedBadges?.includes('WEEK_WARRIOR') || streakCount >= 7,
    },
    {
      id: 'FORTNIGHT_FIGHTER',
      name: 'Fortnight Fighter',
      description: 'Complete 14 days in a row',
      emoji: '⚔️',
      requirement: 14,
      earned: earnedBadges?.includes('FORTNIGHT_FIGHTER') || streakCount >= 14,
    },
    {
      id: 'MONTHLY_MASTER',
      name: 'Monthly Master',
      description: 'Complete 30 days in a row',
      emoji: '👑',
      requirement: 30,
      earned: earnedBadges?.includes('MONTHLY_MASTER') || streakCount >= 30,
    },
    {
      id: 'FIRST_STEPS',
      name: 'First Steps',
      description: 'Complete your first mission',
      emoji: '👣',
      requirement: 1,
      earned: true,
    },
    {
      id: 'CENTURY_CLUB',
      name: 'Century Club',
      description: 'Complete 100 missions total',
      emoji: '💯',
      requirement: 100,
      earned: false,
    },
    {
      id: 'EARLY_BIRD',
      name: 'Early Bird',
      description: 'Complete a mission before 8 AM',
      emoji: '🌅',
      requirement: 1,
      earned: false,
    },
    {
      id: 'NIGHT_OWL',
      name: 'Night Owl',
      description: 'Complete a mission after 10 PM',
      emoji: '🦉',
      requirement: 1,
      earned: false,
    },
    {
      id: 'PERFECT_WEEK',
      name: 'Perfect Week',
      description: 'Complete all missions in a week',
      emoji: '⭐',
      requirement: 7,
      earned: false,
    },
  ];

  const renderBadge = ({ item }) => (
    <Card style={[
      styles.badgeCard,
      !item.earned && styles.badgeCardLocked
    ]}>
      <View style={styles.badgeContent}>
        <View style={[
          styles.badgeIcon,
          !item.earned && styles.badgeIconLocked
        ]}>
          <Text style={styles.badgeEmoji}>{item.earned ? item.emoji : '🔒'}</Text>
        </View>
        <View style={styles.badgeInfo}>
          <Text style={[
            styles.badgeName,
            !item.earned && styles.badgeNameLocked
          ]}>
            {item.name}
          </Text>
          <Text style={styles.badgeDescription}>{item.description}</Text>
          {!item.earned && (
            <Text style={styles.badgeRequirement}>
              Requirement: {item.requirement} {item.id.includes('STREAK') ? 'days' : 'missions'}
            </Text>
          )}
        </View>
        {item.earned && (
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
        )}
      </View>
    </Card>
  );

  const earnedCount = allBadges.filter(b => b.earned).length;

  return (
    <LinearGradient colors={['#1E88E5', '#00BCD4']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Achievement Badges</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsText}>
          {earnedCount} / {allBadges.length} Badges Earned
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(earnedCount / allBadges.length) * 100}%` }]} />
        </View>
      </View>

      <FlatList
        data={allBadges}
        renderItem={renderBadge}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 24,
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
  },
  statsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 32,
  },
  badgeCard: {
    marginBottom: 12,
    padding: 16,
  },
  badgeCardLocked: {
    opacity: 0.6,
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  badgeIconLocked: {
    backgroundColor: '#E0E0E0',
  },
  badgeEmoji: {
    fontSize: 32,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  badgeNameLocked: {
    color: '#999999',
  },
  badgeDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  badgeRequirement: {
    fontSize: 12,
    color: '#999999',
    fontStyle: 'italic',
  },
});
