import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { addFakeMoney, fetchWallet, fetchTransactionHistory } from '../../store/slices/rewardSlice';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';

const { width } = Dimensions.get('window');

/**
 * Updated Wallet Screen - FOMO-Optimized Design
 * Features: Animated coin counter, urgency indicators, streaks, badges
 */
export default function WalletScreen({ navigation }) {
  const dispatch = useDispatch();
  const {
    wallet = { balance: 0, total_balance: 0 },
    recentRewards = [],
    availableVouchers = [],
    loading,
  } = useSelector((state) => state.rewards);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const coinCountAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadData();
  }, [dispatch]);

  useEffect(() => {
    // Animate coin counter when balance updates
    Animated.timing(scaleAnim, {
      toValue: 1.15,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  }, [wallet.total_balance]);

  const loadData = () => {
    dispatch(fetchWallet());
    dispatch(fetchTransactionHistory());
  };

  const handleAddMoney = () => {
    dispatch(addFakeMoney(500));
    Alert.alert('Success', 'Added 500 coins to your wallet! 💰');
  };

  const earnings = useMemo(() => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const weekAgo = new Date(today);
    weekAgo.setUTCDate(weekAgo.getUTCDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setUTCMonth(monthAgo.getUTCMonth() - 1);

    const todayEarnings = recentRewards
      .filter((r) => {
        const date = new Date(r.timestamp || r.created_at || Date.now());
        return date >= today && r.type === 'earned';
      })
      .reduce((sum, r) => sum + (r.amount || 0), 0);

    const weekEarnings = recentRewards
      .filter((r) => {
        const date = new Date(r.timestamp || r.created_at || Date.now());
        return date >= weekAgo && r.type === 'earned';
      })
      .reduce((sum, r) => sum + (r.amount || 0), 0);

    const monthEarnings = recentRewards
      .filter((r) => {
        const date = new Date(r.timestamp || r.created_at || Date.now());
        return date >= monthAgo && r.type === 'earned';
      })
      .reduce((sum, r) => sum + (r.amount || 0), 0);

    return { today: todayEarnings, week: weekEarnings, month: monthEarnings };
  }, [recentRewards]);

  const balance = wallet?.total_balance || wallet?.balance || 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wallet</Text>
        <TouchableOpacity>
          <Ionicons name="help-circle-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadData}
            tintColor={Colors.SHARP_BLUE}
          />
        }
      >
        {/* MAIN BALANCE CARD - Premium Design */}
        <View style={styles.balanceCardWrapper}>
          <LinearGradient
            colors={['#1E88E5', '#00BCD4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceCard}
          >
            <View style={styles.balanceHeader}>
              <View>
                <Text style={styles.balanceLabel}>YOUR BALANCE</Text>
                <Animated.Text
                  style={[
                    styles.balanceAmount,
                    { transform: [{ scale: scaleAnim }] },
                  ]}
                >
                  💰 {balance.toLocaleString()}
                </Animated.Text>
              </View>
              <View style={styles.balanceBadge}>
                <Text style={styles.badgeEmoji}>⭐</Text>
              </View>
            </View>

            <Text style={styles.balanceSubtext}>
              Ready to redeem amazing rewards
            </Text>

            {/* Mini Stats Row */}
            <View style={styles.miniStatsRow}>
              <View style={styles.miniStat}>
                <Text style={styles.miniStatValue}>+{earnings.today}</Text>
                <Text style={styles.miniStatLabel}>Today</Text>
              </View>
              <View style={[styles.miniStat, { borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.3)' }]}>
                <Text style={styles.miniStatValue}>+{earnings.week}</Text>
                <Text style={styles.miniStatLabel}>Week</Text>
              </View>
              <View style={[styles.miniStat, { borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.3)' }]}>
                <Text style={styles.miniStatValue}>+{earnings.month}</Text>
                <Text style={styles.miniStatLabel}>Month</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* URGENCY BANNER - Limited Time Rewards */}
        <View style={styles.urgencyBanner}>
          <LinearGradient
            colors={['#FF9100', '#FF6B6B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.urgencyGradient}
          >
            <View style={styles.urgencyContent}>
              <View>
                <Text style={styles.urgencyTitle}>🔥 Limited Time Offer</Text>
                <Text style={styles.urgencySubtitle}>
                  Redeem vouchers before they expire
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={Colors.BACKGROUND} />
            </View>
          </LinearGradient>
        </View>

        {/* QUICK ACTIONS - Larger, More Prominent */}
        <View style={styles.quickActionsSection}>
          <TouchableOpacity
            style={styles.actionButtonPrimary}
            onPress={() => navigation.navigate('RedeemVoucher')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.SHARP_BLUE, '#00BCD4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.actionGradient}
            >
              <Ionicons name="gift" size={24} color={Colors.BACKGROUND} />
              <View style={{ flex: 1, marginLeft: Spacing.md }}>
                <Text style={styles.actionPrimaryText}>REDEEM REWARDS</Text>
                <Text style={styles.actionPrimarySubtext}>
                  Convert coins to vouchers
                </Text>
              </View>
              <Ionicons
                name="arrow-forward"
                size={20}
                color={Colors.BACKGROUND}
              />
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={styles.actionButtonSecondary}
              onPress={handleAddMoney}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle-outline" size={28} color={Colors.SHARP_BLUE} />
              <Text style={styles.actionSecondaryText}>+500</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButtonSecondary}
              onPress={() =>
                Alert.alert('Coming Soon', 'Referral feature coming soon!')
              }
              activeOpacity={0.8}
            >
              <Ionicons name="share-social-outline" size={28} color={Colors.SHARP_BLUE} />
              <Text style={styles.actionSecondaryText}>REFER</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButtonSecondary}
              onPress={() => navigation.navigate('TransactionHistory')}
              activeOpacity={0.8}
            >
              <Ionicons name="list-outline" size={28} color={Colors.SHARP_BLUE} />
              <Text style={styles.actionSecondaryText}>HISTORY</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* AVAILABLE VOUCHERS - Card Grid */}
        <View style={styles.vouchersSection}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Top Rewards</Text>
              <Text style={styles.sectionSubtitle}>Popular among users</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('RedeemVoucher')}>
              <Text style={styles.viewAllLink}>See All →</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.voucherScroll}
            contentContainerStyle={{ paddingRight: Spacing.lg }}
          >
            {/* Voucher 1 */}
            <LinearGradient
              colors={['#FFC107', '#FF9100']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.voucherCardGradient}
            >
              <View style={styles.voucherBadge}>
                <Text style={styles.voucherBadgeText}>HOT</Text>
              </View>
              <Text style={styles.voucherEmoji}>🎁</Text>
              <Text style={styles.voucherTitle}>$5 Voucher</Text>
              <Text style={styles.voucherDescription}>
                Quick digital gift
              </Text>
              <View style={styles.voucherFooter}>
                <Text style={styles.voucherCost}>500 coins</Text>
                <TouchableOpacity
                  style={styles.voucherRedeemBtn}
                  onPress={() =>
                    navigation.navigate('RedeemVoucher', {
                      voucherId: 'voucher_5',
                    })
                  }
                >
                  <Ionicons name="arrow-forward" size={16} color={Colors.SHARP_BLUE} />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            {/* Voucher 2 */}
            <LinearGradient
              colors={['#4CAF50', '#8BC34A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.voucherCardGradient}
            >
              <View style={styles.voucherBadge}>
                <Text style={styles.voucherBadgeText}>BEST</Text>
              </View>
              <Text style={styles.voucherEmoji}>💳</Text>
              <Text style={styles.voucherTitle}>$10 Voucher</Text>
              <Text style={styles.voucherDescription}>
                Premium rewards
              </Text>
              <View style={styles.voucherFooter}>
                <Text style={styles.voucherCost}>1,000 coins</Text>
                <TouchableOpacity
                  style={styles.voucherRedeemBtn}
                  onPress={() =>
                    navigation.navigate('RedeemVoucher', {
                      voucherId: 'voucher_10',
                    })
                  }
                >
                  <Ionicons name="arrow-forward" size={16} color={Colors.SHARP_BLUE} />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            {/* Voucher 3 */}
            <LinearGradient
              colors={['#E91E63', '#FF5252']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.voucherCardGradient}
            >
              <View style={styles.voucherBadge}>
                <Text style={styles.voucherBadgeText}>NEW</Text>
              </View>
              <Text style={styles.voucherEmoji}>🎫</Text>
              <Text style={styles.voucherTitle}>30% Off</Text>
              <Text style={styles.voucherDescription}>
                Special discount
              </Text>
              <View style={styles.voucherFooter}>
                <Text style={styles.voucherCost}>250 coins</Text>
                <TouchableOpacity
                  style={styles.voucherRedeemBtn}
                  onPress={() =>
                    navigation.navigate('RedeemVoucher', {
                      voucherId: 'coupon_30',
                    })
                  }
                >
                  <Ionicons name="arrow-forward" size={16} color={Colors.SHARP_BLUE} />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </ScrollView>
        </View>

        {/* STREAK & PROGRESS INFO */}
        <View style={styles.streakSection}>
          <LinearGradient
            colors={['#FFD700', '#FFC107']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.streakCard}
          >
            <View style={styles.streakHeader}>
              <View>
                <Text style={styles.streakLabel}>CURRENT STREAK</Text>
                <Text style={styles.streakCount}>🔥 7 Days</Text>
              </View>
              <View style={styles.streakMultiplier}>
                <Text style={styles.multiplierText}>2.0x</Text>
              </View>
            </View>
            <View style={styles.streakProgress}>
              <View style={[styles.progressBar, { width: '57%' }]} />
            </View>
            <Text style={styles.streakGoal}>
              7 more days until 2.5x multiplier! 🎯
            </Text>
          </LinearGradient>
        </View>

        {/* TRANSACTION HISTORY - Sleek Design */}
        <View style={styles.historySection}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <Text style={styles.sectionSubtitle}>Your earnings history</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('TransactionHistory')}
            >
              <Text style={styles.viewAllLink}>All →</Text>
            </TouchableOpacity>
          </View>

          {recentRewards.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={styles.emptyText}>No transactions yet</Text>
              <Text style={styles.emptySubtext}>
                Complete missions to start earning!
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.emptyButtonText}>Go to Missions →</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              {recentRewards.slice(0, 5).map((reward, index) => {
                const date = new Date(reward.timestamp || reward.created_at || Date.now());
                const isEarned =
                  reward.type === 'earned' ||
                  reward.source === 'MISSION_COMPLETION' ||
                  reward.type !== 'redeemed';

                return (
                  <View key={reward.id || reward.reward_id || index}>
                    <View style={styles.transactionItem}>
                      <LinearGradient
                        colors={
                          isEarned
                            ? ['#4CAF50', '#8BC34A']
                            : ['#FF9100', '#FF6B6B']
                        }
                        style={styles.transactionIconGradient}
                      >
                        <Ionicons
                          name={isEarned ? 'add-circle' : 'remove-circle'}
                          size={18}
                          color={Colors.BACKGROUND}
                        />
                      </LinearGradient>

                      <View style={styles.transactionContent}>
                        <Text style={styles.transactionTitle}>
                          {reward.description ||
                            reward.reason ||
                            reward.mission_title ||
                            'Transaction'}
                        </Text>
                        <Text style={styles.transactionDate}>
                          {date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                      </View>

                      <Text
                        style={[
                          styles.transactionAmount,
                          isEarned && styles.transactionAmountEarned,
                        ]}
                      >
                        {isEarned ? '+' : '-'}
                        {reward.amount || 0}
                      </Text>
                    </View>
                    {index < Math.min(recentRewards.length - 1, 4) && (
                      <View style={styles.divider} />
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  balanceCardWrapper: {
    marginBottom: Spacing.xl,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#1E88E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  balanceCard: {
    padding: Spacing.xl,
    borderRadius: 20,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  balanceAmount: {
    fontSize: 42,
    fontWeight: '700',
    color: Colors.BACKGROUND,
    fontFamily: 'Roboto-Bold',
  },
  balanceBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeEmoji: {
    fontSize: 28,
  },
  balanceSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: Spacing.lg,
    fontFamily: 'Roboto-Regular',
  },
  miniStatsRow: {
    flexDirection: 'row',
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  miniStat: {
    flex: 1,
    alignItems: 'center',
  },
  miniStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.BACKGROUND,
    marginBottom: 4,
  },
  miniStatLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'Roboto-Regular',
  },
  urgencyBanner: {
    marginBottom: Spacing.lg,
    borderRadius: 16,
    overflow: 'hidden',
  },
  urgencyGradient: {
    padding: Spacing.lg,
  },
  urgencyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  urgencyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.BACKGROUND,
    marginBottom: Spacing.xs,
  },
  urgencySubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'Roboto-Regular',
  },
  quickActionsSection: {
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  actionButtonPrimary: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#1E88E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  actionPrimaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.BACKGROUND,
    fontFamily: 'Poppins-Bold',
  },
  actionPrimarySubtext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButtonSecondary: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.BACKGROUND,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.SHARP_BLUE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  actionSecondaryText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.SHARP_BLUE,
    marginTop: Spacing.xs,
    fontFamily: 'Poppins-Bold',
  },
  vouchersSection: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    fontFamily: 'Poppins-Bold',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: Colors.TEXT_SECONDARY,
    marginTop: 4,
    fontFamily: 'Roboto-Regular',
  },
  viewAllLink: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.SHARP_BLUE,
    fontFamily: 'Poppins-Bold',
  },
  voucherScroll: {
    marginHorizontal: -Spacing.lg,
    paddingLeft: Spacing.lg,
  },
  voucherCardGradient: {
    width: width - 80,
    marginRight: Spacing.md,
    padding: Spacing.lg,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  voucherBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
    marginBottom: Spacing.md,
  },
  voucherBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.BACKGROUND,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  voucherEmoji: {
    fontSize: 40,
    marginBottom: Spacing.md,
  },
  voucherTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.BACKGROUND,
    marginBottom: Spacing.xs,
  },
  voucherDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: Spacing.md,
  },
  voucherFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  voucherCost: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.BACKGROUND,
  },
  voucherRedeemBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakSection: {
    marginBottom: Spacing.xl,
  },
  streakCard: {
    padding: Spacing.lg,
    borderRadius: 20,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  streakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  streakLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.6)',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  streakCount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  streakMultiplier: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 12,
  },
  multiplierText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  streakProgress: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 3,
  },
  streakGoal: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.7)',
    fontWeight: '500',
  },
  historySection: {
    marginBottom: Spacing.lg,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  transactionIconGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  transactionContent: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: Colors.TEXT_SECONDARY,
    fontFamily: 'Roboto-Regular',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B6B',
    fontFamily: 'Roboto-Bold',
  },
  transactionAmountEarned: {
    color: '#4CAF50',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: Spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl * 2,
    paddingHorizontal: Spacing.lg,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  emptyButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.SHARP_BLUE,
    borderRadius: 12,
    marginTop: Spacing.md,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.BACKGROUND,
    fontFamily: 'Poppins-Bold',
  },
});