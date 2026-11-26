import * as Notifications from 'expo-notifications';
import dayjs from 'dayjs';
import { formatCurrency } from '../utils/currency';
import { currentDebtDue, dueInMonth } from '../utils/debt';

/** Fixed local times reminders fire at when nothing has been recorded yet today. */
const DAILY_REMINDER_HOURS = [10, 15, 20];
/**
 * Berapa hari ke depan pengingat harian dijadwalkan. Cukup panjang supaya tetap
 * muncul walau app tidak dibuka & background task telat (Android yang mengatur).
 */
const DAILY_DAYS_AHEAD = 7;
/** Jam ucapan & pengingat ulang tahun. */
const BIRTHDAY_HOUR = 8;
/** Local hour debt due-date reminders fire at. */
const DEBT_REMINDER_HOUR = 9;
/** Jam pengingat tagihan buatan user (H-3 dan hari H). */
const BILL_REMINDER_HOUR = 9;
const BILL_LEAD_DAYS = 3;

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

export async function cancelByPrefix(prefix: string) {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((n) => n.identifier.startsWith(prefix))
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)),
  );
}

async function scheduleAt(identifier: string, date: Date, title: string, body: string, data?: Record<string, string>) {
  await Notifications.scheduleNotificationAsync({
    identifier,
    content: { title, body, sound: true, ...(data ? { data } : {}) },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date },
  });
}

export interface DebtReminderInput {
  id: string;
  name: string;
  monthlyInstallment: number;
  /** Tanggal jatuh tempo tiap bulan (1–31); 0 = tanpa pengingat. */
  dueDate: number;
  /** Tanggal utang dicatat, 'YYYY-MM-DD'. Jatuh tempo sebelum tanggal ini tidak diingatkan. */
  startDate?: string;
  /** Sudah ada pembayaran bulan ini — pengingat bulan ini dilewati. */
  paidThisMonth: boolean;
}

/**
 * (Re)schedules H-7 and due-date reminders for every unpaid debt with a due date.
 * Dua jatuh tempo ke depan dijadwalkan sekaligus (yang berjalan + bulan
 * berikutnya), supaya pengingat bulan depan tetap muncul walau app tidak dibuka
 * dan background task telat jalan. Utang baru tidak diingatkan untuk tanggal
 * sebelum dicatat; bulan yang sudah dibayar dilewati.
 */
export async function refreshDebtReminders(debts: DebtReminderInput[]) {
  await cancelByPrefix('debt-');
  const now = dayjs();
  const thisMonth = now.format('YYYY-MM');

  for (const debt of debts) {
    if (!debt.dueDate) continue;

    const current = currentDebtDue(debt.dueDate, debt.startDate, now.toDate());
    for (const due of [current, dueInMonth(current.add(1, 'month'), debt.dueDate)]) {
      if (debt.paidThisMonth && due.format('YYYY-MM') === thisMonth) continue;
      await scheduleDebtOccurrence(debt, due, now);
    }
  }
}

async function scheduleDebtOccurrence(debt: DebtReminderInput, due: dayjs.Dayjs, now: dayjs.Dayjs) {
  const occurrence = due.hour(DEBT_REMINDER_HOUR).minute(0).second(0);
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

export interface BillReminderInput {
  id: string;
  title: string;
  amount: number;
  /** Jatuh tempo terdekat yang belum dibayar, 'YYYY-MM-DD'. */
  due: string;
  /** Periode milik `due` (lihat utils/reminder periodOf). */
  period: string;
}

/**
 * Pengingat tagihan buatan user: H-3 dan hari H jam 09:00. Tiap tagihan dikirim
 * dua jatuh tempo ke depan (lihat ReminderScheduler). Jadwal digeser maju saat
 * app dibuka atau dari background task.
 */
export async function refreshBillReminders(bills: BillReminderInput[]) {
  await cancelByPrefix('bill-');
  const now = dayjs();

  for (const b of bills) {
    const at = dayjs(b.due).hour(BILL_REMINDER_HOUR).minute(0).second(0);
    const before = at.subtract(BILL_LEAD_DAYS, 'day');
    const amount = b.amount > 0 ? `${formatCurrency(b.amount)} ` : '';
    // Dibaca saat notif diketuk: buka form uang keluar yang sudah terisi.
    const data = { billId: b.id, billPeriod: b.period };

    if (before.isAfter(now)) {
      await scheduleAt(
        `bill-${b.id}-${b.period}-h${BILL_LEAD_DAYS}`,
        before.toDate(),
        `⏰ ${b.title} jatuh tempo ${BILL_LEAD_DAYS} hari lagi`,
        `Bayar ${amount}sebelum ${at.format('D MMM')}`,
        data,
      );
    }
    if (at.isAfter(now)) {
      await scheduleAt(
        `bill-${b.id}-${b.period}-due`,
        at.toDate(),
        `🔴 ${b.title} jatuh tempo hari ini`,
        `Bayar ${amount}hari ini. Ketuk untuk mencatat.`,
        data,
      );
    }
  }
}

/**
 * Pengingat "belum catat" 3x sehari untuk DAILY_DAYS_AHEAD hari ke depan. Sisa
 * jadwal hari ini dilewati kalau sudah ada catatan hari ini. Dijadwalkan ulang
 * (dan digeser maju) tiap data berubah, app dibuka, atau background task jalan.
 */
export async function refreshDailyReminders(recordedToday: boolean) {
  await cancelByPrefix('daily-');
  const now = dayjs();

  for (let day = 0; day < DAILY_DAYS_AHEAD; day++) {
    if (day === 0 && recordedToday) continue;
    const date = now.add(day, 'day');
    for (const hour of DAILY_REMINDER_HOURS) {
      const at = date.hour(hour).minute(0).second(0).millisecond(0);
      if (!at.isAfter(now)) continue;
      await scheduleAt(
        `daily-${at.format('YYYY-MM-DD')}-${hour}`,
        at.toDate(),
        '💰 Belum catat transaksi hari ini',
        'Yuk catat pemasukan atau pengeluaran hari ini di Dompetku',
      );
    }
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
      body: 'Ada kado kecil yang menunggumu di Dompetku. Buka, yuk!',
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
