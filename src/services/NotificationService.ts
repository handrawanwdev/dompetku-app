import * as Notifications from 'expo-notifications';
import dayjs from 'dayjs';
import { formatCurrency } from '../utils/currency';

/** Fixed local times reminders fire at when nothing has been recorded yet today. */
const DAILY_REMINDER_HOURS = [10, 15, 20];
/** Local hour debt due-date reminders fire at. */
const DEBT_REMINDER_HOUR = 9;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions() {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const result = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowBadge: true, allowSound: true },
  });
  return result.granted;
}

async function cancelByPrefix(prefix: string) {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((n) => n.identifier.startsWith(prefix))
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)),
  );
}

async function scheduleAt(identifier: string, date: Date, title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    identifier,
    content: { title, body, sound: true },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date },
  });
}

export type DebtTypeForNotification = 'tanpa_tenor' | 'berjangka' | 'cicilan' | 'revolving' | 'tagihan_rutin';

export interface DebtReminderInput {
  id: string;
  name: string;
  monthlyInstallment: number;
  remainingMonth: number;
  /** Day of month (1–31) — cicilan/revolving/tagihan_rutin's recurring due date. */
  dueDate: number;
  /** YYYY-MM-DD — berjangka's single fixed maturity date. */
  dueDateFull: string;
  debtType: DebtTypeForNotification;
}

/** (Re)schedules H-7 and due-date reminders for every active debt. Call after any debt is created/edited/paid. */
export async function refreshDebtReminders(debts: DebtReminderInput[]) {
  await cancelByPrefix('debt-');
  const now = dayjs();

  for (const debt of debts) {
    if (debt.debtType === 'tanpa_tenor') continue;

    if (debt.debtType === 'berjangka') {
      if (!debt.dueDateFull) continue;
      const occurrence = dayjs(debt.dueDateFull).hour(DEBT_REMINDER_HOUR).minute(0).second(0);
      const h7 = occurrence.subtract(7, 'day');

      if (h7.isAfter(now)) {
        await scheduleAt(
          `debt-${debt.id}-h7`,
          h7.toDate(),
          `⏰ ${debt.name} jatuh tempo 7 hari lagi`,
          `Hutang ${formatCurrency(debt.monthlyInstallment)} jatuh tempo ${occurrence.format('D MMM YYYY')}`,
        );
      }
      if (occurrence.isAfter(now)) {
        await scheduleAt(
          `debt-${debt.id}-due`,
          occurrence.toDate(),
          `🔴 ${debt.name} jatuh tempo hari ini!`,
          `Hutang jatuh tempo sekarang`,
        );
      }
      continue;
    }

    if (debt.debtType === 'cicilan' && debt.remainingMonth <= 0) continue;

    const occurrence = dayjs().date(debt.dueDate).hour(DEBT_REMINDER_HOUR).minute(0).second(0);
    // dayjs rolls over into the next month when dueDate exceeds the days in that month (e.g. 31 in Feb) — skip the mismatch
    if (occurrence.date() !== debt.dueDate) continue;

    const monthKey = occurrence.format('YYYY-MM');
    const h7 = occurrence.subtract(7, 'day');

    if (h7.isAfter(now)) {
      await scheduleAt(
        `debt-${debt.id}-${monthKey}-h7`,
        h7.toDate(),
        `⏰ ${debt.name} jatuh tempo 7 hari lagi`,
        `Cicilan ${formatCurrency(debt.monthlyInstallment)} jatuh tempo tanggal ${debt.dueDate} (${occurrence.format('D MMM YYYY')})`,
      );
    }
    if (occurrence.isAfter(now)) {
      await scheduleAt(
        `debt-${debt.id}-${monthKey}-due`,
        occurrence.toDate(),
        `🔴 ${debt.name} jatuh tempo hari ini!`,
        `Cicilan ${formatCurrency(debt.monthlyInstallment)} jatuh tempo sekarang`,
      );
    }
  }
}

/**
 * (Re)schedules the 3x/day "belum mencatat" reminders. Skips today's remaining
 * slots when income or expense has already been recorded today; always seeds
 * tomorrow's slots as a fallback (self-corrects next time the app is opened).
 */
export async function refreshDailyReminders(recordedToday: boolean) {
  await cancelByPrefix('daily-');
  const now = dayjs();

  for (const hour of DAILY_REMINDER_HOURS) {
    if (!recordedToday) {
      const fireToday = now.hour(hour).minute(0).second(0);
      if (fireToday.isAfter(now)) {
        await scheduleAt(
          `daily-today-${hour}`,
          fireToday.toDate(),
          '💰 Belum catat transaksi hari ini',
          'Yuk catat pemasukan atau pengeluaran hari ini di Dompetku',
        );
      }
    }

    const fireTomorrow = now.add(1, 'day').hour(hour).minute(0).second(0);
    await scheduleAt(
      `daily-tomorrow-${hour}`,
      fireTomorrow.toDate(),
      '💰 Belum catat transaksi hari ini',
      'Yuk catat pemasukan atau pengeluaran hari ini di Dompetku',
    );
  }
}
