import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../state/ThemeState';

interface AppBackgroundProps {
  minimal?: boolean;
}

export function AppBackground({ minimal }: AppBackgroundProps) {
  const { palette } = useTheme();

  return (
    <View style={[styles.container, minimal && styles.minimal, { backgroundColor: palette.background }]}>
      <View style={[styles.gradient, { backgroundColor: palette.background }]} />
      {!minimal && <View style={styles.accent1} />}
      {!minimal && <View style={styles.accent2} />}
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
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(73, 183, 255, 0.08)',
    top: -100,
    right: -100,
  },
  accent2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 99, 99, 0.06)',
    bottom: -50,
    left: -50,
  },
});