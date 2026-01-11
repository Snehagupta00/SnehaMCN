import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

/**
 * Voucher Details Screen
 * Shows detailed information about a specific voucher
 */
export default function VoucherDetailsScreen({ navigation, route }) {
  const voucher = route?.params?.voucher || {
    id: 'voucher_5',
    title: '$5 Gift Card',
    description: 'Redeemable at any partner store',
    cost: 500,
    emoji: '🎁',
    validFor: '30 days',
    code: 'VM5-XXXX-XXXX',
    redeemedAt: null,
  };

  return (
    <LinearGradient colors={['#1E88E5', '#00BCD4']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Voucher Details</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.voucherCard}>
          <Text style={styles.voucherEmoji}>{voucher.emoji}</Text>
          <Text style={styles.voucherTitle}>{voucher.title}</Text>
          <Text style={styles.voucherDescription}>{voucher.description}</Text>
        </Card>

        <Card style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>DETAILS:</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Cost:</Text>
            <Text style={styles.detailValue}>{voucher.cost?.toLocaleString() || 0} coins</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Valid For:</Text>
            <Text style={styles.detailValue}>{voucher.validFor || '30 days'}</Text>
          </View>

          {voucher.redeemedAt && (
            <>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Redeemed:</Text>
                <Text style={styles.detailValue}>
                  {new Date(voucher.redeemedAt).toLocaleDateString()}
                </Text>
              </View>

              <View style={styles.codeContainer}>
                <Text style={styles.codeLabel}>Voucher Code:</Text>
                <View style={styles.codeBox}>
                  <Text style={styles.codeText}>{voucher.code || 'VM5-XXXX-XXXX'}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      // TODO: Copy to clipboard
                    }}
                  >
                    <Ionicons name="copy-outline" size={20} color="#1E88E5" />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </Card>

        <Card style={styles.termsCard}>
          <Text style={styles.sectionTitle}>TERMS & CONDITIONS:</Text>
          <Text style={styles.termsText}>
            • Voucher is valid for {voucher.validFor || '30 days'} from redemption{'\n'}
            • Cannot be combined with other offers{'\n'}
            • Non-refundable and non-transferable{'\n'}
            • Subject to partner store terms and conditions{'\n'}
            • Voucher code will be sent to your registered email
          </Text>
        </Card>

        {!voucher.redeemedAt && (
          <Button
            title="Redeem Now"
            onPress={() => navigation.navigate('RedeemVoucher', { voucherId: voucher.id })}
            variant="primary"
            style={styles.redeemButton}
          />
        )}
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
  voucherCard: {
    alignItems: 'center',
    padding: 32,
    marginBottom: 16,
    backgroundColor: '#E3F2FD',
  },
  voucherEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  voucherTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E88E5',
    marginBottom: 8,
  },
  voucherDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  detailsCard: {
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  codeContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  codeLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
  },
  codeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E88E5',
    letterSpacing: 2,
  },
  termsCard: {
    marginBottom: 16,
    padding: 20,
    backgroundColor: '#FFF9E6',
  },
  termsText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
  },
  redeemButton: {
    marginTop: 8,
  },
});
