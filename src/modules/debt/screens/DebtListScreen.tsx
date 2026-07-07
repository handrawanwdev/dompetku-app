import React, { useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@realm/react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { COLORS, FONTS, SPACING, RADIUS } from '../../../theme';
import { Card, Text, EmptyState, AmountDisplay, ProgressBar } from '../../../components/common';
import { DebtModel } from '../../../models/DebtModel';
import { DebtPaymentModel } from '../../../models/DebtPaymentModel';
import { IncomeModel } from '../../../models/IncomeModel';
import { ExpenseModel } from '../../../models/ExpenseModel';
import { formatCurrency, formatCompact } from '../../../utils/currency';
import { startOfMonth } from '../../../utils/date';
import { getReminderStatus, getKewajibanBulanIni, type ReminderStatus } from '../../../utils/finance';
import { useSettingsStore } from '../../../store/settingsStore';

// ─── Navigation Types ─────────────────────────────────────────────────────────

export type DebtStackParamList = {
  DebtList: undefined;
  DebtForm: { id?: string };
  DebtDetail: { id: string };
};

type NavProp = NativeStackNavigationProp<DebtStackParamList>;

// ─── Debt Item ────────────────────────────────────────────────────────────────

interface DebtItemProps {
  item: DebtModel;
  reminder: ReminderStatus | null;
  onPress: () => void;
}

function DebtItem({ item, reminder, onPress }: DebtItemProps) {
  const remaining = item.monthlyInstallment * item.remainingMonth;
  const totalPaid = item.totalAmount - remaining;
  const progress = item.totalAmount > 0 ? Math.min((totalPaid / item.totalAmount) * 100, 100) : 0;
  const urgent = reminder?.urgent ?? false;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <View style={styles.itemHeaderLeft}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemLender}>{item.lender}</Text>
        </View>
        {reminder && (
          <View style={[styles.statusBadge, { backgroundColor: reminder.bg }]}>
            <Text style={[styles.statusText, { color: reminder.color }]} numberOfLines={1}>
              {reminder.tier === 'lunas' ? 'LUNAS' : reminder.tier.toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      <ProgressBar
        progress={progress}
        color={urgent ? COLORS.danger : COLORS.debt}
        height={6}
        style={styles.progressBar}
      />

      <View style={styles.itemFooter}>
        <View style={styles.itemStat}>
          <Text style={styles.itemStatLabel}>Cicilan/Bulan</Text>
          <Text style={styles.itemStatValue}>{formatCurrency(item.monthlyInstallment)}</Text>
        </View>
        <View style={styles.itemStat}>
          <Text style={styles.itemStatLabel}>Sisa Bulan</Text>
          <Text style={styles.itemStatValue}>{item.remainingMonth} bln</Text>
        </View>
        <View style={styles.itemStat}>
          <Text style={styles.itemStatLabel}>Tanggal Bayar</Text>
          <Text style={styles.itemStatValue}>Tgl {item.dueDate}</Text>
        </View>
        <View style={styles.itemStat}>
          <Text style={styles.itemStatLabel}>Sisa</Text>
          <AmountDisplay amount={remaining} size="sm" style={{ color: COLORS.debt }} />
        </View>
      </View>

      {item.extraPaid > 0 && (
        <Text style={styles.extraPaidText}>💰 {formatCurrency(item.extraPaid)} ekstra dibayar</Text>
      )}
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function DebtListScreen() {
  const navigation = useNavigation<NavProp>();
  const { settings } = useSettingsStore();
  const allDebts = useQuery(DebtModel).filtered('isActive == true').sorted('createdAt', true);
  const debtPayments = useQuery(DebtPaymentModel);
  const incomes = useQuery(IncomeModel);
  const expenses = useQuery(ExpenseModel);
  const monthStart = startOfMonth();

  const summary = useMemo(() => {
    let totalRemaining = 0;
    let totalMonthly = 0;
    for (const d of allDebts) {
      totalRemaining += d.monthlyInstallment * d.remainingMonth;
      totalMonthly += d.monthlyInstallment;
    }
    return { totalRemaining, totalMonthly, count: allDebts.length };
  }, [allDebts]);

  const debtInputs = useMemo(() => allDebts.map((d) => {
    const paidThisMonth = debtPayments
      .filtered('debtId == $0 AND date >= $1', d._id.toHexString(), monthStart)
      .length > 0;
    return {
      id: d._id.toHexString(),
      name: d.name,
      monthlyInstallment: d.monthlyInstallment,
      remainingMonth: d.remainingMonth,
      dueDate: d.dueDate,
      paidThisMonth,
    };
  }), [allDebts, debtPayments, monthStart]);

  const reminderMap = useMemo(() => {
    const map = new Map<string, ReminderStatus>();
    for (const input of debtInputs) {
      const status = getReminderStatus(input);
      if (status) map.set(input.id, status);
    }
    return map;
  }, [debtInputs]);

  const cashNow = useMemo(() => {
    const cashIncome = incomes.reduce((s, i) => s + i.allocationCash, 0);
    const cashExpense = expenses.filtered('source == "cash"').reduce((s, e) => s + e.amount, 0);
    return cashIncome - cashExpense;
  }, [incomes, expenses]);

  const kewajiban = useMemo(
    () => getKewajibanBulanIni(debtInputs, cashNow, settings.hariLibur ?? [0]),
    [debtInputs, cashNow, settings.hariLibur],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<DebtModel>) => (
      <DebtItem
        item={item}
        reminder={reminderMap.get(item._id.toHexString()) ?? null}
        onPress={() => navigation.navigate('DebtDetail', { id: item._id.toHexString() })}
      />
    ),
    [navigation, reminderMap],
  );

  const keyExtractor = useCallback((item: DebtModel) => item._id.toHexString(), []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.topbar} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Hutang</Text>
          <Text style={styles.headerSubtitle}>Kelola cicilan hutangmu</Text>
        </View>
      </View>

      {/* Body (light bg, no gaps exposing the dark root behind it) */}
      <View style={styles.body}>
      {/* Summary Card */}
      <View style={styles.summaryWrapper}>
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Hutang</Text>
              <AmountDisplay amount={summary.totalRemaining} size="sm" style={{ color: COLORS.debt }} />
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Cicilan/Bln</Text>
              <AmountDisplay amount={summary.totalMonthly} size="sm" style={{ color: COLORS.warning }} />
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Jumlah</Text>
              <Text style={styles.summaryCount}>{summary.count} hutang</Text>
            </View>
          </View>
        </Card>
      </View>

      {/* List */}
      <FlatList
        data={allDebts as unknown as DebtModel[]}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          summary.count > 0 ? (
            <Card style={styles.kewajibanCard}>
              <Text style={styles.kewajibanTitle}>🗓️ Kewajiban Pembayaran</Text>
              <View style={styles.kewajibanGrid}>
                <View style={[styles.kewajibanBox, { backgroundColor: '#fee2e2' }]}>
                  <Text style={[styles.kewajibanMonthLabel, { color: '#991b1b' }]} numberOfLines={1}>{kewajiban.bulanIniLabel}</Text>
                  <Text style={[styles.kewajibanAmount, { color: COLORS.warning }]}>{formatCompact(kewajiban.totalBulanIni)}</Text>
                  <Text style={[styles.kewajibanSub, { color: '#991b1b' }]}>Total cicilan</Text>
                  {kewajiban.totalBelumBayar > 0 && (
                    <View style={styles.kewajibanRow}>
                      <Text style={styles.kewajibanRowLabel}>⏳ Belum dibayar</Text>
                      <Text style={[styles.kewajibanRowValue, { color: COLORS.warning }]}>{formatCompact(kewajiban.totalBelumBayar)}</Text>
                    </View>
                  )}
                  {kewajiban.totalSudahBayar > 0 && (
                    <View style={styles.kewajibanRow}>
                      <Text style={styles.kewajibanRowLabel}>✅ Sudah dibayar</Text>
                      <Text style={[styles.kewajibanRowValue, { color: '#065f46' }]}>{formatCompact(kewajiban.totalSudahBayar)}</Text>
                    </View>
                  )}
                </View>
                <View style={[styles.kewajibanBox, { backgroundColor: '#fef3c7' }]}>
                  <Text style={[styles.kewajibanMonthLabel, { color: '#92400e' }]} numberOfLines={1}>{kewajiban.bulanDepanLabel}</Text>
                  <Text style={[styles.kewajibanAmount, { color: '#ef9f27' }]}>{formatCompact(kewajiban.totalBulanDepan)}</Text>
                  <Text style={[styles.kewajibanSub, { color: '#92400e' }]}>Estimasi cicilan</Text>
                </View>
              </View>
              <View style={styles.kewajibanInfoBox}>
                <Text style={styles.kewajibanInfoText}>
                  🗓️ Bulan ini: <Text style={styles.bold}>{kewajiban.workingDaysInMonth} hari kerja</Text>
                  {' · Libur: '}<Text style={styles.bold}>{kewajiban.hariLiburLabel}</Text>
                  {' · Sisa: '}<Text style={styles.bold}>{kewajiban.workingDaysRemaining} hari</Text>
                </Text>
              </View>
              <View style={styles.kewajibanTargetBox}>
                <Text style={styles.slabel}>🎯 Target Harian — Dibagi Rata Semua Hutang</Text>
                <View style={styles.kewajibanTargetGrid}>
                  <View style={styles.kewajibanTargetItem}>
                    <Text style={styles.kewajibanTargetLabel}>Target/hari kerja</Text>
                    <Text style={[styles.kewajibanTargetValue, { color: COLORS.savings }]}>{formatCompact(kewajiban.targetPerHariKerja)}</Text>
                  </View>
                  <View style={styles.kewajibanTargetItem}>
                    <Text style={styles.kewajibanTargetLabel}>Target/hari sisa</Text>
                    <Text style={[styles.kewajibanTargetValue, { color: COLORS.savings }]}>{formatCompact(kewajiban.targetPerHariSisa)}</Text>
                  </View>
                </View>
              </View>
            </Card>
          ) : null
        }
        ListEmptyComponent={
          <EmptyState
            emoji="🏦"
            title="Belum ada hutang"
            subtitle="Tap tombol + untuk mencatat hutang"
          />
        }
      />
      </View>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('DebtForm', {})}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.topbar,
  },
  body: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.topbar,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  headerTitle: {
    fontSize: FONTS.xl,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: FONTS.sm,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  summaryWrapper: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
  },
  summaryCard: {
    padding: SPACING.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.xs,
  },
  summaryCount: {
    fontSize: FONTS.sm,
    fontWeight: '700',
    color: COLORS.text,
  },
  summaryDivider: {
    width: 1,
    height: 36,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.sm,
  },
  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 100,
    flexGrow: 1,
  },
  itemContainer: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  itemHeaderLeft: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  itemName: {
    fontSize: FONTS.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  itemLender: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    maxWidth: 110,
  },
  statusText: {
    fontSize: FONTS.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  progressBar: {
    marginBottom: SPACING.md,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  extraPaidText: {
    fontSize: FONTS.xs,
    color: COLORS.savings,
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  itemStat: {
    alignItems: 'center',
    flex: 1,
  },
  itemStatLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  itemStatValue: {
    fontSize: FONTS.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.xxl,
    right: SPACING.xl,
    width: 56,
    height: 56,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.debt,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabIcon: {
    fontSize: 28,
    color: '#FFFFFF',
    lineHeight: 32,
    fontWeight: '400',
  },

  kewajibanCard: {
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  kewajibanTitle: {
    fontSize: FONTS.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  kewajibanGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  kewajibanBox: {
    flex: 1,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  kewajibanMonthLabel: {
    fontSize: FONTS.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  kewajibanAmount: {
    fontSize: FONTS.lg,
    fontWeight: '700',
  },
  kewajibanSub: {
    fontSize: FONTS.xs,
    marginTop: 1,
  },
  kewajibanRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  kewajibanRowLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
  },
  kewajibanRowValue: {
    fontSize: FONTS.sm,
    fontWeight: '700',
  },
  kewajibanInfoBox: {
    backgroundColor: '#eff6ff',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  kewajibanInfoText: {
    fontSize: FONTS.xs,
    color: COLORS.savings,
  },
  bold: {
    fontWeight: '700',
  },
  kewajibanTargetBox: {
    backgroundColor: COLORS.subtleBg,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  slabel: {
    fontSize: FONTS.xs,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
  },
  kewajibanTargetGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  kewajibanTargetItem: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  kewajibanTargetLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  kewajibanTargetValue: {
    fontSize: FONTS.lg,
    fontWeight: '700',
    marginTop: 2,
  },
});
