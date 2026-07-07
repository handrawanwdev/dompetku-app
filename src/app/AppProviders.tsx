import React, { useEffect } from 'react';
import { RealmProvider } from '@realm/react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { COLORS } from '../theme';

import { realmConfig } from '../database/realm';
import { MainTabNavigator } from '../navigation/MainTabNavigator';
import { useSettingsStore } from '../store/settingsStore';
import { requestNotificationPermissions } from '../services/NotificationService';

function AppInner() {
  const loadSettings = useSettingsStore(s => s.loadSettings);

  useEffect(() => {
    loadSettings();
    requestNotificationPermissions();
  }, []);

  return (
    <NavigationContainer>
      <MainTabNavigator />
    </NavigationContainer>
  );
}

export function AppProviders() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <RealmProvider {...realmConfig} fallback={() => null}>
          <AppInner />
        </RealmProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
});
