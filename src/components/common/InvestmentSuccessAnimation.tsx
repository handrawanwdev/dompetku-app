import React from 'react';
import { COLORS } from '../../theme';
import { MoneyDropAnimation } from './MoneyDropAnimation';

export type InvestmentMoveKind = 'add' | 'sell' | 'dividend';

const CONFIG: Record<InvestmentMoveKind, { title: string; accentColor: string; icon: string }> = {
  add: { title: 'Investasi Ditambahkan!', accentColor: COLORS.investment, icon: '📈' },
  sell: { title: 'Investasi Terjual!', accentColor: COLORS.income, icon: '💰' },
  dividend: { title: 'Dividen Diterima!', accentColor: COLORS.income, icon: '💰' },
};

interface Props {
  visible: boolean;
  amount: number;
  kind: InvestmentMoveKind;
  onFinish: () => void;
}

/** Coins-dropping-in celebration shown after adding an investment, selling one, or recording a dividend. */
export function InvestmentSuccessAnimation({ visible, amount, kind, onFinish }: Props) {
  const { title, accentColor, icon } = CONFIG[kind];
  return (
    <MoneyDropAnimation
      visible={visible}
      amount={amount}
      title={title}
      accentColor={accentColor}
      icon={icon}
      mode="in"
      onFinish={onFinish}
    />
  );
}
