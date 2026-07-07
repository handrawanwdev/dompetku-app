import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FONTS } from '../../theme';

interface BackButtonProps {
  onPress: () => void;
  color?: string;
}

/** Canonical back-chevron button: 44×44 tap target regardless of visual icon size. */
export function BackButton({ onPress, color = '#ffffff' }: BackButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.hitArea}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel="Kembali"
    >
      <Text style={[styles.icon, { color }]}>←</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  hitArea: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: FONTS.xl,
    fontWeight: '600',
  },
});
