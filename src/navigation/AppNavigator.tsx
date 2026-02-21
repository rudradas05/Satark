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
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { DashboardScreen } from '../screens/DashboardScreen';
import { MessageDetailScreen } from '../screens/MessageDetailScreen';
import { MessagesScreen } from '../screens/MessagesScreen';
import { RulesScreen } from '../screens/RulesScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignupScreen } from '../screens/auth/SignupScreen';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';

import { useAuth } from '../state/AuthState';
import { opacity, palette, radii, spacing } from '../theme/tokens';

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

  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Icon
        size={22}
        strokeWidth={focused ? 2.5 : 2.1}
        color={focused ? palette.textPrimary : palette.textSecondary}
      />
    </View>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
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

  if (isHydrating) {
    return (
      <View style={styles.bootScreen}>
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
    backgroundColor: palette.background,
  },
  tabBar: {
    backgroundColor: `rgba(11, 20, 34, 0.92)`,
    borderTopWidth: 1,
    borderTopColor: `rgba(255,255,255,${opacity?.subtle ?? 0.08})`,
    elevation: 0,
    height: 80,
    paddingBottom: 12,
    paddingTop: 10,
  },
  tabBarItem: {
    paddingVertical: spacing.xs,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 56,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: `rgba(255,255,255,${opacity?.subtle ?? 0.08})`,
  },
  iconWrapActive: {
    backgroundColor: `rgba(73, 183, 255, ${opacity?.muted ?? 0.16})`,
    borderColor: `rgba(73, 183, 255, 0.55)`,
  },
});
