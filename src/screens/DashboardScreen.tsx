import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBackground } from '../components/AppBackground';
import { RiskMeter } from '../components/RiskMeter';
import { SecurityHeader } from '../components/SecurityHeader';
import { StatCard } from '../components/StatCard';
import { useMessageState } from '../state/MessageState';
import { opacity, palette, radii, shadow, spacing, typography } from '../theme/tokens';
import { levelMap } from '../utils/level';

function riskTone(value: number): 'safe' | 'suspicious' | 'spam' {
  if (value >= 75) return 'spam';
  if (value >= 45) return 'suspicious';
  return 'safe';
}

export function DashboardScreen() {
  const { messages, stats } = useMessageState();
  const insets = useSafeAreaInsets();

  const topAlerts = useMemo(
    () =>
      messages
        .filter(message => message.level !== 'safe')
        .sort((a, b) => b.riskScore - a.riskScore)
        .slice(0, 3),
    [messages],
  );

  const globalRiskLevel = riskTone(stats.riskIndex);

  return (
    <View style={styles.root}>
      <AppBackground />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + spacing['2xl'] },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <SecurityHeader
            subtitle="Satark Security Console"
            title="Threat Dashboard"
            statusTone={globalRiskLevel}
            statusLabel={
              globalRiskLevel === 'spam'
                ? 'High risk environment'
                : globalRiskLevel === 'suspicious'
                ? 'Elevated risk'
                : 'Secure mode'
            }
          />

          <RiskMeter
            label="Global risk index"
            score={stats.riskIndex}
            confidence={0.94}
            level={globalRiskLevel}
          />

          <View style={styles.grid}>
            <StatCard
              label="Total scanned"
              value={String(stats.totalScanned)}
              tone="neutral"
              delay={80}
            />
            <StatCard
              label="Spam detected"
              value={String(stats.spamCount)}
              tone="spam"
              delay={140}
            />
            <StatCard
              label="Suspicious"
              value={String(stats.suspiciousCount)}
              tone="suspicious"
              delay={200}
            />
            <StatCard
              label="Blocked senders"
              value={String(stats.blockedSenders)}
              tone="safe"
              delay={260}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Live alerts</Text>
              <Text style={styles.sectionMeta}>{topAlerts.length} shown</Text>
            </View>

            {topAlerts.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>No active alerts</Text>
                <Text style={styles.emptySub}>
                  Your recent messages look safe. Keep scanning enabled.
                </Text>
              </View>
            ) : (
              <View style={{ gap: spacing.sm }}>
                {topAlerts.map(alert => {
                  const meta = levelMap[alert.level];

                  return (
                    <Pressable
                      key={alert.id}
                      hitSlop={6}
                      style={({ pressed }) => [
                        styles.alertItem,
                        pressed ? styles.pressed : null,
                      ]}
                      // Optional later: navigate to details
                      // onPress={() => navigation.navigate('MessageDetail', { messageId: alert.id })}
                      onPress={() => {}}
                    >
                      <View style={styles.alertHeader}>
                        <Text style={styles.alertSender} numberOfLines={1}>
                          {alert.sender}
                        </Text>

                        <View
                          style={[
                            styles.alertPill,
                            {
                              borderColor: `rgba(255,255,255,${opacity.subtle})`,
                              backgroundColor: meta.tint,
                            },
                          ]}
                        >
                          <Text style={[styles.alertLevel, { color: meta.color }]} numberOfLines={1}>
                            {meta.label}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.alertReason} numberOfLines={2}>
                        {alert.reasons[0]}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>
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
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },

  section: {
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: `rgba(255,255,255,${opacity.subtle})`,
    padding: spacing.md,
    ...shadow.card,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  sectionTitle: {
    color: palette.textPrimary,
    fontFamily: typography.headingFamily,
    fontSize: typography.h3,
    fontWeight: '900',
  },
  sectionMeta: {
    color: palette.textSecondary,
    fontFamily: typography.bodyFamily,
    fontSize: typography.label,
  },

  alertItem: {
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: `rgba(255,255,255,${opacity.subtle})`,
    backgroundColor: palette.surfaceMuted,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  alertSender: {
    flex: 1,
    minWidth: 0,
    color: palette.textPrimary,
    fontFamily: typography.bodyFamily,
    fontSize: typography.body,
    fontWeight: '800',
  },
  alertPill: {
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    maxWidth: 120,
  },
  alertLevel: {
    fontFamily: typography.bodyFamily,
    fontSize: typography.label,
    fontWeight: '900',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  alertReason: {
    color: palette.textSecondary,
    fontFamily: typography.bodyFamily,
    fontSize: typography.body,
    lineHeight: Math.round(typography.body * typography.lhRelaxed),
  },

  empty: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
  },
  emptyTitle: {
    color: palette.textPrimary,
    fontFamily: typography.headingFamily,
    fontSize: typography.h3,
    fontWeight: '900',
    marginBottom: spacing.xs,
  },
  emptySub: {
    color: palette.textSecondary,
    fontFamily: typography.bodyFamily,
    fontSize: typography.body,
    textAlign: 'center',
    lineHeight: Math.round(typography.body * typography.lhRelaxed),
  },
});
