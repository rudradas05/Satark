import { ArrowLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
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
import {
  opacity,
  palette,
  radii,
  shadow,
  spacing,
  typography,
} from '../../theme/tokens';

export function SignupScreen({ navigation }: any) {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const canContinue = useMemo(
    () =>
      name.trim().length >= 2 &&
      email.trim().length > 3 &&
      password.trim().length >= 4,
    [name, email, password],
  );
  const PasswordVisibilityIcon = showPass ? EyeOff : Eye;

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
              {/* Name Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    focusedInput === 'name' && styles.inputWrapperFocused,
                  ]}
                >
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    onFocus={() => setFocusedInput('name')}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="John Doe"
                    placeholderTextColor={palette.textSecondary}
                    style={styles.input}
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
                    placeholder="Minimum 8 characters"
                    placeholderTextColor={palette.textSecondary}
                    style={styles.input}
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
                  - At least 8 characters
                </Text>
                <Text style={styles.requirementText}>
                  - Mix of letters and numbers
                </Text>
              </View>

              {/* Signup Button */}
              <ActionButton
                label="Create Account"
                variant="primary"
                disabled={!canContinue}
                onPress={() => signup(name.trim(), email.trim(), password)}
                style={[
                  styles.signupButton,
                  canContinue ? {} : styles.disabledButton,
                ]}
              />

              {/* Login Link */}
              <View style={styles.loginPrompt}>
                <Text style={styles.loginText}>Already a member? </Text>
                <Pressable onPress={() => navigation.navigate('Login')}>
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
