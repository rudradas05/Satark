import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Ban,
  AlertTriangle,
  ShieldAlert,
  ScanLine,
  type LucideIcon,
} from 'lucide-react-native';

import { useTheme } from '../state/ThemeState';
import { radii, shadow, spacing, typography } from '../theme/tokens';

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
  icon: LucideIcon;
}

const getToneMap = (palette: any): Record<Tone, ToneTheme> => ({
  neutral: {
    border: palette.mode === 'dark' ? '#49B7FF' : '#0066CC',
    tint: palette.mode === 'dark' ? 'rgba(73, 183, 255, 0.12)' : '#E6EFF9',
    valueColor: palette.mode === 'dark' ? '#49B7FF' : '#0066CC',
    icon: ScanLine,
  },
  safe: {
    border: palette.mode === 'dark' ? '#2ED8A1' : '#00A66B',
    tint: palette.mode === 'dark' ? 'rgba(46, 216, 161, 0.12)' : '#E4F5ED',
    valueColor: palette.mode === 'dark' ? '#2ED8A1' : '#00A66B',
    icon: Ban,
  },
  suspicious: {
    border: palette.mode === 'dark' ? '#F6B24E' : '#D97706',
    tint: palette.mode === 'dark' ? 'rgba(246, 178, 78, 0.12)' : '#FBF3E4',
    valueColor: palette.mode === 'dark' ? '#F6B24E' : '#D97706',
    icon: AlertTriangle,
  },
  spam: {
    border: palette.mode === 'dark' ? '#FF6363' : '#DC2626',
    tint: palette.mode === 'dark' ? 'rgba(255, 99, 99, 0.12)' : '#FBE7E7',
    valueColor: palette.mode === 'dark' ? '#FF6363' : '#DC2626',
    icon: ShieldAlert,
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
  const Icon = theme.icon;

  const isDark = mode === 'dark';

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
        isDark ? shadow.card : null,
      ]}
    >
      <View style={styles.inner}>
        <View style={styles.topRow}>
          <Text
            style={[styles.label, { color: palette.textSecondary }]}
            numberOfLines={1}
          >
            {label}
          </Text>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: `${theme.valueColor}18` },
            ]}
          >
            <Icon size={14} strokeWidth={2.3} color={theme.valueColor} />
          </View>
        </View>

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
    minHeight: 100,
    borderRadius: radii.lg,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  inner: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    flex: 1,
    fontFamily: typography.bodyFamily,
    fontSize: typography.label,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontFamily: typography.headingFamily,
    fontSize: 30,
    fontWeight: '900',
    lineHeight: Math.round(30 * typography.lhTight),
    marginTop: spacing.xs,
  },
});
