import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import Card from '../../components/ui/Card';

/**
 * Statistics Screen
 * Detailed statistics and analytics
 */
export default function StatisticsScreen({ navigation }) {
  const { current: streakCount, max: maxStreak, multiplier } = useSelector((state) => state.streaks);
  const { wallet } = useSelector((state) => state.rewards);
  const { daily: missions } = useSelector((state) => state.missions);

  const completedMissions = missions.filter(m => m.has_attempted).length;
  const totalMissions = missions.length;
  const completionRate = totalMissions > 0 ? (completedMissions / totalMissions) * 100 : 0;

  const stats = [
    {
      title: 'Current Streak',
      value: `${streakCount || 0} days`,
      icon: '🔥',
      color: '#FF6B6B',
    },
    {
      title: 'Longest Streak',
      value: `${maxStreak || 0} days`,
      icon: '🏆',
      color: '#FFC107',
    },
    {
      title: 'Total Missions',
      value: `${completedMissions}`,
      icon: '✅',
      color: '#4CAF50',
    },
    {
      title: 'Completion Rate',
      value: `${completionRate.toFixed(0)}%`,
      icon: '📊',
      color: '#1E88E5',
    },
    {
      title: 'Total Coins Earned',
      value: `${wallet.balance?.toLocaleString() || 0}`,
      icon: '💰',
      color: '#9C27B0',
    },
    {
      title: 'Current Multiplier',
      value: `${multiplier || 1.0}x`,
      icon: '⚡',
      color: '#FF9800',
    },
  ];

  return (
    <LinearGradient colors={['#1E88E5', '#00BCD4']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Statistics</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>YOUR STATS</Text>
          <Text style={styles.overviewSubtitle}>Track your progress and achievements</Text>
        </Card>

        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <Card key={index} style={styles.statCard}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </Card>
          ))}
        </View>

        <Card style={styles.chartCard}>
          <Text style={styles.sectionTitle}>WEEKLY BREAKDOWN:</Text>
          <View style={styles.chartPlaceholder}>
            <Ionicons name="bar-chart-outline" size={48} color="#BDBDBD" />
            <Text style={styles.chartText}>Chart visualization coming soon</Text>
          </View>
        </Card>

        <Card style={styles.insightsCard}>
          <Text style={styles.sectionTitle}>INSIGHTS:</Text>
          <View style={styles.insightItem}>
            <Text style={styles.insightIcon}>💡</Text>
            <Text style={styles.insightText}>
              You're on a {streakCount || 0}-day streak! Keep it up to unlock higher multipliers.
            </Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightIcon}>🎯</Text>
            <Text style={styles.insightText}>
              Your completion rate is {completionRate.toFixed(0)}%. Try to complete all daily missions!
            </Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightIcon}>📈</Text>
            <Text style={styles.insightText}>
              You've earned {wallet.balance?.toLocaleString() || 0} coins so far. Great job!
            </Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  overviewCard: {
    marginBottom: 16,
    padding: 20,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
  },
  overviewTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E88E5',
    marginBottom: 8,
  },
  overviewSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
  statTitle: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  chartCard: {
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
  chartPlaceholder: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  chartText: {
    fontSize: 14,
    color: '#999999',
    marginTop: 8,
  },
  insightsCard: {
    marginBottom: 16,
    padding: 20,
    backgroundColor: '#FFF9E6',
  },
  insightItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  insightIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});
