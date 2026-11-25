import dayjs from 'dayjs';
import { COLORS } from '../theme';

export interface DebtLike {
  _id: { toHexString(): string };
  name: string;
  totalAmount: number;
  paidBefore: number;
  monthlyInstallment: number;
  dueDate: number;
  /** Tanggal utang mulai dicatat, 'YYYY-MM-DD'. */
  startDate?: string;
}

export interface DebtPaymentLike {
  debtId: string;
  amount: number;
  date: string;
}

export interface DebtInfo<D extends DebtLike = DebtLike> {
  debt: D;
  id: string;
  paid: number;
  remaining: number;
  progress: number;
  /** Perkiraan sisa bulan kalau ada cicilan tetap. */
  monthsLeft: number | null;
  paidThisMonth: boolean;
  lunas: boolean;
}

/** Hitung sisa & status tiap kewajiban dari transaksi yang terhubung. */
export function buildDebtInfos<D extends DebtLike>(
  debts: Iterable<D>,
  payments: Iterable<DebtPaymentLike>,
  now: Date = new Date(),
): DebtInfo<D>[] {
  const monthStart = dayjs(now).startOf('month').format('YYYY-MM-DD');
  const paidById = new Map<string, number>();
  const paidThisMonth = new Set<string>();
  for (const p of payments) {
    if (!p.debtId) continue;
    paidById.set(p.debtId, (paidById.get(p.debtId) ?? 0) + p.amount);
    if (p.date >= monthStart) paidThisMonth.add(p.debtId);
  }

  const out: DebtInfo<D>[] = [];
  for (const d of debts) {
    const id = d._id.toHexString();
    const paid = d.paidBefore + (paidById.get(id) ?? 0);
    const remaining = Math.max(0, d.totalAmount - paid);
    out.push({
      debt: d,
      id,
      paid,
      remaining,
      progress: d.totalAmount > 0 ? Math.min(100, (paid / d.totalAmount) * 100) : 100,
      monthsLeft: d.monthlyInstallment > 0 ? Math.ceil(remaining / d.monthlyInstallment) : null,
      paidThisMonth: paidThisMonth.has(id),
      lunas: remaining <= 0,
    });
  }
  return out;
}

// ─── Pengingat jatuh tempo ────────────────────────────────────────────────────

export type ReminderTier = 'lunas' | 'hari-ini' | 'mendesak' | 'segera' | 'aman';

export interface ReminderStatus {
  tier: ReminderTier;
  label: string;
  color: string;
  bg: string;
  urgent: boolean;
  daysUntil: number;
}

/** Tanggal jatuh tempo di bulan `month`, dipotong ke hari terakhir (mis. 31 → 30 Nov). */
function dueInMonth(month: dayjs.Dayjs, dueDate: number): dayjs.Dayjs {
  return month.date(Math.min(dueDate, month.daysInMonth()));
}

/**
 * Status bulan ini untuk kewajiban yang punya tanggal jatuh tempo.
 * Utang yang baru dicatat setelah tanggal jatuh tempo bulan ini belum punya
 * tagihan bulan ini, jadi yang ditunggu jatuh tempo bulan depan (bukan telat).
 */
export function getReminderStatus(
  info: { lunas: boolean; paidThisMonth: boolean; debt: { dueDate: number; startDate?: string } },
  now: Date = new Date(),
): ReminderStatus | null {
  const { dueDate, startDate } = info.debt;
  if (info.lunas || !dueDate) return null;

  const today = dayjs(now).startOf('day');
  let due = dueInMonth(today, dueDate);
  if (startDate && due.format('YYYY-MM-DD') < startDate) {
    due = dueInMonth(today.add(1, 'month').startOf('month'), dueDate);
  }
  const daysUntil = due.diff(today, 'day');

  if (info.paidThisMonth) return paidStatus(daysUntil, 'Sudah bayar bulan ini');
  return dueStatus(daysUntil, `Jatuh tempo tanggal ${dueDate}`);
}

export function paidStatus(daysUntil: number, label: string): ReminderStatus {
  return { tier: 'lunas', label, color: COLORS.successText, bg: COLORS.successBg, urgent: false, daysUntil };
}

/** Tingkat urgensi dari sisa hari ke jatuh tempo (dipakai utang & pengingat tagihan). */
export function dueStatus(daysUntil: number, amanLabel: string): ReminderStatus {
  if (daysUntil < 0) {
    return { tier: 'hari-ini', label: `Telat ${Math.abs(daysUntil)} hari`, color: COLORS.dangerText, bg: COLORS.dangerBg, urgent: true, daysUntil };
  }
  if (daysUntil === 0) {
    return { tier: 'hari-ini', label: 'Jatuh tempo hari ini', color: COLORS.dangerText, bg: COLORS.dangerBg, urgent: true, daysUntil };
  }
  if (daysUntil <= 3) {
    return { tier: 'mendesak', label: `Jatuh tempo ${daysUntil} hari lagi`, color: COLORS.warningText, bg: COLORS.warningBg, urgent: true, daysUntil };
  }
  if (daysUntil <= 7) {
    return { tier: 'segera', label: `Jatuh tempo ${daysUntil} hari lagi`, color: COLORS.warningText, bg: COLORS.warningSoftBg, urgent: false, daysUntil };
  }
  return { tier: 'aman', label: amanLabel, color: COLORS.infoText, bg: COLORS.infoBg, urgent: false, daysUntil };
}

// ─── Konversi format utang lama (≤ v16) ───────────────────────────────────────

export interface LegacyDebt {
  debtType?: string;
  totalAmount: number;
  monthlyInstallment: number;
  remainingMonth?: number;
  currentBalance?: number;
  dueDate?: number;
  dueDateFull?: string;
  isActive?: boolean;
  note?: string;
}

/**
 * Ubah 5 tipe utang lama jadi bentuk baru dengan sisa utang tetap sama.
 * `paidTotal` = semua pembayaran lama, `linked` = bagian yang sudah dihubungkan
 * ke transaksi. Mengembalikan null untuk tagihan rutin (bukan utang lagi).
 */
export function convertLegacyDebt(od: LegacyDebt, paidTotal: number, linked: number) {
  if (od.debtType === 'tagihan_rutin') return null;

  let remaining: number;
  if (od.isActive === false) remaining = 0;
  else if (od.debtType === 'cicilan') remaining = od.monthlyInstallment * (od.remainingMonth ?? 0);
  else if (od.debtType === 'revolving') remaining = od.currentBalance ?? 0;
  else remaining = Math.max(0, od.totalAmount - paidTotal);

  const totalAmount = od.debtType === 'revolving'
    ? remaining + linked
    : Math.max(od.totalAmount, remaining + linked);
  const noInstallment = od.debtType === 'tanpa_tenor' || od.debtType === 'berjangka';

  let note = od.note ?? '';
  if (od.debtType === 'berjangka' && od.dueDateFull) {
    const label = `Jatuh tempo ${dayjs(od.dueDateFull).format('D MMM YYYY')}`;
    note = note ? `${note} · ${label}` : label;
  }

  return {
    totalAmount,
    paidBefore: Math.max(0, totalAmount - remaining - linked),
    monthlyInstallment: noInstallment ? 0 : od.monthlyInstallment,
    dueDate: od.debtType === 'berjangka' ? 0 : (od.dueDate ?? 0),
    note,
  };
}
