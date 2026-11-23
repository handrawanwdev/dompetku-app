import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Text } from './Text';
import { COLORS, FONTS, ICON_SIZES, RADIUS, SPACING } from '../../theme';

interface Props {
  value: boolean;
  onChange: (v: boolean) => void;
  amountLabel: string;
}

/** Opsi mencatat pembelian investasi/aset sebagai uang keluar jenis Investasi. */
export function PurchaseToggle({ value, onChange, amountLabel }: Props) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => onChange(!value)}
      activeOpacity={0.7}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value }}
    >
      <MaterialIcons
        name={value ? 'check-box' : 'check-box-outline-blank'}
        size={ICON_SIZES.lg}
        color={value ? COLORS.primary : COLORS.textMuted}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>Catat juga sebagai uang keluar</Text>
        <Text style={styles.sub}>
          {value
            ? `${amountLabel} dipotong dari saldo, masuk jenis Investasi.`
            : 'Pilih ini kalau belinya pakai uang yang tercatat di app.'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.lg,
  },
  label: { fontSize: FONTS.md, fontWeight: '600', color: COLORS.text },
  sub: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: 2 },
});
