import React, { useEffect, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  ShieldAlert,
} from 'lucide-react-native';

import { AppBackground } from '../components/AppBackground';
import { RiskMeter } from '../components/RiskMeter';
import { SecurityHeader } from '../components/SecurityHeader';
import { StatCard } from '../components/StatCard';
import { useMessageState } from '../state/MessageState';
import { useTheme } from '../state/ThemeState';
import { opacity, radii, shadow, spacing, typography } from '../theme/tokens';
import { getLevelMap } from '../utils/level';

function riskTone(value: number): 'safe' | 'suspicious' | 'spam' {
  if (value >= 75) return 'spam';
  if (value >= 45) return 'suspicious';
  return 'safe';
}

export function DashboardScreen() {
  const { palette: themePalette, mode } = useTheme();
  const { messages, stats } = useMessageState();
  const insets = useSafeAreaInsets();
  const pulseOpacity = useSharedValue(0.4);

  useEffect(() => {
    pulseOpacity.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [pulseOpacity]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  const topAlerts = useMemo(
    () =>
      messages
        .filter(message => message.level !== 'safe')
        .sort((a, b) => b.riskScore - a.riskScore)
        .slice(0, 3),
    [messages],
  );

  const globalRiskLevel = riskTone(stats.riskIndex);
  const isDark = mode === 'dark';
  const levelMap = getLevelMap(themePalette);

  return (
    <View style={[styles.root, { backgroundColor: themePalette.background }]}>
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

          {/* Live scanning indicator */}
          <Animated.View entering={FadeInDown.duration(400).delay(60)}>
            <View
              style={[
                styles.scanBanner,
                {
                  backgroundColor: isDark
                    ? 'rgba(46, 216, 161, 0.08)'
                    : 'rgba(0, 166, 107, 0.06)',
                  borderColor: isDark
                    ? 'rgba(46, 216, 161, 0.2)'
                    : 'rgba(0, 166, 107, 0.15)',
                },
              ]}
            >
              <Animated.View style={pulseStyle}>
                <Activity
                  size={16}
                  strokeWidth={2.5}
                  color={themePalette.safe}
                />
              </Animated.View>
              <Text style={[styles.scanText, { color: themePalette.safe }]}>
                Scanning active — {stats.totalScanned} messages analyzed
              </Text>
            </View>
          </Animated.View>

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

          <Animated.View entering={FadeInDown.duration(420).delay(320)}>
            <View
              style={[
                styles.section,
                {
                  backgroundColor: themePalette.surface,
                  borderColor: isDark
                    ? `rgba(255,255,255,${opacity.subtle})`
                    : 'rgba(0,0,0,0.08)',
                },
              ]}
            >
              <View style={styles.sectionHeader}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: themePalette.textPrimary },
                  ]}
                >
                  Live alerts
                </Text>
                <View
                  style={[
                    styles.countBadge,
                    {
                      backgroundColor: isDark
                        ? 'rgba(255,99,99,0.15)'
                        : 'rgba(220,38,38,0.1)',
                    },
                  ]}
                >
                  <Text
                    style={[styles.countText, { color: themePalette.spam }]}
                  >
                    {topAlerts.length}
                  </Text>
                </View>
              </View>

              {topAlerts.length === 0 ? (
                <View style={styles.empty}>
                  <CheckCircle
                    size={32}
                    strokeWidth={1.8}
                    color={themePalette.safe}
                  />
                  <Text
                    style={[
                      styles.emptyTitle,
                      { color: themePalette.textPrimary },
                    ]}
                  >
                    No active alerts
                  </Text>
                  <Text
                    style={[
                      styles.emptySub,
                      { color: themePalette.textSecondary },
                    ]}
                  >
                    Your recent messages look safe. Keep scanning enabled.
                  </Text>
                </View>
              ) : (
                <View style={{ gap: spacing.sm }}>
                  {topAlerts.map((alert, index) => {
                    const meta = levelMap[alert.level];
                    const AlertIcon =
                      alert.level === 'spam' ? ShieldAlert : AlertTriangle;

                    return (
                      <Animated.View
                        key={alert.id}
                        entering={FadeInDown.duration(350).delay(
                          380 + index * 80,
                        )}
                      >
                        <Pressable
                          hitSlop={6}
                          style={({ pressed }) => [
                            styles.alertItem,
                            {
                              backgroundColor: themePalette.surfaceMuted,
                              borderColor: isDark
                                ? `rgba(255,255,255,${opacity.subtle})`
                                : 'rgba(0,0,0,0.08)',
                              borderLeftColor: meta.color,
                              borderLeftWidth: 3,
                            },
                            pressed ? styles.pressed : null,
                          ]}
                          onPress={() => {}}
                        >
                          <View style={styles.alertHeader}>
                            <View style={styles.alertSenderRow}>
                              <View
                                style={[
                                  styles.alertIconCircle,
                                  { backgroundColor: meta.tint },
                                ]}
                              >
                                <AlertIcon
                                  size={14}
                                  strokeWidth={2.3}
                                  color={meta.color}
                                />
                              </View>
                              <Text
                                style={[
                                  styles.alertSender,
                                  { color: themePalette.textPrimary },
                                ]}
                                numberOfLines={1}
                              >
                                {alert.sender}
                              </Text>
                            </View>

                            <View
                              style={[
                                styles.alertPill,
                                {
                                  borderColor: isDark
                                    ? `rgba(255,255,255,${opacity.subtle})`
                                    : 'rgba(0,0,0,0.08)',
                                  backgroundColor: meta.tint,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.alertLevel,
                                  { color: meta.color },
                                ]}
                                numberOfLines={1}
                              >
                                {meta.label}
                              </Text>
                            </View>
                          </View>

                          <Text
                            style={[
                              styles.alertReason,
                              { color: themePalette.textSecondary },
                            ]}
                            numberOfLines={2}
                          >
                            {alert.reasons[0]}
                          </Text>

                          {/* Mini risk bar */}
                          <View style={styles.miniBarWrap}>
                            <View
                              style={[
                                styles.miniBarTrack,
                                {
                                  backgroundColor: isDark
                                    ? 'rgba(255,255,255,0.06)'
                                    : 'rgba(0,0,0,0.05)',
                                },
                              ]}
                            >
                              <View
                                style={[
                                  styles.miniBarFill,
                                  {
                                    width: `${alert.riskScore}%`,
                                    backgroundColor: meta.color,
                                  },
                                ]}
                              />
                            </View>
                            <Text
                              style={[
                                styles.miniBarLabel,
                                { color: meta.color },
                              ]}
                            >
                              {alert.riskScore}%
                            </Text>
                          </View>
                        </Pressable>
                      </Animated.View>
                    );
                  })}
                </View>
              )}
            </View>
          </Animated.View>
        </ScrollView>
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
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },

  scanBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radii.md,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginBottom: spacing.lg,
  },
  scanText: {
    fontFamily: typography.bodyFamily,
    fontSize: typography.label,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },

  section: {
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.md,
    ...shadow.card,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontFamily: typography.headingFamily,
    fontSize: typography.h3,
    fontWeight: '900',
  },
  countBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  countText: {
    fontFamily: typography.headingFamily,
    fontSize: 11,
    fontWeight: '900',
  },

  alertItem: {
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
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
  alertSenderRow: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  alertIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertSender: {
    flex: 1,
    minWidth: 0,
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
    fontFamily: typography.bodyFamily,
    fontSize: typography.body,
    lineHeight: Math.round(typography.body * typography.lhRelaxed),
  },

  miniBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  miniBarTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  miniBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  miniBarLabel: {
    fontFamily: typography.headingFamily,
    fontSize: 10,
    fontWeight: '900',
  },

  empty: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    gap: spacing.xs,
  },
  emptyTitle: {
    fontFamily: typography.headingFamily,
    fontSize: typography.h3,
    fontWeight: '900',
  },
  emptySub: {
    fontFamily: typography.bodyFamily,
    fontSize: typography.body,
    textAlign: 'center',
    lineHeight: Math.round(typography.body * typography.lhRelaxed),
  },
});
