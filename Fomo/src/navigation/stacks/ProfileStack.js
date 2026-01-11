import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../../screens/profile/ProfileScreen';
import SettingsScreen from '../../screens/profile/SettingsScreen';
import NotificationPreferencesScreen from '../../screens/profile/NotificationPreferencesScreen';
import HelpFAQScreen from '../../screens/profile/HelpFAQScreen';
import PrivacyScreen from '../../screens/profile/PrivacyScreen';

const Stack = createNativeStackNavigator();

/**
 * Profile Stack Navigator
 * Contains profile and settings-related screens
 */
export default function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'card',
      }}
    >
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen
        name="NotificationPreferences"
        component={NotificationPreferencesScreen}
      />
      <Stack.Screen name="HelpFAQ" component={HelpFAQScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
    </Stack.Navigator>
  );
}
