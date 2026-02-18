import { Platform } from 'react-native';

const headingFamily = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

const bodyFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'sans-serif',
});

export const palette = {
  // Core
  background: '#060C14',
  backgroundElevated: '#0B1422',

  // Surfaces
  surface: '#101D2F',
  surfaceMuted: '#13243B',

  // Lines
  border: '#223552',

  // Text
  textPrimary: '#F0F6FF',
  textSecondary: '#9FB5D3',

  // Brand / Accent
  accent: '#49B7FF',

  // Status
  safe: '#2ED8A1',
  suspicious: '#F6B24E',
  spam: '#FF6363',

  // Utility
  white: '#FFFFFF',
  black: '#000000',
};

export const opacity = {
  subtle: 0.12,
  muted: 0.2,
  medium: 0.35,
  strong: 0.6,
};

export const spacing = {
  // 4pt-ish system (easier to compose consistently)
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
};

export const radii = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
  pill: 999,
};

export const typography = {
  headingFamily: headingFamily ?? 'monospace',
  bodyFamily: bodyFamily ?? 'sans-serif',

  // Sizes
  h1: 28,
  h2: 22,
  h3: 18,
  body: 14,
  label: 12,

  // Line heights (makes text look much nicer)
  lhTight: 1.15,
  lhNormal: 1.35,
  lhRelaxed: 1.55,
};

export const sizes = {
  headerHeight: 56,
  buttonHeight: 48,
  inputHeight: 48,
  chipHeight: 34,
  icon: 20,
};

export const shadow = Platform.select({
  ios: {
    card: {
      shadowColor: palette.black,
      shadowOpacity: 0.35,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 8 },
    },
    soft: {
      shadowColor: palette.black,
      shadowOpacity: 0.22,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
    },
  },
  android: {
    card: { elevation: 6 },
    soft: { elevation: 3 },
  },
  default: {
    card: {},
    soft: {},
  },
});
