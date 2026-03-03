import {
  BarChart3,
  BellRing,
  Lock,
  ShieldCheck,
  Zap,
  type LucideIcon,
} from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBackground } from '../../components/AppBackground';
import { ActionButton } from '../../components/ActionButton';
import { useTheme } from '../../state/ThemeState';
import {
  opacity,
  radii,
  shadow,
  spacing,
  themedBorder,
  typography,
} from '../../theme/tokens';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  stat?: string;
}

function FeatureCard({ icon, title, description, stat }: FeatureCardProps) {
  const Icon = icon;
  const { palette, mode } = useTheme();
  const isDark = mode === 'dark';

  return (
    <View
      style={[
        styles.featureCard,
        {
          backgroundColor: isDark
            ? `rgba(255, 255, 255, ${opacity.subtle})`
            : `rgba(0, 0, 0, 0.03)`,
          borderColor: themedBorder(isDark),
        },
      ]}
    >
      <View style={styles.iconBox}>
        <Icon size={24} strokeWidth={2.3} color={palette.accent} />
      </View>
      <Text style={[styles.featureTitle, { color: palette.textPrimary }]}>
        {title}
      </Text>
      <Text style={[styles.featureDesc, { color: palette.textSecondary }]}>
        {description}
      </Text>
      {stat && (
        <Text style={[styles.featureStat, { color: palette.accent }]}>
          {stat}
        </Text>
      )}
    </View>
  );
}

function StatItem({ number, label }: { number: string; label: string }) {
  const { palette } = useTheme();
  return (
    <View style={styles.statItem}>
      <Text style={[styles.statNumber, { color: palette.accent }]}>
        {number}
      </Text>
      <Text style={[styles.statLabel, { color: palette.textSecondary }]}>
        {label}
      </Text>
    </View>
  );
}

export function WelcomeScreen({ navigation }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { palette, mode } = useTheme();
  const isDark = mode === 'dark';
  const border = themedBorder(isDark);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <View style={[styles.root, { backgroundColor: palette.background }]}>
      <AppBackground />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
        >
          <Animated.View style={[{ opacity: fadeAnim }]}>
            {/* Hero Section - Compact */}
            <View style={styles.heroSection}>
              <View
                style={[
                  styles.logo,
                  {
                    backgroundColor: isDark
                      ? `rgba(73, 183, 255, ${opacity.muted})`
                      : `rgba(26, 127, 232, 0.12)`,
                    borderColor: palette.accent,
                  },
                ]}
              >
                <Text style={[styles.logoText, { color: palette.textPrimary }]}>
                  S
                </Text>
              </View>

              <Text
                style={[styles.mainHeading, { color: palette.textPrimary }]}
              >
                Satark
              </Text>
              <Text style={[styles.subHeading, { color: palette.accent }]}>
                SMS Threat Guard
              </Text>

              <Text
                style={[
                  styles.heroDescription,
                  { color: palette.textSecondary },
                ]}
              >
                Real-time fraud detection & smart blocking
              </Text>
            </View>

            {/* Features Grid - 2x2 Compact */}
            <View style={styles.featuresSection}>
              <View style={styles.featureRow}>
                <FeatureCard
                  icon={Zap}
                  title="Live Detection"
                  description="Real-time analysis"
                  stat="Instant"
                />
                <FeatureCard
                  icon={ShieldCheck}
                  title="Smart Block"
                  description="Auto-block threats"
                  stat="99%+"
                />
              </View>
              <View style={styles.featureRow}>
                <FeatureCard
                  icon={BarChart3}
                  title="Risk Score"
                  description="AI-powered"
                  stat="Accurate"
                />
                <FeatureCard
                  icon={BellRing}
                  title="Instant Alerts"
                  description="Get notified"
                  stat="Real-time"
                />
              </View>
            </View>

            {/* Stats Bar - Horizontal Compact */}
            <View
              style={[
                styles.statsSection,
                {
                  borderColor: border,
                  backgroundColor: isDark
                    ? `rgba(255, 255, 255, ${opacity.subtle})`
                    : `rgba(0, 0, 0, 0.03)`,
                },
              ]}
            >
              <StatItem number="100%" label="Local" />
              <StatItem number="Zero" label="Cloud" />
              <StatItem number="INF" label="Free" />
            </View>

            {/* CTA Section */}
            <View style={styles.ctaSection}>
              <Text style={[styles.ctaTitle, { color: palette.textPrimary }]}>
                Get Started
              </Text>

              <View style={styles.buttonGroup}>
                <ActionButton
                  label="Login"
                  variant="primary"
                  onPress={() => navigation.navigate('Login')}
                  style={{ width: '100%' }}
                />
                <ActionButton
                  label="Create Account"
                  variant="neutral"
                  onPress={() => navigation.navigate('Signup')}
                  style={{ width: '100%' }}
                />
              </View>

              <View style={styles.disclaimerRow}>
                <Lock
                  size={14}
                  strokeWidth={2.4}
                  color={palette.textSecondary}
                  style={styles.disclaimerIcon}
                />
                <Text
                  style={[styles.disclaimer, { color: palette.textSecondary }]}
                >
                  All data stays on your device
                </Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: {
    paddingBottom: spacing.md,
  },

  // Hero Section
  heroSection: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    alignItems: 'center',
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: radii.lg,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.soft,
    marginBottom: spacing.sm,
  },
  logoText: {
    fontFamily: typography.headingFamily,
    fontSize: 32,
    fontWeight: '900',
  },
  mainHeading: {
    fontFamily: typography.headingFamily,
    fontSize: 36,
    fontWeight: '900',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  subHeading: {
    fontFamily: typography.headingFamily,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: spacing.sm,
    letterSpacing: 0.3,
  },
  heroDescription: {
    fontFamily: typography.bodyFamily,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },

  // Features Section
  featuresSection: {
    paddingHorizontal: spacing.sm,
    marginVertical: spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  featureCard: {
    flex: 1,
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.sm,
    alignItems: 'center',
    ...shadow.soft,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radii.lg,
    backgroundColor: `rgba(73, 183, 255, ${opacity.muted})`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  featureTitle: {
    fontFamily: typography.headingFamily,
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 2,
    textAlign: 'center',
  },
  featureDesc: {
    fontFamily: typography.bodyFamily,
    fontSize: 11,
    lineHeight: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  featureStat: {
    fontFamily: typography.headingFamily,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  // Stats Section
  statsSection: {
    marginHorizontal: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontFamily: typography.headingFamily,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: typography.bodyFamily,
    fontSize: 11,
    textAlign: 'center',
  },

  // CTA Section
  ctaSection: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  ctaTitle: {
    fontFamily: typography.headingFamily,
    fontSize: 20,
    fontWeight: '900',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  buttonGroup: {
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  disclaimerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  disclaimerIcon: {
    marginTop: 2,
  },
  disclaimer: {
    fontFamily: typography.bodyFamily,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});
