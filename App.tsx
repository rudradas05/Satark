import { NavigationContainer, Theme } from '@react-navigation/native';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from './src/navigation/AppNavigator';
import { MessageStateProvider } from './src/state/MessageState';
import { AuthProvider } from './src/state/AuthState'; // ✅ ADD THIS
import { palette } from './src/theme/tokens';

const navTheme: Theme = {
  dark: true,
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
};

function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <MessageStateProvider>
          <AuthProvider>
            <NavigationContainer theme={navTheme}>
              <StatusBar
                backgroundColor={palette.background}
                barStyle="light-content"
              />
              <AppNavigator />
            </NavigationContainer>
          </AuthProvider>
        </MessageStateProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export default App;
