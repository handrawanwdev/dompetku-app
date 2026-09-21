import React from 'react';
import { COLORS } from '../../theme';
import { MoneyDropAnimation, type MoneyDropMode } from './MoneyDropAnimation';

export type TransactionKind = 'income' | 'expense';

const CONFIG: Record<TransactionKind, { title: string; accentColor: string; mode: MoneyDropMode }> = {
  income: { title: 'Pemasukan Tercatat!', accentColor: COLORS.income, mode: 'in' },
  expense: { title: 'Pengeluaran Tercatat!', accentColor: COLORS.expense, mode: 'out' },
};

interface Props {
  visible: boolean;
  amount: number;
  kind: TransactionKind;
  onFinish: () => void;
}

/** Coins-into/out-of-the-wallet celebration shown right after a new income/expense entry is saved. */
export function TransactionSuccessAnimation({ visible, amount, kind, onFinish }: Props) {
  const { title, accentColor, mode } = CONFIG[kind];
  return (
    <MoneyDropAnimation
      visible={visible}
      amount={amount}
      title={title}
      accentColor={accentColor}
      icon="👛"
      mode={mode}
      onFinish={onFinish}
    />
  );
}
