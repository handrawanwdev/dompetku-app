import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GoalsListScreen, GoalsStackParamList } from './screens/GoalsListScreen';
import { GoalFormScreen } from './screens/GoalFormScreen';

const Stack = createNativeStackNavigator<GoalsStackParamList>();

export type { GoalsStackParamList };

export function GoalsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GoalsList" component={GoalsListScreen} />
      <Stack.Screen name="GoalForm" component={GoalFormScreen} />
    </Stack.Navigator>
  );
}
