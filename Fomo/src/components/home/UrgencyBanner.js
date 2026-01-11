import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Urgency Banner Component
 * FOMO trigger - shows when missions are about to expire
 * Blinks warning icon when <30 minutes
 */
export default function UrgencyBanner({ hoursLeft }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const minutesLeft = hoursLeft * 60;

  useEffect(() => {
    if (hoursLeft <= 2) {
      // Pulsing animation for banner
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }

    // Blinking animation for warning icon when <30 min
    if (minutesLeft <= 30) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(blinkAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [hoursLeft, minutesLeft, pulseAnim, blinkAnim]);

  if (hoursLeft > 2) return null;

  const displayText =
    hoursLeft < 1
      ? `Only ${Math.floor(minutesLeft)} minutes left!`
      : `Only ${Math.floor(hoursLeft)} hours left!`;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: pulseAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        <Animated.View style={{ opacity: blinkAnim }}>
          <Ionicons name="warning" size={20} color="#FF5252" />
        </Animated.View>
        <Text style={styles.text}>⏱️ {displayText}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FF5252',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FF1744',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});
