import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS, FONTS } from '../theme';

import { DashboardScreen } from '../modules/dashboard/DashboardScreen';
import { IncomeNavigator } from '../modules/income/IncomeNavigator';
import { ExpenseNavigator } from '../modules/expense/ExpenseNavigator';
import { DebtNavigator } from '../modules/debt/DebtNavigator';
import { AssetsTabNavigator } from './AssetsTabNavigator';
import { SettingsNavigator } from '../modules/settings/SettingsNavigator';

const Tab = createBottomTabNavigator();

function TabIcon({ emoji, label, focused }: { emoji: string; label?: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.55 }}>{emoji}</Text>
    </View>
  );
}

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111827',
          borderTopColor: '#1F2937',
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: { fontSize: FONTS.xs, fontWeight: '500' },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Beranda',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Income"
        component={IncomeNavigator}
        options={{
          title: 'Pemasukan',
          tabBarIcon: ({ focused }) => <TabIcon emoji="💰" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Expense"
        component={ExpenseNavigator}
        options={{
          title: 'Pengeluaran',
          tabBarIcon: ({ focused }) => <TabIcon emoji="💸" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Debt"
        component={DebtNavigator}
        options={{
          title: 'Hutang',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📋" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Assets"
        component={AssetsTabNavigator}
        options={{
          title: 'Aset',
          tabBarIcon: ({ focused }) => <TabIcon emoji="💎" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{
          title: 'Pengaturan',
          tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}
