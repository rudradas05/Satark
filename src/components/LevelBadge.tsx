import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../state/ThemeState';
import { radii, spacing, typography } from '../theme/tokens';
import { ThreatLevel } from '../types/message';
import { getLevelMap } from '../utils/level';

interface LevelBadgeProps {
  level: ThreatLevel;
  compact?: boolean;
}

export function LevelBadge({ level, compact = false }: LevelBadgeProps) {
  const { palette } = useTheme();
  const meta = getLevelMap(palette)[level];

  return (
    <View
      style={[
        styles.badge,
        compact && styles.badgeCompact,
        {
          backgroundColor: meta.tint,
          borderColor: meta.color + '55',
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: meta.color }]} />
      <Text
        style={[
          styles.label,
          compact && styles.labelCompact,
          { color: meta.color },
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {meta.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    gap: spacing.xs,
    maxWidth: 150,
  },
  badgeCompact: {
    height: 24,
    paddingHorizontal: spacing.xs,
    maxWidth: 120,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: radii.pill,
  },
  label: {
    fontFamily: typography.bodyFamily,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  labelCompact: {
    fontSize: 10,
  },
});
