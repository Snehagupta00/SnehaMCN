import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Image, Platform } from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/store';
import RootNavigator from './src/navigation/RootNavigator';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { restoreSession, logout } from './src/store/slices/authSlice';
import * as Font from 'expo-font';
import PhoneActivityService from './src/services/PhoneActivityService';
import PermissionCheckScreen from './src/screens/auth/PermissionCheckScreen';

function AppContent() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [permissionChecked, setPermissionChecked] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    PhoneActivityService.setLogoutHandler(() => {
      dispatch(logout());
    });
    initializeApp();
  }, [dispatch]);

  const initializeApp = async () => {
    await loadFonts();
    await checkPermissions();
  };

  const checkPermissions = async () => {
    try {
      const permissionKey = Platform.OS === 'android' 
        ? 'usage_stats_permission_granted_v2' 
        : 'ios_screen_time_enabled_v2';
      const permissionPreference = await AsyncStorage.getItem(permissionKey);
      
      if (!permissionPreference || permissionPreference !== 'true') {
        setPermissionChecked(true);
        setIsLoading(false);
        return;
      }
      
      const permission = await PhoneActivityService.requestPermissions();
      
      if (permission.granted && permissionPreference === 'true') {
        setPermissionGranted(true);
        setPermissionChecked(true);
        await restoreAuthSession();
        PhoneActivityService.startTracking();
        return;
      }
      
      if (permission.needsManualGrant || !permission.granted) {
        setPermissionChecked(true);
        setIsLoading(false);
        return;
      }
      
      setPermissionChecked(true);
      setIsLoading(false);
    } catch (error) {
      setPermissionChecked(true);
      setIsLoading(false);
    }
  };

  const handlePermissionGranted = async () => {
    setPermissionGranted(true);
    await restoreAuthSession();
    PhoneActivityService.startTracking();
  };

  const loadFonts = async () => {
    try {
      await Font.loadAsync({
        'Poppins-Regular': require('./assets/Fonts/Poppins/Poppins-Regular.ttf'),
        'Poppins-Medium': require('./assets/Fonts/Poppins/Poppins-Medium.ttf'),
        'Poppins-SemiBold': require('./assets/Fonts/Poppins/Poppins-SemiBold.ttf'),
        'Poppins-Bold': require('./assets/Fonts/Poppins/Poppins-Bold.ttf'),
        'Poppins-ExtraBold': require('./assets/Fonts/Poppins/Poppins-ExtraBold.ttf'),
        'Roboto-Regular': require('./assets/Fonts/Roboto/static/Roboto-Regular.ttf'),
        'Roboto-Medium': require('./assets/Fonts/Roboto/static/Roboto-Medium.ttf'),
        'Roboto-Bold': require('./assets/Fonts/Roboto/static/Roboto-Bold.ttf'),
      });
      setFontsLoaded(true);
    } catch (error) {
      setFontsLoaded(true); 
    }
  };

  const restoreAuthSession = async () => {
    try {
      const [token, userData] = await Promise.all([
        AsyncStorage.getItem('auth_token'),
        AsyncStorage.getItem('user_data'),
      ]);

      if (token && userData) {
        const user = JSON.parse(userData);
        dispatch(restoreSession({ user, token }));
      }
    } catch (error) {
      await AsyncStorage.multiRemove(['auth_token', 'user_data']);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      PhoneActivityService.stopTracking();
    };
  }, []);

  if (!fontsLoaded || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Image
          source={
            Platform.OS === 'ios'
              ? require('./assets/ios/AppIcon~ios-marketing.png')
              : Platform.OS === 'android'
              ? require('./assets/android/res/mipmap-xxxhdpi/Fomo.png')
              : require('./assets/web/icon-512.png')
          }
          style={styles.splashIcon}
          resizeMode="contain"
        />
        <ActivityIndicator size="large" color="#1E88E5" style={styles.loader} />
      </View>
    );
  }

  if (permissionChecked && !permissionGranted) {
    return (
      <>
        <StatusBar style="light" />
        <PermissionCheckScreen onPermissionGranted={handlePermissionGranted} />
      </>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E88E5',
  },
  splashIcon: {
    width: 120,
    height: 120,
    marginBottom: 32,
  },
  loader: {
    marginTop: 16,
  },
});
