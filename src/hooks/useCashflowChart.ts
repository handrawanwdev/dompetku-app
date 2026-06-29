import { useMemo } from 'react';
import { useQuery } from '@realm/react';
import dayjs from 'dayjs';

import { IncomeModel } from '../models/IncomeModel';
import { ExpenseModel } from '../models/ExpenseModel';

export type ChartPeriod = '7d' | '30d' | '12m';

export function useCashflowChart(period: ChartPeriod = '30d') {
  const incomes = useQuery(IncomeModel);
  const expenses = useQuery(ExpenseModel);

  return useMemo(() => {
    if (period === '7d') {
      return Array.from({ length: 7 }, (_, i) => {
        const d = dayjs().subtract(6 - i, 'day');
        const dateStr = d.format('YYYY-MM-DD');
        const income = incomes
          .filtered('date == $0', dateStr)
          .reduce((s, x) => s + x.amount, 0);
        const expense = expenses
          .filtered('date == $0', dateStr)
          .reduce((s, x) => s + x.amount, 0);
        return { label: d.format('DD'), income, expense, cashflow: income - expense };
      });
    }

    if (period === '30d') {
      return Array.from({ length: 30 }, (_, i) => {
        const d = dayjs().subtract(29 - i, 'day');
        const dateStr = d.format('YYYY-MM-DD');
        const income = incomes
          .filtered('date == $0', dateStr)
          .reduce((s, x) => s + x.amount, 0);
        const expense = expenses
          .filtered('date == $0', dateStr)
          .reduce((s, x) => s + x.amount, 0);
        return { label: d.format('DD'), income, expense, cashflow: income - expense };
      });
    }

    // 12m
    return Array.from({ length: 12 }, (_, i) => {
      const d = dayjs().subtract(11 - i, 'month');
      const start = d.startOf('month').format('YYYY-MM-DD');
      const end = d.endOf('month').format('YYYY-MM-DD');
      const income = incomes
        .filtered('date >= $0 AND date <= $1', start, end)
        .reduce((s, x) => s + x.amount, 0);
      const expense = expenses
        .filtered('date >= $0 AND date <= $1', start, end)
        .reduce((s, x) => s + x.amount, 0);
      return { label: d.format('MMM'), income, expense, cashflow: income - expense };
    });
  }, [incomes, expenses, period]);
}
