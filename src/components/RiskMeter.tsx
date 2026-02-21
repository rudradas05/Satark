import React, { useEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '../state/ThemeState';
import {
  opacity,
  radii,
  shadow,
  spacing,
  typography,
} from '../theme/tokens';
import { ThreatLevel } from '../types/message';

interface RiskMeterProps {
  label: string;
  score: number;
  confidence: number;
  level: ThreatLevel;
}

interface LevelColorMap {
  safe: string;
  suspicious: string;
  spam: string;
}

function getLevelColorMap(palette: any): LevelColorMap {
  return {
    safe: palette.safe,
    suspicious: palette.suspicious,
    spam: palette.spam,
  };
}

function clamp(n: number, min: number, max: number) {
  'worklet';
  return Math.max(min, Math.min(n, max));
}

export function RiskMeter({ label, score, confidence, level }: RiskMeterProps) {
  const { palette } = useTheme();
  const levelColorMap = getLevelColorMap(palette);
  
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

  const gradientId = useMemo(() => `riskGrad_${level}`, [level]);

  return (
    <View style={[styles.card, { backgroundColor: palette.surface, borderColor: `rgba(255,255,255,${opacity.subtle})` }]}>
      <View style={styles.row}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={[styles.label, { color: palette.textSecondary }]} numberOfLines={1}>
            {label}
          </Text>
        </View>

        <Text style={[styles.score, { color: accent }]}>{clampedScore}%</Text>
      </View>

      <View style={[styles.track, { borderColor: `rgba(255,255,255,${opacity.subtle})` }]} onLayout={onTrackLayout}>
        <View style={[styles.trackInner, { backgroundColor: palette.backgroundElevated }]} />

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
          <Text style={[styles.confText, { color: palette.textSecondary }]}>
            Confidence {Math.round(clampedConfidence * 100)}%
          </Text>
        </View>

        <Text style={[styles.hint, { color: palette.textSecondary }]} numberOfLines={1}>
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
    borderRadius: radii.lg,
    borderWidth: 1,
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
  },
  trackInner: {
    ...StyleSheet.absoluteFillObject,
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
    fontFamily: typography.bodyFamily,
    fontSize: typography.label,
    fontWeight: '700',
  },
  hint: {
    fontFamily: typography.bodyFamily,
    fontSize: typography.label,
  },
});