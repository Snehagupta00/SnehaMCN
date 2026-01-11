import { Animated } from 'react-native';

/**
 * Animation Utilities
 * Reusable animation functions matching the UI specifications
 */

/**
 * Slide up and fade animation (300ms)
 * Used for mission card entry
 */
export const slideUpFade = (animatedValue, callback) => {
  animatedValue.setValue(0);
  Animated.parallel([
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }),
  ]).start(callback);
};

/**
 * Bounce coin animation (500ms)
 * Used when coins are earned
 */
export const bounceCoin = (animatedValue, callback) => {
  Animated.sequence([
    Animated.timing(animatedValue, {
      toValue: 1.2,
      duration: 250,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }),
  ]).start(callback);
};

/**
 * Pulse animation
 * Used for urgent missions and FOMO triggers
 */
export const pulse = (animatedValue, min = 1, max = 1.1, duration = 1000) => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: max,
        duration: duration / 2,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: min,
        duration: duration / 2,
        useNativeDriver: true,
      }),
    ])
  );
};

/**
 * Blink animation
 * Used for warning icons
 */
export const blink = (animatedValue, duration = 500) => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 0.3,
        duration: duration / 2,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: duration / 2,
        useNativeDriver: true,
      }),
    ])
  );
};
