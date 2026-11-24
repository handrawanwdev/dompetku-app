import * as TaskManager from 'expo-task-manager';
import * as BackgroundTask from 'expo-background-task';
import * as Notifications from 'expo-notifications';
import Realm from 'realm';
import dayjs from 'dayjs';

import { realmConfig } from '../database/realm';
import { DebtModel } from '../models/DebtModel';
import { ExpenseModel } from '../models/ExpenseModel';
import { buildDebtInfos, getReminderStatus } from '../utils/debt';
import { formatCurrency } from '../utils/currency';
import { getSettings, storage } from '../storage/mmkv';
import { isNotifOn, refreshAllReminders } from './ReminderScheduler';

/** Cek utang mendesak + jadwalkan ulang semua pengingat (periode berikutnya) walau app jarang dibuka. */
const TASK_NAME = 'reminder-check';

function notifiedKey(debtId: string, day: string) {
  return `debt-bg-notified:${debtId}:${day}`;
}

TaskManager.defineTask(TASK_NAME, async () => {
  let realm: Realm | null = null;
  try {
    realm = await Realm.open(realmConfig);
    await refreshAllReminders(realm);
    if (!isNotifOn(getSettings() ?? {}, 'notifDebt')) return BackgroundTask.BackgroundTaskResult.Success;

    const today = dayjs().format('YYYY-MM-DD');
    const infos = buildDebtInfos(
      realm.objects(DebtModel),
      realm.objects(ExpenseModel).filtered('debtId != ""'),
    );

    for (const info of infos) {
      const d = info.debt;
      const debtId = info.id;
      const status = getReminderStatus(info);
      if (!status?.urgent) continue;

      const key = notifiedKey(debtId, today);
      if (storage.getBoolean(key)) continue;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `⏰ ${d.name} — ${status.label}`,
          body: d.monthlyInstallment > 0
            ? `Cicilan ${formatCurrency(d.monthlyInstallment)} belum dibayar`
            : `Sisa ${formatCurrency(info.remaining)} belum dibayar`,
          sound: true,
        },
        trigger: null,
      });
      storage.set(key, true);
    }

    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    console.error(`${TASK_NAME} failed`, error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
  // No realm.close() here — Expo can run this task in the same JS context as
  // the app (not always a true headless isolate), so Realm.open() may hand
  // back the exact instance RealmProvider is using. Closing it would tear
  // down that shared session and break every useQuery/useObject in the UI
  // with "Cannot access realm that has been closed".
});

/** Registers the 6-hourly reminder check. Call once at app startup. */
export async function registerDebtReminderBackgroundTask() {
  const alreadyRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
  if (alreadyRegistered) return;
  await BackgroundTask.registerTaskAsync(TASK_NAME, { minimumInterval: 360 });
}

/** Background tasks from removed features — unregister so the OS stops waking a task with no definition. */
const LEGACY_TASK_NAMES = ['motivation-quote-check', 'debt-payment-reminder-check'];

export async function unregisterLegacyBackgroundTasks() {
  for (const name of LEGACY_TASK_NAMES) {
    try {
      if (await TaskManager.isTaskRegisteredAsync(name)) {
        await BackgroundTask.unregisterTaskAsync(name);
      }
    } catch {
      // Best effort — nothing to clean up on fresh installs.
    }
  }
}
