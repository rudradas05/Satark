import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  ArrowLeft,
  AlertTriangle,
  Link,
  ShieldAlert,
} from 'lucide-react-native';

import { ActionButton } from '../components/ActionButton';
import { AppBackground } from '../components/AppBackground';
import { LevelBadge } from '../components/LevelBadge';
import { RiskMeter } from '../components/RiskMeter';
import { MessagesStackParamList } from '../navigation/types';
import { useMessageState } from '../state/MessageState';
import { useTheme } from '../state/ThemeState';
import {
  opacity,
  radii,
  shadow,
  spacing,
  themedBorder,
  typography,
} from '../theme/tokens';
import { formatMessageTime } from '../utils/time';

type Props = NativeStackScreenProps<MessagesStackParamList, 'MessageDetail'>;

export function MessageDetailScreen({ route, navigation }: Props) {
  const { messageId } = route.params;
  const {
    blocklist,
    markMessageSafe,
    messages,
    reportMessageSpam,
    toggleSenderBlock,
  } = useMessageState();
  const insets = useSafeAreaInsets();
  const { palette, mode } = useTheme();
  const isDark = mode === 'dark';
  const border = themedBorder(isDark);

  const message = useMemo(
    () => messages.find(item => item.id === messageId),
    [messageId, messages],
  );

  if (!message) {
    return (
      <View style={[styles.root, { backgroundColor: palette.background }]}>
        <AppBackground minimal />
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.notFound}>
            <Text
              style={[styles.notFoundTitle, { color: palette.textPrimary }]}
            >
              Message unavailable
            </Text>
            <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
              <Text style={[styles.link, { color: palette.accent }]}>
                Go back
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const isSenderBlocked = blocklist.includes(message.sender);

  return (
    <View style={[styles.root, { backgroundColor: palette.background }]}>
      <AppBackground />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: spacing.sm }]}>
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={8}
            style={[
              styles.backPill,
              {
                borderColor: border,
                backgroundColor: isDark
                  ? `rgba(255,255,255,${opacity.subtle})`
                  : `rgba(0,0,0,0.04)`,
              },
            ]}
          >
            <ArrowLeft
              size={16}
              strokeWidth={2.5}
              color={palette.textPrimary}
            />
          </Pressable>

          <View style={{ flex: 1, minWidth: 0 }}>
            <Text
              style={[styles.headerTitle, { color: palette.textPrimary }]}
              numberOfLines={1}
            >
              Message details
            </Text>
            <Text
              style={[styles.headerSub, { color: palette.textSecondary }]}
              numberOfLines={1}
            >
              {formatMessageTime(message.receivedAt)}
            </Text>
          </View>

          <LevelBadge level={message.level} compact />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            {
              paddingBottom: insets.bottom + 110, // space for sticky actions
            },
          ]}
        >
          {/* Message card */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: palette.surface,
                borderColor: border,
              },
            ]}
          >
            <View style={styles.cardTopRow}>
              <Text
                style={[styles.sender, { color: palette.textPrimary }]}
                numberOfLines={1}
              >
                {message.sender}
              </Text>
              <Text
                style={[styles.timeInline, { color: palette.textSecondary }]}
                numberOfLines={1}
              >
                {formatMessageTime(message.receivedAt)}
              </Text>
            </View>

            <Text style={[styles.body, { color: palette.textPrimary }]}>
              {message.body}
            </Text>
          </View>

          <RiskMeter
            label="Threat score"
            score={message.riskScore}
            confidence={message.confidence}
            level={message.level}
          />

          {/* Reasons / Signals */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: palette.surface,
                borderColor: border,
              },
            ]}
          >
            <Text style={[styles.panelTitle, { color: palette.textPrimary }]}>
              Flagged signals
            </Text>

            <View style={styles.reasonsWrap}>
              {message.reasons.map((reason, index) => (
                <Animated.View
                  key={reason}
                  entering={FadeInDown.duration(300).delay(200 + index * 80)}
                >
                  <View
                    style={[
                      styles.reasonItem,
                      {
                        borderColor: border,
                        backgroundColor: palette.surfaceMuted,
                      },
                    ]}
                  >
                    <View style={styles.reasonIconWrap}>
                      <AlertTriangle
                        size={14}
                        strokeWidth={2.3}
                        color={palette.suspicious}
                      />
                    </View>
                    <Text
                      style={[
                        styles.reasonText,
                        { color: palette.textSecondary },
                      ]}
                    >
                      {reason}
                    </Text>
                  </View>
                </Animated.View>
              ))}
            </View>

            {message.hasLink && (
              <Animated.View
                entering={FadeInDown.duration(300).delay(
                  200 + message.reasons.length * 80,
                )}
              >
                <View style={styles.linkWarning}>
                  <Link size={14} strokeWidth={2.3} color={palette.spam} />
                  <Text
                    style={[styles.linkWarningText, { color: palette.spam }]}
                  >
                    This message contains a link — exercise caution before
                    clicking.
                  </Text>
                </View>
              </Animated.View>
            )}
          </View>
        </ScrollView>

        {/* Sticky actions */}
        <View
          style={[
            styles.stickyBar,
            {
              paddingBottom: Math.max(insets.bottom, spacing.md),
              backgroundColor: isDark
                ? 'rgba(6, 12, 20, 0.92)'
                : 'rgba(246, 248, 252, 0.95)',
              borderTopColor: border,
            },
          ]}
        >
          <View style={styles.actionsRow}>
            <ActionButton
              label="Mark safe"
              variant="primary"
              onPress={() => markMessageSafe(message.id)}
              style={{ flex: 1 }}
            />
            <ActionButton
              label="Report spam"
              variant="danger"
              onPress={() => reportMessageSpam(message.id)}
              style={{ flex: 1 }}
            />
          </View>

          <View style={styles.actionsRow}>
            <ActionButton
              label={isSenderBlocked ? 'Unblock sender' : 'Block sender'}
              onPress={() => toggleSenderBlock(message.sender)}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  backPill: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: typography.headingFamily,
    fontSize: typography.h3,
    fontWeight: '900',
  },
  headerSub: {
    fontFamily: typography.bodyFamily,
    fontSize: typography.label,
    marginTop: 2,
  },

  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },

  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadow.card,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  sender: {
    flex: 1,
    minWidth: 0,
    fontFamily: typography.headingFamily,
    fontSize: typography.h3,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  timeInline: {
    fontFamily: typography.bodyFamily,
    fontSize: typography.label,
  },
  body: {
    fontFamily: typography.bodyFamily,
    fontSize: typography.body,
    lineHeight: Math.round(typography.body * typography.lhRelaxed),
  },

  panelTitle: {
    fontFamily: typography.headingFamily,
    fontSize: typography.h3,
    fontWeight: '900',
    marginBottom: spacing.sm,
  },
  reasonsWrap: {
    gap: spacing.sm,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: 10,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  reasonIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(246, 178, 78, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  reasonText: {
    flex: 1,
    fontFamily: typography.bodyFamily,
    fontSize: typography.body,
    lineHeight: Math.round(typography.body * typography.lhRelaxed),
  },
  linkWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: 'rgba(255, 99, 99, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 99, 99, 0.2)',
  },
  linkWarningText: {
    flex: 1,
    fontFamily: typography.bodyFamily,
    fontSize: typography.label,
    fontWeight: '700',
  },

  stickyBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,

    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,

    borderTopWidth: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },

  notFound: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  notFoundTitle: {
    fontFamily: typography.headingFamily,
    fontSize: typography.h2,
    marginBottom: spacing.md,
  },
  link: {
    fontFamily: typography.bodyFamily,
    fontSize: typography.body,
    fontWeight: '800',
  },
});
