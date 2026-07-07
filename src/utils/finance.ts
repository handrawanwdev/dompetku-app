import dayjs from 'dayjs';

export function calcDepreciation(
  purchasePrice: number,
  residualValue: number,
  usefulLife: number,
  purchaseDate: string
): number {
  const yearsOwned = (Date.now() - new Date(purchaseDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
  const annualDepreciation = (purchasePrice - residualValue) / usefulLife;
  const totalDepreciation = Math.min(annualDepreciation * yearsOwned, purchasePrice - residualValue);
  return Math.max(purchasePrice - totalDepreciation, residualValue);
}

export function calcROI(buyPrice: number, currentValue: number, quantity: number): number {
  const invested = buyPrice * quantity;
  const current = currentValue * quantity;
  if (invested === 0) return 0;
  return ((current - invested) / invested) * 100;
}

export function calcProfitLoss(buyPrice: number, currentPrice: number, quantity: number): number {
  return (currentPrice - buyPrice) * quantity;
}

export function calcGoalProgress(current: number, target: number): number {
  if (target === 0) return 0;
  return Math.min((current / target) * 100, 100);
}

export function calcDebtRatio(monthlyInstallment: number, monthlyIncome: number): number {
  if (monthlyIncome === 0) return 0;
  return (monthlyInstallment / monthlyIncome) * 100;
}

export function generateFinancialSuggestion(params: {
  debtRatio: number;
  debtRatioLimit: number;
  cashflow: number;
  netWorth: number;
  totalSavings: number;
  monthlyIncome: number;
}): string {
  const { debtRatio, debtRatioLimit, cashflow, totalSavings, monthlyIncome } = params;

  if (debtRatio > debtRatioLimit) {
    return `Rasio hutang kamu ${debtRatio.toFixed(0)}% melebihi batas ${debtRatioLimit}%. Pertimbangkan untuk melunasi hutang lebih cepat.`;
  }
  if (cashflow < 0) {
    return 'Pengeluaran melebihi pemasukan bulan ini. Coba kurangi pengeluaran tidak penting.';
  }
  if (totalSavings < monthlyIncome * 3) {
    return 'Dana darurat kamu masih kurang dari 3x gaji. Prioritaskan menabung untuk dana darurat.';
  }
  return 'Kondisi keuangan kamu baik! Pertahankan pola pengeluaran saat ini.';
}

// ─── Working-day pacing (hariLibur aware) ─────────────────────────────────────

/** Count working days (weekday not in hariLibur) in the given month. */
export function getWorkingDaysInMonth(year: number, month: number, hariLibur: number[]): number {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let count = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const dow = new Date(year, month, d).getDay();
    if (!hariLibur.includes(dow)) count++;
  }
  return count;
}

/** Count remaining working days in the current month, from today (inclusive) to month end. */
export function getWorkingDaysRemaining(now: Date, hariLibur: number[]): number {
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  let count = 0;
  for (let d = now.getDate(); d <= daysInMonth; d++) {
    const dow = new Date(now.getFullYear(), now.getMonth(), d).getDay();
    if (!hariLibur.includes(dow)) count++;
  }
  return count;
}

// ─── Debt reminder urgency tiers ──────────────────────────────────────────────

export type ReminderTier = 'lunas' | 'hari-ini' | 'mendesak' | 'segera' | 'aman';

export interface ReminderStatus {
  tier: ReminderTier;
  label: string;
  color: string;
  bg: string;
  urgent: boolean;
  daysUntil: number;
}

export interface DebtReminderInput {
  id: string;
  name: string;
  monthlyInstallment: number;
  remainingMonth: number;
  dueDate: number;
  /** Whether a DebtPayment already exists for this debt within the current month */
  paidThisMonth: boolean;
}

export function getReminderStatus(debt: DebtReminderInput, now: Date = new Date()): ReminderStatus | null {
  if (!debt.dueDate || debt.remainingMonth === 0) return null;

  const today = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysUntil = debt.dueDate >= today ? debt.dueDate - today : daysInMonth - today + debt.dueDate;

  if (debt.paidThisMonth) {
    return { tier: 'lunas', label: '✅ Sudah bayar bulan ini', color: '#065f46', bg: '#d1fae5', urgent: false, daysUntil };
  }
  if (daysUntil === 0) {
    return { tier: 'hari-ini', label: '🔴 JATUH TEMPO HARI INI!', color: '#991b1b', bg: '#fee2e2', urgent: true, daysUntil };
  }
  if (daysUntil <= 3) {
    return {
      tier: 'mendesak',
      label: `🟠 Jatuh tempo ${daysUntil} hari lagi (tgl ${debt.dueDate})`,
      color: '#92400e', bg: '#fef3c7', urgent: true, daysUntil,
    };
  }
  if (daysUntil <= 7) {
    return {
      tier: 'segera',
      label: `🟡 Jatuh tempo ${daysUntil} hari lagi (tgl ${debt.dueDate})`,
      color: '#92400e', bg: '#fefce8', urgent: false, daysUntil,
    };
  }
  return {
    tier: 'aman',
    label: `📅 Jatuh tempo tgl ${debt.dueDate} (${daysUntil} hari lagi)`,
    color: '#1e40af', bg: '#eff6ff', urgent: false, daysUntil,
  };
}

// ─── Roadmap bebas hutang (snowball) ──────────────────────────────────────────

export interface RoadmapItem {
  id: string;
  name: string;
  step: number;
  remainingMonth: number;
  monthlyInstallment: number;
  totalRemaining: number;
  payoffLabel: string;
  progressPct: number;
  color: string;
}

const ROADMAP_COLORS = ['#1D9E75', '#185FA5', '#EF9F27', '#E24B4A'];

export function getDebtRoadmap(
  debts: Array<{ id: string; name: string; remainingMonth: number; monthlyInstallment: number }>,
  now: Date = new Date(),
): RoadmapItem[] {
  const sorted = [...debts].sort((a, b) => a.remainingMonth - b.remainingMonth);
  return sorted.map((h, i) => ({
    id: h.id,
    name: h.name,
    step: i + 1,
    remainingMonth: h.remainingMonth,
    monthlyInstallment: h.monthlyInstallment,
    totalRemaining: h.monthlyInstallment * h.remainingMonth,
    payoffLabel: dayjs(now).add(h.remainingMonth, 'month').format('MMMM YYYY'),
    progressPct: Math.round(((6 - Math.min(h.remainingMonth, 6)) / 6) * 100),
    color: ROADMAP_COLORS[i % ROADMAP_COLORS.length],
  }));
}

// ─── Trailing 30-day real average income/expense ──────────────────────────────

export function getTrailing30d(
  incomes: Array<{ date: string; amount: number }>,
  expenses: Array<{ date: string; amount: number }>,
  now: Date = new Date(),
): { income: number; expense: number } {
  const cutoff = dayjs(now).subtract(30, 'day').format('YYYY-MM-DD');
  const income = incomes.filter((t) => t.date >= cutoff).reduce((s, t) => s + t.amount, 0);
  const expense = expenses.filter((t) => t.date >= cutoff).reduce((s, t) => s + t.amount, 0);
  return { income, expense };
}

// ─── Proyeksi finansial ────────────────────────────────────────────────────────

export interface FinancialProjection {
  cashNow: number;
  debtFreeMonths: number;
  debtFreeLabel: string;
  totalSavings: number;
  emergencyFundTarget: number;
  emergencyFundLabel: string;
}

export function getFinancialProjection(params: {
  cashNow: number;
  totalSavings: number;
  maxRemainingMonth: number;
  monthlyInstallmentTotal: number;
  trailingExpense30d: number;
  now?: Date;
}): FinancialProjection {
  const { cashNow, totalSavings, maxRemainingMonth, monthlyInstallmentTotal, trailingExpense30d } = params;
  const now = params.now ?? new Date();

  const debtFreeLabel = maxRemainingMonth > 0
    ? dayjs(now).add(maxRemainingMonth, 'month').format('MMMM YYYY')
    : 'Sudah bebas 🎉';

  const emergencyFundTarget = 3 * (monthlyInstallmentTotal + trailingExpense30d || 1);
  const surplusNow = cashNow;
  const monthsToTarget = surplusNow > 0
    ? Math.ceil(Math.max(0, emergencyFundTarget - totalSavings) / surplusNow)
    : 999;
  const emergencyFundLabel = monthsToTarget < 500 && surplusNow > 0
    ? `~${monthsToTarget} bln`
    : 'Isi tabungan';

  return {
    cashNow,
    debtFreeMonths: maxRemainingMonth,
    debtFreeLabel,
    totalSavings,
    emergencyFundTarget,
    emergencyFundLabel,
  };
}

// ─── Multi-card rekomendasi (priority-stacked) ────────────────────────────────

export interface FinancialSuggestionCard {
  icon: string;
  bg: string;
  text: string;
  tag: string;
  tagColor: string;
}

export function generateFinancialSuggestions(params: {
  cashNow: number;
  debtRatioPct: number;
  debtRatioLimit: number;
  urgentDebtNames: string[];
  almostPaidOffDebts: Array<{ name: string; remainingMonth: number }>;
}): FinancialSuggestionCard[] {
  const { cashNow, debtRatioPct, debtRatioLimit, urgentDebtNames, almostPaidOffDebts } = params;
  const items: FinancialSuggestionCard[] = [];

  if (urgentDebtNames.length) {
    items.push({
      icon: '🔔', bg: '#fee2e2',
      text: `${urgentDebtNames.join(', ')} jatuh tempo sangat dekat!`,
      tag: 'Mendesak', tagColor: '#e24b4a',
    });
  }
  if (cashNow > 500000) {
    items.push({
      icon: '💰', bg: '#d1fae5',
      text: `Kas bersih ${formatCurrencyShort(cashNow)}. Pertimbangkan setor ke tabungan.`,
      tag: 'Surplus', tagColor: '#1d9e75',
    });
  }
  if (cashNow < 0) {
    items.push({
      icon: '⚠️', bg: '#fee2e2',
      text: `Kas bersih negatif ${formatCurrencyShort(Math.abs(cashNow))}. Kurangi pengeluaran.`,
      tag: 'Defisit', tagColor: '#e24b4a',
    });
  }
  if (almostPaidOffDebts.length) {
    items.push({
      icon: '🏁', bg: '#dbeafe',
      text: `${almostPaidOffDebts.map((h) => h.name).join(', ')} hampir lunas! Sisa ${almostPaidOffDebts[0].remainingMonth} bulan.`,
      tag: 'Segera', tagColor: '#185fa5',
    });
  }
  if (debtRatioPct > debtRatioLimit) {
    items.push({
      icon: '🚨', bg: '#fee2e2',
      text: `Cicilan ${debtRatioPct.toFixed(0)}% dari estimasi pendapatan. Melebihi batas aman.`,
      tag: 'Peringatan', tagColor: '#e24b4a',
    });
  }
  if (!items.length) {
    items.push({
      icon: '👍', bg: '#f3f4f6',
      text: 'Keuangan stabil. Terus catat transaksi harian.',
      tag: 'Normal', tagColor: '#374151',
    });
  }
  return items;
}

function formatCurrencyShort(n: number): string {
  return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}

// ─── Kewajiban pembayaran (this month / next month + daily target) ───────────

export interface KewajibanInfo {
  bulanIniLabel: string;
  bulanDepanLabel: string;
  totalBulanIni: number;
  totalBulanDepan: number;
  totalSudahBayar: number;
  totalBelumBayar: number;
  workingDaysInMonth: number;
  workingDaysRemaining: number;
  hariLiburLabel: string;
  targetPerHariKerja: number;
  targetPerHariSisa: number;
}

const DAY_NAMES_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export function getKewajibanBulanIni(
  debts: Array<{ remainingMonth: number; monthlyInstallment: number; paidThisMonth: boolean }>,
  cashNow: number,
  hariLibur: number[],
  now: Date = new Date(),
): KewajibanInfo {
  const active = debts.filter((h) => h.remainingMonth > 0);
  const totalBulanIni = active.reduce((s, h) => s + h.monthlyInstallment, 0);
  const totalBulanDepan = debts
    .filter((h) => h.remainingMonth > 1)
    .reduce((s, h) => s + h.monthlyInstallment, 0);

  const totalSudahBayar = active.filter((h) => h.paidThisMonth).reduce((s, h) => s + h.monthlyInstallment, 0);
  const totalBelumBayar = totalBulanIni - totalSudahBayar;

  const workingDaysInMonth = getWorkingDaysInMonth(now.getFullYear(), now.getMonth(), hariLibur);
  const workingDaysRemaining = getWorkingDaysRemaining(now, hariLibur);

  const sisaKumpul = Math.max(0, totalBulanIni - cashNow);
  const targetPerHariKerja = workingDaysInMonth > 0 ? Math.ceil(totalBulanIni / workingDaysInMonth) : totalBulanIni;
  const targetPerHariSisa = workingDaysRemaining > 0 && sisaKumpul > 0
    ? Math.ceil(sisaKumpul / workingDaysRemaining)
    : 0;

  return {
    bulanIniLabel: dayjs(now).format('MMMM YYYY'),
    bulanDepanLabel: dayjs(now).add(1, 'month').format('MMMM YYYY'),
    totalBulanIni,
    totalBulanDepan,
    totalSudahBayar,
    totalBelumBayar,
    workingDaysInMonth,
    workingDaysRemaining,
    hariLiburLabel: hariLibur.length ? hariLibur.map((d) => DAY_NAMES_ID[d]).join(', ') : 'Tidak ada',
    targetPerHariKerja,
    targetPerHariSisa,
  };
}
