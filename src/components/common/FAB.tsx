import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, SPACING } from '../../theme';

function lighten(hex: string, amount: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  return `#${[mix(r), mix(g), mix(b)]
    .map((c) => c.toString(16).padStart(2, '0'))
    .join('')}`;
}

interface Props {
  color: string;
  onPress: () => void;
  style?: ViewStyle;
}

export function FAB({ color, onPress, style }: Props) {
  return (
    <TouchableOpacity
      style={[styles.wrapper, style]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={[lighten(color, 0.25), color]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <MaterialIcons name="add" size={28} color={COLORS.onPrimary} />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: SPACING.xxl,
    right: SPACING.xl,
    width: 56,
    height: 56,
    borderRadius: RADIUS.round,
    elevation: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  gradient: {
    flex: 1,
    borderRadius: RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
