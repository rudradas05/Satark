import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { opacity, palette, radii, spacing, typography } from '../theme/tokens';

type Variant = 'primary' | 'neutral' | 'danger';

interface ActionButtonProps {
  label: string;
  variant?: Variant;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  disabled?: boolean;
}

const stylesByVariant: Record<
  Variant,
  { background: string; border: string; text: string }
> = {
  primary: {
    background: `rgba(73, 183, 255, ${opacity.muted})`,
    border: 'rgba(73, 183, 255, 0.55)',
    text: palette.textPrimary,
  },
  neutral: {
    background: `rgba(255, 255, 255, ${opacity.subtle})`,
    border: `rgba(255, 255, 255, ${opacity.subtle})`,
    text: palette.textPrimary,
  },
  danger: {
    background: 'rgba(255, 99, 99, 0.16)',
    border: 'rgba(255, 99, 99, 0.52)',
    text: palette.textPrimary,
  },
};

export function ActionButton({
  label,
  variant = 'neutral',
  onPress,
  style,
  disabled = false,
}: ActionButtonProps) {
  const theme = stylesByVariant[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.background, borderColor: theme.border },
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
        style,
      ]}
    >
      <Text style={[styles.label, { color: theme.text }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radii.lg,
    borderWidth: 1,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.95,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    fontFamily: typography.bodyFamily,
    fontSize: typography.body,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
});
