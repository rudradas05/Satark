import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../state/ThemeState';

interface AppBackgroundProps {
  minimal?: boolean;
}

export function AppBackground({ minimal }: AppBackgroundProps) {
  const { palette, mode } = useTheme();
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.15, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const isDark = mode === 'dark';

  return (
    <View
      style={[
        styles.container,
        minimal && styles.minimal,
        { backgroundColor: palette.background },
      ]}
    >
      <View
        style={[styles.gradient, { backgroundColor: palette.background }]}
      />
      {!minimal && (
        <>
          <Animated.View
            style={[
              styles.accent1,
              pulseStyle,
              {
                backgroundColor: isDark
                  ? 'rgba(73, 183, 255, 0.07)'
                  : 'rgba(0, 102, 204, 0.05)',
              },
            ]}
          />
          <View
            style={[
              styles.accent2,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 99, 99, 0.05)'
                  : 'rgba(220, 38, 38, 0.04)',
              },
            ]}
          />
          <View
            style={[
              styles.accent3,
              {
                backgroundColor: isDark
                  ? 'rgba(46, 216, 161, 0.04)'
                  : 'rgba(0, 166, 107, 0.03)',
              },
            ]}
          />
          {/* Subtle grid overlay for depth */}
          <View
            style={[
              styles.gridOverlay,
              {
                borderColor: isDark
                  ? 'rgba(255,255,255,0.02)'
                  : 'rgba(0,0,0,0.02)',
              },
            ]}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  minimal: {
    opacity: 0.5,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  accent1: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: 170,
    top: -120,
    right: -80,
  },
  accent2: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    bottom: -60,
    left: -60,
  },
  accent3: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    top: '40%',
    left: '50%',
    marginLeft: -90,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 0.5,
    opacity: 0.3,
  },
});
