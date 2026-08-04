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

export type DebtTypeForReminder = 'tanpa_tenor' | 'berjangka' | 'cicilan' | 'revolving' | 'tagihan_rutin';

export interface DebtReminderInput {
  id: string;
  name: string;
  monthlyInstallment: number;
  remainingMonth: number;
  /** Day of month (1–31) — used for cicilan/revolving/tagihan_rutin's recurring due date. */
  dueDate: number;
  /** YYYY-MM-DD — used for berjangka's single fixed maturity date. */
  dueDateFull: string;
  debtType: DebtTypeForReminder;
  /** For cicilan/revolving/tagihan_rutin: a DebtPayment already exists this month cycle. For berjangka: the debt is fully paid off (isActive false). Unused for tanpa_tenor. */
  paidThisMonth: boolean;
}

export function getReminderStatus(debt: DebtReminderInput, now: Date = new Date()): ReminderStatus | null {
  if (debt.debtType === 'tanpa_tenor') return null;

  if (debt.debtType === 'berjangka') {
    if (!debt.dueDateFull) return null;
    if (debt.paidThisMonth) {
      return { tier: 'lunas', label: '✅ Lunas', color: '#065f46', bg: '#d1fae5', urgent: false, daysUntil: 0 };
    }
    const daysUntil = dayjs(debt.dueDateFull).startOf('day').diff(dayjs(now).startOf('day'), 'day');
    if (daysUntil < 0) {
      return { tier: 'hari-ini', label: `🔴 Telat ${Math.abs(daysUntil)} hari!`, color: '#991b1b', bg: '#fee2e2', urgent: true, daysUntil };
    }
    if (daysUntil === 0) {
      return { tier: 'hari-ini', label: '🔴 JATUH TEMPO HARI INI!', color: '#991b1b', bg: '#fee2e2', urgent: true, daysUntil };
    }
    if (daysUntil <= 3) {
      return { tier: 'mendesak', label: `🟠 Jatuh tempo ${daysUntil} hari lagi`, color: '#92400e', bg: '#fef3c7', urgent: true, daysUntil };
    }
    if (daysUntil <= 7) {
      return { tier: 'segera', label: `🟡 Jatuh tempo ${daysUntil} hari lagi`, color: '#92400e', bg: '#fefce8', urgent: false, daysUntil };
    }
    return { tier: 'aman', label: `📅 Jatuh tempo ${dayjs(debt.dueDateFull).format('D MMM YYYY')}`, color: '#1e40af', bg: '#eff6ff', urgent: false, daysUntil };
  }

  if (!debt.dueDate) return null;
  if (debt.debtType === 'cicilan' && debt.remainingMonth === 0) return null;

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

// ─── Net Worth monthly series (from FinancialScore daily snapshots) ──────────

export interface NetWorthPoint {
  label: string;
  netWorth: number;
}

/** Takes the last snapshot of each month, oldest first, capped to the last `months` entries. */
export function buildNetWorthSeries(
  snapshots: Array<{ netWorth: number; createdAt: Date }>,
  months = 6,
): NetWorthPoint[] {
  const byMonth = new Map<string, { netWorth: number; createdAt: Date }>();
  for (const s of snapshots) {
    const key = dayjs(s.createdAt).format('YYYY-MM');
    const existing = byMonth.get(key);
    if (!existing || s.createdAt > existing.createdAt) {
      byMonth.set(key, s);
    }
  }
  return Array.from(byMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-months)
    .map(([key, v]) => ({ label: dayjs(key + '-01').format('MMM YYYY'), netWorth: v.netWorth }));
}

export function calcNetWorthGrowthPct(series: NetWorthPoint[]): number {
  if (series.length < 2) return 0;
  const first = series[0].netWorth;
  const last = series[series.length - 1].netWorth;
  if (first === 0) return last === 0 ? 0 : 100;
  return ((last - first) / Math.abs(first)) * 100;
}

// ─── Emergency Fund status (PRD §10) ──────────────────────────────────────────

export type EmergencyFundStatus = 'DANGER' | 'WARNING' | 'SAFE';

export interface EmergencyFundInfo {
  current: number;
  target: number;
  coverageMonths: number;
  /** True when monthlyExpense is 0 — coverageMonths is a placeholder, not a real month count. */
  coverageUnlimited: boolean;
  status: EmergencyFundStatus;
  statusColor: string;
  statusBg: string;
}

export function getEmergencyFundStatus(current: number, target: number, monthlyExpense: number): EmergencyFundInfo {
  const coverageUnlimited = monthlyExpense <= 0 && current > 0;
  const coverageMonths = monthlyExpense > 0 ? current / monthlyExpense : (current > 0 ? 99 : 0);
  let status: EmergencyFundStatus = 'DANGER';
  if (coverageMonths >= 3) status = 'SAFE';
  else if (coverageMonths >= 1) status = 'WARNING';

  const colors: Record<EmergencyFundStatus, { statusColor: string; statusBg: string }> = {
    DANGER: { statusColor: '#991b1b', statusBg: '#fee2e2' },
    WARNING: { statusColor: '#92400e', statusBg: '#fef3c7' },
    SAFE: { statusColor: '#065f46', statusBg: '#d1fae5' },
  };

  return { current, target, coverageMonths, coverageUnlimited, status, ...colors[status] };
}

// ─── Debt Freedom progress (PRD §11) ──────────────────────────────────────────

export interface DebtFreedomInfo {
  totalDebt: number;
  totalPaid: number;
  progressPct: number;
  estimatedFreedomLabel: string;
}

/** Uses every debt ever recorded (active + paid off) so payoff progress doesn't jump when a debt is fully settled. */
export function getDebtFreedomStatus(
  debts: Array<{ totalAmount: number; monthlyInstallment: number; remainingMonth: number }>,
  now: Date = new Date(),
): DebtFreedomInfo {
  let totalDebt = 0;
  let totalPaid = 0;
  let maxRemainingMonth = 0;

  for (const d of debts) {
    const remaining = d.monthlyInstallment * d.remainingMonth;
    totalDebt += d.totalAmount;
    totalPaid += Math.max(0, d.totalAmount - remaining);
    if (d.remainingMonth > maxRemainingMonth) maxRemainingMonth = d.remainingMonth;
  }

  const progressPct = totalDebt > 0 ? Math.min((totalPaid / totalDebt) * 100, 100) : 0;
  const estimatedFreedomLabel = maxRemainingMonth > 0
    ? dayjs(now).add(maxRemainingMonth, 'month').format('MMMM YYYY')
    : 'Sudah bebas 🎉';

  return { totalDebt, totalPaid, progressPct, estimatedFreedomLabel };
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

/** Only these debt types carry a recurring monthly obligation — tanpa_tenor and berjangka are settled on their own schedule, not every month. */
function isMonthlyObligation(h: { debtType: DebtTypeForReminder; remainingMonth: number }): boolean {
  if (h.debtType === 'cicilan') return h.remainingMonth > 0;
  return h.debtType === 'revolving' || h.debtType === 'tagihan_rutin';
}

function isMonthlyObligationNextMonth(h: { debtType: DebtTypeForReminder; remainingMonth: number }): boolean {
  if (h.debtType === 'cicilan') return h.remainingMonth > 1;
  return h.debtType === 'revolving' || h.debtType === 'tagihan_rutin';
}

export function getKewajibanBulanIni(
  debts: Array<{ remainingMonth: number; monthlyInstallment: number; paidThisMonth: boolean; debtType: DebtTypeForReminder }>,
  cashNow: number,
  hariLibur: number[],
  now: Date = new Date(),
): KewajibanInfo {
  const active = debts.filter(isMonthlyObligation);
  const totalBulanIni = active.reduce((s, h) => s + h.monthlyInstallment, 0);
  const totalBulanDepan = debts
    .filter(isMonthlyObligationNextMonth)
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

// ─── Debt payment schedule (per-month, marks late months) ────────────────────

export type DebtScheduleStatus = 'lunas' | 'telat' | 'jatuh-tempo-hari-ini' | 'akan-datang';

export interface DebtScheduleMonth {
  index: number;
  monthLabel: string;
  dueDateFull: string;
  amount: number;
  status: DebtScheduleStatus;
  daysLate: number;
}

/** How many upcoming months to show for open-ended (no-tenor) debts, which have no fixed payoff month. */
const NO_TENOR_LOOKAHEAD_MONTHS = 6;

/**
 * Builds the month-by-month installment schedule for a debt, from its first
 * due month through the last remaining one (or, for open-ended debts with no
 * tenor, a rolling lookahead window). The first `paymentsCount` months are
 * marked 'lunas' (payments are consumed oldest-first, matching how
 * handlePayment decrements remainingMonth by exactly 1 per payment for
 * tenor-based debts). Months whose due date has passed without a payment are
 * marked 'telat' with the number of calendar days overdue.
 */
export function buildDebtSchedule(params: {
  startDate: string;
  dueDate: number;
  monthlyInstallment: number;
  paymentsCount: number;
  hasTenor: boolean;
  remainingMonth: number;
  now?: Date;
}): DebtScheduleMonth[] {
  const { startDate, dueDate, monthlyInstallment, paymentsCount, hasTenor, remainingMonth } = params;
  const now = dayjs(params.now ?? new Date());
  const totalMonths = paymentsCount + (hasTenor ? remainingMonth : NO_TENOR_LOOKAHEAD_MONTHS);
  const startMonth = dayjs(startDate).startOf('month');

  const schedule: DebtScheduleMonth[] = [];
  for (let i = 0; i < totalMonths; i++) {
    const monthCursor = startMonth.add(i, 'month');
    const dueDay = Math.min(dueDate, monthCursor.daysInMonth());
    const dueDateFull = monthCursor.date(dueDay);

    let status: DebtScheduleStatus;
    let daysLate = 0;

    if (i < paymentsCount) {
      status = 'lunas';
    } else if (dueDateFull.isSame(now, 'day')) {
      status = 'jatuh-tempo-hari-ini';
    } else if (dueDateFull.isBefore(now, 'day')) {
      status = 'telat';
      daysLate = now.startOf('day').diff(dueDateFull.startOf('day'), 'day');
    } else {
      status = 'akan-datang';
    }

    schedule.push({
      index: i,
      monthLabel: monthCursor.format('MMMM YYYY'),
      dueDateFull: dueDateFull.format('YYYY-MM-DD'),
      amount: monthlyInstallment,
      status,
      daysLate,
    });
  }
  return schedule;
}

// ─── FIRE Calculator (PRD §12) ─────────────────────────────────────────────────

export interface FireInfo {
  fireNumber: number;
  currentAmount: number;
  progressPct: number;
  remaining: number;
  annualExpense: number;
  annualPassiveIncome: number;
  netAnnualNeed: number;
}

/**
 * FIRE Number = (annual expense − annual passive income) × 25 (4% safe withdrawal rate).
 * Passive income already covers part of living costs, so the portfolio only needs to
 * fund the remaining gap. `currentAmount` should be liquid/productive assets only
 * (savings + investments − debt) — personal-use physical assets don't count.
 */
export function calcFireProgress(
  monthlyExpense: number,
  currentAmount: number,
  monthlyPassiveIncome = 0,
): FireInfo {
  const annualExpense = monthlyExpense * 12;
  const annualPassiveIncome = monthlyPassiveIncome * 12;
  const netAnnualNeed = Math.max(0, annualExpense - annualPassiveIncome);
  const fireNumber = netAnnualNeed * 25;
  const progressPct =
    fireNumber > 0 ? Math.min((currentAmount / fireNumber) * 100, 100) : annualExpense > 0 ? 100 : 0;
  const remaining = Math.max(fireNumber - currentAmount, 0);
  return {
    fireNumber,
    currentAmount,
    progressPct,
    remaining,
    annualExpense,
    annualPassiveIncome,
    netAnnualNeed,
  };
}

// ─── Passive Income Tracker (PRD §13) ──────────────────────────────────────────

export const PASSIVE_INCOME_CATEGORIES = [
  { value: 'dividen', label: 'Dividen', emoji: '📊' },
  { value: 'properti', label: 'Properti', emoji: '🏠' },
  { value: 'bisnis', label: 'Bisnis', emoji: '💼' },
  { value: 'royalti', label: 'Royalti', emoji: '📚' },
  { value: 'yield', label: 'Yield', emoji: '🌾' },
] as const;

export const PASSIVE_INCOME_FREQUENCIES = [
  { value: 'monthly', label: 'Bulanan' },
  { value: 'yearly', label: 'Tahunan' },
] as const;

/** Normalizes any entry to a monthly-equivalent amount. */
export function toMonthlyAmount(amount: number, frequency: string): number {
  return frequency === 'yearly' ? amount / 12 : amount;
}

export interface PassiveIncomeInfo {
  monthlyTotal: number;
  freedomTarget: number;
  progressPct: number;
  remaining: number;
}

/** Freedom target reached when passive income covers monthly expense (PRD §13). */
export function getPassiveIncomeStatus(
  entries: Array<{ amount: number; frequency: string }>,
  monthlyExpense: number,
): PassiveIncomeInfo {
  const monthlyTotal = entries.reduce((s, e) => s + toMonthlyAmount(e.amount, e.frequency), 0);
  const progressPct = monthlyExpense > 0 ? Math.min((monthlyTotal / monthlyExpense) * 100, 100) : 0;
  const remaining = Math.max(monthlyExpense - monthlyTotal, 0);
  return { monthlyTotal, freedomTarget: monthlyExpense, progressPct, remaining };
}

// ─── Financial Recommendation Engine, sub-score driven (PRD §15) ─────────────

/** Rule-based tips derived from each Financial Freedom sub-score, distinct from the cashflow/debt-event cards above. */
export function generateScoreRecommendations(scores: {
  cashflowScore: number;
  emergencyScore: number;
  debtScore: number;
  investmentScore: number;
  passiveScore: number;
}): FinancialSuggestionCard[] {
  const items: FinancialSuggestionCard[] = [];

  if (scores.cashflowScore < 60) {
    items.push({
      icon: '⚠️', bg: '#fef3c7',
      text: 'Saving rate rendah. Kurangi pengeluaran konsumtif, target tambah saving Rp500.000/bulan.',
      tag: 'Cashflow', tagColor: '#92400e',
    });
  }
  if (scores.emergencyScore < 75) {
    items.push({
      icon: '🛡️', bg: '#fee2e2',
      text: 'Dana darurat belum aman. Kejar minimal 3× pengeluaran bulanan sebelum fokus ke investasi.',
      tag: 'Emergency Fund', tagColor: '#e24b4a',
    });
  }
  if (scores.debtScore < 70) {
    items.push({
      icon: '📋', bg: '#fee2e2',
      text: 'Rasio cicilan hutang cukup tinggi. Prioritaskan pelunasan sebelum menambah kewajiban baru.',
      tag: 'Debt Health', tagColor: '#e24b4a',
    });
  }
  if (scores.investmentScore < 70) {
    items.push({
      icon: '📈', bg: '#ede9fe',
      text: 'Alokasi investasi masih kecil dibanding pendapatan tahunan. Mulai investasi rutin bulanan.',
      tag: 'Investment', tagColor: '#6d28d9',
    });
  }
  if (scores.passiveScore < 60) {
    items.push({
      icon: '💎', bg: '#dbeafe',
      text: 'Passive income masih jauh dari menutup pengeluaran. Pertimbangkan dividen, properti sewa, atau yield instrument.',
      tag: 'Passive Income', tagColor: '#185fa5',
    });
  }
  return items;
}
