import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, ICON_SIZES } from '../theme';

import { DashboardScreen } from '../modules/dashboard/DashboardScreen';
import { TransactionNavigator } from '../modules/transaction/TransactionNavigator';
import { FinanceTabNavigator } from './FinanceTabNavigator';
import { SettingsNavigator } from '../modules/settings/SettingsNavigator';

const Tab = createBottomTabNavigator();

function TabIcon({ icon, focused }: { icon: keyof typeof MaterialIcons.glyphMap; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <MaterialIcons name={icon} size={ICON_SIZES.xxl} color={focused ? COLORS.primary : COLORS.textMuted} />
    </View>
  );
}

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 6,
          paddingTop: 4,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: { fontSize: FONTS.xs, fontWeight: '600', marginTop: 1 },
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
        name="Finance"
        component={FinanceTabNavigator}
        options={{
          title: 'Keuangan',
          tabBarIcon: ({ focused }) => <TabIcon icon="account-balance" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{
          title: 'Pengaturan',
          tabBarIcon: ({ focused }) => <TabIcon icon="settings" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}
