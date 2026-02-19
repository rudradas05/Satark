import React, { useState } from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';
import { ActionButton } from '../components/ActionButton';
import { useAuth } from '../state/AuthState';
import { useTheme } from '../state/ThemeState';

import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { AppBackground } from '../components/AppBackground';
import { SecurityHeader } from '../components/SecurityHeader';
import {
  opacity,
  radii,
  spacing,
  typography,
} from '../theme/tokens';







export function SettingsScreen() {
  const { mode, toggleTheme, palette: themePalette } = useTheme();
  const insets = useSafeAreaInsets();
  const [pushAlertsEnabled, setPushAlertsEnabled] = useState(true);
  const [biometricLockEnabled, setBiometricLockEnabled] = useState(true);
  const [shareTelemetryEnabled, setShareTelemetryEnabled] = useState(false);
  const { logout } = useAuth();

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
          
          {/* Appearance Panel */}
          <View style={{
            backgroundColor: themePalette.surface,
            borderRadius: radii.lg,
            borderWidth: 1,
            borderColor: `rgba(255,255,255,${opacity.subtle})`,
            padding: spacing.md,
            marginBottom: spacing.md,
          }}>
            <Text style={{
              color: themePalette.textPrimary,
              fontFamily: typography.headingFamily,
              fontSize: typography.h3,
              fontWeight: '900',
              marginBottom: spacing.sm,
            }}>Appearance</Text>

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing.md,
              paddingVertical: spacing.sm,
            }}>
              <View style={{ flex: 1 }}>
                <Text style={{
                  color: themePalette.textPrimary,
                  fontFamily: typography.bodyFamily,
                  fontSize: typography.body,
                  fontWeight: '800',
                  marginBottom: 4,
                }}>Dark Mode</Text>
                <Text style={{
                  color: themePalette.textSecondary,
                  fontFamily: typography.bodyFamily,
                  fontSize: typography.label,
                }}>
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
          <View style={{
            backgroundColor: themePalette.surface,
            borderRadius: radii.lg,
            borderWidth: 1,
            borderColor: `rgba(255,255,255,${opacity.subtle})`,
            padding: spacing.md,
            marginBottom: spacing.md,
          }}>
            <Text style={{
              color: themePalette.textPrimary,
              fontFamily: typography.headingFamily,
              fontSize: typography.h3,
              fontWeight: '900',
              marginBottom: spacing.sm,
            }}>Security</Text>

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing.md,
              paddingVertical: spacing.sm,
              borderBottomWidth: 1,
              borderBottomColor: `rgba(255,255,255,${opacity.subtle})`,
            }}>
              <View style={{ flex: 1 }}>
                <Text style={{
                  color: themePalette.textPrimary,
                  fontFamily: typography.bodyFamily,
                  fontSize: typography.body,
                  fontWeight: '800',
                  marginBottom: 4,
                }}>Biometric lock</Text>
                <Text style={{
                  color: themePalette.textSecondary,
                  fontFamily: typography.bodyFamily,
                  fontSize: typography.label,
                }}>
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

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing.md,
              paddingVertical: spacing.sm,
            }}>
              <View style={{ flex: 1 }}>
                <Text style={{
                  color: themePalette.textPrimary,
                  fontFamily: typography.bodyFamily,
                  fontSize: typography.body,
                  fontWeight: '800',
                  marginBottom: 4,
                }}>Push alerts</Text>
                <Text style={{
                  color: themePalette.textSecondary,
                  fontFamily: typography.bodyFamily,
                  fontSize: typography.label,
                }}>
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
          <View style={{
            backgroundColor: themePalette.surface,
            borderRadius: radii.lg,
            borderWidth: 1,
            borderColor: `rgba(255,255,255,${opacity.subtle})`,
            padding: spacing.md,
            marginBottom: spacing.md,
          }}>
            <Text style={{
              color: themePalette.textPrimary,
              fontFamily: typography.headingFamily,
              fontSize: typography.h3,
              fontWeight: '900',
              marginBottom: spacing.sm,
            }}>Privacy</Text>

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing.md,
              paddingVertical: spacing.sm,
            }}>
              <View style={{ flex: 1 }}>
                <Text style={{
                  color: themePalette.textPrimary,
                  fontFamily: typography.bodyFamily,
                  fontSize: typography.body,
                  fontWeight: '800',
                  marginBottom: 4,
                }}>Share anonymous telemetry</Text>
                <Text style={{
                  color: themePalette.textSecondary,
                  fontFamily: typography.bodyFamily,
                  fontSize: typography.label,
                }}>
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

          {/* Account Panel */}
          <View style={{
            backgroundColor: themePalette.surface,
            borderRadius: radii.lg,
            borderWidth: 1,
            borderColor: `rgba(255,255,255,${opacity.subtle})`,
            padding: spacing.md,
            marginBottom: spacing.md,
          }}>
            <Text style={{
              color: themePalette.textPrimary,
              fontFamily: typography.headingFamily,
              fontSize: typography.h3,
              fontWeight: '900',
              marginBottom: spacing.sm,
            }}>Account</Text>

            <View style={{ marginTop: spacing.sm }}>
              <ActionButton label="Logout" variant="danger" onPress={logout} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}