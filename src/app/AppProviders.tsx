import React, { useEffect } from 'react';
import { RealmProvider } from '@realm/react';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { COLORS } from '../theme';

import { realmConfig } from '../database/realm';
import { RootNavigator } from '../navigation/RootNavigator';
import { useSettingsStore } from '../store/settingsStore';
import { requestNotificationPermissions, refreshBirthdayReminders } from '../services/NotificationService';
import { registerDebtReminderBackgroundTask } from '../services/DebtReminderBackgroundTask';
import { unregisterLegacyBackgroundTasks } from '../services/DebtReminderBackgroundTask';
import { installGlobalErrorHandlers } from '../services/ErrorLogService';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { AppLockGate } from './AppLockGate';
import { pauseAutoLock } from '../services/AppLockService';

installGlobalErrorHandlers();

const navTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primary,
    background: COLORS.background,
    card: COLORS.surface,
    text: COLORS.text,
    border: COLORS.border,
    notification: COLORS.primary,
  },
};

function AppInner() {
  const loadSettings = useSettingsStore(s => s.loadSettings);
  const birthday = useSettingsStore(s => s.settings.birthday);
  const displayName = useSettingsStore(s => s.settings.displayName);

  useEffect(() => {
    loadSettings();
    // Dialog izin notifikasi sempat membuat app "keluar"; jangan dianggap ditinggal.
    pauseAutoLock(10_000);
    requestNotificationPermissions();
    registerDebtReminderBackgroundTask();
    unregisterLegacyBackgroundTasks();
  }, []);

  useEffect(() => {
    refreshBirthdayReminders(birthday, displayName).catch(() => {});
  }, [birthday, displayName]);

  return (
    <AppLockGate>
      <NavigationContainer theme={navTheme}>
        <RootNavigator />
      </NavigationContainer>
    </AppLockGate>
  );
}

export function AppProviders() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <RealmProvider {...realmConfig} fallback={() => null}>
            <AppInner />
          </RealmProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
});
