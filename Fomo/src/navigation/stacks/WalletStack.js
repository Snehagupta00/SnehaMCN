import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WalletScreen from '../../screens/wallet/WalletScreen';
import TransactionHistoryScreen from '../../screens/wallet/TransactionHistoryScreen';
import RedeemVoucherScreen from '../../screens/wallet/RedeemVoucherScreen';
import VoucherDetailsScreen from '../../screens/wallet/VoucherDetailsScreen';

const Stack = createNativeStackNavigator();

/**
 * Wallet Stack Navigator
 * Contains wallet and reward-related screens
 */
export default function WalletStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'card',
      }}
    >
      <Stack.Screen name="WalletMain" component={WalletScreen} />
      <Stack.Screen
        name="TransactionHistory"
        component={TransactionHistoryScreen}
      />
      <Stack.Screen
        name="RedeemVoucher"
        component={RedeemVoucherScreen}
      />
      <Stack.Screen
        name="VoucherDetails"
        component={VoucherDetailsScreen}
      />
    </Stack.Navigator>
  );
}
