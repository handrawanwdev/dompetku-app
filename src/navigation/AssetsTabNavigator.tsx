import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { COLORS } from '../theme';

// These will be replaced once module screens exist
// Using lazy imports to avoid circular deps
import { SavingsNavigator } from '../modules/savings/SavingsNavigator';
import { InvestmentNavigator } from '../modules/investment/InvestmentNavigator';
import { AssetsNavigator } from '../modules/assets/AssetsNavigator';

const Tab = createBottomTabNavigator();

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.6 }}>{emoji}</Text>
  );
}

export function AssetsTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1E293B',
          borderTopColor: '#334155',
          borderTopWidth: 1,
          height: 56,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500', marginBottom: 4 },
      }}
    >
      <Tab.Screen
        name="SavingsTab"
        component={SavingsNavigator}
        options={{
          title: 'Tabungan',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏦" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="InvestmentTab"
        component={InvestmentNavigator}
        options={{
          title: 'Investasi',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📈" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="PhysicalAssetsTab"
        component={AssetsNavigator}
        options={{
          title: 'Aset Fisik',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}
