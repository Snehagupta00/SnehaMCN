import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import Card from '../../components/ui/Card';

/**
 * Insights Screen
 * Personalized insights and recommendations
 */
export default function InsightsScreen({ navigation }) {
  const { current: streakCount, multiplier } = useSelector((state) => state.streaks);
  const { wallet } = useSelector((state) => state.rewards);
  const { daily: missions } = useSelector((state) => state.missions);

  const completedMissions = missions.filter(m => m.has_attempted).length;
  const totalMissions = missions.length;
  const completionRate = totalMissions > 0 ? (completedMissions / totalMissions) * 100 : 0;

  const insights = [
    {
      type: 'success',
      icon: '🎯',
      title: 'Great Consistency!',
      message: `You've maintained a ${streakCount || 0}-day streak. Keep it up to unlock the 2.5x multiplier at 30 days!`,
      action: 'Continue your streak',
    },
    {
      type: 'warning',
      icon: '⏰',
      title: 'Time to Complete Missions',
      message: `You have ${totalMissions - completedMissions} incomplete missions today. Complete them before they expire!`,
      action: 'View missions',
    },
    {
      type: 'info',
      icon: '💰',
      title: 'Redeem Your Coins',
      message: `You've earned ${wallet.balance?.toLocaleString() || 0} coins! Consider redeeming them for rewards.`,
      action: 'Browse vouchers',
    },
    {
      type: 'tip',
      icon: '💡',
      title: 'Pro Tip',
      message: `Your completion rate is ${completionRate.toFixed(0)}%. Try completing all missions daily to maximize your rewards!`,
      action: 'Learn more',
    },
  ];

  const getInsightColor = (type) => {
    switch (type) {
      case 'success': return '#4CAF50';
      case 'warning': return '#FFC107';
      case 'info': return '#1E88E5';
      case 'tip': return '#9C27B0';
      default: return '#666666';
    }
  };

  return (
    <LinearGradient colors={['#1E88E5', '#00BCD4']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Insights</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.introCard}>
          <Text style={styles.introTitle}>Your Personalized Insights</Text>
          <Text style={styles.introText}>
            Based on your activity, here are personalized recommendations to help you achieve your goals.
          </Text>
        </Card>

        {insights.map((insight, index) => (
          <Card key={index} style={[
            styles.insightCard,
            { borderLeftColor: getInsightColor(insight.type) }
          ]}>
            <View style={styles.insightHeader}>
              <Text style={styles.insightIcon}>{insight.icon}</Text>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                <Text style={styles.insightMessage}>{insight.message}</Text>
              </View>
            </View>
            <TouchableOpacity style={[
              styles.insightAction,
              { backgroundColor: getInsightColor(insight.type) + '20' }
            ]}>
              <Text style={[
                styles.insightActionText,
                { color: getInsightColor(insight.type) }
              ]}>
                {insight.action} →
              </Text>
            </TouchableOpacity>
          </Card>
        ))}

        <TouchableOpacity
          onPress={() => navigation.navigate('PhoneActivity')}
          style={styles.activityCard}
        >
          <Card style={styles.activityCardContent}>
            <View style={styles.activityHeader}>
              <Ionicons name="phone-portrait-outline" size={24} color="#1E88E5" />
              <View style={styles.activityText}>
                <Text style={styles.activityTitle}>Phone Activity</Text>
                <Text style={styles.activitySubtitle}>View your app usage statistics</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#BDBDBD" />
            </View>
          </Card>
        </TouchableOpacity>

        <Card style={styles.trendsCard}>
          <Text style={styles.sectionTitle}>TRENDING:</Text>
          <View style={styles.trendItem}>
            <Text style={styles.trendIcon}>📈</Text>
            <View style={styles.trendInfo}>
              <Text style={styles.trendTitle}>Your streak is increasing!</Text>
              <Text style={styles.trendText}>You're on track to beat your record</Text>
            </View>
          </View>
          <View style={styles.trendItem}>
            <Text style={styles.trendIcon}>⚡</Text>
            <View style={styles.trendInfo}>
              <Text style={styles.trendTitle}>Multiplier Active</Text>
              <Text style={styles.trendText}>You're earning {multiplier || 1.0}x rewards</Text>
            </View>
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
  introCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    backgroundColor: '#E3F2FD',
  },
  introTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E88E5',
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  insightCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderLeftWidth: 4,
  },
  insightHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  insightIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  insightMessage: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  insightAction: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  insightActionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  trendsCard: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 20,
    backgroundColor: '#FFF9E6',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#424242',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  trendItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  trendIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  trendInfo: {
    flex: 1,
  },
  trendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  trendText: {
    fontSize: 14,
    color: '#666666',
  },
  activityCard: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  activityCardContent: {
    padding: 16,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityText: {
    flex: 1,
    marginLeft: 12,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#666666',
  },
});
