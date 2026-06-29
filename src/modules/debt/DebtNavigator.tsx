import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DebtListScreen, DebtStackParamList } from './screens/DebtListScreen';
import { DebtFormScreen } from './screens/DebtFormScreen';
import { DebtDetailScreen } from './screens/DebtDetailScreen';

const Stack = createNativeStackNavigator<DebtStackParamList>();

export function DebtNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DebtList" component={DebtListScreen} />
      <Stack.Screen name="DebtForm" component={DebtFormScreen} />
      <Stack.Screen name="DebtDetail" component={DebtDetailScreen} />
    </Stack.Navigator>
  );
}
