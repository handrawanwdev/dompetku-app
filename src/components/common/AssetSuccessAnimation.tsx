import React from 'react';
import { COLORS } from '../../theme';
import { MoneyDropAnimation } from './MoneyDropAnimation';

export type AssetMoveKind = 'add' | 'sell';

const CONFIG: Record<AssetMoveKind, { title: string; accentColor: string; icon: string }> = {
  add: { title: 'Aset Ditambahkan!', accentColor: COLORS.asset, icon: '📦' },
  sell: { title: 'Aset Terjual!', accentColor: COLORS.income, icon: '💰' },
};

interface Props {
  visible: boolean;
  amount: number;
  kind: AssetMoveKind;
  onFinish: () => void;
}

/** Coins-dropping-in celebration shown right after adding a new asset or selling one off. */
export function AssetSuccessAnimation({ visible, amount, kind, onFinish }: Props) {
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
