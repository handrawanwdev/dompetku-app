import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Text } from '../../../components/common';
import { COLORS, FONTS, ICON_SIZES, RADIUS, SPACING } from '../../../theme';
import { accountTypeMeta } from '../../../services/AccountService';
import { formatCurrency } from '../../../utils/currency';
import { useRootNavigation } from '../../../navigation/types';
import { useAccounts } from '../useAccounts';

interface Props {
  label: string;
  value: string;
  onChange: (id: string) => void;
  /** Kantong yang tidak boleh dipilih (mis. kantong asal saat pindah saldo). */
  exclude?: string;
  /** Hanya kantong tabungan. */
  onlySavings?: boolean;
  /** Tampilkan pilihan kosong ('') dengan label ini. */
  noneLabel?: string;
}

/** Pilih kantong (BCA, GoPay, …). Tampil saldo kantong yang dipilih. */
export function AccountPicker({ label, value, onChange, exclude, onlySavings, noneLabel }: Props) {
  const nav = useRootNavigation();
  const { list: all } = useAccounts();
  const list = onlySavings ? all.filter((a) => a.account.isSavings) : all;
  const options = list.filter((a) => a.id !== exclude);
  const addNew = () => nav.navigate('AccountForm', { savings: onlySavings });
  const selected = list.find((a) => a.id === value);

  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      {list.length === 0 ? (
        <TouchableOpacity style={styles.empty} onPress={addNew} activeOpacity={0.7}>
          <MaterialIcons name="add" size={ICON_SIZES.md} color={COLORS.primary} />
          <Text style={styles.emptyText}>
            {onlySavings
              ? 'Tambah kantong tabungan (misal Blu, Jago) supaya uang yang disisihkan ikut pindah ke sana'
              : 'Tambah kantong (BCA, GoPay, tunai…) supaya tahu uangnya di mana'}
          </Text>
        </TouchableOpacity>
      ) : (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row} keyboardShouldPersistTaps="handled">
            {noneLabel !== undefined && (
              <TouchableOpacity
                onPress={() => onChange('')}
                style={[styles.chip, value === '' && styles.chipNone]}
                activeOpacity={0.7}
                accessibilityRole="radio"
                accessibilityState={{ selected: value === '' }}
              >
                <Text style={[styles.chipLabel, value === '' && styles.chipLabelActive]}>{noneLabel}</Text>
              </TouchableOpacity>
            )}
            {options.map((a) => {
              const m = accountTypeMeta(a.account.type);
              const active = a.id === value;
              return (
                <TouchableOpacity
                  key={a.id}
                  onPress={() => onChange(a.id)}
                  style={[styles.chip, active && { borderColor: m.color, backgroundColor: m.color + '1A' }]}
                  activeOpacity={0.7}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                >
                  <MaterialIcons name={a.account.isSavings ? 'savings' : m.icon} size={ICON_SIZES.sm} color={a.account.isSavings ? COLORS.saving : m.color} />
                  <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{a.account.name}</Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              onPress={addNew}
              style={styles.chip}
              activeOpacity={0.7}
              accessibilityLabel="Tambah kantong"
            >
              <MaterialIcons name="add" size={ICON_SIZES.sm} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </ScrollView>
          {selected && (
            <Text style={styles.hint}>Saldo {selected.account.name} {formatCurrency(selected.balance)}</Text>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { marginBottom: SPACING.md },
  label: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginBottom: SPACING.sm, fontWeight: '500' },
  row: { gap: SPACING.sm, paddingRight: SPACING.xl },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipNone: { borderColor: COLORS.textMuted, backgroundColor: COLORS.subtleBg },
  chipLabel: { fontSize: FONTS.sm, color: COLORS.textSecondary, fontWeight: '500' },
  chipLabelActive: { color: COLORS.text, fontWeight: '700' },
  hint: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: SPACING.xs },
  empty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
  },
  emptyText: { flex: 1, fontSize: FONTS.sm, color: COLORS.textSecondary },
});
