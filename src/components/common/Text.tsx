import React from 'react';
import { Text as RNText, TextStyle, StyleProp } from 'react-native';
import { COLORS, FONTS } from '../../theme';

interface TextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  color?: string;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  numberOfLines?: number;
}

const variantStyles: Record<string, TextStyle> = {
  h1: { fontSize: FONTS.xxxl, fontWeight: '700', color: COLORS.text },
  h2: { fontSize: FONTS.xxl, fontWeight: '700', color: COLORS.text },
  h3: { fontSize: FONTS.xl, fontWeight: '600', color: COLORS.text },
  body: { fontSize: FONTS.md, color: COLORS.text },
  caption: { fontSize: FONTS.sm, color: COLORS.textSecondary },
  label: { fontSize: FONTS.xs, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
};

const weightMap: Record<string, TextStyle['fontWeight']> = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export function Text({ children, style, variant = 'body', color, weight, numberOfLines }: TextProps) {
  return (
    <RNText
      numberOfLines={numberOfLines}
      style={[
        variantStyles[variant],
        color ? { color } : undefined,
        weight ? { fontWeight: weightMap[weight] } : undefined,
        style,
      ]}
    >
      {children}
    </RNText>
  );
}
