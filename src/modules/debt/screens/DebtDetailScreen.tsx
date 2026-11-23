import React, { useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@realm/react';
import { MaterialIcons } from '@expo/vector-icons';

import { COLORS, FONTS, ICON_SIZES, SPACING, RADIUS, SHADOWS } from '../../../theme';
import { Text, Button, ProgressBar, BackButton } from '../../../components/common';
import { ExpenseModel } from '../../../models/ExpenseModel';
import { formatCurrency } from '../../../utils/currency';
import { formatDate } from '../../../utils/date';
import { getReminderStatus } from '../../../utils/debt';
import { useDebts } from '../useDebts';
import type { DebtStackParamList } from '../types';
import { useRootNavigation } from '../../../navigation/types';

type Props = NativeStackScreenProps<DebtStackParamList, 'DebtDetail'>;

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export function DebtDetailScreen({ navigation, route }: Props) {
  const { id } = route.params;
  const rootNav = useRootNavigation();
  const info = useDebts().find((d) => d.id === id);
  const payments = useQuery(ExpenseModel, (c) => c.filtered('debtId == $0', id).sorted('date', true), [id]);
  const history = useMemo(() => [...payments], [payments]);

  if (!info) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  const { debt } = info;
  const status = getReminderStatus(info);

  const pay = () =>
    rootNav.navigate('ExpenseForm', {
      kind: 'obligation',
      category: debt.monthlyInstallment > 0 ? 'Cicilan' : 'Utang',
      debtId: id,
    });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title} numberOfLines={1}>{debt.name}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('DebtForm', { id })} hitSlop={8} accessibilityLabel="Ubah">
          <MaterialIcons name="edit" size={ICON_SIZES.lg} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>{info.lunas ? 'Sudah lunas' : 'Sisa'}</Text>
          <Text style={styles.cardAmount}>{formatCurrency(info.remaining)}</Text>
          <ProgressBar progress={info.progress} color={COLORS.obligation} style={{ marginTop: SPACING.md }} />
          <Text style={styles.cardSub}>
            Terbayar {formatCurrency(info.paid)} dari {formatCurrency(debt.totalAmount)}
          </Text>
          {status && (
            <View style={[styles.badge, { backgroundColor: status.bg }]}>
              <Text style={[styles.badgeText, { color: status.color }]}>{status.label}</Text>
            </View>
          )}
        </View>

        <View style={styles.info}>
          <Row label="Cicilan per bulan" value={debt.monthlyInstallment > 0 ? formatCurrency(debt.monthlyInstallment) : 'Bayar bebas'} />
          {info.monthsLeft ? <Row label="Perkiraan selesai" value={`±${info.monthsLeft} bulan lagi`} /> : null}
          <Row label="Jatuh tempo" value={debt.dueDate ? `Tiap tanggal ${debt.dueDate}` : '-'} />
          {debt.note ? <Row label="Catatan" value={debt.note} /> : null}
        </View>

        {!info.lunas && <Button title="Bayar" onPress={pay} fullWidth style={styles.payBtn} />}

        <Text style={styles.sectionTitle}>Riwayat pembayaran</Text>
        {history.length === 0 ? (
          <Text style={styles.empty}>Belum ada pembayaran. Bayar dari sini, atau catat di Transaksi dan pilih kewajiban ini.</Text>
        ) : (
          history.map((e) => (
            <TouchableOpacity
              key={e._id.toHexString()}
              style={styles.payment}
              onPress={() => rootNav.navigate('ExpenseForm', { id: e._id.toHexString() })}
              activeOpacity={0.7}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.paymentTitle}>{e.category}</Text>
                <Text style={styles.paymentMeta} numberOfLines={1}>
                  {formatDate(e.date)}
                  {e.source === 'savings' ? ' · dari tabungan' : ''}
                  {e.note ? ` · ${e.note}` : ''}
                </Text>
              </View>
              <Text style={styles.paymentAmount}>{formatCurrency(e.amount)}</Text>
            </TouchableOpacity>
          ))
        )}
        {debt.paidBefore > 0 && (
          <Text style={styles.empty}>+ {formatCurrency(debt.paidBefore)} dibayar sebelum dicatat.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  title: { flex: 1, fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.sm,
  },
  cardLabel: { fontSize: FONTS.sm, fontWeight: '600', color: COLORS.textSecondary },
  cardAmount: { fontSize: FONTS.xxl, fontWeight: '800', color: COLORS.text, marginTop: SPACING.xs },
  cardSub: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: SPACING.sm },
  badge: { alignSelf: 'flex-start', paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: RADIUS.round, marginTop: SPACING.md },
  badgeText: { fontSize: FONTS.xs, fontWeight: '700' },
  info: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: SPACING.md, paddingVertical: SPACING.md },
  rowLabel: { fontSize: FONTS.sm, color: COLORS.textSecondary },
  rowValue: { flexShrink: 1, fontSize: FONTS.sm, fontWeight: '600', color: COLORS.text, textAlign: 'right' },
  payBtn: { marginTop: SPACING.lg },
  sectionTitle: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text, marginTop: SPACING.xl, marginBottom: SPACING.sm },
  empty: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: SPACING.xs },
  payment: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  paymentTitle: { fontSize: FONTS.md, fontWeight: '600', color: COLORS.text },
  paymentMeta: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: 2 },
  paymentAmount: { fontSize: FONTS.md, fontWeight: '700', color: COLORS.text },
});
