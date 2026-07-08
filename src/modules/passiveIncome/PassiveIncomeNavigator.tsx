import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PassiveIncomeListScreen, PassiveIncomeStackParamList } from './screens/PassiveIncomeListScreen';
import { PassiveIncomeFormScreen } from './screens/PassiveIncomeFormScreen';

const Stack = createNativeStackNavigator<PassiveIncomeStackParamList>();

export type { PassiveIncomeStackParamList };

export function PassiveIncomeNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PassiveIncomeList" component={PassiveIncomeListScreen} />
      <Stack.Screen name="PassiveIncomeForm" component={PassiveIncomeFormScreen} />
    </Stack.Navigator>
  );
}
