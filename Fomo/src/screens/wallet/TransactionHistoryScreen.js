import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTransactionHistory } from '../../store/slices/rewardSlice';
import Card from '../../components/ui/Card';

/**
 * Transaction History Screen
 * Displays all wallet transactions
 */
export default function TransactionHistoryScreen({ navigation }) {
  const dispatch = useDispatch();
  const { recentRewards } = useSelector((state) => state.rewards);
  const { loading } = useSelector((state) => state.rewards);

  useEffect(() => {
    dispatch(fetchTransactionHistory());
  }, [dispatch]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'earned':
        return '💰';
      case 'redeemed':
        return '🎁';
      case 'bonus':
        return '⭐';
      default:
        return '💵';
    }
  };

  const renderTransaction = ({ item, index }) => {
    const transactionType = item.type || 'earned';
    const isPositive = transactionType === 'earned' || transactionType === 'bonus';

    return (
      <Card style={styles.transactionCard}>
        <View style={styles.transactionRow}>
          <View style={styles.transactionLeft}>
            <Text style={styles.transactionIcon}>{getTransactionIcon(transactionType)}</Text>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTitle}>{item.description || 'Mission Reward'}</Text>
              <Text style={styles.transactionDate}>{formatDate(item.timestamp)}</Text>
            </View>
          </View>
          <View style={styles.transactionRight}>
            <Text style={[
              styles.transactionAmount,
              isPositive ? styles.positiveAmount : styles.negativeAmount
            ]}>
              {isPositive ? '+' : '-'}{item.amount || 0} coins
            </Text>
            <Text style={styles.transactionType}>
              {transactionType === 'earned' ? 'Earned' : 
               transactionType === 'redeemed' ? 'Redeemed' : 'Bonus'}
            </Text>
          </View>
        </View>
      </Card>
    );
  };

  const transactions = recentRewards.length > 0 
    ? recentRewards 
    : [
        { id: 1, type: 'earned', amount: 150, description: 'Completed "Walk 10,000 steps"', timestamp: Date.now() - 3600000 },
        { id: 2, type: 'earned', amount: 200, description: 'Completed "Drink 8 glasses of water"', timestamp: Date.now() - 7200000 },
        { id: 3, type: 'bonus', amount: 50, description: '7-day streak bonus', timestamp: Date.now() - 86400000 },
        { id: 4, type: 'redeemed', amount: 500, description: 'Redeemed $5 Voucher', timestamp: Date.now() - 172800000 },
      ];

  return (
    <LinearGradient colors={['#1E88E5', '#00BCD4']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction History</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>TOTAL TRANSACTIONS</Text>
          <Text style={styles.summaryCount}>{transactions.length}</Text>
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Earned</Text>
              <Text style={styles.statValue}>
                {transactions.filter(t => t.type === 'earned' || t.type === 'bonus').length}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Redeemed</Text>
              <Text style={styles.statValue}>
                {transactions.filter(t => t.type === 'redeemed').length}
              </Text>
            </View>
          </View>
        </Card>

        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>No transactions yet</Text>
              <Text style={styles.emptySubtext}>Complete missions to earn coins!</Text>
            </Card>
          }
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
  summaryCard: {
    marginBottom: 16,
    padding: 20,
    backgroundColor: '#E3F2FD',
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E88E5',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  summaryCount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1E88E5',
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E88E5',
  },
  listContent: {
    paddingBottom: 16,
  },
  transactionCard: {
    marginBottom: 12,
    padding: 16,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666666',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  positiveAmount: {
    color: '#4CAF50',
  },
  negativeAmount: {
    color: '#FF5252',
  },
  transactionType: {
    fontSize: 12,
    color: '#999999',
  },
  emptyCard: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666666',
  },
});
