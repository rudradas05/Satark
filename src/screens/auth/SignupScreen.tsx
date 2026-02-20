import { ArrowLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBackground } from '../../components/AppBackground';
import { ActionButton } from '../../components/ActionButton';
import { useAuth } from '../../state/AuthState';
import {
  opacity,
  palette,
  radii,
  shadow,
  spacing,
  typography,
} from '../../theme/tokens';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^(?=.*\d)[A-Za-z0-9_]+$/;

export function SignupScreen({ navigation }: any) {
  const { signup } = useAuth();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const trimmedUserName = userName.trim();
  const trimmedEmail = email.trim();
  const phoneDigits = phone.replace(/\D/g, '');
  const hasValidUserName =
    trimmedUserName.length >= 3 &&
    trimmedUserName.length <= 30 &&
    USERNAME_REGEX.test(trimmedUserName);
  const hasValidEmail = trimmedEmail.length > 0 && EMAIL_REGEX.test(trimmedEmail);
  const hasValidPhone = phoneDigits.length >= 10 && phoneDigits.length <= 15;

  const canContinue = useMemo(
    () =>
      hasValidUserName &&
      (hasValidEmail || hasValidPhone) &&
      password.trim().length >= 6,
    [hasValidEmail, hasValidPhone, hasValidUserName, password],
  );
  const PasswordVisibilityIcon = showPass ? EyeOff : Eye;

  const handleSignup = async () => {
    if (!canContinue || isSubmitting) return;

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await signup({
        userName: trimmedUserName.toLowerCase(),
        email: hasValidEmail ? trimmedEmail : undefined,
        phone: hasValidPhone ? phoneDigits : undefined,
        password: password.trim(),
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to create account';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.root}>
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
              style={styles.backButton}
            >
              <ArrowLeft size={22} strokeWidth={2.4} color={palette.textPrimary} />
            </Pressable>
          </View>

          <View style={styles.content}>
            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
              <View style={styles.smallLogo}>
                <Text style={styles.smallLogoText}>S</Text>
              </View>
              <Text style={styles.title}>Join Satark</Text>
              <Text style={styles.subtitle}>
                Protect your messages from scams and fraud
              </Text>
            </View>

            {/* Form Card */}
            <View style={styles.card}>
              {/* Username Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Username</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    focusedInput === 'userName' && styles.inputWrapperFocused,
                  ]}
                >
                  <TextInput
                    value={userName}
                    onChangeText={setUserName}
                    onFocus={() => setFocusedInput('userName')}
                    onBlur={() => setFocusedInput(null)}
                    autoCapitalize="none"
                    placeholder="john_123"
                    placeholderTextColor={palette.textSecondary}
                    style={styles.input}
                    editable={!isSubmitting}
                  />
                </View>
              </View>

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    focusedInput === 'email' && styles.inputWrapperFocused,
                  ]}
                >
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="john@example.com"
                    placeholderTextColor={palette.textSecondary}
                    style={styles.input}
                    editable={!isSubmitting}
                  />
                </View>
              </View>

              {/* Phone Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    focusedInput === 'phone' && styles.inputWrapperFocused,
                  ]}
                >
                  <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    onFocus={() => setFocusedInput('phone')}
                    onBlur={() => setFocusedInput(null)}
                    keyboardType="phone-pad"
                    placeholder="9876543210"
                    placeholderTextColor={palette.textSecondary}
                    style={styles.input}
                    editable={!isSubmitting}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    focusedInput === 'password' && styles.inputWrapperFocused,
                  ]}
                >
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                    secureTextEntry={!showPass}
                    placeholder="Minimum 6 characters"
                    placeholderTextColor={palette.textSecondary}
                    style={styles.input}
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

              {/* Requirements Hint */}
              <View style={styles.requirementsBox}>
                <Text style={styles.requirementText}>
                  - Username: 3-30 chars, at least 1 number, letters/numbers/underscore only
                </Text>
                <Text style={styles.requirementText}>
                  - Use valid email or phone (10-15 digits), password 6+ chars
                </Text>
              </View>

              {/* Signup Button */}
              <ActionButton
                label="Create Account"
                variant="primary"
                disabled={!canContinue}
                onPress={handleSignup}
                style={[
                  styles.signupButton,
                  canContinue && !isSubmitting ? {} : styles.disabledButton,
                ]}
              />

              {isSubmitting ? (
                <View style={styles.feedbackRow}>
                  <ActivityIndicator size="small" color={palette.textPrimary} />
                  <Text style={styles.feedbackText}>Creating account...</Text>
                </View>
              ) : null}

              {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
              ) : null}

              {/* Login Link */}
              <View style={styles.loginPrompt}>
                <Text style={styles.loginText}>Already a member? </Text>
                <Pressable
                  onPress={() => navigation.navigate('Login')}
                  disabled={isSubmitting}
                >
                  <Text style={styles.loginLink}>Login here</Text>
                </Pressable>
              </View>
            </View>

            {/* Privacy Note */}
            <View style={styles.privacyNote}>
              <ShieldCheck
                size={20}
                strokeWidth={2.3}
                color={palette.textSecondary}
                style={styles.privacyIcon}
              />
              <Text style={styles.privacyText}>
                100% local storage, zero data collection
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.background },
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
    borderColor: `rgba(255,255,255,${opacity.subtle})`,
    backgroundColor: `rgba(255,255,255,${opacity.subtle})`,
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
    backgroundColor: `rgba(73, 183, 255, ${opacity.muted})`,
    borderWidth: 1.5,
    borderColor: `rgba(73, 183, 255, 0.6)`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadow.soft,
  },
  smallLogoText: {
    color: palette.textPrimary,
    fontFamily: typography.headingFamily,
    fontSize: 28,
    fontWeight: '900',
  },
  title: {
    color: palette.textPrimary,
    fontFamily: typography.headingFamily,
    fontSize: 28,
    fontWeight: '900',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    color: palette.textSecondary,
    fontFamily: typography.bodyFamily,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },

  // Form Card
  card: {
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: `rgba(255,255,255,${opacity.subtle})`,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadow.card,
  },

  // Input Group
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    color: palette.textSecondary,
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
    backgroundColor: palette.surfaceMuted,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: `rgba(255,255,255,${opacity.subtle})`,
    paddingHorizontal: spacing.md,
  },
  inputWrapperFocused: {
    borderColor: `rgba(73, 183, 255, 0.5)`,
    backgroundColor: `rgba(73, 183, 255, ${opacity.muted})`,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    color: palette.textPrimary,
    fontFamily: typography.bodyFamily,
    fontSize: 16,
  },
  showButton: {
    paddingLeft: spacing.sm,
    paddingVertical: spacing.sm,
  },

  // Requirements Box
  requirementsBox: {
    backgroundColor: `rgba(73, 183, 255, ${opacity.muted})`,
    borderRadius: radii.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  requirementText: {
    color: palette.textSecondary,
    fontFamily: typography.bodyFamily,
    fontSize: 12,
    lineHeight: 18,
  },

  // Buttons
  signupButton: {
    width: '100%',
    marginBottom: spacing.md,
  },
  disabledButton: {
    opacity: 0.5,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  feedbackText: {
    color: palette.textSecondary,
    fontFamily: typography.bodyFamily,
    fontSize: 12,
  },
  errorText: {
    marginBottom: spacing.sm,
    color: palette.spam,
    fontFamily: typography.bodyFamily,
    fontSize: 12,
    textAlign: 'center',
  },

  // Login Prompt
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: palette.textSecondary,
    fontFamily: typography.bodyFamily,
    fontSize: 14,
  },
  loginLink: {
    color: `rgba(73, 183, 255, 0.9)`,
    fontFamily: typography.bodyFamily,
    fontSize: 14,
    fontWeight: '900',
  },

  // Privacy Note
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `rgba(73, 183, 255, ${opacity.muted})`,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  privacyIcon: {
    marginRight: 4,
  },
  privacyText: {
    flex: 1,
    color: palette.textSecondary,
    fontFamily: typography.bodyFamily,
    fontSize: 12,
    lineHeight: 16,
  },
});
