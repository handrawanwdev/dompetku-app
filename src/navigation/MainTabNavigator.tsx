import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, ICON_SIZES, RADIUS } from '../theme';

import { DashboardScreen } from '../modules/dashboard/DashboardScreen';
import { TransactionNavigator } from '../modules/transaction/TransactionNavigator';
import { WalletScreen } from '../modules/finance/screens/WalletScreen';
import { ProfileScreen } from '../modules/settings/screens/ProfileScreen';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

function TabIcon({ icon, focused }: { icon: keyof typeof MaterialIcons.glyphMap; focused: boolean }) {
  return (
    <View style={[tabStyles.indicator, focused && tabStyles.indicatorActive]}>
      <MaterialIcons name={icon} size={ICON_SIZES.xl} color={focused ? COLORS.primary : COLORS.textMuted} />
    </View>
  );
}

export function MainTabNavigator() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 0,
          height: 68 + insets.bottom,
          paddingBottom: 8 + insets.bottom,
          paddingTop: 8,
          elevation: 10,
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 14,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: { fontSize: FONTS.xs, fontWeight: '600', marginTop: 4 },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused }) => <TabIcon icon="dashboard" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Transaction"
        component={TransactionNavigator}
        options={{
          title: 'Transaksi',
          tabBarIcon: ({ focused }) => <TabIcon icon="swap-vert" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          title: 'Dompet',
          tabBarIcon: ({ focused }) => <TabIcon icon="account-balance-wallet" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profil',
          tabBarIcon: ({ focused }) => <TabIcon icon="person" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

const tabStyles = StyleSheet.create({
  indicator: {
    width: 56,
    height: 30,
    borderRadius: RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorActive: { backgroundColor: COLORS.primarySoft },
});
