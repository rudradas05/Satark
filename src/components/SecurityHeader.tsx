import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { useTheme } from '../state/ThemeState';
import { opacity, radii, spacing, typography } from '../theme/tokens';

type StatusTone = 'safe' | 'suspicious' | 'spam' | 'neutral';

interface SecurityHeaderProps {
  title: string;
  subtitle: string;
  statusLabel?: string;
  statusTone?: StatusTone;
}

interface ToneColor {
  dot: string;
  text: string;
  bg: string;
  border: string;
}

function getToneColors(tone: StatusTone, palette: any): ToneColor {
  switch (tone) {
    case 'safe':
      return {
        dot: palette.safe,
        text: palette.safe,
        bg: `rgba(46, 216, 161, ${opacity.muted})`,
        border: `rgba(46, 216, 161, 0.38)`,
      };
    case 'suspicious':
      return {
        dot: palette.suspicious,
        text: palette.suspicious,
        bg: `rgba(246, 178, 78, ${opacity.muted})`,
        border: `rgba(246, 178, 78, 0.38)`,
      };
    case 'spam':
      return {
        dot: palette.spam,
        text: palette.spam,
        bg: `rgba(255, 99, 99, ${opacity.muted})`,
        border: `rgba(255, 99, 99, 0.38)`,
      };
    default:
      return {
        dot: palette.accent,
        text: palette.textPrimary,
        bg: `rgba(255, 255, 255, ${opacity.subtle})`,
        border: palette.border,
      };
  }
}

export function SecurityHeader({
  title,
  subtitle,
  statusLabel = 'Frontend Secure Mode',
  statusTone = 'safe',
}: SecurityHeaderProps) {
  const { palette } = useTheme();
  const tone = getToneColors(statusTone, palette);

  return (
    <View style={styles.row}>
      <View style={styles.textBlock}>
        <Text style={[styles.subtitle, { color: palette.textSecondary }]} numberOfLines={1}>
          {subtitle}
        </Text>
        <Text style={[styles.title, { color: palette.textPrimary }]} numberOfLines={2}>
          {title}
        </Text>
      </View>

      <Animated.View
        entering={FadeIn.duration(500).withInitialValues({
          opacity: 0,
          transform: [{ scale: 0.92 }],
        })}
        style={[
          styles.chip,
          { backgroundColor: tone.bg, borderColor: tone.border },
        ]}
      >
        <View style={[styles.indicator, { backgroundColor: tone.dot }]} />
        <Text
          style={[styles.chipLabel, { color: tone.text }]}
          numberOfLines={1}
        >
          {statusLabel}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
  },
  subtitle: {
    fontFamily: typography.bodyFamily,
    fontSize: typography.label,
    letterSpacing: 0.9,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: typography.headingFamily,
    fontSize: typography.h2,
    fontWeight: '800',
    letterSpacing: 0.2,
    lineHeight: Math.round(typography.h2 * typography.lhTight),
  },
  chip: {
    alignItems: 'center',
    borderRadius: radii.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xxs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    maxWidth: 170,
  },
  indicator: {
    borderRadius: radii.pill,
    height: 8,
    width: 8,
  },
  chipLabel: {
    fontFamily: typography.bodyFamily,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});