import React from 'react';
import { COLORS } from '../../theme';
import { MoneyDropAnimation, type MoneyDropMode } from './MoneyDropAnimation';

export type SavingMoveKind = 'deposit' | 'withdraw' | 'transfer';

const SAVING_CONFIG: Record<SavingMoveKind, { title: string; accentColor: string; mode: MoneyDropMode }> = {
  deposit: { title: 'Setor Berhasil!', accentColor: COLORS.savings, mode: 'in' },
  withdraw: { title: 'Tarik Berhasil!', accentColor: COLORS.expense, mode: 'out' },
  transfer: { title: 'Transfer Berhasil!', accentColor: COLORS.warning, mode: 'across' },
};

interface Props {
  visible: boolean;
  amount: number;
  type?: SavingMoveKind;
  onFinish: () => void;
}

/** Coins-into-the-jar celebration shown right after a successful saving move. */
export function SavingSuccessAnimation({ visible, amount, type = 'deposit', onFinish }: Props) {
  const { title, accentColor, mode } = SAVING_CONFIG[type];
  return (
    <MoneyDropAnimation
      visible={visible}
      amount={amount}
      title={title}
      accentColor={accentColor}
      icon="🫙"
      mode={mode}
      onFinish={onFinish}
    />
  );
}
