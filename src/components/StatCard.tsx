import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import {
  opacity,
  palette,
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

const toneMap: Record<
  Tone,
  { border: string; tint: string; valueColor: string }
> = {
  neutral: {
    border: `rgba(255,255,255,${opacity.subtle})`,
    tint: palette.surface,
    valueColor: palette.accent,
  },
  safe: {
    border: 'rgba(46, 216, 161, 0.45)',
    tint: 'rgba(46, 216, 161, 0.08)',
    valueColor: palette.safe,
  },
  suspicious: {
    border: 'rgba(246, 178, 78, 0.45)',
    tint: 'rgba(246, 178, 78, 0.08)',
    valueColor: palette.suspicious,
  },
  spam: {
    border: 'rgba(255, 99, 99, 0.45)',
    tint: 'rgba(255, 99, 99, 0.08)',
    valueColor: palette.spam,
  },
};

export function StatCard({
  label,
  value,
  tone = 'neutral',
  delay = 0,
}: StatCardProps) {
  const theme = toneMap[tone];

  return (
    <Animated.View
      entering={FadeInDown.duration(420).delay(delay)}
      style={[
        styles.card,
        {
          backgroundColor: theme.tint,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={styles.inner}>
        <Text style={styles.label} numberOfLines={1}>
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
    borderWidth: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
    ...shadow.card,
  },
  inner: {
    flex: 1,
    justifyContent: 'space-between',
  },
  label: {
    color: palette.textSecondary,
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
