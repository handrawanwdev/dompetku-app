import { useMemo } from 'react';
import { useQuery, useRealm } from '@realm/react';
import { AccountModel } from '../../models/AccountModel';
import { TransferModel } from '../../models/TransferModel';
import { IncomeModel } from '../../models/IncomeModel';
import { ExpenseModel } from '../../models/ExpenseModel';
import { getAccountBalances, getUnassigned } from '../../services/AccountService';
import { getBalances } from '../../services/AllocationService';

export interface AccountInfo {
  account: AccountModel;
  id: string;
  balance: number;
}

/** Daftar kantong beserta saldonya, ikut berubah saat transaksi berubah. */
export function useAccounts() {
  const realm = useRealm();
  const accounts = useQuery(AccountModel, (c) => c.sorted([['isMain', true], ['createdAt', false]]), []);
  const transfers = useQuery(TransferModel);
  const incomes = useQuery(IncomeModel);
  const expenses = useQuery(ExpenseModel);

  return useMemo(() => {
    const balances = getAccountBalances(realm);
    const list: AccountInfo[] = accounts.map((a) => {
      const id = a._id.toHexString();
      return { account: a, id, balance: balances.get(id) ?? 0 };
    });
    return {
      list,
      totals: getBalances(realm),
      unassigned: getUnassigned(realm, balances),
      byId: (id: string) => list.find((x) => x.id === id),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realm, accounts, transfers, incomes, expenses]);
}
