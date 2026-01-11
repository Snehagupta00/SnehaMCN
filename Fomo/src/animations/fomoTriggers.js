import React from 'react';
import { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, interpolate, Extrapolate } from 'react-native-reanimated';

/**
 * FOMO Animation Library
 * Micro-interactions to create urgency and engagement
 */

/**
 * TRIGGER 1: Pulsing Border (Mission expiring <1 hour)
 */
export const usePulsingBorder = (isActive) => {
  const pulseValue = useSharedValue(0);

  React.useEffect(() => {
    if (isActive) {
      pulseValue.value = withRepeat(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      pulseValue.value = 0;
    }
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => {
    const borderWidth = interpolate(
      pulseValue.value,
      [0, 1],
      [2, 4],
      Extrapolate.CLAMP
    );

    return {
      borderWidth,
      borderColor: `rgba(255, 82, 82, ${0.5 + pulseValue.value * 0.5})`,
    };
  });

  return animatedStyle;
};

/**
 * TRIGGER 2: Blinking Warning Icon (<30 min)
 */
export const useBlinkingIcon = (isCritical) => {
  const blinkValue = useSharedValue(0);

  React.useEffect(() => {
    if (isCritical) {
      blinkValue.value = withRepeat(
        withTiming(1, { duration: 600, easing: Easing.linear }),
        -1,
        true
      );
    } else {
      blinkValue.value = 0;
    }
  }, [isCritical]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: blinkValue.value === 0 ? 0.3 : 1,
    };
  });

  return animatedStyle;
};

/**
 * TRIGGER 3: Scale-Up Animation (Countdown numbers)
 */
export const useCountdownScale = (timeLeft) => {
  const scaleValue = useSharedValue(1);

  React.useEffect(() => {
    // Trigger scale animation every second when <10 min left
    if (timeLeft < 600000) {
      scaleValue.value = withTiming(0.95, { duration: 300 });
      scaleValue.value = withTiming(1.05, { duration: 300 });
    }
  }, [timeLeft]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }],
    };
  });

  return animatedStyle;
};

/**
 * TRIGGER 4: Shake Animation (Mission about to expire)
 */
export const useShakeAnimation = (shouldShake) => {
  const shakeValue = useSharedValue(0);

  React.useEffect(() => {
    if (shouldShake) {
      shakeValue.value = withRepeat(
        withTiming(1, { duration: 200, easing: Easing.linear }),
        4, // 4 shakes
        true
      );
    } else {
      shakeValue.value = 0;
    }
  }, [shouldShake]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      shakeValue.value,
      [0, 0.25, 0.5, 0.75, 1],
      [0, -10, 10, -10, 0],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateX }],
    };
  });

  return animatedStyle;
};

/**
 * TRIGGER 5: Progress Bar Fill (Real-time completion %)
 */
export const useProgressBarAnimation = (completionPercent) => {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withTiming(completionPercent / 100, {
      duration: 800,
      easing: Easing.out(Easing.ease),
    });
  }, [completionPercent]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  return animatedStyle;
};

/**
 * TRIGGER 6: Streak Number Pop (When streak increments)
 */
export const useStreakPopAnimation = (streakCount) => {
  const popValue = useSharedValue(0);

  React.useEffect(() => {
    // Trigger pop animation when streak changes
    popValue.value = withTiming(1, { duration: 500, easing: Easing.bounce });
  }, [streakCount]);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      popValue.value,
      [0, 0.5, 1],
      [0.8, 1.2, 1],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
    };
  });

  return animatedStyle;
};

/**
 * TRIGGER 7: Coin Earning Animation
 */
export const useCoinEarningAnimation = (shouldAnimate) => {
  const coinValue = useSharedValue(0);

  React.useEffect(() => {
    if (shouldAnimate) {
      coinValue.value = withTiming(1, { duration: 500, easing: Easing.bounce });
    } else {
      coinValue.value = 0;
    }
  }, [shouldAnimate]);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      coinValue.value,
      [0, 0.5, 1],
      [0.5, 1.3, 1],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      coinValue.value,
      [0, 1],
      [0, -20],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }, { translateY }],
      opacity: coinValue.value,
    };
  });

  return animatedStyle;
};
