import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CashflowScreen, CashflowStackParamList } from './screens/CashflowScreen';
import { IncomeFormScreen } from '../income/screens/IncomeFormScreen';
import { ExpenseFormScreen } from '../expense/screens/ExpenseFormScreen';

const Stack = createNativeStackNavigator<CashflowStackParamList>();

export function TransactionNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CashflowMain" component={CashflowScreen} />
      <Stack.Screen name="IncomeForm" component={IncomeFormScreen} />
      <Stack.Screen name="ExpenseForm" component={ExpenseFormScreen} />
    </Stack.Navigator>
  );
}
