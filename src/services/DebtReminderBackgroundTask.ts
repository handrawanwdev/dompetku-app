import * as TaskManager from 'expo-task-manager';
import * as BackgroundTask from 'expo-background-task';
import * as Notifications from 'expo-notifications';
import Realm from 'realm';
import dayjs from 'dayjs';

import { realmConfig } from '../database/realm';
import { DebtModel } from '../models/DebtModel';
import { DebtPaymentModel } from '../models/DebtPaymentModel';
import { getReminderStatus } from '../utils/finance';
import { formatCurrency } from '../utils/currency';
import { storage } from '../storage/mmkv';

const TASK_NAME = 'debt-payment-reminder-check';

function notifiedKey(debtId: string, day: string) {
  return `debt-bg-notified:${debtId}:${day}`;
}

TaskManager.defineTask(TASK_NAME, async () => {
  let realm: Realm | null = null;
  try {
    realm = await Realm.open(realmConfig);
    const today = dayjs().format('YYYY-MM-DD');
    const monthStart = dayjs().startOf('month').format('YYYY-MM-DD');

    const debts = realm.objects(DebtModel).filtered('isActive == true');
    const debtPayments = realm.objects(DebtPaymentModel);

    for (const d of debts) {
      const debtId = d._id.toHexString();
      const paidThisMonth = debtPayments.filtered('debtId == $0 AND date >= $1', debtId, monthStart).length > 0;
      const status = getReminderStatus(
        {
          id: debtId,
          name: d.name,
          monthlyInstallment: d.monthlyInstallment,
          remainingMonth: d.remainingMonth,
          dueDate: d.dueDate,
          paidThisMonth,
        },
      );
      if (!status?.urgent) continue;

      const key = notifiedKey(debtId, today);
      if (storage.getBoolean(key)) continue;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `⏰ ${d.name} — ${status.label}`,
          body: `Cicilan ${formatCurrency(d.monthlyInstallment)} belum dibayar`,
          sound: true,
        },
        trigger: null,
      });
      storage.set(key, true);
    }

    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    console.error('debt-payment-reminder-check failed', error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  } finally {
    realm?.close();
  }
});

/** Registers the 6-hourly debt payment check. Call once at app startup. */
export async function registerDebtReminderBackgroundTask() {
  const alreadyRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
  if (alreadyRegistered) return;
  await BackgroundTask.registerTaskAsync(TASK_NAME, { minimumInterval: 360 });
}
