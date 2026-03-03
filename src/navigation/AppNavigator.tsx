import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  LayoutGrid,
  MessageSquareText,
  Settings,
  ShieldAlert,
  type LucideIcon,
} from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { DashboardScreen } from '../screens/DashboardScreen';
import { MessageDetailScreen } from '../screens/MessageDetailScreen';
import { MessagesScreen } from '../screens/MessagesScreen';
import { RulesScreen } from '../screens/RulesScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignupScreen } from '../screens/auth/SignupScreen';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';

import { useAuth } from '../state/AuthState';
import { useTheme } from '../state/ThemeState';
import { opacity, radii, spacing, themedBorder } from '../theme/tokens';

import type {
  AuthStackParamList,
  MessagesStackParamList,
  RootTabParamList,
} from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();
const MessageStack = createNativeStackNavigator<MessagesStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const tabIconMap: Record<keyof RootTabParamList, LucideIcon> = {
  Dashboard: LayoutGrid,
  Messages: MessageSquareText,
  Rules: ShieldAlert,
  Settings,
};

function MessagesStackNavigator() {
  return (
    <MessageStack.Navigator screenOptions={{ headerShown: false }}>
      <MessageStack.Screen name="MessageList" component={MessagesScreen} />
      <MessageStack.Screen
        name="MessageDetail"
        component={MessageDetailScreen}
      />
    </MessageStack.Navigator>
  );
}

function TabIcon({
  focused,
  routeName,
}: {
  focused: boolean;
  routeName: keyof RootTabParamList;
}) {
  const Icon = tabIconMap[routeName];
  const { palette, mode } = useTheme();
  const isDark = mode === 'dark';

  return (
    <View
      style={[
        styles.iconWrap,
        focused && {
          backgroundColor: isDark
            ? `rgba(73, 183, 255, ${opacity?.muted ?? 0.16})`
            : `rgba(26, 127, 232, 0.1)`,
        },
      ]}
    >
      <Icon
        size={20}
        strokeWidth={focused ? 2.6 : 2}
        color={focused ? palette.accent : palette.textSecondary}
      />
      <Text
        style={[
          styles.tabLabel,
          { color: focused ? palette.accent : palette.textSecondary },
          focused && styles.tabLabelActive,
        ]}
        numberOfLines={1}
      >
        {routeName}
      </Text>
    </View>
  );
}

function AppTabs() {
  const { palette, mode } = useTheme();
  const isDark = mode === 'dark';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: isDark
              ? 'rgba(11, 20, 34, 0.95)'
              : 'rgba(255, 255, 255, 0.97)',
            borderTopColor: themedBorder(isDark),
          },
        ],
        tabBarItemStyle: styles.tabBarItem,
        tabBarActiveTintColor: palette.textPrimary,
        tabBarInactiveTintColor: palette.textSecondary,
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({ focused }) => (
          <TabIcon
            focused={focused}
            routeName={route.name as keyof RootTabParamList}
          />
        ),
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Messages" component={MessagesStackNavigator} />
      <Tab.Screen name="Rules" component={RulesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Welcome"
    >
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
}

export function AppNavigator() {
  const { isAuthenticated, isHydrating } = useAuth();
  const { palette } = useTheme();

  if (isHydrating) {
    return (
      <View
        style={[styles.bootScreen, { backgroundColor: palette.background }]}
      >
        <ActivityIndicator size="large" color={palette.accent} />
      </View>
    );
  }

  return isAuthenticated ? <AppTabs /> : <AuthNavigator />;
}

const styles = StyleSheet.create({
  bootScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    borderTopWidth: 1,
    elevation: 0,
    height: 72,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarItem: {
    paddingVertical: spacing.xxs,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radii.xl,
    gap: 4,
  },
  tabLabel: {
    fontFamily: 'sans-serif',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    fontWeight: '900',
  },
});
