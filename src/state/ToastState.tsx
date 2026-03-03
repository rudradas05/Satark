import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { opacity, radii, shadow, spacing, typography } from '../theme/tokens';
import { useTheme } from './ThemeState';

type ToastType = 'success' | 'error' | 'info';

type ToastInput =
  | string
  | {
      message: string;
      type?: ToastType;
      durationMs?: number;
    };

type ActiveToast = {
  message: string;
  type: ToastType;
  durationMs: number;
};

type ToastContextValue = {
  showToast: (input: ToastInput) => void;
};

const DEFAULT_DURATION_MS = 2400;
const ToastContext = createContext<ToastContextValue | null>(null);

function normalizeToastInput(input: ToastInput): ActiveToast {
  if (typeof input === 'string') {
    return {
      message: input,
      type: 'info',
      durationMs: DEFAULT_DURATION_MS,
    };
  }

  return {
    message: input.message,
    type: input.type ?? 'info',
    durationMs: input.durationMs ?? DEFAULT_DURATION_MS,
  };
}

function getToastColors(type: ToastType, textColor: string) {
  if (type === 'success') {
    return {
      background: 'rgba(46,216,161,0.18)',
      border: 'rgba(46,216,161,0.5)',
      text: textColor,
    };
  }

  if (type === 'error') {
    return {
      background: 'rgba(255,99,99,0.2)',
      border: 'rgba(255,99,99,0.6)',
      text: textColor,
    };
  }

  return {
    background: `rgba(73,183,255,${opacity.muted})`,
    border: 'rgba(73,183,255,0.55)',
    text: textColor,
  };
}

export const ToastProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const insets = useSafeAreaInsets();
  const { palette: themePalette } = useTheme();
  const [toast, setToast] = useState<ActiveToast | null>(null);
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(-12)).current;
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!toast) {
      return;
    }

    clearTimer();
    opacityAnim.setValue(0);
    translateYAnim.setValue(-12);

    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();

    hideTimerRef.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: -8,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setToast(null);
      });
    }, toast.durationMs);

    return clearTimer;
  }, [clearTimer, opacityAnim, toast, translateYAnim]);

  const showToast = useCallback((input: ToastInput) => {
    const nextToast = normalizeToastInput(input);
    setToast(nextToast);
  }, []);

  const value = useMemo(
    () => ({
      showToast,
    }),
    [showToast],
  );

  const colors = toast
    ? getToastColors(toast.type, themePalette.textPrimary)
    : null;

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && colors ? (
        <View pointerEvents="box-none" style={styles.overlay}>
          <Animated.View
            style={[
              styles.toast,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
                marginTop: insets.top + spacing.sm,
                opacity: opacityAnim,
                transform: [{ translateY: translateYAnim }],
              },
            ]}
          >
            <Text style={[styles.message, { color: colors.text }]}>
              {toast.message}
            </Text>
          </Animated.View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    zIndex: 40,
    pointerEvents: 'none',
  },
  toast: {
    minHeight: 44,
    maxWidth: '92%',
    borderRadius: radii.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
    ...shadow.soft,
  },
  message: {
    fontFamily: typography.bodyFamily,
    fontSize: typography.label,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 18,
  },
});
