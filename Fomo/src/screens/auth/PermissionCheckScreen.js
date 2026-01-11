import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking, Platform, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PhoneActivityService from '../../services/PhoneActivityService';
import { Typography } from '../../constants/typography';

/**
 * Permission Check Screen
 * Checks phone activity permissions before app opens
 */
export default function PermissionCheckScreen({ onPermissionGranted }) {
  const [checking, setChecking] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState(null);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const permission = await PhoneActivityService.requestPermissions();
      setPermissionStatus(permission);
      
      // Check if user has explicitly granted permission
      const permissionKey = Platform.OS === 'android' 
        ? 'usage_stats_permission_granted_v2' 
        : 'ios_screen_time_enabled_v2';
      const permissionPreference = await AsyncStorage.getItem(permissionKey);
      
      // Only auto-proceed if BOTH conditions are met:
      // 1. Permission is granted (from service)
      // 2. User has confirmed it (stored preference)
      if (permission.granted === true && permissionPreference === 'true') {
        // Permission is OK, proceed
        setTimeout(() => {
          onPermissionGranted();
        }, 500);
      } else {
        // Always show permission screen if not explicitly granted
        // This ensures permission is asked even during development/testing
        setChecking(false);
      }
    } catch (error) {
      setChecking(false);
    }
  };

  const handleRequestPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        // Open Android Usage Access Settings
        // Method 1: Try to open Usage Access Settings directly
        const usageAccessSettings = 'android.settings.USAGE_ACCESS_SETTINGS';
        
        // Try multiple methods to open settings
        try {
          // Method 1: Direct intent
          await Linking.openURL(`intent:#Intent;action=${usageAccessSettings};end`);
        } catch (e1) {
          try {
            // Method 2: Package-specific settings
            const packageName = 'com.fomo.app';
            await Linking.openURL(`package:${packageName}`);
          } catch (e2) {
            try {
              // Method 3: General app settings
              await Linking.openSettings();
            } catch (e3) {
            }
          }
        }
        
        Alert.alert(
          'Enable Usage Access',
          'Please enable "App usage access" for FOMO:\n\n1. In the Settings screen that opened\n2. Find "FOMO" in the list\n3. Toggle "Permit usage access" ON\n4. Return to this app',
          [
            {
              text: 'I\'ve Enabled It',
              onPress: async () => {
                // Mark as granted
                await AsyncStorage.setItem('usage_stats_permission_granted_v2', 'true');
                setTimeout(() => {
                  checkPermissions();
                }, 1000);
              },
            },
            {
              text: 'Open Settings Again',
              onPress: () => {
                handleRequestPermission();
              },
            },
            {
              text: 'Skip',
              style: 'cancel',
              onPress: () => {
                // Allow app to open even without permission
                onPermissionGranted();
              },
            },
          ]
        );
      } catch (error) {
        Alert.alert(
          'Enable Usage Access',
          'To track your phone activity:\n\n1. Go to Settings\n2. Tap Apps or Application Manager\n3. Find FOMO\n4. Tap App usage access or Special access\n5. Enable "Permit usage access"\n\nThen return to the app.',
          [
            {
              text: 'I\'ve Enabled It',
              onPress: async () => {
                await AsyncStorage.setItem('usage_stats_permission_granted_v2', 'true');
                setTimeout(() => {
                  checkPermissions();
                }, 1000);
              },
            },
            {
              text: 'Skip',
              style: 'cancel',
              onPress: () => {
                onPermissionGranted();
              },
            },
          ]
        );
      }
    } else if (Platform.OS === 'ios') {
      try {
        await Linking.openSettings();
      } catch (e) {
      }
      
      Alert.alert(
        'Enable Permission',
        'Please ensure you have enabled necessary permissions in Settings.',
        [
          {
            text: 'I\'ve Enabled It',
            onPress: async () => {
              await AsyncStorage.setItem('ios_screen_time_enabled_v2', 'true');
              setTimeout(() => {
                onPermissionGranted();
              }, 500);
            },
          },
          {
            text: 'Skip',
            style: 'cancel',
            onPress: () => {
              onPermissionGranted();
            },
          },
        ]
      );
    } else {
      // Web or other - proceed directly
      onPermissionGranted();
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Permission?',
      'You can still use the app, but phone activity tracking will be limited.',
      [
        {
          text: 'Go Back',
          style: 'cancel',
        },
        {
          text: 'Skip',
          onPress: () => {
            onPermissionGranted();
          },
        },
      ]
    );
  };

  if (checking) {
    return (
      <LinearGradient colors={['#1E88E5', '#00BCD4']} style={styles.container}>
        <View style={styles.content}>
          <Image
            source={
              Platform.OS === 'ios'
                ? require('../../../assets/ios/AppIcon~ios-marketing.png')
                : Platform.OS === 'android'
                ? require('../../../assets/android/res/mipmap-xxxhdpi/Fomo.png')
                : require('../../../assets/web/icon-512.png')
            }
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.checkingText}>Checking permissions...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#1E88E5', '#00BCD4']} style={styles.container}>
      <View style={styles.content}>
        <Image
          source={
            Platform.OS === 'ios'
              ? require('../../../assets/ios/AppIcon~ios-marketing.png')
              : Platform.OS === 'android'
              ? require('../../../assets/android/res/mipmap-xxxhdpi/Fomo.png')
              : require('../../../assets/web/icon-512.png')
          }
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.iconContainer}>
          <Ionicons name="phone-portrait-outline" size={64} color="#FFFFFF" />
        </View>

        <Text style={styles.title}>Phone Activity Permission</Text>
        <Text style={styles.description}>
          {Platform.OS === 'ios' 
            ? 'FOMO can track your phone activity to provide personalized insights. Enable Screen Time in Settings for full device tracking.'
            : 'FOMO needs permission to track your phone activity to provide personalized insights and track your app usage.'}
        </Text>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color="#FFFFFF" />
          <Text style={styles.infoText}>
            {Platform.OS === 'ios' 
              ? 'Screen Time allows tracking across all apps. Currently tracking this app\'s usage automatically.'
              : 'This helps us understand your usage patterns and provide better mission recommendations.'}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleRequestPermission}
          >
            <Text style={styles.primaryButtonText}>
              {Platform.OS === 'ios' ? 'Open Settings' : Platform.OS === 'android' ? 'Enable Permission' : 'Continue'}
            </Text>
          </TouchableOpacity>

          {(Platform.OS === 'android' || Platform.OS === 'ios') && (
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
            >
              <Text style={styles.skipButtonText}>Skip for Now</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 32,
  },
  checkingText: {
    ...Typography.body,
    color: '#FFFFFF',
    fontSize: 16,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    ...Typography.headline,
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    ...Typography.body,
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  infoText: {
    ...Typography.body,
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    ...Typography.button,
    color: '#1E88E5',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    ...Typography.body,
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.8,
  },
});
