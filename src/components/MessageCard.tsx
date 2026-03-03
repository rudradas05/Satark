import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react-native';

import { useTheme } from '../state/ThemeState';
import { opacity, radii, shadow, spacing, typography } from '../theme/tokens';
import { MessageRecord, ThreatLevel } from '../types/message';
import { formatMessageTime } from '../utils/time';
import { LevelBadge } from './LevelBadge';

interface MessageCardProps {
  message: MessageRecord;
  delay?: number;
  onPress: () => void;
}

function ThreatIcon({ level, color }: { level: ThreatLevel; color: string }) {
  const size = 16;
  const strokeWidth = 2.3;
  switch (level) {
    case 'spam':
      return (
        <ShieldAlert size={size} strokeWidth={strokeWidth} color={color} />
      );
    case 'suspicious':
      return (
        <AlertTriangle size={size} strokeWidth={strokeWidth} color={color} />
      );
    default:
      return (
        <CheckCircle size={size} strokeWidth={strokeWidth} color={color} />
      );
  }
}

const accentColorMap: Record<ThreatLevel, { dark: string; light: string }> = {
  safe: { dark: '#2ED8A1', light: '#00A66B' },
  suspicious: { dark: '#F6B24E', light: '#D97706' },
  spam: { dark: '#FF6363', light: '#DC2626' },
};

export function MessageCard({ message, delay = 0, onPress }: MessageCardProps) {
  const { palette, mode } = useTheme();
  const isDark = mode === 'dark';
  const accentColor = accentColorMap[message.level][isDark ? 'dark' : 'light'];

  return (
    <Animated.View entering={FadeInDown.duration(350).delay(delay)}>
      <Pressable
        onPress={onPress}
        hitSlop={6}
        style={({ pressed }) => [
          styles.pressWrap,
          pressed && {
            transform: [{ scale: 0.985 }],
            opacity: 0.92,
          },
        ]}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: palette.surface,
              borderColor: isDark
                ? `rgba(255,255,255,${opacity.subtle})`
                : 'rgba(0,0,0,0.08)',
            },
          ]}
        >
          {/* Colored left accent bar */}
          <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

          <View style={styles.cardContent}>
            {/* Top row: Sender + Time */}
            <View style={styles.topRow}>
              <View style={styles.senderRow}>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: accentColor + '18' },
                  ]}
                >
                  <ThreatIcon level={message.level} color={accentColor} />
                </View>
                <Text
                  style={[styles.sender, { color: palette.textPrimary }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {message.sender}
                </Text>
              </View>
              <Text
                style={[styles.time, { color: palette.textSecondary }]}
                numberOfLines={1}
              >
                {formatMessageTime(message.receivedAt)}
              </Text>
            </View>

            {/* Badge row */}
            <View style={styles.badgeRow}>
              <LevelBadge level={message.level} compact />
              <Text
                style={[styles.risk, { color: palette.textSecondary }]}
                numberOfLines={1}
              >
                {message.riskScore}% risk
              </Text>
            </View>

            {/* Preview */}
            <Text
              style={[styles.preview, { color: palette.textSecondary }]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {message.preview}
            </Text>

            {/* Link indicator */}
            {message.hasLink && (
              <View
                style={[
                  styles.linkBadge,
                  {
                    backgroundColor: `${accentColor}14`,
                    borderColor: `${accentColor}30`,
                  },
                ]}
              >
                <Text style={[styles.linkText, { color: accentColor }]}>
                  Contains link
                </Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pressWrap: {
    marginBottom: spacing.sm,
    marginHorizontal: spacing.md,
  },
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    ...shadow.card,
  },
  accentBar: {
    width: 4,
    borderTopLeftRadius: radii.lg,
    borderBottomLeftRadius: radii.lg,
  },
  cardContent: {
    flex: 1,
    padding: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  senderRow: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sender: {
    flex: 1,
    minWidth: 0,
    fontFamily: typography.headingFamily,
    fontSize: typography.h3,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  time: {
    fontFamily: typography.bodyFamily,
    fontSize: typography.label,
  },
  badgeRow: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  risk: {
    fontFamily: typography.bodyFamily,
    fontSize: typography.label,
  },
  preview: {
    marginTop: spacing.sm,
    fontFamily: typography.bodyFamily,
    fontSize: typography.body,
    lineHeight: Math.round(typography.body * typography.lhRelaxed),
  },
  linkBadge: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
  },
  linkText: {
    fontFamily: typography.bodyFamily,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});
