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

/** Pembelian investasi/aset dicatat sebagai uang keluar jenis Investasi (default aktif).
 * Off hanya untuk barang yang dibeli sebelum pakai app. */
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
        <Text style={styles.label}>Dibayar pakai saldo di Dompetku</Text>
        <Text style={[styles.sub, !value && { color: COLORS.warningText }]}>
          {value
            ? `${amountLabel} dipotong dari saldo dan tercatat di riwayat sebagai uang keluar jenis Investasi.`
            : 'Tidak memotong saldo dan tidak tercatat di riwayat. Matikan hanya kalau dibeli sebelum pakai Dompetku.'}
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
