import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import HomeStack from './stacks/HomeStack';
import WalletStack from './stacks/WalletStack';
import StreakStack from './stacks/StreakStack';
import ProfileStack from './stacks/ProfileStack';
import AnalyticsStack from './stacks/AnalyticsStack';

import { BlurView } from 'expo-blur';
import { View, StyleSheet, Platform } from 'react-native';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true, 
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Wallet') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Streak') {
            iconName = focused ? 'flame' : 'flame-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Analytics') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1E88E5',
        tabBarInactiveTintColor: '#BDBDBD',
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          height: 80, 
          paddingBottom: 10, 
          paddingTop: 10,
        },
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView
              tint="light"
              intensity={80}
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View 
              style={[
                StyleSheet.absoluteFill, 
                { backgroundColor: 'rgba(255, 255, 255, 0.95)' }
              ]} 
            />
          )
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Wallet" component={WalletStack} />
      <Tab.Screen name="Streak" component={StreakStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
      <Tab.Screen name="Analytics" component={AnalyticsStack} />
    </Tab.Navigator>
  );
}
