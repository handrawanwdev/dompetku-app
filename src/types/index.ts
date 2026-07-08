// ─── Primitive Types ─────────────────────────────────────────────────────────

export type IncomeCategory = string;
export type ExpenseCategory = string;
export type ExpenseSource = 'cash' | 'savings';
export type InvestmentType =
  | 'stock'
  | 'crypto'
  | 'gold'
  | 'mutual_fund'
  | 'bond'
  | 'property';
export type AssetCategory =
  | 'laptop'
  | 'phone'
  | 'vehicle'
  | 'house'
  | 'electronics'
  | 'furniture'
  | 'other';
export type SavingTransactionType = 'deposit' | 'withdraw' | 'transfer';

// ─── Domain Interfaces ────────────────────────────────────────────────────────

export interface Income {
  id: string;
  date: string;
  category: string;
  amount: number;
  note?: string;
  allocationDebt: number;
  allocationSavings: number;
  allocationCash: number;
  /** Debt.id that received allocationDebt, if any */
  allocationDebtId?: string;
  /** Saving.id that received allocationSavings, if any */
  allocationSavingId?: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  source: ExpenseSource;
  /** Saving.id that funded this expense, when source === 'savings' */
  savingId?: string;
  note?: string;
  createdAt: string;
}

export interface Debt {
  id: string;
  name: string;
  lender: string;
  totalAmount: number;
  monthlyInstallment: number;
  remainingMonth: number;
  /** Day of month 1–31 */
  dueDate: number;
  startDate: string;
  note?: string;
  /** Extra rupiah paid ad-hoc (e.g. allocated from income) on top of scheduled installments */
  extraPaid?: number;
  createdAt: string;
}

export interface DebtPayment {
  id: string;
  debtId: string;
  amount: number;
  date: string;
  note?: string;
  createdAt: string;
}

export interface SavingHistory {
  id: string;
  savingId: string;
  type: SavingTransactionType;
  amount: number;
  date: string;
  note?: string;
  createdAt: string;
}

export interface Saving {
  id: string;
  name: string;
  target: number;
  balance: number;
  emoji: string;
  createdAt: string;
}

export interface Investment {
  id: string;
  type: InvestmentType;
  name: string;
  buyPrice: number;
  quantity: number;
  currentPrice: number;
  buyDate: string;
  note?: string;
  createdAt: string;
}

export interface PhysicalAsset {
  id: string;
  name: string;
  category: AssetCategory;
  purchasePrice: number;
  purchaseDate: string;
  /** Useful life in years */
  usefulLife: number;
  residualValue: number;
  note?: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  deadline: string;
  savingId: string;
  emoji: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  emoji: string;
  createdAt: string;
}

// ─── Settings & Summary ───────────────────────────────────────────────────────

export interface AppSettings {
  /** Debt-to-income ratio limit as a percentage (default 30) */
  debtRatioLimit: number;
  /** Working days per month used for daily rate calculation (default 22) */
  workingDays: number;
  /** Currency code (default 'IDR') */
  currency: string;
  /** Weekday indices (0=Minggu..6=Sabtu) excluded from working-day pacing calcs (default [0]) */
  hariLibur: number[];
  /** SavingModel._id (hex) designated as the "dana darurat" pos for the Emergency Fund module */
  emergencyFundSavingId?: string;
}

export interface DashboardSummary {
  cash: number;
  totalSavings: number;
  totalInvestment: number;
  totalAssets: number;
  totalDebt: number;
  netWorth: number;
  monthlyIncome: number;
  monthlyExpense: number;
  cashflow: number;
  debtRatio: number;
}

// ─── Form / UI Helpers ────────────────────────────────────────────────────────

export interface SelectOption<T = string> {
  value: T;
  label: string;
  emoji?: string;
}
