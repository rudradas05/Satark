import React, { useEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {
  opacity,
  palette,
  radii,
  shadow,
  spacing,
  typography,
} from '../theme/tokens';
import { ThreatLevel } from '../types/message';

interface RiskMeterProps {
  label: string;
  score: number; // 0..100
  confidence: number; // 0..1
  level: ThreatLevel;
}

const levelColorMap: Record<ThreatLevel, string> = {
  safe: palette.safe,
  suspicious: palette.suspicious,
  spam: palette.spam,
};

function clamp(n: number, min: number, max: number) {
  'worklet';
  return Math.max(min, Math.min(n, max));
}

export function RiskMeter({ label, score, confidence, level }: RiskMeterProps) {
  const clampedScore = Math.round(clamp(score, 0, 100));
  const clampedConfidence = clamp(confidence, 0, 1);

  const accent = levelColorMap[level];
  const progress = useSharedValue(0);
  const [trackWidth, setTrackWidth] = useState(0);

  useEffect(() => {
    progress.value = withTiming(clampedScore / 100, {
      duration: 900,
      easing: Easing.out(Easing.cubic),
    });
  }, [clampedScore, progress]);

  const animatedFillStyle = useAnimatedStyle(() => {
    const w = trackWidth * progress.value;
    return { width: Math.max(10, w) };
  });

  const onTrackLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  };

  // Gradient IDs must be stable (avoid re-mount flicker)
  const gradientId = useMemo(() => `riskGrad_${level}`, [level]);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.label} numberOfLines={1}>
            {label}
          </Text>
        </View>

        <Text style={[styles.score, { color: accent }]}>{clampedScore}%</Text>
      </View>

      <View style={styles.track} onLayout={onTrackLayout}>
        {/* Track surface */}
        <View style={styles.trackInner} />

        {/* Animated fill with gradient */}
        <Animated.View style={[styles.fillWrap, animatedFillStyle]}>
          <Svg width="100%" height="100%" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0%" stopColor={accent} stopOpacity="0.55" />
                <Stop offset="55%" stopColor={accent} stopOpacity="0.85" />
                <Stop offset="100%" stopColor={accent} stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <Rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              rx={radii.pill}
              fill={`url(#${gradientId})`}
            />
          </Svg>
        </Animated.View>
      </View>

      <View style={styles.metaRow}>
        <View
          style={[
            styles.confChip,
            {
              borderColor: `rgba(255,255,255,${opacity.subtle})`,
              backgroundColor: `rgba(255,255,255,${opacity.subtle})`,
            },
          ]}
        >
          <Text style={styles.confText}>
            Confidence {Math.round(clampedConfidence * 100)}%
          </Text>
        </View>

        <Text style={styles.hint} numberOfLines={1}>
          Level:{' '}
          <Text style={{ color: accent, fontWeight: '800' }}>
            {level.toUpperCase()}
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: `rgba(255,255,255,${opacity.subtle})`,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadow.card,
  },
  row: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  label: {
    color: palette.textSecondary,
    fontFamily: typography.bodyFamily,
    fontSize: typography.body,
    fontWeight: '700',
  },
  score: {
    fontFamily: typography.headingFamily,
    fontSize: typography.h3,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  track: {
    height: 12,
    borderRadius: radii.pill,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: `rgba(255,255,255,${opacity.subtle})`,
  },
  trackInner: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: palette.backgroundElevated,
    opacity: 0.9,
  },
  fillWrap: {
    height: '100%',
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  metaRow: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  confChip: {
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  confText: {
    color: palette.textSecondary,
    fontFamily: typography.bodyFamily,
    fontSize: typography.label,
    fontWeight: '700',
  },
  hint: {
    color: palette.textSecondary,
    fontFamily: typography.bodyFamily,
    fontSize: typography.label,
  },
});
