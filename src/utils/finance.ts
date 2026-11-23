import dayjs from 'dayjs';
import { COLORS } from '../theme';

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
