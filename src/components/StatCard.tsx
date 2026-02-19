import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useTheme } from '../state/ThemeState';
import {
  radii,
  shadow,
  spacing,
  typography,
} from '../theme/tokens';

type Tone = 'neutral' | 'safe' | 'suspicious' | 'spam';

interface StatCardProps {
  label: string;
  value: string;
  tone?: Tone;
  delay?: number;
}

interface ToneTheme {
  border: string;
  tint: string;
  valueColor: string;
}

const getToneMap = (palette: any): Record<Tone, ToneTheme> => ({
  neutral: {
    border: palette.mode === 'dark' ? '#49B7FF' : '#0066CC',
    tint: palette.mode === 'dark' ? 'rgba(73, 183, 255, 0.12)' : 'rgba(0, 102, 204, 0.08)',
    valueColor: palette.mode === 'dark' ? '#49B7FF' : '#0066CC',
  },
  safe: {
    border: palette.mode === 'dark' ? '#2ED8A1' : '#00A66B',
    tint: palette.mode === 'dark' ? 'rgba(46, 216, 161, 0.12)' : 'rgba(0, 166, 107, 0.08)',
    valueColor: palette.mode === 'dark' ? '#2ED8A1' : '#00A66B',
  },
  suspicious: {
    border: palette.mode === 'dark' ? '#F6B24E' : '#D97706',
    tint: palette.mode === 'dark' ? 'rgba(246, 178, 78, 0.12)' : 'rgba(217, 119, 6, 0.08)',
    valueColor: palette.mode === 'dark' ? '#F6B24E' : '#D97706',
  },
  spam: {
    border: palette.mode === 'dark' ? '#FF6363' : '#DC2626',
    tint: palette.mode === 'dark' ? 'rgba(255, 99, 99, 0.12)' : 'rgba(220, 38, 38, 0.08)',
    valueColor: palette.mode === 'dark' ? '#FF6363' : '#DC2626',
  },
});

export function StatCard({
  label,
  value,
  tone = 'neutral',
  delay = 0,
}: StatCardProps) {
  const { palette, mode } = useTheme();
  const toneMap = getToneMap({ ...palette, mode });
  const theme = toneMap[tone];

  return (
    <Animated.View
      entering={FadeInDown.duration(420).delay(delay)}
      style={[
        styles.card,
        {
          backgroundColor: theme.tint,
          borderColor: theme.border,
          borderWidth: 1.5,
        },
      ]}
    >
      <View style={styles.inner}>
        <Text style={[styles.label, { color: palette.textSecondary }]} numberOfLines={1}>
          {label}
        </Text>

        <Text
          style={[styles.value, { color: theme.valueColor }]}
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: '48%',
    minHeight: 92,
    borderRadius: radii.lg,
    padding: spacing.md,
    justifyContent: 'space-between',
    ...shadow.card,
  },
  inner: {
    flex: 1,
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: typography.bodyFamily,
    fontSize: typography.label,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  value: {
    fontFamily: typography.headingFamily,
    fontSize: 28,
    fontWeight: '900',
    lineHeight: Math.round(28 * typography.lhTight),
  },
});