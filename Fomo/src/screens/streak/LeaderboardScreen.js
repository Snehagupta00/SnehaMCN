import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLeaderboard } from '../../store/slices/streakSlice';
import Card from '../../components/ui/Card';

/**
 * Leaderboard Screen
 * Shows global and friend rankings
 */
export default function LeaderboardScreen({ navigation }) {
  const dispatch = useDispatch();
  const { leaderboard } = useSelector((state) => state.streaks);
  const { current: userStreak } = useSelector((state) => state.streaks);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  const mockLeaderboard = leaderboard.length > 0 ? leaderboard : [
    { user_id: '1', username: 'User1', email: 'user1@example.com', current_streak: 45, rank: 1 },
    { user_id: '2', username: 'User2', email: 'user2@example.com', current_streak: 38, rank: 2 },
    { user_id: '3', username: 'User3', email: 'user3@example.com', current_streak: 32, rank: 3 },
    { user_id: user?.user_id, username: user?.username || 'You', email: user?.email, current_streak: userStreak, rank: 15 },
    { user_id: '4', username: 'User4', email: 'user4@example.com', current_streak: 28, rank: 4 },
    { user_id: '5', username: 'User5', email: 'user5@example.com', current_streak: 25, rank: 5 },
  ].sort((a, b) => (b.current_streak || b.current_streak_count || 0) - (a.current_streak || a.current_streak_count || 0));

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const renderLeaderboardItem = ({ item, index }) => {
    const isCurrentUser = item.user_id === user?.user_id;
    const rank = item.rank || index + 1;

    return (
      <Card style={[
        styles.leaderboardItem,
        isCurrentUser && styles.currentUserItem
      ]}>
        <View style={styles.rankContainer}>
          <Text style={styles.rankText}>{getRankIcon(item.rank || rank)}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={[
            styles.userName,
            isCurrentUser && styles.currentUserName
          ]}>
            {isCurrentUser ? 'You' : item.username || item.email?.split('@')[0] || 'User'}
          </Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
        <View style={styles.streakInfo}>
          <Text style={styles.streakCount}>{item.current_streak || item.current_streak_count || 0}</Text>
          <Text style={styles.streakLabel}>days</Text>
        </View>
      </Card>
    );
  };

  return (
    <LinearGradient colors={['#1E88E5', '#00BCD4']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        <Card style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userStreak || 0}</Text>
            <Text style={styles.statLabel}>Your Streak</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              #{mockLeaderboard.find(u => u.user_id === user?.user_id)?.rank || mockLeaderboard.findIndex(u => u.user_id === user?.user_id) + 1 || 'N/A'}
            </Text>
            <Text style={styles.statLabel}>Your Rank</Text>
          </View>
        </Card>

        <FlatList
          data={mockLeaderboard}
          renderItem={renderLeaderboardItem}
          keyExtractor={(item, index) => item.user_id?.toString() || index.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
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
  content: {
    flex: 1,
    padding: 16,
  },
  statsCard: {
    flexDirection: 'row',
    padding: 20,
    marginBottom: 16,
    backgroundColor: '#E3F2FD',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E88E5',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#BDBDBD',
    marginHorizontal: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
  },
  currentUserItem: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#1E88E5',
  },
  rankContainer: {
    width: 50,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E88E5',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  currentUserName: {
    color: '#1E88E5',
  },
  userEmail: {
    fontSize: 12,
    color: '#666666',
  },
  streakInfo: {
    alignItems: 'flex-end',
  },
  streakCount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF6B6B',
    marginBottom: 4,
  },
  streakLabel: {
    fontSize: 12,
    color: '#666666',
  },
});
