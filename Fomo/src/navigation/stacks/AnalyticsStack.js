import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WeeklySummaryScreen from '../../screens/analytics/WeeklySummaryScreen';
import MonthlySummaryScreen from '../../screens/analytics/MonthlySummaryScreen';
import InsightsScreen from '../../screens/analytics/InsightsScreen';
import CustomReportScreen from '../../screens/analytics/CustomReportScreen';
import PhoneActivityScreen from '../../screens/analytics/PhoneActivityScreen';

const Stack = createNativeStackNavigator();

/**
 * Analytics Stack Navigator
 * Contains analytics and reporting screens
 */
export default function AnalyticsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'card',
      }}
    >
      <Stack.Screen
        name="WeeklySummary"
        component={WeeklySummaryScreen}
      />
      <Stack.Screen
        name="MonthlySummary"
        component={MonthlySummaryScreen}
      />
      <Stack.Screen
        name="Insights"
        component={InsightsScreen}
      />
      <Stack.Screen
        name="CustomReport"
        component={CustomReportScreen}
      />
      <Stack.Screen
        name="PhoneActivity"
        component={PhoneActivityScreen}
      />
    </Stack.Navigator>
  );
}
