import Realm from 'realm';
import dayjs from 'dayjs';

import { IncomeModel } from '../models/IncomeModel';
import { ExpenseModel } from '../models/ExpenseModel';
import { DebtModel } from '../models/DebtModel';
import { ReminderModel } from '../models/ReminderModel';
import { getSettings } from '../storage/mmkv';
import { buildDebtInfos } from '../utils/debt';
import { buildReminderInfos } from '../utils/reminder';
import type { AppSettings, NotifSettingKey } from '../types';
import {
  cancelByPrefix,
  refreshBillReminders,
  refreshBirthdayReminders,
  refreshDailyReminders,
  refreshDebtReminders,
  type BillReminderInput,
  type DebtReminderInput,
} from './NotificationService';

export function isNotifOn(settings: Partial<AppSettings>, key: NotifSettingKey) {
  return settings[key] !== false;
}

interface Snapshot {
  settings: Partial<AppSettings>;
  recordedToday: boolean;
  debts: DebtReminderInput[];
  bills: BillReminderInput[];
}

/** Baca semua yang dibutuhkan secara sinkron, sebelum ada await (objek Realm bisa berubah). */
function snapshot(realm: Realm): Snapshot {
  const today = dayjs().format('YYYY-MM-DD');
  const debts = buildDebtInfos(
    realm.objects(DebtModel),
    realm.objects(ExpenseModel).filtered('debtId != ""'),
  )
    .filter((d) => !d.lunas)
    .map((d) => ({
      id: d.id,
      name: d.debt.name,
      monthlyInstallment: d.debt.monthlyInstallment,
      dueDate: d.debt.dueDate,
      paidThisMonth: d.paidThisMonth,
    }));
  const bills = buildReminderInfos(realm.objects(ReminderModel)).flatMap((i) =>
    i.due
      ? [{ id: i.id, title: i.reminder.title, amount: i.reminder.amount, due: i.due.format('YYYY-MM-DD'), period: i.duePeriod }]
      : [],
  );

  return {
    settings: (getSettings() ?? {}) as Partial<AppSettings>,
    recordedToday:
      realm.objects(IncomeModel).filtered('date == $0', today).length > 0 ||
      realm.objects(ExpenseModel).filtered('date == $0', today).length > 0,
    debts,
    bills,
  };
}

async function apply(s: Snapshot) {
  const on = (key: NotifSettingKey) => isNotifOn(s.settings, key);
  // Urutan = prioritas kalau batas notif terjadwal (iOS: 64) tercapai.
  await (on('notifDebt') ? refreshDebtReminders(s.debts) : cancelByPrefix('debt-'));
  await (on('notifBills') ? refreshBillReminders(s.bills) : cancelByPrefix('bill-'));
  // Ulang tahun wajib, tidak ikut pengaturan.
  await refreshBirthdayReminders(s.settings.birthday, s.settings.displayName);
  await (on('notifDaily') ? refreshDailyReminders(s.recordedToday) : cancelByPrefix('daily-'));
}

let pending: Realm | null = null;
let running: Promise<void> | null = null;

async function loop() {
  while (pending) {
    const realm = pending;
    pending = null;
    if (realm.isClosed) continue;
    try {
      await apply(snapshot(realm));
    } catch (error) {
      console.warn('refreshAllReminders failed', error);
    }
  }
}

/**
 * Satu pintu untuk menjadwalkan ulang semua notifikasi (utang, tagihan, ulang
 * tahun, belum catat). Dipanggil saat data berubah, saat app dibuka, dan dari
 * background task. Panggilan beruntun digabung dan dijalankan berurutan supaya
 * cancel/schedule tidak saling tumpang tindih.
 */
export function refreshAllReminders(realm: Realm): Promise<void> {
  pending = realm;
  if (!running) {
    running = loop().finally(() => {
      running = null;
      // Masuk tepat setelah loop selesai memeriksa antrean.
      if (pending) void refreshAllReminders(pending);
    });
  }
  return running;
}
