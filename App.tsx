import { NavigationContainer, Theme } from '@react-navigation/native';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { darkPalette } from './src/theme/tokens';
import { AppNavigator } from './src/navigation/AppNavigator';
import { MessageStateProvider } from './src/state/MessageState';
import { AuthProvider } from './src/state/AuthState';
import { ThemeProvider, useTheme } from './src/state/ThemeState';

const navTheme: Theme = {
  dark: true,
  colors: {
    primary: darkPalette.accent,
    background: darkPalette.background,
    card: darkPalette.surface,
    text: darkPalette.textPrimary,
    border: darkPalette.border,
    notification: darkPalette.spam,
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' },
    medium: { fontFamily: 'System', fontWeight: '500' },
    bold: { fontFamily: 'System', fontWeight: '700' },
    heavy: { fontFamily: 'System', fontWeight: '800' },
  },
};

function AppContent() {
  const { palette } = useTheme();

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar
        backgroundColor={palette.background}
        barStyle="light-content"
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
          <MessageStateProvider>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </MessageStateProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export default App;