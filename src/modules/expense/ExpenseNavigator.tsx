import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExpenseListScreen, ExpenseStackParamList } from './screens/ExpenseListScreen';
import { ExpenseFormScreen } from './screens/ExpenseFormScreen';

const Stack = createNativeStackNavigator<ExpenseStackParamList>();

export function ExpenseNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExpenseList" component={ExpenseListScreen} />
      <Stack.Screen name="ExpenseForm" component={ExpenseFormScreen} />
    </Stack.Navigator>
  );
}
