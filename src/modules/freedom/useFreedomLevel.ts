import { useMemo } from 'react';
import { useQuery, useRealm } from '@realm/react';
import dayjs from 'dayjs';

import { IncomeModel } from '../../models/IncomeModel';
import { ExpenseModel } from '../../models/ExpenseModel';
import { InvestmentModel } from '../../models/InvestmentModel';
import { TransferModel } from '../../models/TransferModel';
import { AccountModel } from '../../models/AccountModel';
import { getBalances, getUntrackedInvestment } from '../../services/AllocationService';
import { useSettingsStore } from '../../store/settingsStore';
import { EXCLUDE_NON_EARNED } from '../../utils/journal';
import { computeFreedomLevel, type FreedomInput } from '../../utils/freedomLevel';
import { useDebts } from '../debt/useDebts';

const EARNED = `date >= $0 AND date <= $1 AND isInternal == false AND ${EXCLUDE_NON_EARNED}`;
const SPENT = 'date >= $0 AND date <= $1 AND isInternal == false';

/**
 * Data level keuangan. Rata-rata diambil dari 3 bulan penuh terakhir yang ada
 * catatannya; kalau belum ada, pakai bulan berjalan.
 */
export function useFreedomLevel() {
  const realm = useRealm();
  const incomes = useQuery(IncomeModel);
  const expenses = useQuery(ExpenseModel);
  const investments = useQuery(InvestmentModel, (c) => c.filtered('sold == false'), []);
  // Ikut dihitung di saldo Tabungan (getBalances).
  const transfers = useQuery(TransferModel);
  const accounts = useQuery(AccountModel);
  const debts = useDebts();
  const installmentLimit = useSettingsStore((s) => s.settings.kindTargets.obligation);

  return useMemo(() => {
    const now = dayjs();
    const range = (m: dayjs.Dayjs) => [m.startOf('month').format('YYYY-MM-DD'), m.endOf('month').format('YYYY-MM-DD')] as const;
    const hasData = (m: dayjs.Dayjs) =>
      incomes.filtered('date >= $0 AND date <= $1 AND isInternal == false', ...range(m)).length > 0 ||
      expenses.filtered(SPENT, ...range(m)).length > 0;

    let window = [1, 2, 3].map((n) => now.subtract(n, 'month')).filter(hasData);
    const partial = window.length === 0;
    if (partial) window = [now];

    let income = 0;
    let needs = 0;
    let expense = 0;
    for (const m of window) {
      const [from, to] = range(m);
      income += incomes.filtered(EARNED, from, to).sum('amount') ?? 0;
      for (const e of expenses.filtered(SPENT, from, to)) {
        if (e.kind === 'saving' || e.kind === 'invest') continue;
        expense += e.amount;
        if (e.kind !== 'want') needs += e.amount;
      }
    }
    const n = window.length;

    const active = debts.filter((d) => !d.lunas);
    const input: FreedomInput = {
      months: n,
      avgIncome: income / n,
      avgNeeds: needs / n,
      avgExpense: expense / n,
      monthlyInstallment: active.reduce((s, d) => s + Math.min(d.debt.monthlyInstallment, d.remaining), 0),
      installmentLimit,
      totalDebt: active.reduce((s, d) => s + d.remaining, 0),
      savings: getBalances(realm).savings,
      productiveAssets:
        investments.reduce((s, inv) => s + inv.currentPrice * inv.quantity, 0) + getUntrackedInvestment(realm),
    };

    return {
      ...computeFreedomLevel(input),
      input,
      /** Rata-rata masih dari bulan berjalan (belum ada bulan penuh). */
      partial,
      months: n,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realm, incomes, expenses, investments, transfers, accounts, debts, installmentLimit]);
}

export type FreedomLevelData = ReturnType<typeof useFreedomLevel>;
