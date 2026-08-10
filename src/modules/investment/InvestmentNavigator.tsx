import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { InvestmentListScreen, InvestmentStackParamList } from './screens/InvestmentListScreen';
import { InvestmentFormScreen } from './screens/InvestmentFormScreen';
import { InvestmentSellScreen } from './screens/InvestmentSellScreen';
import { InvestmentDividendScreen } from './screens/InvestmentDividendScreen';

const Stack = createNativeStackNavigator<InvestmentStackParamList>();

export type { InvestmentStackParamList };

export function InvestmentNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InvestmentList" component={InvestmentListScreen} />
      <Stack.Screen name="InvestmentForm" component={InvestmentFormScreen} />
      <Stack.Screen name="InvestmentSell" component={InvestmentSellScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="InvestmentDividend" component={InvestmentDividendScreen} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
  );
}
