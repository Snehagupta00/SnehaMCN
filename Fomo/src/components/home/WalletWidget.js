import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated as RNAnimated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Card from '../ui/Card';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';

const { width } = Dimensions.get('window');

export default function WalletWidget({
  balance,
  todayEarnings,
  weekEarnings,
  monthEarnings = 1200,
  onRedeemPress,
}) {
  const displayBalance = typeof balance === 'number' ? balance : 0;
  const displayToday = typeof todayEarnings === 'number' ? todayEarnings : 0;
  const displayWeek = typeof weekEarnings === 'number' ? weekEarnings : 0;
  const displayMonth = typeof monthEarnings === 'number' ? monthEarnings : 0;

  // Animations
  const scaleAnim = useRef(new RNAnimated.Value(1)).current;
  const bounceAnim = useRef(new RNAnimated.Value(0)).current;

  // Animate balance on change
  useEffect(() => {
    RNAnimated.sequence([
      RNAnimated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 300,
        useNativeDriver: true,
      }),
      RNAnimated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [displayBalance]);

  // Continuous bounce for earnings
  useEffect(() => {
    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(bounceAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        RNAnimated.timing(bounceAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const vouchers = [
    {
      id: '5',
      emoji: '🎁',
      title: '$5 Voucher',
      subtitle: 'Quick digital gift',
      cost: 500,
      colors: ['#FFC107', '#FF9100'],
      badge: 'HOT',
    },
    {
      id: '10',
      emoji: '💳',
      title: '$10 Voucher',
      subtitle: 'Premium rewards',
      cost: 1000,
      colors: ['#4CAF50', '#8BC34A'],
      badge: 'BEST',
    },
    {
      id: 'discount',
      emoji: '🎫',
      title: '30% Discount',
      subtitle: 'Special offer',
      cost: 250,
      colors: ['#E91E63', '#FF5252'],
      badge: 'NEW',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Premium Balance Card */}
      <Card style={styles.balanceCard}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.title}>SHARP COINS BALANCE</Text>
            <RNAnimated.Text
              style={[
                styles.balanceAmount,
                {
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              💰 {displayBalance.toLocaleString()}
            </RNAnimated.Text>
          </View>
          <View style={styles.balanceBadge}>
            <Text style={styles.badgeEmoji}>⭐</Text>
          </View>
        </View>

        <Text style={styles.balanceSubtext}>Ready to redeem exclusive rewards</Text>

        {/* Earnings Stats Grid */}
        <View style={styles.earningsGrid}>
          <View style={styles.earningsItem}>
            <Text style={styles.earningsIcon}>📈</Text>
            <Text style={styles.earningsLabel}>Today</Text>
            <RNAnimated.Text
              style={[
                styles.earningsValue,
                {
                  transform: [
                    {
                      translateY: bounceAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -4],
                      }),
                    },
                  ],
                },
              ]}
            >
              +{displayToday}
            </RNAnimated.Text>
          </View>

          <View style={styles.earningsDivider} />

          <View style={styles.earningsItem}>
            <Text style={styles.earningsIcon}>📊</Text>
            <Text style={styles.earningsLabel}>This Week</Text>
            <Text style={styles.earningsValue}>+{displayWeek}</Text>
          </View>

          <View style={styles.earningsDivider} />

          <View style={styles.earningsItem}>
            <Text style={styles.earningsIcon}>🏆</Text>
            <Text style={styles.earningsLabel}>This Month</Text>
            <Text style={styles.earningsValue}>+{displayMonth}</Text>
          </View>
        </View>
      </Card>

      {/* Quick Actions - Enhanced */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>

        <TouchableOpacity
          style={styles.primaryActionButton}
          onPress={onRedeemPress}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[Colors.SHARP_BLUE, '#00BCD4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.primaryActionGradient}
          >
            <Ionicons name="gift" size={24} color={Colors.BACKGROUND} />
            <View style={styles.actionTextContainer}>
              <Text style={styles.primaryActionText}>REDEEM REWARDS</Text>
              <Text style={styles.primaryActionSubtext}>Convert coins to vouchers</Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color={Colors.BACKGROUND} />
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.secondaryActionsRow}>
          <TouchableOpacity
            style={styles.secondaryActionButton}
            activeOpacity={0.8}
          >
            <Ionicons name="swap-horizontal-outline" size={24} color={Colors.SHARP_BLUE} />
            <Text style={styles.secondaryActionText}>TRANSFER</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryActionButton}
            activeOpacity={0.8}
          >
            <Ionicons name="share-social-outline" size={24} color={Colors.SHARP_BLUE} />
            <Text style={styles.secondaryActionText}>REFER</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryActionButton}
            activeOpacity={0.8}
          >
            <Ionicons name="gift-outline" size={24} color={Colors.SHARP_BLUE} />
            <Text style={styles.secondaryActionText}>MORE</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Available Rewards - Carousel */}
      <View style={styles.rewardsSection}>
        <View style={styles.rewardsSectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>TOP REWARDS</Text>
            <Text style={styles.rewardsSubtitle}>Popular among users</Text>
          </View>
          <TouchableOpacity onPress={onRedeemPress}>
            <Text style={styles.viewAllLink}>See All →</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.rewardsScroll}
          contentContainerStyle={styles.rewardsContent}
        >
          {vouchers.map((voucher) => (
            <LinearGradient
              key={voucher.id}
              colors={voucher.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.rewardCard}
            >
              {/* Badge */}
              <View style={styles.voucherBadge}>
                <Text style={styles.voucherBadgeText}>{voucher.badge}</Text>
              </View>

              {/* Content */}
              <Text style={styles.voucherEmoji}>{voucher.emoji}</Text>
              <Text style={styles.voucherTitle}>{voucher.title}</Text>
              <Text style={styles.voucherSubtitle}>{voucher.subtitle}</Text>

              {/* Footer */}
              <View style={styles.voucherFooter}>
                <View>
                  <Text style={styles.voucherCost}>
                    {voucher.cost.toLocaleString()}
                  </Text>
                  <Text style={styles.voucherCostLabel}>coins</Text>
                </View>
                <TouchableOpacity
                  style={styles.voucherButton}
                  onPress={onRedeemPress}
                >
                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color={Colors.SHARP_BLUE}
                  />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
    marginHorizontal: -Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  balanceCard: {
    marginBottom: Spacing.md,
    marginHorizontal: 0,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Poppins-SemiBold',
    color: Colors.TEXT_SECONDARY,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    fontFamily: 'Roboto-Bold',
    color: Colors.SHARP_BLUE,
  },
  balanceBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeEmoji: {
    fontSize: 24,
  },
  balanceSubtext: {
    fontSize: 13,
    color: Colors.TEXT_SECONDARY,
    fontFamily: 'Roboto-Regular',
    marginBottom: Spacing.md,
  },
  earningsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.BACKGROUND_LIGHT,
  },
  earningsItem: {
    flex: 1,
    alignItems: 'center',
  },
  earningsDivider: {
    width: 1,
    height: 50,
    backgroundColor: Colors.BACKGROUND_LIGHT,
  },
  earningsIcon: {
    fontSize: 18,
    marginBottom: Spacing.xs,
  },
  earningsLabel: {
    fontSize: 10,
    fontFamily: 'Roboto-Regular',
    color: Colors.TEXT_SECONDARY,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  earningsValue: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Roboto-Bold',
    color: Colors.TEXT_PRIMARY,
  },
  quickActionsContainer: {
    marginBottom: Spacing.md,
    marginHorizontal: 0,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Poppins-SemiBold',
    color: Colors.TEXT_SECONDARY,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  primaryActionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    shadowColor: '#1E88E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    paddingRight: Spacing.md,
  },
  actionTextContainer: {
    flex: 1,
    marginLeft: Spacing.lg,
  },
  primaryActionText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.BACKGROUND,
    fontFamily: 'Poppins-Bold',
    marginBottom: 2,
  },
  primaryActionSubtext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'Roboto-Regular',
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  secondaryActionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.BACKGROUND,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.SHARP_BLUE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.SHARP_BLUE,
    marginTop: Spacing.xs,
    fontFamily: 'Poppins-Bold',
  },
  rewardsSection: {
    marginBottom: 0,
    marginHorizontal: 0,
  },
  rewardsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  rewardsSubtitle: {
    fontSize: 12,
    color: Colors.TEXT_SECONDARY,
    fontFamily: 'Roboto-Regular',
    marginTop: 4,
  },
  viewAllLink: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.SHARP_BLUE,
    fontFamily: 'Poppins-Bold',
  },
  rewardsScroll: {
    marginHorizontal: -Spacing.lg,
  },
  rewardsContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  rewardCard: {
    width: width - 80,
    padding: Spacing.lg,
    borderRadius: 18,
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
    borderRadius: 12,
    marginBottom: Spacing.md,
  },
  voucherBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.BACKGROUND,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
    fontFamily: 'Poppins-Bold',
  },
  voucherSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'Roboto-Regular',
    marginBottom: Spacing.lg,
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
    fontSize: 16,
    fontWeight: '700',
    color: Colors.BACKGROUND,
    fontFamily: 'Roboto-Bold',
  },
  voucherCostLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'Roboto-Regular',
  },
  voucherButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
});