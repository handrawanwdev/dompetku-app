import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ReminderStackParamList } from './types';
import { ReminderListScreen } from './screens/ReminderListScreen';
import { ReminderFormScreen } from './screens/ReminderFormScreen';

const Stack = createNativeStackNavigator<ReminderStackParamList>();

export function ReminderNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ReminderList" component={ReminderListScreen} />
      <Stack.Screen name="ReminderForm" component={ReminderFormScreen} />
    </Stack.Navigator>
  );
}
