import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PhysicalAssetListScreen, AssetsStackParamList } from './screens/PhysicalAssetListScreen';
import { PhysicalAssetFormScreen } from './screens/PhysicalAssetFormScreen';

const Stack = createNativeStackNavigator<AssetsStackParamList>();

export type { AssetsStackParamList };

export function AssetsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PhysicalAssetList" component={PhysicalAssetListScreen} />
      <Stack.Screen name="PhysicalAssetForm" component={PhysicalAssetFormScreen} />
    </Stack.Navigator>
  );
}
