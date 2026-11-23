import React, { useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../../theme';
import { Text, EmptyState, ProgressBar, FAB, BackButton } from '../../../components/common';
import { formatCurrency } from '../../../utils/currency';
import { getReminderStatus, type DebtInfo } from '../../../utils/debt';
import type { DebtModel } from '../../../models/DebtModel';
import { useDebts } from '../useDebts';
import type { DebtStackParamList } from '../types';

export type { DebtStackParamList };

type NavProp = NativeStackNavigationProp<DebtStackParamList>;

function DebtItem({ info, onPress }: { info: DebtInfo<DebtModel>; onPress: () => void }) {
  const { debt } = info;
  const status = getReminderStatus(info);
  const sub = [
    debt.monthlyInstallment > 0 ? `${formatCurrency(debt.monthlyInstallment)}/bln` : 'Bayar bebas',
    info.monthsLeft ? `±${info.monthsLeft} bln lagi` : null,
  ].filter(Boolean).join(' · ');

  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.itemHead}>
        <Text style={styles.itemName} numberOfLines={1}>{debt.name}</Text>
        {info.lunas ? (
          <View style={[styles.badge, { backgroundColor: COLORS.successBg }]}>
            <Text style={[styles.badgeText, { color: COLORS.successText }]}>Lunas</Text>
          </View>
        ) : status ? (
          <View style={[styles.badge, { backgroundColor: status.bg }]}>
            <Text style={[styles.badgeText, { color: status.color }]}>{status.label}</Text>
          </View>
        ) : null}
      </View>
      {!info.lunas && (
        <>
          <Text style={styles.itemRemaining}>Sisa {formatCurrency(info.remaining)}</Text>
          <ProgressBar progress={info.progress} color={COLORS.obligation} style={{ marginTop: SPACING.sm }} />
          <Text style={styles.itemSub}>{sub}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

export function DebtListScreen() {
  const navigation = useNavigation<NavProp>();
  const debts = useDebts();

  const active = debts.filter((d) => !d.lunas);
  const done = debts.filter((d) => d.lunas);

  const summary = useMemo(() => {
    const withInstallment = active.filter((d) => d.debt.monthlyInstallment > 0);
    return {
      remaining: active.reduce((s, d) => s + d.remaining, 0),
      perMonth: withInstallment.reduce((s, d) => s + Math.min(d.debt.monthlyInstallment, d.remaining), 0),
      paidCount: withInstallment.filter((d) => d.paidThisMonth).length,
      dueCount: withInstallment.length,
    };
  }, [active]);

  const open = (id: string) => navigation.navigate('DebtDetail', { id });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Cicilan & utang</Text>
      </View>
      {debts.length === 0 ? (
        <EmptyState
          emoji="🧾"
          title="Belum ada cicilan atau utang"
          subtitle="Catat cicilan, kartu kredit, atau utang supaya sisanya terpantau."
        />
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.summary}>
            <Text style={styles.summaryLabel}>Sisa utang</Text>
            <Text style={styles.summaryAmount}>{formatCurrency(summary.remaining)}</Text>
            {summary.dueCount > 0 && (
              <Text style={styles.summarySub}>
                Cicilan {formatCurrency(summary.perMonth)}/bln · sudah bayar {summary.paidCount} dari {summary.dueCount} bulan ini
              </Text>
            )}
          </View>

          {active.map((d) => (
            <DebtItem key={d.id} info={d} onPress={() => open(d.id)} />
          ))}

          {done.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Sudah lunas</Text>
              {done.map((d) => (
                <DebtItem key={d.id} info={d} onPress={() => open(d.id)} />
              ))}
            </>
          )}
        </ScrollView>
      )}

      <FAB color={COLORS.primary} onPress={() => navigation.navigate('DebtForm', {})} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  title: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text },
  content: { padding: SPACING.lg, paddingTop: 0, paddingBottom: 120 },
  summary: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  summaryLabel: { fontSize: FONTS.sm, fontWeight: '600', color: COLORS.textSecondary },
  summaryAmount: { fontSize: FONTS.xxl, fontWeight: '800', color: COLORS.text, marginTop: SPACING.xs },
  summarySub: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: SPACING.sm },
  sectionTitle: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  item: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemHead: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  itemName: { flex: 1, fontSize: FONTS.md, fontWeight: '700', color: COLORS.text },
  badge: { paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: RADIUS.round },
  badgeText: { fontSize: FONTS.xs, fontWeight: '700' },
  itemRemaining: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text, marginTop: SPACING.sm },
  itemSub: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: SPACING.sm },
});
