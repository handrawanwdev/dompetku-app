import React, { useMemo, useCallback } from 'react';
import {
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRealm, useQuery } from '@realm/react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import dayjs from 'dayjs';

import { COLORS, FONTS, SPACING, RADIUS } from '../../../theme';
import { Card, Text, Button, AmountDisplay, ProgressBar, EmptyState, BackButton } from '../../../components/common';
import { DebtModel } from '../../../models/DebtModel';
import { DebtPaymentModel } from '../../../models/DebtPaymentModel';
import { formatCurrency } from '../../../utils/currency';
import { formatDate, isOverdue } from '../../../utils/date';
import { buildDebtSchedule, DebtScheduleMonth, DebtScheduleStatus } from '../../../utils/finance';
import type { DebtStackParamList } from './DebtListScreen';

// ─── Types ────────────────────────────────────────────────────────────────────

type NavProp = NativeStackNavigationProp<DebtStackParamList, 'DebtDetail'>;
type RouteType = RouteProp<DebtStackParamList, 'DebtDetail'>;

// ─── Payment Item ─────────────────────────────────────────────────────────────

interface PaymentItemProps {
  item: DebtPaymentModel;
}

function PaymentItem({ item }: PaymentItemProps) {
  return (
    <View style={styles.paymentItem}>
      <View style={styles.paymentLeft}>
        <View style={styles.paymentIcon}>
          <Text style={styles.paymentIconText}>💳</Text>
        </View>
        <View>
          <Text style={styles.paymentDate}>{formatDate(item.date)}</Text>
          {item.note ? (
            <Text style={styles.paymentNote} numberOfLines={1}>
              {item.note}
            </Text>
          ) : null}
        </View>
      </View>
      <Text style={styles.paymentAmount}>- {formatCurrency(item.amount)}</Text>
    </View>
  );
}

// ─── Schedule Item ────────────────────────────────────────────────────────────

const SCHEDULE_STATUS_META: Record<DebtScheduleStatus, { label: (m: DebtScheduleMonth) => string; color: string; bg: string }> = {
  lunas: { label: () => '✅ Lunas', color: COLORS.success, bg: COLORS.success + '18' },
  telat: { label: (m) => `🔴 Telat ${m.daysLate} hari`, color: COLORS.danger, bg: COLORS.danger + '18' },
  'jatuh-tempo-hari-ini': { label: () => '🟠 Jatuh tempo hari ini', color: COLORS.warning, bg: COLORS.warning + '18' },
  'akan-datang': { label: () => '📅 Belum jatuh tempo', color: COLORS.textMuted, bg: COLORS.surface },
};

interface ScheduleItemProps {
  month: DebtScheduleMonth;
  onPress?: () => void;
}

function ScheduleItem({ month, onPress }: ScheduleItemProps) {
  const meta = SCHEDULE_STATUS_META[month.status];
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      style={[styles.scheduleItem, onPress && styles.scheduleItemPayable]}
      onPress={onPress}
      activeOpacity={onPress ? 0.75 : 1}
    >
      <View style={styles.scheduleLeft}>
        <Text style={styles.scheduleMonth}>{month.monthLabel}</Text>
        <Text style={styles.scheduleDate}>Jatuh tempo {formatDate(month.dueDateFull)}</Text>
      </View>
      <View style={styles.scheduleRight}>
        <Text style={styles.scheduleAmount}>{formatCurrency(month.amount)}</Text>
        <View style={[styles.scheduleBadge, { backgroundColor: meta.bg }]}>
          <Text style={[styles.scheduleBadgeText, { color: meta.color }]}>{meta.label(month)}</Text>
        </View>
      </View>
    </Wrapper>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function DebtDetailScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteType>();
  const { id } = route.params;

  const allDebts = useQuery(DebtModel);
  const debt = useMemo(
    () => allDebts.find((d) => d._id.toHexString() === id) ?? null,
    [allDebts, id],
  );

  const allPayments = useQuery(DebtPaymentModel);
  const payments = useMemo(() => {
    return allPayments.filtered('debtId == $0', id).sorted('date', true);
  }, [allPayments, id]);

  const totalPaidSoFar = useMemo(() => payments.reduce((s, p) => s + p.amount, 0), [payments]);

  const remaining = useMemo(() => {
    if (!debt) return 0;
    if (debt.debtType === 'cicilan') return debt.monthlyInstallment * debt.remainingMonth;
    if (debt.debtType === 'revolving') return debt.currentBalance;
    if (debt.debtType === 'tanpa_tenor' || debt.debtType === 'berjangka') {
      return Math.max(0, debt.totalAmount - totalPaidSoFar);
    }
    return 0; // tagihan_rutin — no fixed total
  }, [debt, totalPaidSoFar]);

  const progress = useMemo(() => {
    if (!debt || debt.totalAmount <= 0) return 0;
    if (debt.debtType === 'cicilan') {
      return Math.min(((debt.totalAmount - remaining) / debt.totalAmount) * 100, 100);
    }
    if (debt.debtType === 'revolving') {
      return Math.min((debt.currentBalance / debt.totalAmount) * 100, 100);
    }
    if (debt.debtType === 'tanpa_tenor' || debt.debtType === 'berjangka') {
      return Math.min((totalPaidSoFar / debt.totalAmount) * 100, 100);
    }
    return 0;
  }, [debt, remaining, totalPaidSoFar]);

  const overdue = useMemo(() => {
    if (!debt || !debt.isActive) return false;
    if (debt.debtType === 'tanpa_tenor') return false;
    if (debt.debtType === 'berjangka') {
      return debt.dueDateFull ? dayjs().isAfter(dayjs(debt.dueDateFull), 'day') : false;
    }
    return isOverdue(debt.dueDate);
  }, [debt]);

  const berjangkaMeta = useMemo(() => {
    if (!debt || debt.debtType !== 'berjangka' || !debt.dueDateFull) return null;
    if (remaining <= 0) return { label: '✅ Lunas', color: COLORS.success, bg: COLORS.success + '18' };
    if (overdue) {
      const daysLate = dayjs().startOf('day').diff(dayjs(debt.dueDateFull).startOf('day'), 'day');
      return { label: `🔴 Telat ${daysLate} hari`, color: COLORS.danger, bg: COLORS.danger + '18' };
    }
    return { label: '📅 Belum jatuh tempo', color: COLORS.textMuted, bg: COLORS.surface };
  }, [debt, remaining, overdue]);

  const schedule = useMemo(() => {
    if (!debt) return [];
    if (debt.debtType === 'tanpa_tenor' || debt.debtType === 'berjangka') return [];
    return buildDebtSchedule({
      startDate: debt.startDate,
      dueDate: debt.dueDate,
      monthlyInstallment: debt.monthlyInstallment,
      paymentsCount: payments.length,
      hasTenor: debt.debtType === 'cicilan',
      remainingMonth: debt.remainingMonth,
    });
  }, [debt, payments.length]);

  const renderPayment = useCallback(
    ({ item }: ListRenderItemInfo<DebtPaymentModel>) => <PaymentItem item={item} />,
    [],
  );

  const keyExtractor = useCallback((item: DebtPaymentModel) => item._id.toHexString(), []);

  if (!debt) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
        </View>
        <View style={styles.scroll}>
          <EmptyState emoji="🔍" title="Data tidak ditemukan" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <TouchableOpacity
          onPress={() => navigation.navigate('DebtForm', { id })}
          style={styles.editBtn}
        >
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Summary Card */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View>
              <Text style={styles.lenderLabel}>Kreditur</Text>
              <Text style={styles.lenderName}>{debt.lender}</Text>
            </View>
            <View style={[styles.statusBadge, overdue ? styles.statusOverdue : styles.statusLancar]}>
              <Text style={[styles.statusText, overdue ? styles.statusTextOverdue : styles.statusTextLancar]}>
                {overdue ? 'JATUH TEMPO' : 'LANCAR'}
              </Text>
            </View>
          </View>

          {debt.debtType === 'cicilan' && (
            <>
              <Text style={styles.remainingLabel}>Sisa Hutang</Text>
              <AmountDisplay amount={remaining} size="xl" style={{ color: COLORS.debt }} />
              <ProgressBar progress={progress} color={overdue ? COLORS.danger : COLORS.debt} height={8} style={styles.progressBar} />
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabelText}>Lunas {formatCurrency(debt.totalAmount - remaining)}</Text>
                <Text style={styles.progressLabelText}>{progress.toFixed(0)}%</Text>
                <Text style={styles.progressLabelText}>Total {formatCurrency(debt.totalAmount)}</Text>
              </View>
            </>
          )}

          {debt.debtType === 'revolving' && (
            <>
              <Text style={styles.remainingLabel}>Saldo Terpakai</Text>
              <AmountDisplay amount={debt.currentBalance} size="xl" style={{ color: COLORS.debt }} />
              <ProgressBar progress={progress} color={overdue ? COLORS.danger : COLORS.debt} height={8} style={styles.progressBar} />
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabelText}>Tersedia {formatCurrency(debt.totalAmount - debt.currentBalance)}</Text>
                <Text style={styles.progressLabelText}>{progress.toFixed(0)}%</Text>
                <Text style={styles.progressLabelText}>Limit {formatCurrency(debt.totalAmount)}</Text>
              </View>
            </>
          )}

          {(debt.debtType === 'tanpa_tenor' || debt.debtType === 'berjangka') && (
            <>
              <Text style={styles.remainingLabel}>Sisa Hutang</Text>
              <AmountDisplay amount={remaining} size="xl" style={{ color: COLORS.debt }} />
              <ProgressBar progress={progress} color={overdue ? COLORS.danger : COLORS.debt} height={8} style={styles.progressBar} />
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabelText}>Lunas {formatCurrency(totalPaidSoFar)}</Text>
                <Text style={styles.progressLabelText}>{progress.toFixed(0)}%</Text>
                <Text style={styles.progressLabelText}>Total {formatCurrency(debt.totalAmount)}</Text>
              </View>
            </>
          )}

          {debt.debtType === 'tagihan_rutin' && (
            <>
              <Text style={styles.remainingLabel}>🔁 Tagihan Rutin — nominal bisa beda tiap bulan</Text>
              <Text style={styles.noTenorPaidText}>
                Total sudah dibayar: <Text style={styles.bold}>{formatCurrency(totalPaidSoFar)}</Text>
              </Text>
            </>
          )}

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {debt.debtType === 'cicilan' && (
              <>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Cicilan/Bulan</Text>
                  <Text style={styles.statValue}>{formatCurrency(debt.monthlyInstallment)}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Sisa Bulan</Text>
                  <Text style={styles.statValue}>{debt.remainingMonth} bulan</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Jatuh Tempo</Text>
                  <Text style={[styles.statValue, overdue ? { color: COLORS.danger } : null]}>Tgl {debt.dueDate}</Text>
                </View>
              </>
            )}
            {(debt.debtType === 'revolving' || debt.debtType === 'tagihan_rutin') && (
              <>
                {debt.monthlyInstallment > 0 && (
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Estimasi/Bulan</Text>
                    <Text style={styles.statValue}>{formatCurrency(debt.monthlyInstallment)}</Text>
                  </View>
                )}
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Tgl Tagihan</Text>
                  <Text style={[styles.statValue, overdue ? { color: COLORS.danger } : null]}>Tgl {debt.dueDate}</Text>
                </View>
              </>
            )}
            {debt.debtType === 'berjangka' && (
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Jatuh Tempo</Text>
                <Text style={[styles.statValue, overdue ? { color: COLORS.danger } : null]}>{formatDate(debt.dueDateFull)}</Text>
              </View>
            )}
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Mulai</Text>
              <Text style={styles.statValue}>{formatDate(debt.startDate, 'MMM YYYY')}</Text>
            </View>
          </View>

          {debt.note ? (
            <View style={styles.noteContainer}>
              <Text style={styles.noteLabel}>Catatan</Text>
              <Text style={styles.noteText}>{debt.note}</Text>
            </View>
          ) : null}
        </Card>

        {/* Payment CTA */}
        {debt.isActive && debt.debtType === 'revolving' && (
          <View style={styles.ctaRow}>
            <Button
              title="💳 Bayar Tagihan"
              onPress={() => navigation.navigate('DebtPayment', { debtId: id, mode: 'payment' })}
              style={styles.ctaHalf}
            />
            <Button
              title="🛒 Catat Pemakaian"
              onPress={() => navigation.navigate('DebtPayment', { debtId: id, mode: 'usage' })}
              variant="secondary"
              style={styles.ctaHalf}
            />
          </View>
        )}
        {debt.isActive && debt.debtType !== 'revolving' && (
          <Button
            title={
              debt.debtType === 'cicilan'
                ? `💳  Bayar Cicilan  •  ${formatCurrency(debt.monthlyInstallment)}`
                : '💳  Bayar Hutang'
            }
            onPress={() => navigation.navigate('DebtPayment', { debtId: id, mode: 'payment' })}
            fullWidth
            style={styles.payBtn}
          />
        )}

        {/* Payment Schedule */}
        {schedule.length > 0 && (
          <>
            <View style={styles.historySection}>
              <Text style={styles.historyTitle}>Jadwal Cicilan</Text>
              <Text style={styles.historyCount}>{schedule.length} bulan</Text>
            </View>
            {schedule.map((month) => (
              <ScheduleItem
                key={month.index}
                month={month}
                onPress={month.status !== 'lunas' && month.index === payments.length ? () => navigation.navigate('DebtPayment', { debtId: id, mode: 'payment' }) : undefined}
              />
            ))}
          </>
        )}

        {/* Jatuh Tempo — berjangka only (single due date, no monthly schedule) */}
        {debt.debtType === 'berjangka' && berjangkaMeta && (
          <>
            <View style={styles.historySection}>
              <Text style={styles.historyTitle}>Jatuh Tempo</Text>
            </View>
            <View style={styles.scheduleItem}>
              <View style={styles.scheduleLeft}>
                <Text style={styles.scheduleMonth}>{formatDate(debt.dueDateFull, 'MMMM YYYY')}</Text>
                <Text style={styles.scheduleDate}>Jatuh tempo {formatDate(debt.dueDateFull)}</Text>
              </View>
              <View style={styles.scheduleRight}>
                <Text style={styles.scheduleAmount}>{formatCurrency(remaining)}</Text>
                <View style={[styles.scheduleBadge, { backgroundColor: berjangkaMeta.bg }]}>
                  <Text style={[styles.scheduleBadgeText, { color: berjangkaMeta.color }]}>{berjangkaMeta.label}</Text>
                </View>
              </View>
            </View>
          </>
        )}

        {/* Payment History */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Riwayat Pembayaran</Text>
          <Text style={styles.historyCount}>{payments.length} pembayaran</Text>
        </View>

        <FlatList
          data={payments as unknown as DebtPaymentModel[]}
          renderItem={renderPayment}
          keyExtractor={keyExtractor}
          scrollEnabled={false}
          ListEmptyComponent={
            <View style={styles.emptyPayments}>
              <Text style={styles.emptyPaymentsText}>Belum ada riwayat pembayaran</Text>
            </View>
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  editBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtnText: {
    fontSize: FONTS.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  scroll: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  summaryCard: {
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  lenderLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  lenderName: {
    fontSize: FONTS.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  statusLancar: {
    backgroundColor: COLORS.success + '22',
  },
  statusOverdue: {
    backgroundColor: COLORS.danger + '22',
  },
  statusText: {
    fontSize: FONTS.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusTextLancar: {
    color: COLORS.success,
  },
  statusTextOverdue: {
    color: COLORS.danger,
  },
  remainingLabel: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  noTenorPaidText: {
    fontSize: FONTS.md,
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  bold: {
    fontWeight: '700',
  },
  progressBar: {
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  progressLabelText: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
  },
  statItem: {
    width: '50%',
    paddingVertical: SPACING.sm,
    paddingRight: SPACING.sm,
  },
  statLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  statValue: {
    fontSize: FONTS.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  noteContainer: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  noteLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  noteText: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  payBtn: {
    marginBottom: SPACING.lg,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  ctaHalf: {
    flex: 1,
  },
  historySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  historyTitle: {
    fontSize: FONTS.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  historyCount: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scheduleItemPayable: {
    borderColor: COLORS.primary,
    borderWidth: 1.5,
  },
  scheduleLeft: { flex: 1 },
  scheduleMonth: {
    fontSize: FONTS.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  scheduleDate: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  scheduleRight: {
    alignItems: 'flex-end',
    marginLeft: SPACING.sm,
  },
  scheduleAmount: {
    fontSize: FONTS.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  scheduleBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  scheduleBadgeText: {
    fontSize: FONTS.xs,
    fontWeight: '600',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIcon: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  paymentIconText: {
    fontSize: 18,
  },
  paymentDate: {
    fontSize: FONTS.sm,
    fontWeight: '500',
    color: COLORS.text,
  },
  paymentNote: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  paymentAmount: {
    fontSize: FONTS.md,
    fontWeight: '700',
    color: COLORS.debt,
    marginLeft: SPACING.sm,
  },
  emptyPayments: {
    paddingVertical: SPACING.xxl,
    alignItems: 'center',
  },
  emptyPaymentsText: {
    fontSize: FONTS.sm,
    color: COLORS.textMuted,
  },
});
