import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../state/ThemeState';
import {
  opacity,
  radii,
  shadow,
  spacing,
  typography,
} from '../theme/tokens';
import { MessageRecord } from '../types/message';
import { formatMessageTime } from '../utils/time';
import { LevelBadge } from './LevelBadge';

interface MessageCardProps {
  message: MessageRecord;
  delay?: number;
  onPress: () => void;
}

export function MessageCard({ message, delay = 0, onPress }: MessageCardProps) {
  const { palette } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [
        styles.pressWrap,
        pressed && {
          transform: [{ scale: 0.99 }],
          opacity: 0.95,
        },
      ]}
    >
      <View style={[styles.card, { backgroundColor: palette.surface, borderColor: `rgba(255,255,255,${opacity.subtle})` }]}>
        {/* Top row: Sender + Time */}
        <View style={styles.topRow}>
          <Text style={[styles.sender, { color: palette.textPrimary }]} numberOfLines={1} ellipsizeMode="tail">
            {message.sender}
          </Text>
          <Text style={[styles.time, { color: palette.textSecondary }]} numberOfLines={1}>
            {formatMessageTime(message.receivedAt)}
          </Text>
        </View>

        {/* Badge row */}
        <View style={styles.badgeRow}>
          <LevelBadge level={message.level} compact />
          <Text style={[styles.risk, { color: palette.textSecondary }]} numberOfLines={1}>
            {message.riskScore}% risk
          </Text>
        </View>

        {/* Preview */}
        <Text style={[styles.preview, { color: palette.textSecondary }]} numberOfLines={2} ellipsizeMode="tail">
          {message.preview}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressWrap: {
    marginBottom: spacing.sm,
  },
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.md,
    ...shadow.card,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing.sm,
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
});