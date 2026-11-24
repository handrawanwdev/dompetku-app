import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { GoalStackParamList } from './types';
import { GoalListScreen } from './screens/GoalListScreen';
import { GoalFormScreen } from './screens/GoalFormScreen';
import { GoalDetailScreen } from './screens/GoalDetailScreen';

const Stack = createNativeStackNavigator<GoalStackParamList>();

export function GoalNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GoalList" component={GoalListScreen} />
      <Stack.Screen name="GoalForm" component={GoalFormScreen} />
      <Stack.Screen name="GoalDetail" component={GoalDetailScreen} />
    </Stack.Navigator>
  );
}
