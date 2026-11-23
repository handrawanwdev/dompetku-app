import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CashflowScreen } from './screens/CashflowScreen';
import type { CashflowStackParamList } from './types';

const Stack = createNativeStackNavigator<CashflowStackParamList>();

export function TransactionNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CashflowMain" component={CashflowScreen} />
    </Stack.Navigator>
  );
}
