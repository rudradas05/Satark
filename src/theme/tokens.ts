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

// DARK PALETTE (current)
export const darkPalette = {
  background: '#060C14',
  backgroundElevated: '#0B1422',
  surface: '#101D2F',
  surfaceMuted: '#13243B',
  border: '#223552',
  textPrimary: '#F0F6FF',
  textSecondary: '#9FB5D3',
  accent: '#49B7FF',
  safe: '#2ED8A1',
  suspicious: '#F6B24E',
  spam: '#FF6363',
  white: '#FFFFFF',
  black: '#000000',
};

// LIGHT PALETTE
export const lightPalette = {
  background: '#F6F8FC',
  backgroundElevated: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceMuted: '#EEF1F6',
  border: '#D8DDE6',
  textPrimary: '#111827',
  textSecondary: '#5B6478',
  accent: '#1A7FE8',
  safe: '#0DA678',
  suspicious: '#D4920A',
  spam: '#DC3545',
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
  h1: 28,
  h2: 22,
  h3: 18,
  body: 14,
  label: 12,
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
      shadowColor: darkPalette.black,
      shadowOpacity: 0.35,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 8 },
    },
    soft: {
      shadowColor: darkPalette.black,
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

// Default to dark (can be changed)
export const palette = darkPalette;

/** Returns appropriate overlay rgba based on dark/light mode */
export function overlayColor(isDark: boolean, alpha: number): string {
  return isDark ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha * 0.6})`;
}

/** Returns a themed border color */
export function themedBorder(isDark: boolean): string {
  return isDark ? `rgba(255,255,255,${opacity.subtle})` : `rgba(0,0,0,0.08)`;
}
