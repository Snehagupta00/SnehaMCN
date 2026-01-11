import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getApiUrl = () => {
  const devServerHostname = Constants.expoConfig?.hostUri?.split(':')[0];
  const isPhysicalDevice = Constants.executionEnvironment === 'storeClient' || 
                           Constants.executionEnvironment === 'standalone';
  const useNetworkIP = isPhysicalDevice && devServerHostname && devServerHostname !== 'localhost' && devServerHostname !== '127.0.0.1';

  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) {
    let url = envUrl;
    if (url.startsWith('https://localhost') || url.startsWith('https://127.0.0.1')) {
      url = url.replace('https://', 'http://');
    }
    if (Platform.OS === 'android' && url.includes('localhost')) {
      if (useNetworkIP && devServerHostname) {
        url = url.replace('localhost', devServerHostname);
      } else {
        url = url.replace('localhost', '10.0.2.2');
      }
    }
    if (Platform.OS === 'ios' && (url.includes('localhost') || url.includes('127.0.0.1'))) {
      if (useNetworkIP && devServerHostname) {
        url = url.replace(/localhost|127\.0\.0\.1/g, devServerHostname);
      }
    }
    return url;
  }

  if (__DEV__) {
    if (Platform.OS === 'web') {
      return 'http://localhost:3000/api/v1';
    }
    
    if (Platform.OS === 'android') {
      if (useNetworkIP && devServerHostname) {
        return `http://${devServerHostname}:3000/api/v1`;
      }
      return 'http://10.0.2.2:3000/api/v1';
    }
    
    if (Platform.OS === 'ios') {
      if (useNetworkIP && devServerHostname) {
        return `http://${devServerHostname}:3000/api/v1`;
      }
      return 'http://127.0.0.1:3000/api/v1';
    }
  }

  return 'http://127.0.0.1:3000/api/v1';
};

export const API_BASE_URL = getApiUrl();
