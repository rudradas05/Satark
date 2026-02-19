import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';

import { useTheme } from '../state/ThemeState';
import {
  opacity,
  radii,
  sizes,
  spacing,
  typography,
} from '../theme/tokens';
import { ThreatLevel } from '../types/message';

export type MessageFilter = 'all' | ThreatLevel;

interface FilterChipsProps {
  selected: MessageFilter;
  onSelect: (value: MessageFilter) => void;
}

const filters: { id: MessageFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'spam', label: 'Spam' },
  { id: 'suspicious', label: 'Suspicious' },
  { id: 'safe', label: 'Safe' },
];

interface ChipTone {
  tint: string;
  border: string;
  text: string;
}

function getChipTone(filter: MessageFilter, palette: any): ChipTone {
  switch (filter) {
    case 'spam':
      return {
        tint: `rgba(255, 99, 99, ${opacity.muted})`,
        border: `rgba(255, 99, 99, 0.55)`,
        text: palette.spam,
      };
    case 'suspicious':
      return {
        tint: `rgba(246, 178, 78, ${opacity.muted})`,
        border: `rgba(246, 178, 78, 0.55)`,
        text: palette.suspicious,
      };
    case 'safe':
      return {
        tint: `rgba(46, 216, 161, ${opacity.muted})`,
        border: `rgba(46, 216, 161, 0.55)`,
        text: palette.safe,
      };
    default:
      return {
        tint: `rgba(73, 183, 255, ${opacity.muted})`,
        border: `rgba(73, 183, 255, 0.55)`,
        text: palette.accent,
      };
  }
}

export function FilterChips({ selected, onSelect }: FilterChipsProps) {
  const { palette } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {filters.map(filter => {
        const isActive = selected === filter.id;
        const tone = getChipTone(filter.id, palette);

        return (
          <Pressable
            key={filter.id}
            onPress={() => onSelect(filter.id)}
            hitSlop={6}
            style={({ pressed }) =>
              [
                styles.chip,
                isActive
                  ? {
                      backgroundColor: tone.tint,
                      borderColor: tone.border,
                    }
                  : {
                      backgroundColor: `rgba(255,255,255,${opacity.subtle})`,
                      borderColor: `rgba(255,255,255,${opacity.subtle})`,
                    },
                pressed ? styles.pressed : null,
              ] as ViewStyle[]
            }
          >
            <Text
              style={[
                styles.label,
                {
                  color: isActive ? palette.textPrimary : palette.textSecondary,
                },
              ]}
              numberOfLines={1}
            >
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  chip: {
    height: sizes.chipHeight,
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  label: {
    fontFamily: typography.bodyFamily,
    fontSize: typography.label,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});