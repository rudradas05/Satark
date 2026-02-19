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
import {
  opacity,
  palette,
  radii,
  shadow,
  spacing,
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

  return (
    <View style={styles.featureCard}>
      <View style={styles.iconBox}>
        <Icon
          size={24}
          strokeWidth={2.3}
          color={`rgba(73, 183, 255, 0.9)`}
        />
      </View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDesc}>{description}</Text>
      {stat && <Text style={styles.featureStat}>{stat}</Text>}
    </View>
  );
}

function StatItem({ number, label }: { number: string; label: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export function WelcomeScreen({ navigation }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <View style={styles.root}>
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
              <View style={styles.logo}>
                <Text style={styles.logoText}>S</Text>
              </View>

              <Text style={styles.mainHeading}>Satark</Text>
              <Text style={styles.subHeading}>SMS Threat Guard</Text>

              <Text style={styles.heroDescription}>
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
            <View style={styles.statsSection}>
              <StatItem number="100%" label="Local" />
              <StatItem number="Zero" label="Cloud" />
              <StatItem number="INF" label="Free" />
            </View>

            {/* CTA Section */}
            <View style={styles.ctaSection}>
              <Text style={styles.ctaTitle}>Get Started</Text>

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
                <Text style={styles.disclaimer}>
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
  root: { flex: 1, backgroundColor: palette.background },
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
    backgroundColor: `rgba(73, 183, 255, ${opacity.muted})`,
    borderWidth: 2,
    borderColor: `rgba(73, 183, 255, 0.6)`,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.soft,
    marginBottom: spacing.sm,
  },
  logoText: {
    color: palette.textPrimary,
    fontFamily: typography.headingFamily,
    fontSize: 32,
    fontWeight: '900',
  },
  mainHeading: {
    color: palette.textPrimary,
    fontFamily: typography.headingFamily,
    fontSize: 36,
    fontWeight: '900',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  subHeading: {
    color: `rgba(73, 183, 255, 0.8)`,
    fontFamily: typography.headingFamily,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: spacing.sm,
    letterSpacing: 0.3,
  },
  heroDescription: {
    color: palette.textSecondary,
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
    backgroundColor: `rgba(255, 255, 255, ${opacity.subtle})`,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: `rgba(255, 255, 255, ${opacity.subtle})`,
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
    color: palette.textPrimary,
    fontFamily: typography.headingFamily,
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 2,
    textAlign: 'center',
  },
  featureDesc: {
    color: palette.textSecondary,
    fontFamily: typography.bodyFamily,
    fontSize: 11,
    lineHeight: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  featureStat: {
    color: `rgba(73, 183, 255, 0.8)`,
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
    borderColor: `rgba(255, 255, 255, ${opacity.subtle})`,
    backgroundColor: `rgba(255, 255, 255, ${opacity.subtle})`,
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
    color: `rgba(73, 183, 255, 0.9)`,
    fontFamily: typography.headingFamily,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 2,
  },
  statLabel: {
    color: palette.textSecondary,
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
    color: palette.textPrimary,
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
    color: palette.textSecondary,
    fontFamily: typography.bodyFamily,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});
