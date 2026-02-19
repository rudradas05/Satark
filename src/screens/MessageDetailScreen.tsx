import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { ActionButton } from '../components/ActionButton';
import { AppBackground } from '../components/AppBackground';
import { LevelBadge } from '../components/LevelBadge';
import { RiskMeter } from '../components/RiskMeter';
import { MessagesStackParamList } from '../navigation/types';
import { useMessageState } from '../state/MessageState';
import {
  opacity,
  palette,
  radii,
  shadow,
  spacing,
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

  const message = useMemo(
    () => messages.find(item => item.id === messageId),
    [messageId, messages],
  );

  if (!message) {
    return (
      <View style={styles.root}>
        <AppBackground minimal />
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.notFound}>
            <Text style={styles.notFoundTitle}>Message unavailable</Text>
            <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
              <Text style={styles.link}>Go back</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const isSenderBlocked = blocklist.includes(message.sender);

  return (
    <View style={styles.root}>
      <AppBackground />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: spacing.sm }]}>
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={8}
            style={styles.backPill}
          >
            <Text style={styles.backLabel}>Back</Text>
          </Pressable>

          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              Message details
            </Text>
            <Text style={styles.headerSub} numberOfLines={1}>
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
          <View style={styles.card}>
            <View style={styles.cardTopRow}>
              <Text style={styles.sender} numberOfLines={1}>
                {message.sender}
              </Text>
              <Text style={styles.timeInline} numberOfLines={1}>
                {formatMessageTime(message.receivedAt)}
              </Text>
            </View>

            <Text style={styles.body}>{message.body}</Text>
          </View>

          <RiskMeter
            label="Threat score"
            score={message.riskScore}
            confidence={message.confidence}
            level={message.level}
          />

          {/* Reasons / Signals */}
          <View style={styles.card}>
            <Text style={styles.panelTitle}>Flagged signals</Text>

            <View style={styles.reasonsWrap}>
              {message.reasons.map(reason => (
                <View key={reason} style={styles.reasonItem}>
                  <View style={styles.reasonIcon} />
                  <Text style={styles.reasonText}>{reason}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Sticky actions */}
        <View
          style={[
            styles.stickyBar,
            {
              paddingBottom: Math.max(insets.bottom, spacing.md),
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
    backgroundColor: palette.background,
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
    borderWidth: 1,
    borderColor: `rgba(255,255,255,${opacity.subtle})`,
    backgroundColor: `rgba(255,255,255,${opacity.subtle})`,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
  },
  backLabel: {
    color: palette.textPrimary,
    fontFamily: typography.bodyFamily,
    fontSize: typography.label,
    fontWeight: '800',
  },
  headerTitle: {
    color: palette.textPrimary,
    fontFamily: typography.headingFamily,
    fontSize: typography.h3,
    fontWeight: '900',
  },
  headerSub: {
    color: palette.textSecondary,
    fontFamily: typography.bodyFamily,
    fontSize: typography.label,
    marginTop: 2,
  },

  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },

  card: {
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: `rgba(255,255,255,${opacity.subtle})`,
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
    color: palette.textPrimary,
    fontFamily: typography.headingFamily,
    fontSize: typography.h3,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  timeInline: {
    color: palette.textSecondary,
    fontFamily: typography.bodyFamily,
    fontSize: typography.label,
  },
  body: {
    color: palette.textPrimary,
    fontFamily: typography.bodyFamily,
    fontSize: typography.body,
    lineHeight: Math.round(typography.body * typography.lhRelaxed),
  },

  panelTitle: {
    color: palette.textPrimary,
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
    borderColor: `rgba(255,255,255,${opacity.subtle})`,
    backgroundColor: palette.surfaceMuted,
  },
  reasonIcon: {
    width: 10,
    height: 10,
    borderRadius: radii.pill,
    marginTop: 4,
    backgroundColor: palette.suspicious,
  },
  reasonText: {
    flex: 1,
    color: palette.textSecondary,
    fontFamily: typography.bodyFamily,
    fontSize: typography.body,
    lineHeight: Math.round(typography.body * typography.lhRelaxed),
  },

  stickyBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,

    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,

    backgroundColor: `rgba(6, 12, 20, 0.92)`,
    borderTopWidth: 1,
    borderTopColor: `rgba(255,255,255,${opacity.subtle})`,
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
    color: palette.textPrimary,
    fontFamily: typography.headingFamily,
    fontSize: typography.h2,
    marginBottom: spacing.md,
  },
  link: {
    color: palette.accent,
    fontFamily: typography.bodyFamily,
    fontSize: typography.body,
    fontWeight: '800',
  },
});
