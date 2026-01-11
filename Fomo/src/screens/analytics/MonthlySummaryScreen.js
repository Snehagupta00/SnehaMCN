import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import Card from '../../components/ui/Card';

/**
 * Monthly Summary Screen
 * Monthly performance overview and statistics
 */
export default function MonthlySummaryScreen({ navigation }) {
  const { current: streakCount } = useSelector((state) => state.streaks);
  const { wallet } = useSelector((state) => state.rewards);
  const { daily: missions } = useSelector((state) => state.missions);

  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  const completedMissions = missions.filter(m => m.has_attempted).length;

  const monthlyStats = {
    missionsCompleted: completedMissions,
    coinsEarned: wallet.balance || 0,
    averageStreak: streakCount || 0,
    bestDay: 'Monday',
    totalTimeSpent: '12.5 hours',
  };

  return (
    <LinearGradient colors={['#1E88E5', '#00BCD4']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Monthly Summary</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.monthCard}>
          <Text style={styles.monthTitle}>{currentMonth}</Text>
          <Text style={styles.monthSubtitle}>Your monthly performance</Text>
        </Card>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statIcon}>✅</Text>
            <Text style={styles.statValue}>{monthlyStats.missionsCompleted}</Text>
            <Text style={styles.statLabel}>Missions Completed</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statIcon}>💰</Text>
            <Text style={styles.statValue}>{monthlyStats.coinsEarned.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Coins Earned</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statValue}>{monthlyStats.averageStreak}</Text>
            <Text style={styles.statLabel}>Avg Streak</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statIcon}>⏱️</Text>
            <Text style={styles.statValue}>{monthlyStats.totalTimeSpent}</Text>
            <Text style={styles.statLabel}>Time Spent</Text>
          </Card>
        </View>

        <Card style={styles.breakdownCard}>
          <Text style={styles.sectionTitle}>WEEKLY BREAKDOWN:</Text>
          <View style={styles.weekRow}>
            <Text style={styles.weekLabel}>Week 1:</Text>
            <View style={styles.weekBar}>
              <View style={[styles.weekBarFill, { width: '85%' }]} />
            </View>
            <Text style={styles.weekValue}>85%</Text>
          </View>
          <View style={styles.weekRow}>
            <Text style={styles.weekLabel}>Week 2:</Text>
            <View style={styles.weekBar}>
              <View style={[styles.weekBarFill, { width: '92%' }]} />
            </View>
            <Text style={styles.weekValue}>92%</Text>
          </View>
          <View style={styles.weekRow}>
            <Text style={styles.weekLabel}>Week 3:</Text>
            <View style={styles.weekBar}>
              <View style={[styles.weekBarFill, { width: '78%' }]} />
            </View>
            <Text style={styles.weekValue}>78%</Text>
          </View>
          <View style={styles.weekRow}>
            <Text style={styles.weekLabel}>Week 4:</Text>
            <View style={styles.weekBar}>
              <View style={[styles.weekBarFill, { width: '95%' }]} />
            </View>
            <Text style={styles.weekValue}>95%</Text>
          </View>
        </Card>

        <Card style={styles.achievementsCard}>
          <Text style={styles.sectionTitle}>MONTHLY ACHIEVEMENTS:</Text>
          <View style={styles.achievementItem}>
            <Text style={styles.achievementIcon}>🏆</Text>
            <Text style={styles.achievementText}>Completed all missions for 2 weeks straight</Text>
          </View>
          <View style={styles.achievementItem}>
            <Text style={styles.achievementIcon}>⭐</Text>
            <Text style={styles.achievementText}>Reached 2.0x multiplier</Text>
          </View>
          <View style={styles.achievementItem}>
            <Text style={styles.achievementIcon}>💎</Text>
            <Text style={styles.achievementText}>Earned over 1,000 coins this month</Text>
          </View>
        </Card>
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 0,
    paddingVertical: 16,
    paddingBottom: 100,
  },
  monthCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 24,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
  },
  monthTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E88E5',
    marginBottom: 8,
  },
  monthSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  breakdownCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#424242',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  weekLabel: {
    fontSize: 14,
    color: '#666666',
    width: 60,
  },
  weekBar: {
    flex: 1,
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  weekBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 10,
  },
  weekValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    width: 40,
    textAlign: 'right',
  },
  achievementsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    backgroundColor: '#FFF9E6',
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementText: {
    flex: 1,
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});
