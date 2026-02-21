import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ActionButton } from '../components/ActionButton';
import { useAuth } from '../state/AuthState';
import { useToast } from '../state/ToastState';
import { getUserFriendlyErrorMessage } from '../utils/errorMessages';

import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { ChevronRight, Eye, EyeOff } from 'lucide-react-native';

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

  return (
    <View style={profileStyles.overlay}>
      <Pressable style={profileStyles.backdrop} onPress={onClose} />
      <View style={profileStyles.sheet}>
        <View style={profileStyles.handle} />
        <Text style={profileStyles.sheetTitle}>Profile</Text>

        <View style={profileStyles.avatarCircle}>
          <Text style={profileStyles.avatarLetter}>
            {user.userName.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={profileStyles.infoSection}>
          <View style={profileStyles.infoRow}>
            <Text style={profileStyles.infoLabel}>Username</Text>
            <Text style={profileStyles.infoValue}>{user.userName}</Text>
          </View>
          {user.email ? (
            <View style={profileStyles.infoRow}>
              <Text style={profileStyles.infoLabel}>Email</Text>
              <Text style={profileStyles.infoValue}>{user.email}</Text>
            </View>
          ) : null}
          {user.phone ? (
            <View style={profileStyles.infoRow}>
              <Text style={profileStyles.infoLabel}>Phone</Text>
              <Text style={profileStyles.infoValue}>{user.phone}</Text>
            </View>
          ) : null}
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
      <View style={profileStyles.sheet}>
        <View style={profileStyles.handle} />
        <Text style={profileStyles.sheetTitle}>Change Password</Text>

        <View style={cpStyles.fieldWrap}>
          <Text style={cpStyles.fieldLabel}>Old Password</Text>
          <View style={cpStyles.inputRow}>
            <TextInput
              style={cpStyles.input}
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
          <Text style={cpStyles.fieldLabel}>New Password</Text>
          <View style={cpStyles.inputRow}>
            <TextInput
              style={cpStyles.input}
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
          <Text style={cpStyles.fieldLabel}>Confirm New Password</Text>
          <View style={cpStyles.inputRow}>
            <TextInput
              style={cpStyles.input}
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
  const insets = useSafeAreaInsets();
  const [pushAlertsEnabled, setPushAlertsEnabled] = useState(true);
  const [biometricLockEnabled, setBiometricLockEnabled] = useState(true);
  const [shareTelemetryEnabled, setShareTelemetryEnabled] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [changePassVisible, setChangePassVisible] = useState(false);
  const { logout, user, changePassword } = useAuth();

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

          {/* View Profile */}
          <Pressable
            style={styles.profileCard}
            onPress={() => setProfileVisible(true)}
          >
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarLetter}>
                {user?.userName?.charAt(0).toUpperCase() ?? 'U'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.userName ?? 'User'}</Text>
              <Text style={styles.profileSub}>
                {user?.email ?? 'View your profile details'}
              </Text>
            </View>
            <ChevronRight size={20} color={palette.textSecondary} />
          </Pressable>

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

            <View style={{ marginTop: spacing.sm, gap: spacing.xs }}>
              <ActionButton
                label="Change Password"
                variant="neutral"
                onPress={() => setChangePassVisible(true)}
              />
              <ActionButton label="Logout" variant="danger" onPress={logout} />
            </View>
          </View>

          {/* After we add auth, we’ll add a Logout section here using <ActionButton variant="danger" /> */}

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={styles.appName}>Satark</Text>
            <Text style={styles.appVersion}>Version 0.0.1</Text>
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

  // Profile card
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: `rgba(255,255,255,${opacity.subtle})`,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `rgba(73,183,255,0.2)`,
    borderWidth: 2,
    borderColor: palette.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarLetter: {
    color: palette.accent,
    fontFamily: typography.headingFamily,
    fontSize: 20,
    fontWeight: '900',
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  profileName: {
    color: palette.textPrimary,
    fontFamily: typography.headingFamily,
    fontSize: typography.body,
    fontWeight: '800',
  },
  profileSub: {
    color: palette.textSecondary,
    fontFamily: typography.bodyFamily,
    fontSize: typography.label,
    marginTop: 2,
  },

  // App info footer
  appInfo: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginTop: spacing.sm,
  },
  appName: {
    color: palette.textSecondary,
    fontFamily: typography.headingFamily,
    fontSize: typography.body,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  appVersion: {
    color: `rgba(159,181,211,0.5)`,
    fontFamily: typography.bodyFamily,
    fontSize: typography.label - 1,
    marginTop: 4,
  },
});

const profileStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 10,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: palette.surface,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing['3xl'],
    borderWidth: 1,
    borderColor: `rgba(255,255,255,${opacity.subtle})`,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: `rgba(255,255,255,${opacity.muted})`,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  sheetTitle: {
    color: palette.textPrimary,
    fontFamily: typography.headingFamily,
    fontSize: typography.h3,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: `rgba(73,183,255,0.15)`,
    borderWidth: 2,
    borderColor: palette.accent,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  avatarLetter: {
    color: palette.accent,
    fontFamily: typography.headingFamily,
    fontSize: 30,
    fontWeight: '900',
  },
  infoSection: {
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: `rgba(255,255,255,${opacity.subtle})`,
  },
  infoLabel: {
    color: palette.textSecondary,
    fontFamily: typography.bodyFamily,
    fontSize: typography.label,
  },
  infoValue: {
    color: palette.textPrimary,
    fontFamily: typography.bodyFamily,
    fontSize: typography.label,
    fontWeight: '700',
  },
});

const cpStyles = StyleSheet.create({
  fieldWrap: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    color: palette.textSecondary,
    fontFamily: typography.bodyFamily,
    fontSize: typography.label,
    marginBottom: spacing.xxs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `rgba(255,255,255,${opacity.subtle})`,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: `rgba(255,255,255,${opacity.subtle})`,
    paddingHorizontal: spacing.sm,
  },
  input: {
    flex: 1,
    color: palette.textPrimary,
    fontFamily: typography.bodyFamily,
    fontSize: typography.body,
    paddingVertical: spacing.sm,
  },
  buttons: {
    marginTop: spacing.sm,
  },
});
