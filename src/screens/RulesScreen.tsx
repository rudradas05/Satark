import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { AppBackground } from '../components/AppBackground';
import { SecurityHeader } from '../components/SecurityHeader';
import { useMessageState } from '../state/MessageState';
import {
  opacity,
  palette,
  radii,
  shadow,
  spacing,
  typography,
} from '../theme/tokens';

const severityColor: Record<'low' | 'medium' | 'high', string> = {
  low: palette.safe,
  medium: palette.suspicious,
  high: palette.spam,
};

export function RulesScreen() {
  const {
    autoBlockEnabled,
    blocklist,
    keywordRules,
    setAutoBlockEnabled,
    setStrictModeEnabled,
    strictModeEnabled,
    toggleKeywordRule,
  } = useMessageState();

  const insets = useSafeAreaInsets();

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
            subtitle="Detection Controls"
            title="Rules & Blocklist"
          />

          {/* Toggles */}
          <View style={styles.panel}>
            <View style={[styles.row, styles.rowDivider]}>
              <View style={styles.textWrap}>
                <Text style={styles.title}>Auto-block high-risk senders</Text>
                <Text style={styles.sub}>
                  Automatically adds spam sources to local blocklist.
                </Text>
              </View>

              <Switch
                value={autoBlockEnabled}
                onValueChange={setAutoBlockEnabled}
                thumbColor={autoBlockEnabled ? palette.safe : '#d0d6e0'}
                trackColor={{
                  false: `rgba(255,255,255,${opacity.muted})`,
                  true: `rgba(46,216,161,0.45)`,
                }}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.textWrap}>
                <Text style={styles.title}>Strict scan mode</Text>
                <Text style={styles.sub}>
                  Raises sensitivity for unknown senders and links.
                </Text>
              </View>

              <Switch
                value={strictModeEnabled}
                onValueChange={setStrictModeEnabled}
                thumbColor={strictModeEnabled ? palette.accent : '#d0d6e0'}
                trackColor={{
                  false: `rgba(255,255,255,${opacity.muted})`,
                  true: `rgba(73,183,255,0.45)`,
                }}
              />
            </View>
          </View>

          {/* Keyword rules */}
          <View style={styles.panel}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Keyword rules</Text>
              <Text style={styles.panelMeta}>{keywordRules.length}</Text>
            </View>

            {keywordRules.map((rule, idx) => {
              const isLast = idx === keywordRules.length - 1;
              return (
                <View
                  key={rule.id}
                  style={[styles.row, !isLast && styles.rowDivider]}
                >
                  <View style={styles.textWrap}>
                    <Text style={styles.title}>{rule.keyword}</Text>
                    <Text
                      style={[
                        styles.sub,
                        { color: severityColor[rule.severity] },
                      ]}
                    >
                      {rule.severity.toUpperCase()} severity
                    </Text>
                  </View>

                  <Switch
                    value={rule.enabled}
                    onValueChange={() => toggleKeywordRule(rule.id)}
                    thumbColor={rule.enabled ? palette.accent : '#d0d6e0'}
                    trackColor={{
                      false: `rgba(255,255,255,${opacity.muted})`,
                      true: `rgba(73,183,255,0.42)`,
                    }}
                  />
                </View>
              );
            })}
          </View>

          {/* Blocked senders */}
          <View style={styles.panel}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Blocked senders</Text>
              <Text style={styles.panelMeta}>{blocklist.length}</Text>
            </View>

            {blocklist.length === 0 ? (
              <Text style={styles.sub}>No blocked senders configured.</Text>
            ) : (
              <View style={styles.chipWrap}>
                {blocklist.map(sender => (
                  <View key={sender} style={styles.senderChip}>
                    <Text style={styles.senderChipText} numberOfLines={1}>
                      {sender}
                    </Text>
                  </View>
                ))}
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

  panel: {
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: `rgba(255,255,255,${opacity.subtle})`,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadow.card,
  },

  panelHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  panelTitle: {
    color: palette.textPrimary,
    fontFamily: typography.headingFamily,
    fontSize: typography.h3,
    fontWeight: '900',
  },
  panelMeta: {
    color: palette.textSecondary,
    fontFamily: typography.bodyFamily,
    fontSize: typography.label,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: `rgba(255,255,255,${opacity.subtle})`,
  },

  textWrap: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: palette.textPrimary,
    fontFamily: typography.bodyFamily,
    fontSize: typography.body,
    fontWeight: '800',
    marginBottom: 4,
  },
  sub: {
    color: palette.textSecondary,
    fontFamily: typography.bodyFamily,
    fontSize: typography.label,
    lineHeight: Math.round(typography.label * typography.lhNormal),
  },

  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  senderChip: {
    maxWidth: '100%',
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: `rgba(255,255,255,${opacity.subtle})`,
    backgroundColor: palette.surfaceMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
  },
  senderChipText: {
    color: palette.textSecondary,
    fontFamily: typography.bodyFamily,
    fontSize: typography.label,
    fontWeight: '800',
  },
});
