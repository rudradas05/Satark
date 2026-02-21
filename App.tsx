import { NavigationContainer, Theme } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from './src/navigation/AppNavigator';
import { AuthProvider } from './src/state/AuthState';
import { MessageStateProvider } from './src/state/MessageState';

import { ThemeProvider, useTheme } from './src/state/ThemeState';
import { ToastProvider } from './src/state/ToastState';

function AppContent() {
  const { mode, palette } = useTheme();
  const isDark = mode === 'dark';
  const navTheme = useMemo<Theme>(
    () => ({
      dark: isDark,
      colors: {
        primary: palette.accent,
        background: palette.background,
        card: palette.surface,
        text: palette.textPrimary,
        border: palette.border,
        notification: palette.spam,
      },
      fonts: {
        regular: { fontFamily: 'System', fontWeight: '400' },
        medium: { fontFamily: 'System', fontWeight: '500' },
        bold: { fontFamily: 'System', fontWeight: '700' },
        heavy: { fontFamily: 'System', fontWeight: '800' },
      },
    }),
    [isDark, palette],
  );

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar
        backgroundColor={palette.background}
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      <AppNavigator />
    </NavigationContainer>
  );
}

function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ToastProvider>
            <MessageStateProvider>
              <AuthProvider>
                <AppContent />
              </AuthProvider>
            </MessageStateProvider>
          </ToastProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export default App;
