import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';

import { SavingsNavigator } from '../modules/savings/SavingsNavigator';
import { InvestmentNavigator } from '../modules/investment/InvestmentNavigator';
import { AssetsNavigator } from '../modules/assets/AssetsNavigator';

const Tab = createBottomTabNavigator();

const ROUTE_EMOJI: Record<string, string> = {
  SavingsTab: '🏦',
  InvestmentTab: '📈',
  PhysicalAssetsTab: '🏠',
};

function AssetsSegmentedTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.tabBar}>
      <View style={styles.segmentTrack}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = (options.title ?? route.name) as string;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.7}
              style={[styles.segment, isFocused && styles.segmentActive]}
            >
              <Text style={[styles.segmentEmoji, isFocused && styles.segmentEmojiActive]}>
                {ROUTE_EMOJI[route.name] ?? '•'}
              </Text>
              <Text style={[styles.segmentLabel, isFocused && styles.segmentLabelActive]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export function AssetsTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <AssetsSegmentedTabBar {...props} />}
    >
      <Tab.Screen name="SavingsTab" component={SavingsNavigator} options={{ title: 'Tabungan' }} />
      <Tab.Screen name="InvestmentTab" component={InvestmentNavigator} options={{ title: 'Investasi' }} />
      <Tab.Screen name="PhysicalAssetsTab" component={AssetsNavigator} options={{ title: 'Aset Fisik' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  segmentTrack: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    padding: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  segmentActive: {
    backgroundColor: COLORS.surface,
    ...SHADOWS.sm,
  },
  segmentEmoji: { fontSize: 15, opacity: 0.5 },
  segmentEmojiActive: { opacity: 1 },
  segmentLabel: { fontSize: FONTS.sm, fontWeight: '600', color: COLORS.textMuted },
  segmentLabelActive: { color: COLORS.primary },
});
