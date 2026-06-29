import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@realm/react';
import dayjs from 'dayjs';

import { COLORS, FONTS, SPACING, RADIUS } from '../../theme';
import { Card } from '../../components/common/Card';
import { ProgressBar } from '../../components/common/ProgressBar';
import { AmountDisplay } from '../../components/common/AmountDisplay';
import { IncomeModel } from '../../models/IncomeModel';
import { ExpenseModel } from '../../models/ExpenseModel';
import { DebtModel } from '../../models/DebtModel';
import { SavingModel } from '../../models/SavingModel';
import { InvestmentModel } from '../../models/InvestmentModel';
import { PhysicalAssetModel } from '../../models/PhysicalAssetModel';
import { GoalModel } from '../../models/GoalModel';
import { formatCurrency, formatCompact } from '../../utils/currency';
import { formatDate, startOfMonth, endOfMonth, daysUntilDue } from '../../utils/date';
import { calcDepreciation, calcGoalProgress, generateFinancialSuggestion } from '../../utils/finance';
import { useSettingsStore } from '../../store/settingsStore';

export function DashboardScreen() {
  const { settings } = useSettingsStore();

  const incomes = useQuery(IncomeModel);
  const expenses = useQuery(ExpenseModel);
  const debts = useQuery(DebtModel).filtered('isActive == true');
  const savings = useQuery(SavingModel);
  const investments = useQuery(InvestmentModel);
  const physicalAssets = useQuery(PhysicalAssetModel);
  const goals = useQuery(GoalModel);

  const now = dayjs();
  const monthStart = startOfMonth();
  const monthEnd = endOfMonth();

  const summary = useMemo(() => {
    const monthlyIncome = incomes
      .filtered('date >= $0 AND date <= $1', monthStart, monthEnd)
      .reduce((s, i) => s + i.amount, 0);

    const monthlyExpense = expenses
      .filtered('date >= $0 AND date <= $1', monthStart, monthEnd)
      .reduce((s, e) => s + e.amount, 0);

    const totalCashIncome = incomes.reduce((s, i) => s + i.allocationCash, 0);
    const totalCashExpense = expenses
      .filtered('source == "cash"')
      .reduce((s, e) => s + e.amount, 0);
    const cash = totalCashIncome - totalCashExpense;

    const totalSavings = savings.reduce((s, sv) => s + sv.balance, 0);

    const totalInvestment = investments.reduce(
      (s, inv) => s + inv.currentPrice * inv.quantity,
      0
    );

    const totalAssets = physicalAssets.reduce(
      (s, a) => s + calcDepreciation(a.purchasePrice, a.residualValue, a.usefulLife, a.purchaseDate),
      0
    );

    const totalDebt = debts.reduce(
      (s, d) => s + d.monthlyInstallment * d.remainingMonth,
      0
    );

    const monthlyInstallment = debts.reduce((s, d) => s + d.monthlyInstallment, 0);
    const debtRatio = monthlyIncome > 0 ? (monthlyInstallment / monthlyIncome) * 100 : 0;
    const netWorth = cash + totalSavings + totalInvestment + totalAssets - totalDebt;

    return {
      cash,
      totalSavings,
      totalInvestment,
      totalAssets,
      totalDebt,
      netWorth,
      monthlyIncome,
      monthlyExpense,
      cashflow: monthlyIncome - monthlyExpense,
      debtRatio,
      monthlyInstallment,
    };
  }, [incomes, expenses, debts, savings, investments, physicalAssets, monthStart, monthEnd]);

  const suggestion = useMemo(() =>
    generateFinancialSuggestion({
      debtRatio: summary.debtRatio,
      debtRatioLimit: settings.debtRatioLimit,
      cashflow: summary.cashflow,
      netWorth: summary.netWorth,
      totalSavings: summary.totalSavings,
      monthlyIncome: summary.monthlyIncome,
    }), [summary, settings]);

  const upcomingDebts = useMemo(() =>
    debts.filter(d => daysUntilDue(d.dueDate) <= 7), [debts]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Halo, Selamat datang 👋</Text>
            <Text style={styles.date}>{formatDate(now.toDate(), 'dddd, DD MMMM YYYY')}</Text>
          </View>
        </View>

        {/* Net Worth Card */}
        <Card style={styles.netWorthCard} padding={SPACING.xl}>
          <Text style={styles.netWorthLabel}>Net Worth</Text>
          <Text style={[styles.netWorthAmount, { color: summary.netWorth >= 0 ? COLORS.income : COLORS.expense }]}>
            {formatCurrency(summary.netWorth)}
          </Text>
          <View style={styles.cashflowRow}>
            <View style={styles.cashflowItem}>
              <Text style={styles.cashflowLabel}>▲ Pemasukan</Text>
              <Text style={[styles.cashflowValue, { color: COLORS.income }]}>
                {formatCompact(summary.monthlyIncome)}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.cashflowItem}>
              <Text style={styles.cashflowLabel}>▼ Pengeluaran</Text>
              <Text style={[styles.cashflowValue, { color: COLORS.expense }]}>
                {formatCompact(summary.monthlyExpense)}
              </Text>
            </View>
          </View>
        </Card>

        {/* Financial Summary Grid */}
        <Text style={styles.sectionTitle}>Ringkasan Keuangan</Text>
        <View style={styles.grid}>
          <SummaryItem label="Kas" value={summary.cash} color={COLORS.income} emoji="💵" />
          <SummaryItem label="Tabungan" value={summary.totalSavings} color={COLORS.savings} emoji="🏦" />
          <SummaryItem label="Investasi" value={summary.totalInvestment} color={COLORS.investment} emoji="📈" />
          <SummaryItem label="Aset Fisik" value={summary.totalAssets} color={COLORS.asset} emoji="🏠" />
          <SummaryItem label="Total Hutang" value={-summary.totalDebt} color={COLORS.debt} emoji="📋" negative />
          <SummaryItem label="Cicilan/Bln" value={-summary.monthlyInstallment} color={COLORS.debt} emoji="📅" negative />
        </View>

        {/* Debt Ratio */}
        {summary.totalDebt > 0 && (
          <>
            <Text style={styles.sectionTitle}>Rasio Hutang</Text>
            <Card padding={SPACING.lg}>
              <View style={styles.debtRatioRow}>
                <Text style={styles.debtRatioValue}>
                  {summary.debtRatio.toFixed(1)}%
                </Text>
                <Text style={[
                  styles.debtRatioStatus,
                  { color: summary.debtRatio > settings.debtRatioLimit ? COLORS.danger : COLORS.success }
                ]}>
                  {summary.debtRatio > settings.debtRatioLimit ? '⚠️ Melebihi batas' : '✅ Aman'}
                </Text>
              </View>
              <ProgressBar
                progress={Math.min(summary.debtRatio, 100)}
                color={summary.debtRatio > settings.debtRatioLimit ? COLORS.danger : COLORS.success}
                style={{ marginTop: SPACING.sm }}
              />
              <Text style={styles.debtRatioHint}>Batas: {settings.debtRatioLimit}%</Text>
            </Card>
          </>
        )}

        {/* Goals */}
        {goals.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Financial Goals</Text>
            {goals.slice(0, 3).map(goal => {
              const linked = savings.find(s => s._id.toHexString() === goal.savingId);
              const balance = linked?.balance ?? 0;
              const progress = calcGoalProgress(balance, goal.target);
              return (
                <Card key={goal._id.toHexString()} style={{ marginBottom: SPACING.sm }} padding={SPACING.lg}>
                  <View style={styles.goalHeader}>
                    <Text style={styles.goalEmoji}>{goal.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.goalName}>{goal.name}</Text>
                      <Text style={styles.goalDate}>Target: {formatDate(goal.deadline)}</Text>
                    </View>
                    <Text style={styles.goalPercent}>{progress.toFixed(0)}%</Text>
                  </View>
                  <ProgressBar progress={progress} color={COLORS.primary} style={{ marginTop: SPACING.sm }} />
                  <View style={styles.goalAmounts}>
                    <Text style={styles.goalBalance}>{formatCompact(balance)}</Text>
                    <Text style={styles.goalTarget}>/ {formatCompact(goal.target)}</Text>
                  </View>
                </Card>
              );
            })}
          </>
        )}

        {/* Upcoming Debt */}
        {upcomingDebts.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>⏰ Jatuh Tempo Segera</Text>
            {upcomingDebts.map(d => (
              <Card key={d._id.toHexString()} style={styles.reminderCard} padding={SPACING.md}>
                <View style={styles.reminderRow}>
                  <Text style={styles.reminderEmoji}>📋</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reminderName}>{d.name}</Text>
                    <Text style={styles.reminderSub}>Tanggal {d.dueDate} • {daysUntilDue(d.dueDate)} hari lagi</Text>
                  </View>
                  <Text style={[styles.reminderAmount, { color: COLORS.debt }]}>
                    {formatCompact(d.monthlyInstallment)}
                  </Text>
                </View>
              </Card>
            ))}
          </>
        )}

        {/* Suggestion */}
        <Card style={styles.suggestionCard} padding={SPACING.lg}>
          <Text style={styles.suggestionTitle}>💡 Rekomendasi</Text>
          <Text style={styles.suggestionText}>{suggestion}</Text>
        </Card>

      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryItem({ label, value, color, emoji, negative }: {
  label: string;
  value: number;
  color: string;
  emoji: string;
  negative?: boolean;
}) {
  const displayValue = negative ? Math.abs(value) : value;
  return (
    <Card style={styles.summaryItem} padding={SPACING.md}>
      <Text style={styles.summaryEmoji}>{emoji}</Text>
      <Text style={[styles.summaryValue, { color }]}>{formatCompact(displayValue)}</Text>
      <Text style={styles.summaryLabel} numberOfLines={1}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  header: { marginBottom: SPACING.lg },
  greeting: { fontSize: FONTS.xl, fontWeight: '700', color: COLORS.text },
  date: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: 2 },
  netWorthCard: {
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.primary + '22',
    borderColor: COLORS.primary + '44',
  },
  netWorthLabel: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  netWorthAmount: { fontSize: FONTS.xxxl, fontWeight: '800', marginBottom: SPACING.md },
  cashflowRow: { flexDirection: 'row', alignItems: 'center' },
  cashflowItem: { flex: 1, alignItems: 'center' },
  cashflowLabel: { fontSize: FONTS.xs, color: COLORS.textMuted },
  cashflowValue: { fontSize: FONTS.lg, fontWeight: '700', marginTop: 2 },
  divider: { width: 1, height: 32, backgroundColor: COLORS.border },
  sectionTitle: {
    fontSize: FONTS.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.lg,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  summaryItem: { width: '31%', alignItems: 'center' },
  summaryEmoji: { fontSize: 22, marginBottom: SPACING.xs },
  summaryValue: { fontSize: FONTS.md, fontWeight: '700' },
  summaryLabel: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 2, textAlign: 'center' },
  debtRatioRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  debtRatioValue: { fontSize: FONTS.xxl, fontWeight: '800', color: COLORS.text },
  debtRatioStatus: { fontSize: FONTS.sm, fontWeight: '600' },
  debtRatioHint: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: SPACING.xs },
  goalHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  goalEmoji: { fontSize: 24 },
  goalName: { fontSize: FONTS.md, fontWeight: '600', color: COLORS.text },
  goalDate: { fontSize: FONTS.xs, color: COLORS.textSecondary },
  goalPercent: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.primary },
  goalAmounts: { flexDirection: 'row', marginTop: SPACING.xs },
  goalBalance: { fontSize: FONTS.sm, fontWeight: '600', color: COLORS.primary },
  goalTarget: { fontSize: FONTS.sm, color: COLORS.textMuted },
  reminderCard: { marginBottom: SPACING.sm, borderColor: COLORS.warning + '44' },
  reminderRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  reminderEmoji: { fontSize: 20 },
  reminderName: { fontSize: FONTS.md, fontWeight: '600', color: COLORS.text },
  reminderSub: { fontSize: FONTS.xs, color: COLORS.textSecondary },
  reminderAmount: { fontSize: FONTS.md, fontWeight: '700' },
  suggestionCard: {
    marginTop: SPACING.lg,
    borderColor: COLORS.primary + '33',
    backgroundColor: COLORS.primary + '11',
  },
  suggestionTitle: { fontSize: FONTS.md, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.sm },
  suggestionText: { fontSize: FONTS.sm, color: COLORS.textSecondary, lineHeight: 20 },
});
