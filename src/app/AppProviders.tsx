import React, { useEffect, useRef, useState } from 'react';
import { RealmProvider } from '@realm/react';
import { NavigationContainer, DefaultTheme, Theme, createNavigationContainerRef } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { COLORS } from '../theme';

import { realmConfig } from '../database/realm';
import { RootNavigator } from '../navigation/RootNavigator';
import { useSettingsStore } from '../store/settingsStore';
import { requestNotificationPermissions } from '../services/NotificationService';
import type { RootStackParamList } from '../navigation/types';
import { registerDebtReminderBackgroundTask, unregisterLegacyBackgroundTasks } from '../services/DebtReminderBackgroundTask';
import { installGlobalErrorHandlers } from '../services/ErrorLogService';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { AppLockGate } from './AppLockGate';
import { pauseAutoLock, useAppLock } from '../services/AppLockService';
import { BirthdaySurprise } from '../modules/birthday/BirthdaySurprise';

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

const navigationRef = createNavigationContainerRef<RootStackParamList>();

/** Notif pengingat tagihan diketuk (termasuk saat app dibuka dari notif): buka form uang keluar terisi. */
function useOpenFromNotification(navReady: boolean) {
  const response = Notifications.useLastNotificationResponse();
  const handled = useRef(new Set<string>());

  useEffect(() => {
    if (!navReady || !response) return;
    if (response.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) return;
    const { identifier, content } = response.notification.request;
    if (handled.current.has(identifier)) return;
    handled.current.add(identifier);
    // Supaya notif yang sama tidak membuka form lagi saat app dibuka ulang.
    Notifications.clearLastNotificationResponse();

    const data = content.data ?? {};
    if (typeof data.billId === 'string' && typeof data.billPeriod === 'string') {
      navigationRef.navigate('ExpenseForm', { billId: data.billId, billPeriod: data.billPeriod });
    }
  }, [navReady, response]);
}

function AppInner() {
  const loadSettings = useSettingsStore(s => s.loadSettings);
  const [navReady, setNavReady] = useState(false);
  const locked = useAppLock((s) => s.locked);
  useOpenFromNotification(navReady);

  useEffect(() => {
    loadSettings();
    // Dialog izin notifikasi sempat membuat app "keluar"; jangan dianggap ditinggal.
    pauseAutoLock(10_000);
    requestNotificationPermissions();
    // Hapus task lama dulu (nama task pengingat sempat berganti), baru daftarkan yang baru.
    unregisterLegacyBackgroundTasks().then(registerDebtReminderBackgroundTask).catch(() => {});
  }, []);

  return (
    <AppLockGate>
      <NavigationContainer ref={navigationRef} theme={navTheme} onReady={() => setNavReady(true)}>
        <RootNavigator />
      </NavigationContainer>
      {/* Kejutan ulang tahun: tampil setelah kunci app dibuka. */}
      <BirthdaySurprise enabled={!locked} />
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
