import React from 'react';
import { Image, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * App Icon Component
 * Uses custom icons from assets folder (iOS/Android/Web) when available
 * Falls back to Ionicons for UI-specific icons
 * 
 * @param {string} name - Icon name (e.g., 'home', 'wallet', 'streak', 'profile', 'analytics', 'menu', 'settings', 'app', 'logo', 'fomo', 'splash')
 * @param {number} size - Icon size (default: 24)
 * @param {string} color - Icon color
 * @param {Object} style - Additional styles
 */
export default function AppIcon({ name, size = 24, color = '#424242', style }) {
  // Icons that should use the app icon from platform-specific assets
  const appIconNames = ['app', 'logo', 'fomo'];
  const splashIconName = 'splash';
  
  // Get platform-specific app icon
  const getAppIconSource = () => {
    if (Platform.OS === 'ios') {
      return require('../../../assets/ios/AppIcon~ios-marketing.png');
    } else if (Platform.OS === 'android') {
      return require('../../../assets/android/res/mipmap-xxxhdpi/Fomo.png');
    } else {
      // Web
      return require('../../../assets/web/icon-512.png');
    }
  };

  // Get splash icon source
  const getSplashIconSource = () => {
    if (Platform.OS === 'ios') {
      return require('../../../assets/ios/AppIcon~ios-marketing.png');
    } else if (Platform.OS === 'android') {
      return require('../../../assets/android/res/mipmap-xxxhdpi/Fomo.png');
    } else {
      return require('../../../assets/web/icon-512.png');
    }
  };
  
  // Check if this should use the app icon
  if (appIconNames.includes(name.toLowerCase())) {
    return (
      <Image
        source={getAppIconSource()}
        style={[
          styles.icon,
          { width: size, height: size },
          style,
        ]}
        resizeMode="contain"
      />
    );
  }

  // Check if this should use the splash icon
  if (name.toLowerCase() === splashIconName) {
    return (
      <Image
        source={getSplashIconSource()}
        style={[
          styles.icon,
          { width: size, height: size },
          style,
        ]}
        resizeMode="contain"
      />
    );
  }

  // For UI icons (menu, settings, navigation), use Ionicons
  // Map common icon names to Ionicons
  const iconMap = {
    // Tab bar icons
    'home': 'home',
    'home-outline': 'home-outline',
    'wallet': 'wallet',
    'wallet-outline': 'wallet-outline',
    'streak': 'flame',
    'streak-outline': 'flame-outline',
    'flame': 'flame',
    'flame-outline': 'flame-outline',
    'profile': 'person',
    'profile-outline': 'person-outline',
    'person': 'person',
    'person-outline': 'person-outline',
    'analytics': 'stats-chart',
    'analytics-outline': 'stats-chart-outline',
    'stats-chart': 'stats-chart',
    'stats-chart-outline': 'stats-chart-outline',
    
    // Menu & Navigation icons
    'menu': 'menu',
    'close': 'close',
    'settings': 'settings',
    'settings-outline': 'settings-outline',
    'help': 'help-circle',
    'help-circle-outline': 'help-circle-outline',
    'share': 'share',
    'share-outline': 'share-outline',
    'star': 'star',
    'star-outline': 'star-outline',
    'arrow-back': 'arrow-back',
    'chevron-forward': 'chevron-forward',
    'chevron-back': 'chevron-back',
  };

  const iconName = iconMap[name] || name;

  return (
    <Ionicons
      name={iconName}
      size={size}
      color={color}
      style={style}
    />
  );
}

const styles = StyleSheet.create({
  icon: {
    resizeMode: 'contain',
  },
});
