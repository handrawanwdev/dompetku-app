import dayjs, { type Dayjs } from 'dayjs';
import type { ReminderRepeat } from '../models/ReminderModel';
import { dueStatus, paidStatus, type ReminderStatus } from './debt';

export interface ReminderLike {
  _id: { toHexString(): string };
  title: string;
  amount: number;
  categoryName: string;
  repeat: string;
  dueDate: string;
  lastDonePeriod: string;
}

export const REPEAT_OPTIONS: { value: ReminderRepeat; label: string }[] = [
  { value: 'monthly', label: 'Tiap bulan' },
  { value: 'yearly', label: 'Tiap tahun' },
  { value: 'once', label: 'Sekali' },
];

export function isRepeat(v: unknown): v is ReminderRepeat {
  return v === 'once' || v === 'monthly' || v === 'yearly';
}

/** Kunci periode: 'YYYY-MM' (bulanan), 'YYYY' (tahunan), 'once' (sekali). */
export function periodOf(repeat: ReminderRepeat, d: Dayjs): string {
  if (repeat === 'monthly') return d.format('YYYY-MM');
  if (repeat === 'yearly') return d.format('YYYY');
  return 'once';
}

/** Tanggal jatuh tempo di periode yang memuat `anchor`. 29–31 di-clamp ke akhir bulan. */
function occurrenceIn(repeat: ReminderRepeat, start: Dayjs, anchor: Dayjs): Dayjs {
  if (repeat === 'once') return start;
  const base = repeat === 'monthly' ? anchor.startOf('month') : anchor.startOf('year').month(start.month());
  return base.date(Math.min(start.date(), base.daysInMonth()));
}

export interface ReminderInfo<R extends ReminderLike = ReminderLike> {
  reminder: R;
  id: string;
  repeat: ReminderRepeat;
  /** Jatuh tempo terdekat yang belum dibayar. null = pengingat sekali yang sudah selesai. */
  due: Dayjs | null;
  /** Periode milik `due`; disimpan ke lastDonePeriod saat dibayar. */
  duePeriod: string;
  /** Jatuh tempo periode sesudah `due` (untuk jadwal notif ke depan). null = pengingat sekali. */
  followingDue: Dayjs | null;
  followingPeriod: string;
  /** Periode berjalan sudah dibayar. */
  paidCurrent: boolean;
  /** Jatuh tempo periode berjalan jatuh di bulan ini. */
  currentInThisMonth: boolean;
  status: ReminderStatus | null;
}

export function buildReminderInfo<R extends ReminderLike>(r: R, now: Date = new Date()): ReminderInfo<R> {
  const today = dayjs(now).startOf('day');
  const start = dayjs(r.dueDate).startOf('day');
  const repeat: ReminderRepeat = isRepeat(r.repeat) ? r.repeat : 'monthly';
  const id = r._id.toHexString();

  if (repeat === 'once') {
    const done = r.lastDonePeriod === 'once';
    return {
      reminder: r,
      id,
      repeat,
      due: done ? null : start,
      duePeriod: 'once',
      followingDue: null,
      followingPeriod: '',
      paidCurrent: done,
      currentInThisMonth: start.isSame(today, 'month'),
      status: done ? null : dueStatus(start.diff(today, 'day'), `Jatuh tempo ${start.format('D MMM YYYY')}`),
    };
  }

  const unit = repeat === 'monthly' ? 'month' : 'year';
  // Periode sebelum jatuh tempo pertama belum dihitung.
  const anchor = today.isBefore(start, unit) ? start : today;
  const current = occurrenceIn(repeat, start, anchor);
  const curPeriod = periodOf(repeat, anchor);
  const paidCurrent = r.lastDonePeriod !== '' && r.lastDonePeriod >= curPeriod;
  const next = anchor.add(1, unit);
  const due = paidCurrent ? occurrenceIn(repeat, start, next) : current;
  const dueAnchor = paidCurrent ? next : anchor;
  const followingAnchor = dueAnchor.add(1, unit);
  const daysUntil = due.diff(today, 'day');

  return {
    reminder: r,
    id,
    repeat,
    due,
    duePeriod: paidCurrent ? periodOf(repeat, next) : curPeriod,
    followingDue: occurrenceIn(repeat, start, followingAnchor),
    followingPeriod: periodOf(repeat, followingAnchor),
    paidCurrent,
    currentInThisMonth: current.isSame(today, 'month'),
    status: paidCurrent
      ? paidStatus(daysUntil, repeat === 'monthly' ? 'Sudah bayar bulan ini' : 'Sudah bayar tahun ini')
      : dueStatus(daysUntil, `Jatuh tempo ${due.format('D MMM')}`),
  };
}

/** Diurutkan dari jatuh tempo terdekat; yang sudah selesai paling bawah. */
export function buildReminderInfos<R extends ReminderLike>(items: Iterable<R>, now: Date = new Date()): ReminderInfo<R>[] {
  return [...items]
    .map((r) => buildReminderInfo(r, now))
    .sort((a, b) => (a.due?.valueOf() ?? Number.MAX_SAFE_INTEGER) - (b.due?.valueOf() ?? Number.MAX_SAFE_INTEGER));
}

/** Satu baris pengingat pembayaran di dashboard (kewajiban atau tagihan). */
export interface DueItem {
  key: string;
  source: 'debt' | 'bill';
  name: string;
  amount: number;
  status: ReminderStatus;
}
