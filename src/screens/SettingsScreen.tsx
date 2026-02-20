import React, { useMemo, useState } from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { ActionButton } from '../components/ActionButton';
import { AppBackground } from '../components/AppBackground';
import { SecurityHeader } from '../components/SecurityHeader';
import { useAuth } from '../state/AuthState';
import { useTheme } from '../state/ThemeState';
import { opacity, radii, spacing, typography } from '../theme/tokens';

const appMeta = require('../../app.json') as {
  displayName?: string;
  name?: string;
};
const packageMeta = require('../../package.json') as {
  version?: string;
};

export function SettingsScreen() {
  const { mode, toggleTheme, palette: themePalette } = useTheme();
  const insets = useSafeAreaInsets();
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [pushAlertsEnabled, setPushAlertsEnabled] = useState(true);
  const [biometricLockEnabled, setBiometricLockEnabled] = useState(true);
  const [shareTelemetryEnabled, setShareTelemetryEnabled] = useState(false);
  const { user, logout } = useAuth();

  const appName = appMeta.displayName ?? appMeta.name ?? 'Satark';
  const appVersion = packageMeta.version ?? '0.0.1';

  const infoRows = useMemo(
    () => [
      { label: 'App Name', value: appName },
      { label: 'App Version', value: `v${appVersion}` },
    ],
    [appName, appVersion],
  );

  return (
    <View style={{ backgroundColor: themePalette.background, flex: 1 }}>
      <AppBackground />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: spacing.md,
            paddingTop: spacing.sm,
            paddingBottom: insets.bottom + spacing['2xl'],
          }}
          showsVerticalScrollIndicator={false}
        >
          <SecurityHeader subtitle="Application Preferences" title="Settings" />

          {/* Profile Panel */}
          <View
            style={{
              backgroundColor: themePalette.surface,
              borderRadius: radii.lg,
              borderWidth: 1,
              borderColor: `rgba(255,255,255,${opacity.subtle})`,
              padding: spacing.md,
              marginBottom: spacing.md,
            }}
          >
            <Text
              style={{
                color: themePalette.textPrimary,
                fontFamily: typography.headingFamily,
                fontSize: typography.h3,
                fontWeight: '900',
                marginBottom: spacing.xs,
              }}
            >
              Profile
            </Text>
            <Text
              style={{
                color: themePalette.textSecondary,
                fontFamily: typography.bodyFamily,
                fontSize: typography.label,
                marginBottom: spacing.sm,
              }}
            >
              Manage account info and session controls.
            </Text>

            <ActionButton
              label={isProfileVisible ? 'Hide Profile' : 'View Profile'}
              variant="neutral"
              onPress={() => setIsProfileVisible(prev => !prev)}
            />

            {isProfileVisible ? (
              <View style={{ marginTop: spacing.sm, gap: spacing.sm }}>
                <View
                  style={{
                    backgroundColor: themePalette.surfaceMuted,
                    borderRadius: radii.md,
                    borderWidth: 1,
                    borderColor: `rgba(255,255,255,${opacity.subtle})`,
                    padding: spacing.sm,
                  }}
                >
                  <Text
                    style={{
                      color: themePalette.textSecondary,
                      fontFamily: typography.bodyFamily,
                      fontSize: typography.label,
                      marginBottom: 4,
                    }}
                  >
                    Username
                  </Text>
                  <Text
                    style={{
                      color: themePalette.textPrimary,
                      fontFamily: typography.bodyFamily,
                      fontSize: typography.body,
                      fontWeight: '800',
                    }}
                  >
                    {user?.userName ?? 'N/A'}
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: themePalette.surfaceMuted,
                    borderRadius: radii.md,
                    borderWidth: 1,
                    borderColor: `rgba(255,255,255,${opacity.subtle})`,
                    padding: spacing.sm,
                  }}
                >
                  <Text
                    style={{
                      color: themePalette.textSecondary,
                      fontFamily: typography.bodyFamily,
                      fontSize: typography.label,
                      marginBottom: 4,
                    }}
                  >
                    Email
                  </Text>
                  <Text
                    style={{
                      color: themePalette.textPrimary,
                      fontFamily: typography.bodyFamily,
                      fontSize: typography.body,
                      fontWeight: '800',
                    }}
                  >
                    {user?.email ?? 'Not set'}
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: themePalette.surfaceMuted,
                    borderRadius: radii.md,
                    borderWidth: 1,
                    borderColor: `rgba(255,255,255,${opacity.subtle})`,
                    padding: spacing.sm,
                  }}
                >
                  <Text
                    style={{
                      color: themePalette.textSecondary,
                      fontFamily: typography.bodyFamily,
                      fontSize: typography.label,
                      marginBottom: 4,
                    }}
                  >
                    Phone
                  </Text>
                  <Text
                    style={{
                      color: themePalette.textPrimary,
                      fontFamily: typography.bodyFamily,
                      fontSize: typography.body,
                      fontWeight: '800',
                    }}
                  >
                    {user?.phone ?? 'Not set'}
                  </Text>
                </View>
              </View>
            ) : null}

            <View style={{ marginTop: spacing.sm }}>
              <ActionButton label="Logout" variant="danger" onPress={logout} />
            </View>
          </View>

          {/* Appearance Panel */}
          <View
            style={{
              backgroundColor: themePalette.surface,
              borderRadius: radii.lg,
              borderWidth: 1,
              borderColor: `rgba(255,255,255,${opacity.subtle})`,
              padding: spacing.md,
              marginBottom: spacing.md,
            }}
          >
            <Text
              style={{
                color: themePalette.textPrimary,
                fontFamily: typography.headingFamily,
                fontSize: typography.h3,
                fontWeight: '900',
                marginBottom: spacing.sm,
              }}
            >
              Appearance
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: spacing.md,
                paddingVertical: spacing.sm,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: themePalette.textPrimary,
                    fontFamily: typography.bodyFamily,
                    fontSize: typography.body,
                    fontWeight: '800',
                    marginBottom: 4,
                  }}
                >
                  Dark Mode
                </Text>
                <Text
                  style={{
                    color: themePalette.textSecondary,
                    fontFamily: typography.bodyFamily,
                    fontSize: typography.label,
                  }}
                >
                  Currently in {mode === 'dark' ? 'Dark' : 'Light'} mode
                </Text>
              </View>

              <Switch
                value={mode === 'dark'}
                onValueChange={toggleTheme}
                thumbColor={mode === 'dark' ? themePalette.accent : '#d0d6e0'}
                trackColor={{
                  false: `rgba(255,255,255,${opacity.muted})`,
                  true: `rgba(73,183,255,0.45)`,
                }}
              />
            </View>
          </View>

          {/* Security Panel */}
          <View
            style={{
              backgroundColor: themePalette.surface,
              borderRadius: radii.lg,
              borderWidth: 1,
              borderColor: `rgba(255,255,255,${opacity.subtle})`,
              padding: spacing.md,
              marginBottom: spacing.md,
            }}
          >
            <Text
              style={{
                color: themePalette.textPrimary,
                fontFamily: typography.headingFamily,
                fontSize: typography.h3,
                fontWeight: '900',
                marginBottom: spacing.sm,
              }}
            >
              Security
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: spacing.md,
                paddingVertical: spacing.sm,
                borderBottomWidth: 1,
                borderBottomColor: `rgba(255,255,255,${opacity.subtle})`,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: themePalette.textPrimary,
                    fontFamily: typography.bodyFamily,
                    fontSize: typography.body,
                    fontWeight: '800',
                    marginBottom: 4,
                  }}
                >
                  Biometric lock
                </Text>
                <Text
                  style={{
                    color: themePalette.textSecondary,
                    fontFamily: typography.bodyFamily,
                    fontSize: typography.label,
                  }}
                >
                  Require fingerprint or face unlock at app launch.
                </Text>
              </View>

              <Switch
                value={biometricLockEnabled}
                onValueChange={setBiometricLockEnabled}
                thumbColor={biometricLockEnabled ? themePalette.safe : '#d0d6e0'}
                trackColor={{
                  false: `rgba(255,255,255,${opacity.muted})`,
                  true: `rgba(46,216,161,0.45)`,
                }}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: spacing.md,
                paddingVertical: spacing.sm,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: themePalette.textPrimary,
                    fontFamily: typography.bodyFamily,
                    fontSize: typography.body,
                    fontWeight: '800',
                    marginBottom: 4,
                  }}
                >
                  Push alerts
                </Text>
                <Text
                  style={{
                    color: themePalette.textSecondary,
                    fontFamily: typography.bodyFamily,
                    fontSize: typography.label,
                  }}
                >
                  Notify instantly when high-risk spam is detected.
                </Text>
              </View>

              <Switch
                value={pushAlertsEnabled}
                onValueChange={setPushAlertsEnabled}
                thumbColor={pushAlertsEnabled ? themePalette.accent : '#d0d6e0'}
                trackColor={{
                  false: `rgba(255,255,255,${opacity.muted})`,
                  true: `rgba(73,183,255,0.45)`,
                }}
              />
            </View>
          </View>

          {/* Privacy Panel */}
          <View
            style={{
              backgroundColor: themePalette.surface,
              borderRadius: radii.lg,
              borderWidth: 1,
              borderColor: `rgba(255,255,255,${opacity.subtle})`,
              padding: spacing.md,
              marginBottom: spacing.md,
            }}
          >
            <Text
              style={{
                color: themePalette.textPrimary,
                fontFamily: typography.headingFamily,
                fontSize: typography.h3,
                fontWeight: '900',
                marginBottom: spacing.sm,
              }}
            >
              Privacy
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: spacing.md,
                paddingVertical: spacing.sm,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: themePalette.textPrimary,
                    fontFamily: typography.bodyFamily,
                    fontSize: typography.body,
                    fontWeight: '800',
                    marginBottom: 4,
                  }}
                >
                  Share anonymous telemetry
                </Text>
                <Text
                  style={{
                    color: themePalette.textSecondary,
                    fontFamily: typography.bodyFamily,
                    fontSize: typography.label,
                  }}
                >
                  Helps improve model quality with privacy-safe stats.
                </Text>
              </View>

              <Switch
                value={shareTelemetryEnabled}
                onValueChange={setShareTelemetryEnabled}
                thumbColor={shareTelemetryEnabled ? themePalette.accent : '#d0d6e0'}
                trackColor={{
                  false: `rgba(255,255,255,${opacity.muted})`,
                  true: `rgba(73,183,255,0.45)`,
                }}
              />
            </View>
          </View>

          {/* App Info Panel */}
          <View
            style={{
              backgroundColor: themePalette.surface,
              borderRadius: radii.lg,
              borderWidth: 1,
              borderColor: `rgba(255,255,255,${opacity.subtle})`,
              padding: spacing.md,
              marginBottom: spacing.md,
            }}
          >
            <Text
              style={{
                color: themePalette.textPrimary,
                fontFamily: typography.headingFamily,
                fontSize: typography.h3,
                fontWeight: '900',
                marginBottom: spacing.sm,
              }}
            >
              App Info
            </Text>

            {infoRows.map((row, index) => (
              <View
                key={row.label}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: spacing.sm,
                  borderBottomWidth: index === infoRows.length - 1 ? 0 : 1,
                  borderBottomColor: `rgba(255,255,255,${opacity.subtle})`,
                }}
              >
                <Text
                  style={{
                    color: themePalette.textSecondary,
                    fontFamily: typography.bodyFamily,
                    fontSize: typography.label,
                  }}
                >
                  {row.label}
                </Text>
                <Text
                  style={{
                    color: themePalette.textPrimary,
                    fontFamily: typography.bodyFamily,
                    fontSize: typography.body,
                    fontWeight: '800',
                  }}
                >
                  {row.value}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
