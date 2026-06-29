import { useMemo } from 'react';
import { useQuery } from '@realm/react';
import dayjs from 'dayjs';

import { IncomeModel } from '../models/IncomeModel';
import { ExpenseModel } from '../models/ExpenseModel';
import { DebtModel } from '../models/DebtModel';
import { SavingModel } from '../models/SavingModel';
import { InvestmentModel } from '../models/InvestmentModel';
import { PhysicalAssetModel } from '../models/PhysicalAssetModel';
import { calcDepreciation } from '../utils/finance';
import { startOfMonth, endOfMonth } from '../utils/date';

export function useDashboardData() {
  const incomes = useQuery(IncomeModel);
  const expenses = useQuery(ExpenseModel);
  const debts = useQuery(DebtModel).filtered('isActive == true');
  const savings = useQuery(SavingModel);
  const investments = useQuery(InvestmentModel);
  const physicalAssets = useQuery(PhysicalAssetModel);

  const monthStart = startOfMonth();
  const monthEnd = endOfMonth();

  return useMemo(() => {
    const monthlyIncome = incomes
      .filtered('date >= $0 AND date <= $1', monthStart, monthEnd)
      .reduce((s, i) => s + i.amount, 0);

    const monthlyExpense = expenses
      .filtered('date >= $0 AND date <= $1', monthStart, monthEnd)
      .reduce((s, e) => s + e.amount, 0);

    const cash = incomes.reduce((s, i) => s + i.allocationCash, 0)
      - expenses.filtered('source == "cash"').reduce((s, e) => s + e.amount, 0);

    const totalSavings = savings.reduce((s, sv) => s + sv.balance, 0);
    const totalInvestment = investments.reduce((s, inv) => s + inv.currentPrice * inv.quantity, 0);
    const totalAssets = physicalAssets.reduce(
      (s, a) => s + calcDepreciation(a.purchasePrice, a.residualValue, a.usefulLife, a.purchaseDate), 0
    );
    const totalDebt = debts.reduce((s, d) => s + d.monthlyInstallment * d.remainingMonth, 0);
    const monthlyInstallment = debts.reduce((s, d) => s + d.monthlyInstallment, 0);
    const netWorth = cash + totalSavings + totalInvestment + totalAssets - totalDebt;
    const debtRatio = monthlyIncome > 0 ? (monthlyInstallment / monthlyIncome) * 100 : 0;

    return {
      cash,
      totalSavings,
      totalInvestment,
      totalAssets,
      totalDebt,
      monthlyInstallment,
      netWorth,
      monthlyIncome,
      monthlyExpense,
      cashflow: monthlyIncome - monthlyExpense,
      debtRatio,
    };
  }, [incomes, expenses, debts, savings, investments, physicalAssets, monthStart, monthEnd]);
}
