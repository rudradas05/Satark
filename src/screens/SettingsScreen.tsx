import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { ActionButton } from '../components/ActionButton';
import { useAuth } from '../state/AuthState';

import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { AppBackground } from '../components/AppBackground';
import { SecurityHeader } from '../components/SecurityHeader';
import {
  opacity,
  palette,
  radii,
  shadow,
  spacing,
  typography,
} from '../theme/tokens';

export function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [pushAlertsEnabled, setPushAlertsEnabled] = useState(true);
  const [biometricLockEnabled, setBiometricLockEnabled] = useState(true);
  const [shareTelemetryEnabled, setShareTelemetryEnabled] = useState(false);
  const { logout } = useAuth();

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
          <SecurityHeader subtitle="Application Preferences" title="Settings" />

          <View style={styles.panel}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Security</Text>
            </View>

            <View style={[styles.row, styles.rowDivider]}>
              <View style={styles.textWrap}>
                <Text style={styles.rowTitle}>Biometric lock</Text>
                <Text style={styles.rowText}>
                  Require fingerprint or face unlock at app launch.
                </Text>
              </View>

              <Switch
                value={biometricLockEnabled}
                onValueChange={setBiometricLockEnabled}
                thumbColor={biometricLockEnabled ? palette.safe : '#d0d6e0'}
                trackColor={{
                  false: `rgba(255,255,255,${opacity.muted})`,
                  true: `rgba(46,216,161,0.45)`,
                }}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.textWrap}>
                <Text style={styles.rowTitle}>Push alerts</Text>
                <Text style={styles.rowText}>
                  Notify instantly when high-risk spam is detected.
                </Text>
              </View>

              <Switch
                value={pushAlertsEnabled}
                onValueChange={setPushAlertsEnabled}
                thumbColor={pushAlertsEnabled ? palette.accent : '#d0d6e0'}
                trackColor={{
                  false: `rgba(255,255,255,${opacity.muted})`,
                  true: `rgba(73,183,255,0.45)`,
                }}
              />
            </View>
          </View>

          <View style={styles.panel}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Privacy</Text>
            </View>

            <View style={styles.row}>
              <View style={styles.textWrap}>
                <Text style={styles.rowTitle}>Share anonymous telemetry</Text>
                <Text style={styles.rowText}>
                  Helps improve model quality with privacy-safe stats.
                </Text>
              </View>

              <Switch
                value={shareTelemetryEnabled}
                onValueChange={setShareTelemetryEnabled}
                thumbColor={shareTelemetryEnabled ? palette.accent : '#d0d6e0'}
                trackColor={{
                  false: `rgba(255,255,255,${opacity.muted})`,
                  true: `rgba(73,183,255,0.45)`,
                }}
              />
            </View>
          </View>
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Account</Text>

            <View style={{ marginTop: spacing.sm }}>
              <ActionButton label="Logout" variant="danger" onPress={logout} />
            </View>
          </View>

          {/* After we add auth, we’ll add a Logout section here using <ActionButton variant="danger" /> */}
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
  rowTitle: {
    color: palette.textPrimary,
    fontFamily: typography.bodyFamily,
    fontSize: typography.body,
    fontWeight: '800',
    marginBottom: 4,
  },
  rowText: {
    color: palette.textSecondary,
    fontFamily: typography.bodyFamily,
    fontSize: typography.label,
    lineHeight: Math.round(typography.label * typography.lhNormal),
  },
});
