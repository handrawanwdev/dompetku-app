import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CashflowScreen, CashflowStackParamList } from './screens/CashflowScreen';
import { IncomeFormScreen } from '../income/screens/IncomeFormScreen';
import { ExpenseFormScreen } from '../expense/screens/ExpenseFormScreen';
import { TransferScreen } from './screens/TransferScreen';
import { ReportScreen } from './screens/ReportScreen';
import { PassiveIncomeNavigator } from '../passiveIncome/PassiveIncomeNavigator';

const Stack = createNativeStackNavigator<CashflowStackParamList>();

export function TransactionNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CashflowMain" component={CashflowScreen} />
      <Stack.Screen name="IncomeForm" component={IncomeFormScreen} />
      <Stack.Screen name="ExpenseForm" component={ExpenseFormScreen} />
      <Stack.Screen name="TransferScreen" component={TransferScreen} />
      <Stack.Screen name="RecurringNavScreen" component={PassiveIncomeNavigator} />
      <Stack.Screen name="ReportScreen" component={ReportScreen} options={{ headerShown: true, headerTitle: 'Laporan' }} />
    </Stack.Navigator>
  );
}
