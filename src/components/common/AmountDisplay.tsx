import React from 'react';
import { Text, StyleSheet, TextStyle, StyleProp } from 'react-native';
import { COLORS, FONTS } from '../../theme';
import { formatCurrency } from '../../utils/currency';

interface AmountDisplayProps {
  amount: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  colored?: boolean;
  positiveColor?: string;
  negativeColor?: string;
  style?: StyleProp<TextStyle>;
}

const sizes = {
  sm: FONTS.sm,
  md: FONTS.md,
  lg: FONTS.xl,
  xl: FONTS.xxxl,
};

export function AmountDisplay({
  amount,
  currency = 'IDR',
  size = 'md',
  colored = false,
  positiveColor = COLORS.income,
  negativeColor = COLORS.expense,
  style,
}: AmountDisplayProps) {
  const color = colored
    ? amount >= 0 ? positiveColor : negativeColor
    : COLORS.text;

  return (
    <Text style={[styles.base, { fontSize: sizes[size], color }, style]}>
      {formatCurrency(Math.abs(amount), currency)}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});
