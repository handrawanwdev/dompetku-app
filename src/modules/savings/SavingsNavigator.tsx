import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SavingsListScreen, SavingsStackParamList } from './screens/SavingsListScreen';
import { SavingsFormScreen } from './screens/SavingsFormScreen';
import { SavingsDetailScreen } from './screens/SavingsDetailScreen';

const Stack = createNativeStackNavigator<SavingsStackParamList>();

export type { SavingsStackParamList };

export function SavingsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SavingsList" component={SavingsListScreen} />
      <Stack.Screen name="SavingsForm" component={SavingsFormScreen} />
      <Stack.Screen name="SavingsDetail" component={SavingsDetailScreen} />
    </Stack.Navigator>
  );
}
