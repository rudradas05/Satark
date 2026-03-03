import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  ChevronRight,
  Eye,
  EyeOff,
  LogOut,
  Mail,
  Phone,
  Shield,
  User,
  X,
} from 'lucide-react-native';

import { ActionButton } from '../components/ActionButton';
import { AppBackground } from '../components/AppBackground';
import { SecurityHeader } from '../components/SecurityHeader';
import { useAuth } from '../state/AuthState';
import { useTheme } from '../state/ThemeState';
import {
  opacity,
  radii,
  spacing,
  themedBorder,
  typography,
} from '../theme/tokens';
import { getUserFriendlyErrorMessage } from '../utils/errorMessages';
import { useToast } from '../state/ToastState';

const appMeta = require('../../app.json') as {
  displayName?: string;
  name?: string;
};
const packageMeta = require('../../package.json') as {
  version?: string;
};

function ProfileModal({
  visible,
  onClose,
  user,
}: {
  visible: boolean;
  onClose: () => void;
  user: {
    userName: string;
    email?: string | null;
    phone?: string | null;
  } | null;
}) {
  if (!visible || !user) return null;

  const { palette, mode } = useTheme();
  const isDark = mode === 'dark';
  const border = themedBorder(isDark);

  const fields = [
    { icon: User, label: 'Username', value: user.userName },
    { icon: Mail, label: 'Email', value: user.email ?? 'Not set' },
    { icon: Phone, label: 'Phone', value: user.phone ?? 'Not set' },
  ];

  return (
    <View style={profileStyles.overlay}>
      <Pressable style={profileStyles.backdrop} onPress={onClose} />
      <View
        style={[
          profileStyles.sheet,
          { backgroundColor: palette.surface, borderColor: border },
        ]}
      >
        <View
          style={[profileStyles.handle, { backgroundColor: palette.border }]}
        />

        {/* Close button */}
        <Pressable
          style={[
            profileStyles.closeBtn,
            { backgroundColor: palette.surfaceMuted },
          ]}
          onPress={onClose}
          hitSlop={12}
        >
          <X size={20} color={palette.textSecondary} />
        </Pressable>

        {/* Avatar + name hero */}
        <View style={profileStyles.heroSection}>
          <View
            style={[profileStyles.avatarRing, { borderColor: palette.accent }]}
          >
            <View style={profileStyles.avatarCircle}>
              <Text
                style={[profileStyles.avatarLetter, { color: palette.accent }]}
              >
                {user.userName.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>
          <Text
            style={[profileStyles.heroName, { color: palette.textPrimary }]}
          >
            {user.userName}
          </Text>
          {user.email ? (
            <Text
              style={[
                profileStyles.heroEmail,
                { color: palette.textSecondary },
              ]}
            >
              {user.email}
            </Text>
          ) : null}
          <View style={profileStyles.badge}>
            <Shield size={12} color={palette.safe} />
            <Text style={[profileStyles.badgeText, { color: palette.safe }]}>
              Verified
            </Text>
          </View>
        </View>

        {/* Info fields */}
        <View style={profileStyles.infoSection}>
          {fields.map(({ icon: Icon, label, value }) => (
            <View
              key={label}
              style={[
                profileStyles.infoRow,
                { backgroundColor: palette.surfaceMuted, borderColor: border },
              ]}
            >
              <View style={profileStyles.infoIconWrap}>
                <Icon size={16} color={palette.accent} />
              </View>
              <View style={profileStyles.infoTextWrap}>
                <Text
                  style={[
                    profileStyles.infoLabel,
                    { color: palette.textSecondary },
                  ]}
                >
                  {label}
                </Text>
                <Text
                  style={[
                    profileStyles.infoValue,
                    { color: palette.textPrimary },
                  ]}
                >
                  {value}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <ActionButton label="Close" variant="neutral" onPress={onClose} />
      </View>
    </View>
  );
}

function ChangePasswordModal({
  visible,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (oldPassword: string, newPassword: string) => Promise<void>;
}) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { palette, mode } = useTheme();
  const isDark = mode === 'dark';
  const border = themedBorder(isDark);

  if (!visible) return null;

  const canSubmit =
    oldPassword.length >= 1 &&
    newPassword.length >= 6 &&
    confirmPassword === newPassword;

  const handleSubmit = async () => {
    if (!canSubmit) {
      showToast({
        type: 'error',
        message: 'Please fill all password fields correctly.',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast({
        type: 'error',
        message: 'New passwords do not match.',
      });
      return;
    }

    setLoading(true);
    try {
      await onSubmit(oldPassword, newPassword);
      showToast({
        type: 'success',
        message: 'Password changed successfully.',
      });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } catch (error) {
      showToast({
        type: 'error',
        message: getUserFriendlyErrorMessage(
          error,
          'Failed to change password. Please try again.',
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <View style={profileStyles.overlay}>
      <Pressable style={profileStyles.backdrop} onPress={handleClose} />
      <View
        style={[
          profileStyles.sheet,
          { backgroundColor: palette.surface, borderColor: border },
        ]}
      >
        <View
          style={[profileStyles.handle, { backgroundColor: palette.border }]}
        />
        <Text
          style={[profileStyles.sheetTitle, { color: palette.textPrimary }]}
        >
          Change Password
        </Text>

        <View style={cpStyles.fieldWrap}>
          <Text style={[cpStyles.fieldLabel, { color: palette.textSecondary }]}>
            Old Password
          </Text>
          <View
            style={[
              cpStyles.inputRow,
              { backgroundColor: palette.surfaceMuted, borderColor: border },
            ]}
          >
            <TextInput
              style={[cpStyles.input, { color: palette.textPrimary }]}
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry={!showOld}
              placeholder="Enter old password"
              placeholderTextColor={palette.textSecondary}
              autoCapitalize="none"
            />
            <Pressable onPress={() => setShowOld(v => !v)} hitSlop={8}>
              {showOld ? (
                <EyeOff size={18} color={palette.textSecondary} />
              ) : (
                <Eye size={18} color={palette.textSecondary} />
              )}
            </Pressable>
          </View>
        </View>

        <View style={cpStyles.fieldWrap}>
          <Text style={[cpStyles.fieldLabel, { color: palette.textSecondary }]}>
            New Password
          </Text>
          <View
            style={[
              cpStyles.inputRow,
              { backgroundColor: palette.surfaceMuted, borderColor: border },
            ]}
          >
            <TextInput
              style={[cpStyles.input, { color: palette.textPrimary }]}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNew}
              placeholder="Min 6 characters"
              placeholderTextColor={palette.textSecondary}
              autoCapitalize="none"
            />
            <Pressable onPress={() => setShowNew(v => !v)} hitSlop={8}>
              {showNew ? (
                <EyeOff size={18} color={palette.textSecondary} />
              ) : (
                <Eye size={18} color={palette.textSecondary} />
              )}
            </Pressable>
          </View>
        </View>

        <View style={cpStyles.fieldWrap}>
          <Text style={[cpStyles.fieldLabel, { color: palette.textSecondary }]}>
            Confirm New Password
          </Text>
          <View
            style={[
              cpStyles.inputRow,
              { backgroundColor: palette.surfaceMuted, borderColor: border },
            ]}
          >
            <TextInput
              style={[cpStyles.input, { color: palette.textPrimary }]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirm}
              placeholder="Re-enter new password"
              placeholderTextColor={palette.textSecondary}
              autoCapitalize="none"
            />
            <Pressable onPress={() => setShowConfirm(v => !v)} hitSlop={8}>
              {showConfirm ? (
                <EyeOff size={18} color={palette.textSecondary} />
              ) : (
                <Eye size={18} color={palette.textSecondary} />
              )}
            </Pressable>
          </View>
        </View>

        <View style={cpStyles.buttons}>
          <ActionButton
            label={loading ? 'Changing...' : 'Change Password'}
            variant="primary"
            disabled={!canSubmit || loading}
            onPress={handleSubmit}
          />
          <View style={{ height: spacing.xs }} />
          <ActionButton
            label="Cancel"
            variant="neutral"
            onPress={handleClose}
          />
        </View>
      </View>
    </View>
  );
}

export function SettingsScreen() {
  const { mode, toggleTheme, palette: themePalette } = useTheme();
  const insets = useSafeAreaInsets();
  const isDark = mode === 'dark';
  const border = themedBorder(isDark);
  const [profileVisible, setProfileVisible] = useState(false);
  const [pushAlertsEnabled, setPushAlertsEnabled] = useState(true);
  const [biometricLockEnabled, setBiometricLockEnabled] = useState(true);
  const [shareTelemetryEnabled, setShareTelemetryEnabled] = useState(false);
  const [changePassVisible, setChangePassVisible] = useState(false);
  const { user, logout, changePassword } = useAuth();

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

          {/* Profile Card */}
          <Pressable
            onPress={() => setProfileVisible(true)}
            style={{
              backgroundColor: themePalette.surface,
              borderRadius: radii.lg,
              borderWidth: 1,
              borderColor: border,
              padding: spacing.md,
              marginBottom: spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.md,
            }}
          >
            {/* Avatar */}
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: `rgba(73,183,255,0.18)`,
                borderWidth: 2,
                borderColor: themePalette.accent,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  color: themePalette.accent,
                  fontSize: 22,
                  fontWeight: '900',
                  fontFamily: typography.headingFamily,
                }}
              >
                {user?.userName?.charAt(0).toUpperCase() ?? '?'}
              </Text>
            </View>

            {/* Name + email */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: themePalette.textPrimary,
                  fontFamily: typography.headingFamily,
                  fontSize: typography.h3,
                  fontWeight: '900',
                }}
                numberOfLines={1}
              >
                {user?.userName ?? 'User'}
              </Text>
              <Text
                style={{
                  color: themePalette.textSecondary,
                  fontFamily: typography.bodyFamily,
                  fontSize: typography.label,
                  marginTop: 2,
                }}
                numberOfLines={1}
              >
                {user?.email ?? 'Tap to view profile'}
              </Text>
            </View>

            <ChevronRight size={20} color={themePalette.textSecondary} />
          </Pressable>

          {/* Account Actions */}
          <View
            style={{
              backgroundColor: themePalette.surface,
              borderRadius: radii.lg,
              borderWidth: 1,
              borderColor: border,
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
              Account
            </Text>

            {/* Logout row */}
            <Pressable
              onPress={logout}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.sm,
                paddingVertical: spacing.sm,
              }}
            >
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  backgroundColor: 'rgba(255,99,99,0.12)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LogOut size={16} color={themePalette.spam} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: themePalette.spam,
                    fontFamily: typography.bodyFamily,
                    fontSize: typography.body,
                    fontWeight: '800',
                  }}
                >
                  Logout
                </Text>
                <Text
                  style={{
                    color: themePalette.textSecondary,
                    fontFamily: typography.bodyFamily,
                    fontSize: typography.label,
                  }}
                >
                  Sign out of your account
                </Text>
              </View>
              <ChevronRight size={16} color={themePalette.textSecondary} />
            </Pressable>
          </View>

          {/* Appearance Panel */}
          <View
            style={{
              backgroundColor: themePalette.surface,
              borderRadius: radii.lg,
              borderWidth: 1,
              borderColor: border,
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
                  false: isDark
                    ? `rgba(255,255,255,${opacity.muted})`
                    : 'rgba(0,0,0,0.08)',
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
              borderColor: border,
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
                borderBottomColor: border,
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
                thumbColor={
                  biometricLockEnabled ? themePalette.safe : '#d0d6e0'
                }
                trackColor={{
                  false: isDark
                    ? `rgba(255,255,255,${opacity.muted})`
                    : 'rgba(0,0,0,0.08)',
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
                  false: isDark
                    ? `rgba(255,255,255,${opacity.muted})`
                    : 'rgba(0,0,0,0.08)',
                  true: `rgba(73,183,255,0.45)`,
                }}
              />
            </View>

            <View style={{ marginTop: spacing.sm }}>
              <ActionButton
                label="Change Password"
                variant="neutral"
                onPress={() => setChangePassVisible(true)}
              />
            </View>
          </View>

          {/* Privacy Panel */}
          <View
            style={{
              backgroundColor: themePalette.surface,
              borderRadius: radii.lg,
              borderWidth: 1,
              borderColor: border,
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
                thumbColor={
                  shareTelemetryEnabled ? themePalette.accent : '#d0d6e0'
                }
                trackColor={{
                  false: isDark
                    ? `rgba(255,255,255,${opacity.muted})`
                    : 'rgba(0,0,0,0.08)',
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
              borderColor: border,
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
                  borderBottomColor: border,
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

      <ProfileModal
        visible={profileVisible}
        onClose={() => setProfileVisible(false)}
        user={user}
      />

      <ChangePasswordModal
        visible={changePassVisible}
        onClose={() => setChangePassVisible(false)}
        onSubmit={(oldPw, newPw) =>
          changePassword({ oldPassword: oldPw, newPassword: newPw })
        }
      />
    </View>
  );
}

const profileStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    padding: spacing.lg,
    paddingBottom: spacing['3xl'],
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  sheetTitle: {
    fontFamily: typography.headingFamily,
    fontSize: typography.h3,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  closeBtn: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatarRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(73,183,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 34,
    fontWeight: '900',
    fontFamily: typography.headingFamily,
  },
  heroName: {
    fontFamily: typography.headingFamily,
    fontSize: typography.h2,
    fontWeight: '900',
    marginBottom: 2,
  },
  heroEmail: {
    fontFamily: typography.bodyFamily,
    fontSize: typography.body,
    marginBottom: spacing.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(46,216,161,0.12)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(46,216,161,0.25)',
  },
  badgeText: {
    fontFamily: typography.bodyFamily,
    fontSize: typography.label,
    fontWeight: '700',
  },
  infoSection: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  infoRow: {
    borderRadius: radii.md,
    padding: spacing.sm,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(73,183,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextWrap: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: typography.bodyFamily,
    fontSize: typography.label,
    marginBottom: 2,
  },
  infoValue: {
    fontFamily: typography.bodyFamily,
    fontSize: typography.body,
    fontWeight: '800',
  },
});

const cpStyles = StyleSheet.create({
  fieldWrap: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontFamily: typography.bodyFamily,
    fontSize: typography.label,
    marginBottom: spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: typography.bodyFamily,
    fontSize: typography.body,
    paddingVertical: spacing.sm,
  },
  buttons: {
    marginTop: spacing.sm,
  },
});
