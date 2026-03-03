import { ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBackground } from '../../components/AppBackground';
import { ActionButton } from '../../components/ActionButton';
import { useAuth } from '../../state/AuthState';
import { useTheme } from '../../state/ThemeState';
import { useToast } from '../../state/ToastState';
import {
  opacity,
  radii,
  shadow,
  spacing,
  themedBorder,
  typography,
} from '../../theme/tokens';
import { getUserFriendlyErrorMessage } from '../../utils/errorMessages';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const { showToast } = useToast();
  const { palette, mode } = useTheme();
  const isDark = mode === 'dark';
  const border = themedBorder(isDark);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const identifierTrimmed = identifier.trim();
  const phoneDigits = identifierTrimmed.replace(/\D/g, '');
  const hasValidEmail = EMAIL_REGEX.test(identifierTrimmed);
  const hasValidPhone =
    !identifierTrimmed.includes('@') &&
    phoneDigits.length >= 10 &&
    phoneDigits.length <= 15;
  const canContinue = useMemo(
    () => (hasValidEmail || hasValidPhone) && password.trim().length >= 6,
    [hasValidEmail, hasValidPhone, password],
  );
  const PasswordVisibilityIcon = showPass ? EyeOff : Eye;

  const handleLogin = async () => {
    if (!canContinue || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await login({ identifier: identifierTrimmed, password: password.trim() });
      showToast({ type: 'success', message: 'Logged in successfully.' });
    } catch (error) {
      showToast({
        type: 'error',
        message: getUserFriendlyErrorMessage(
          error,
          'Unable to log in. Please try again.',
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: palette.background }]}>
      <AppBackground minimal />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Pressable
              onPress={() => navigation.goBack()}
              hitSlop={8}
              style={[
                styles.backButton,
                {
                  borderColor: border,
                  backgroundColor: isDark
                    ? `rgba(255,255,255,${opacity.subtle})`
                    : `rgba(0,0,0,0.04)`,
                },
              ]}
            >
              <ArrowLeft
                size={22}
                strokeWidth={2.4}
                color={palette.textPrimary}
              />
            </Pressable>
          </View>

          <View style={styles.content}>
            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
              <View
                style={[
                  styles.smallLogo,
                  {
                    backgroundColor: isDark
                      ? `rgba(73, 183, 255, ${opacity.muted})`
                      : `rgba(26, 127, 232, 0.12)`,
                    borderColor: palette.accent,
                  },
                ]}
              >
                <Text
                  style={[styles.smallLogoText, { color: palette.textPrimary }]}
                >
                  S
                </Text>
              </View>
              <Text style={[styles.title, { color: palette.textPrimary }]}>
                Welcome Back
              </Text>
              <Text style={[styles.subtitle, { color: palette.textSecondary }]}>
                Access your Satark console to manage your security
              </Text>
            </View>

            {/* Form Card */}
            <View
              style={[
                styles.card,
                { backgroundColor: palette.surface, borderColor: border },
              ]}
            >
              {/* Email or Phone Input */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: palette.textSecondary }]}>
                  Email or Phone
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: palette.surfaceMuted,
                      borderColor: border,
                    },
                    focusedInput === 'identifier' && styles.inputWrapperFocused,
                  ]}
                >
                  <TextInput
                    value={identifier}
                    onChangeText={setIdentifier}
                    onFocus={() => setFocusedInput('identifier')}
                    onBlur={() => setFocusedInput(null)}
                    autoCapitalize="none"
                    keyboardType="default"
                    placeholder="name@example.com or 9876543210"
                    placeholderTextColor={palette.textSecondary}
                    style={[styles.input, { color: palette.textPrimary }]}
                    editable={!isSubmitting}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: palette.textSecondary }]}>
                  Password
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: palette.surfaceMuted,
                      borderColor: border,
                    },
                    focusedInput === 'password' && styles.inputWrapperFocused,
                  ]}
                >
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                    secureTextEntry={!showPass}
                    placeholder="********"
                    placeholderTextColor={palette.textSecondary}
                    style={[styles.input, { color: palette.textPrimary }]}
                    editable={!isSubmitting}
                  />
                  <Pressable
                    onPress={() => setShowPass(v => !v)}
                    hitSlop={8}
                    style={styles.showButton}
                  >
                    <PasswordVisibilityIcon
                      size={20}
                      strokeWidth={2.3}
                      color={palette.textPrimary}
                    />
                  </Pressable>
                </View>
              </View>

              {/* Login Button */}
              <ActionButton
                label="Login"
                variant="primary"
                disabled={!canContinue || isSubmitting}
                onPress={handleLogin}
                style={[
                  styles.loginButton,
                  canContinue && !isSubmitting ? {} : styles.disabledButton,
                ]}
              />

              {isSubmitting ? (
                <View style={styles.feedbackRow}>
                  <ActivityIndicator size="small" color={palette.textPrimary} />
                  <Text
                    style={[
                      styles.feedbackText,
                      { color: palette.textSecondary },
                    ]}
                  >
                    Signing in...
                  </Text>
                </View>
              ) : null}

              {/* Signup Link */}
              <View style={styles.signupPrompt}>
                <Text
                  style={[styles.signupText, { color: palette.textSecondary }]}
                >
                  Don't have an account?{' '}
                </Text>
                <Pressable
                  onPress={() => navigation.navigate('Signup')}
                  disabled={isSubmitting}
                >
                  <Text style={[styles.signupLink, { color: palette.accent }]}>
                    Create one
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Security Note */}
            <View
              style={[
                styles.securityNote,
                {
                  backgroundColor: isDark
                    ? `rgba(73, 183, 255, ${opacity.muted})`
                    : `rgba(26, 127, 232, 0.06)`,
                },
              ]}
            >
              <Lock
                size={20}
                strokeWidth={2.3}
                color={palette.textSecondary}
                style={styles.securityIcon}
              />
              <Text
                style={[styles.securityText, { color: palette.textSecondary }]}
              >
                Your data is encrypted and stays on your device
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },

  // Header
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Main Content
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },

  // Welcome Section
  welcomeSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  smallLogo: {
    width: 60,
    height: 60,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadow.soft,
  },
  smallLogoText: {
    fontFamily: typography.headingFamily,
    fontSize: 28,
    fontWeight: '900',
  },
  title: {
    fontFamily: typography.headingFamily,
    fontSize: 28,
    fontWeight: '900',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: typography.bodyFamily,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },

  // Form Card
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadow.card,
  },

  // Input Group
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontFamily: typography.bodyFamily,
    fontSize: 12,
    fontWeight: '900',
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
  },
  inputWrapperFocused: {
    borderColor: `rgba(73, 183, 255, 0.5)`,
    backgroundColor: `rgba(73, 183, 255, ${opacity.muted})`,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontFamily: typography.bodyFamily,
    fontSize: 16,
  },
  showButton: {
    paddingLeft: spacing.sm,
    paddingVertical: spacing.sm,
  },

  // Buttons
  loginButton: {
    width: '100%',
    marginTop: spacing.md,
  },
  disabledButton: {
    opacity: 0.5,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  feedbackText: {
    fontFamily: typography.bodyFamily,
    fontSize: 12,
  },

  // Signup Prompt
  signupPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  signupText: {
    fontFamily: typography.bodyFamily,
    fontSize: 14,
  },
  signupLink: {
    fontFamily: typography.bodyFamily,
    fontSize: 14,
    fontWeight: '900',
  },

  // Security Note
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  securityIcon: {
    marginRight: 4,
  },
  securityText: {
    flex: 1,
    fontFamily: typography.bodyFamily,
    fontSize: 12,
    lineHeight: 16,
  },
});
