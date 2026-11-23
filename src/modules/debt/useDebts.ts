import { useMemo } from 'react';
import { useQuery } from '@realm/react';
import { DebtModel } from '../../models/DebtModel';
import { ExpenseModel } from '../../models/ExpenseModel';
import { buildDebtInfos } from '../../utils/debt';

/** Semua kewajiban + sisa/status yang dihitung dari transaksi terhubung. */
export function useDebts() {
  const debts = useQuery(DebtModel, (c) => c.sorted('createdAt'), []);
  const payments = useQuery(ExpenseModel, (c) => c.filtered('debtId != ""'), []);
  return useMemo(() => buildDebtInfos(debts, payments), [debts, payments]);
}
