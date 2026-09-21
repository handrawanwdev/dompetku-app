import React from 'react';
import { COLORS } from '../../theme';
import { MoneyDropAnimation } from './MoneyDropAnimation';

export type DebtPaymentKind = 'installment' | 'bill' | 'debt';

const TITLE: Record<DebtPaymentKind, string> = {
  installment: 'Cicilan Dibayar!',
  bill: 'Tagihan Dibayar!',
  debt: 'Utang Dibayar!',
};

interface Props {
  visible: boolean;
  amount: number;
  kind: DebtPaymentKind;
  onFinish: () => void;
}

/** Coins-into-the-bill celebration shown right after a successful debt/bill payment. */
export function DebtPaymentSuccessAnimation({ visible, amount, kind, onFinish }: Props) {
  return (
    <MoneyDropAnimation
      visible={visible}
      amount={amount}
      title={TITLE[kind]}
      accentColor={COLORS.debt}
      icon="🧾"
      mode="in"
      onFinish={onFinish}
    />
  );
}
