import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../screens/home/HomeScreen';
import MissionDetailModal from '../../screens/home/MissionDetailModal';
import MissionCompletionModal from '../../screens/home/MissionCompletionModal';
import ProofCaptureScreen from '../../screens/home/ProofCaptureScreen';

const Stack = createNativeStackNavigator();

/**
 * Home Stack Navigator
 * Contains home screen and mission-related modals
 */
export default function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'card',
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen
        name="MissionDetail"
        component={MissionDetailModal}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="MissionCompletion"
        component={MissionCompletionModal}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="ProofCapture"
        component={ProofCaptureScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}
