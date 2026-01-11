import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

/**
 * Redeem Voucher Screen
 * Browse and redeem available vouchers
 */
export default function RedeemVoucherScreen({ navigation, route }) {
  const { wallet } = useSelector((state) => state.rewards);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const vouchers = [
    {
      id: 'voucher_5',
      title: '$5 Gift Card',
      description: 'Redeemable at any partner store',
      cost: 500,
      emoji: '🎁',
      validFor: '30 days',
    },
    {
      id: 'voucher_10',
      title: '$10 Gift Card',
      description: 'Redeemable at any partner store',
      cost: 1000,
      emoji: '🎁',
      validFor: '30 days',
    },
    {
      id: 'coupon_30',
      title: '30% Discount Coupon',
      description: '30% off your next purchase',
      cost: 250,
      emoji: '🎫',
      validFor: '14 days',
    },
    {
      id: 'voucher_25',
      title: '$25 Gift Card',
      description: 'Redeemable at any partner store',
      cost: 2500,
      emoji: '🎁',
      validFor: '60 days',
    },
    {
      id: 'premium_1',
      title: 'Premium Membership (1 Month)',
      description: 'Unlock premium features',
      cost: 5000,
      emoji: '⭐',
      validFor: '30 days',
    },
  ];

  const handleRedeem = (voucher) => {
    if (wallet.balance < voucher.cost) {
      Alert.alert(
        'Insufficient Coins',
        `You need ${voucher.cost} coins to redeem this voucher. You currently have ${wallet.balance} coins.`,
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Confirm Redemption',
      `Redeem ${voucher.title} for ${voucher.cost} coins?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Redeem',
          onPress: () => {
            // TODO: Implement redemption API call
            Alert.alert(
              'Success!',
              `You've successfully redeemed ${voucher.title}. Check your email for the voucher code.`,
              [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
          },
        },
      ]
    );
  };

  return (
    <LinearGradient colors={['#1E88E5', '#00BCD4']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Redeem Vouchers</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Your Balance</Text>
        <Text style={styles.balanceAmount}>💰 {wallet.balance?.toLocaleString() || 0} coins</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {vouchers.map((voucher) => {
          const canAfford = wallet.balance >= voucher.cost;
          
          return (
            <Card key={voucher.id} style={[
              styles.voucherCard,
              !canAfford && styles.voucherCardDisabled
            ]}>
              <View style={styles.voucherHeader}>
                <Text style={styles.voucherEmoji}>{voucher.emoji}</Text>
                <View style={styles.voucherInfo}>
                  <Text style={styles.voucherTitle}>{voucher.title}</Text>
                  <Text style={styles.voucherDescription}>{voucher.description}</Text>
                  <Text style={styles.voucherValid}>Valid for: {voucher.validFor}</Text>
                </View>
              </View>
              
              <View style={styles.voucherFooter}>
                <View style={styles.costContainer}>
                  <Text style={styles.costLabel}>Cost:</Text>
                  <Text style={[
                    styles.costAmount,
                    !canAfford && styles.costAmountDisabled
                  ]}>
                    {voucher.cost.toLocaleString()} coins
                  </Text>
                </View>
                <Button
                  title={canAfford ? "REDEEM" : "INSUFFICIENT"}
                  onPress={() => handleRedeem(voucher)}
                  variant={canAfford ? "primary" : "secondary"}
                  style={styles.redeemButton}
                  disabled={!canAfford}
                />
              </View>
            </Card>
          );
        })}
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
  balanceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 32,
  },
  voucherCard: {
    marginBottom: 16,
    padding: 20,
  },
  voucherCardDisabled: {
    opacity: 0.6,
  },
  voucherHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  voucherEmoji: {
    fontSize: 48,
    marginRight: 16,
  },
  voucherInfo: {
    flex: 1,
  },
  voucherTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  voucherDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  voucherValid: {
    fontSize: 12,
    color: '#999999',
  },
  voucherFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  costContainer: {
    flex: 1,
  },
  costLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  costAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E88E5',
  },
  costAmountDisabled: {
    color: '#BDBDBD',
  },
  redeemButton: {
    minWidth: 120,
  },
});
