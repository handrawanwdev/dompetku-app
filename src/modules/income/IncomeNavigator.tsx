import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { IncomeListScreen, IncomeStackParamList } from './screens/IncomeListScreen';
import { IncomeFormScreen } from './screens/IncomeFormScreen';

const Stack = createNativeStackNavigator<IncomeStackParamList>();

export function IncomeNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="IncomeList" component={IncomeListScreen} />
      <Stack.Screen name="IncomeForm" component={IncomeFormScreen} />
    </Stack.Navigator>
  );
}
