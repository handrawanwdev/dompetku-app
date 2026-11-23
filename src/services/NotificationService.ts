import * as Notifications from 'expo-notifications';
import dayjs from 'dayjs';
import { formatCurrency } from '../utils/currency';

/** Fixed local times reminders fire at when nothing has been recorded yet today. */
const DAILY_REMINDER_HOURS = [10, 15, 20];
/** Jam ucapan & pengingat ulang tahun. */
const BIRTHDAY_HOUR = 8;
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

export interface DebtReminderInput {
  id: string;
  name: string;
  monthlyInstallment: number;
  /** Tanggal jatuh tempo tiap bulan (1–31); 0 = tanpa pengingat. */
  dueDate: number;
  /** Sudah ada pembayaran bulan ini — pengingat bulan ini dilewati. */
  paidThisMonth: boolean;
}

/** (Re)schedules H-7 and due-date reminders for every unpaid debt with a due date. */
export async function refreshDebtReminders(debts: DebtReminderInput[]) {
  await cancelByPrefix('debt-');
  const now = dayjs();

  for (const debt of debts) {
    if (!debt.dueDate || debt.paidThisMonth) continue;

    const occurrence = dayjs().date(Math.min(debt.dueDate, dayjs().daysInMonth())).hour(DEBT_REMINDER_HOUR).minute(0).second(0);
    const monthKey = occurrence.format('YYYY-MM');
    const h7 = occurrence.subtract(7, 'day');
    const amount = debt.monthlyInstallment > 0 ? `${formatCurrency(debt.monthlyInstallment)} ` : '';

    if (h7.isAfter(now)) {
      await scheduleAt(
        `debt-${debt.id}-${monthKey}-h7`,
        h7.toDate(),
        `⏰ ${debt.name} jatuh tempo 7 hari lagi`,
        `Bayar ${amount}sebelum ${occurrence.format('D MMM')}`,
      );
    }
    if (occurrence.isAfter(now)) {
      await scheduleAt(
        `debt-${debt.id}-${monthKey}-due`,
        occurrence.toDate(),
        `🔴 ${debt.name} jatuh tempo hari ini`,
        `Bayar ${amount}hari ini`,
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

/**
 * Pengingat tahunan: H-7 (ajak menyisihkan uang buat merayakan) dan ucapan
 * pagi hari di hari ulang tahun. Panggil tiap kali tanggal lahir/nama berubah.
 */
export async function refreshBirthdayReminders(birthday: string | undefined, name: string | undefined) {
  await cancelByPrefix('birthday-');
  if (!birthday) return;
  const b = dayjs(birthday);
  if (!b.isValid()) return;

  // Pakai tahun bukan kabisat: 29 Feb jadi 28 Feb, supaya tetap muncul tiap tahun.
  const day = dayjs(new Date(2001, b.month(), Math.min(b.date(), b.month() === 1 ? 28 : b.date())));
  const before = day.subtract(7, 'day');
  const sapaan = name ? `, ${name}` : '';

  await Notifications.scheduleNotificationAsync({
    identifier: 'birthday-h7',
    content: {
      title: 'Seminggu lagi ulang tahunmu 🎉',
      body: 'Mau mulai sisihkan sedikit buat merayakannya? Biar senangnya nggak bikin dompet kaget.',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.YEARLY,
      month: before.month(),
      day: before.date(),
      hour: BIRTHDAY_HOUR + 1,
      minute: 0,
    },
  });
  await Notifications.scheduleNotificationAsync({
    identifier: 'birthday-day',
    content: {
      title: `Selamat ulang tahun${sapaan}! 🎂`,
      body: 'Semoga tahun ini penuh rezeki, sehat, dan bahagia. Hari ini jangan lupa senyum, ya.',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.YEARLY,
      month: day.month(),
      day: day.date(),
      hour: BIRTHDAY_HOUR,
      minute: 0,
    },
  });
}
