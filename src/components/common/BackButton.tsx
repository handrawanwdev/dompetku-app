import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme';

interface BackButtonProps {
  onPress: () => void;
  color?: string;
}

/** Canonical back button — same "arrow_back" glyph as the native-stack header (e.g. Laporan). */
export function BackButton({ onPress, color = COLORS.text }: BackButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.hitArea}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel="Kembali"
    >
      <MaterialIcons name="arrow-back" size={24} color={color} />
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
});
