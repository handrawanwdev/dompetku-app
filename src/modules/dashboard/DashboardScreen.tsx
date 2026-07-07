import React, { useEffect, useMemo } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';

import { COLORS, FONTS, SPACING, RADIUS } from '../../theme';
import { Card } from '../../components/common/Card';
import { ProgressBar } from '../../components/common/ProgressBar';
import { AmountDisplay } from '../../components/common/AmountDisplay';
import { IncomeModel } from '../../models/IncomeModel';
import { ExpenseModel } from '../../models/ExpenseModel';
import { DebtModel } from '../../models/DebtModel';
import { DebtPaymentModel } from '../../models/DebtPaymentModel';
import { SavingModel } from '../../models/SavingModel';
import { InvestmentModel } from '../../models/InvestmentModel';
import { PhysicalAssetModel } from '../../models/PhysicalAssetModel';
import { GoalModel } from '../../models/GoalModel';
import { formatCurrency, formatCompact } from '../../utils/currency';
import { formatDate, startOfMonth, endOfMonth } from '../../utils/date';
import {
  calcDepreciation,
  calcGoalProgress,
  getReminderStatus,
  getDebtRoadmap,
  getTrailing30d,
  getFinancialProjection,
  generateFinancialSuggestions,
} from '../../utils/finance';
import { useSettingsStore } from '../../store/settingsStore';
import { useCashflowChart } from '../../hooks/useCashflowChart';
import { GroupedBarChart } from '../../components/charts/GroupedBarChart';
import { refreshDebtReminders, refreshDailyReminders } from '../../services/NotificationService';

export function DashboardScreen() {
  const { settings } = useSettingsStore();
  const navigation = useNavigation();

  const incomes = useQuery(IncomeModel);
  const expenses = useQuery(ExpenseModel);
  const debts = useQuery(DebtModel).filtered('isActive == true');
  const debtPayments = useQuery(DebtPaymentModel);
  const savings = useQuery(SavingModel);
  const investments = useQuery(InvestmentModel).filtered('sold == false');
  const physicalAssets = useQuery(PhysicalAssetModel).filtered('sold == false');
  const goals = useQuery(GoalModel);

  useEffect(() => {
    refreshDebtReminders(debts.map((d) => ({
      id: d._id.toHexString(),
      name: d.name,
      monthlyInstallment: d.monthlyInstallment,
      remainingMonth: d.remainingMonth,
      dueDate: d.dueDate,
    })));
  }, [debts]);

  useEffect(() => {
    const today = dayjs().format('YYYY-MM-DD');
    const recordedToday = incomes.filtered('date == $0', today).length > 0
      || expenses.filtered('date == $0', today).length > 0;
    refreshDailyReminders(recordedToday);
  }, [incomes, expenses]);

  const cashflow7d = useCashflowChart('7d');
  const cashflow12m = useCashflowChart('12m');

  const now = dayjs();
  const monthStart = startOfMonth();
  const monthEnd = endOfMonth();

  const prevMonthStart = useMemo(() => {
    return dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
  }, []);
  const prevMonthEnd = useMemo(() => {
    return dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');
  }, []);

  const summary = useMemo(() => {
    const monthlyIncome = incomes
      .filtered('date >= $0 AND date <= $1', monthStart, monthEnd)
      .reduce((s, i) => s + i.amount, 0);

    const monthlyExpense = expenses
      .filtered('date >= $0 AND date <= $1', monthStart, monthEnd)
      .reduce((s, e) => s + e.amount, 0);

    const prevIncome = incomes
      .filtered('date >= $0 AND date <= $1', prevMonthStart, prevMonthEnd)
      .reduce((s, i) => s + i.amount, 0);

    const prevExpense = expenses
      .filtered('date >= $0 AND date <= $1', prevMonthStart, prevMonthEnd)
      .reduce((s, e) => s + e.amount, 0);

    const totalCashIncome = incomes.reduce((s, i) => s + i.allocationCash, 0);
    const totalCashExpense = expenses
      .filtered('source == "cash"')
      .reduce((s, e) => s + e.amount, 0);
    const cash = totalCashIncome - totalCashExpense;

    const totalSavings = savings.reduce((s, sv) => s + sv.balance, 0);

    const totalInvestment = investments.reduce(
      (s, inv) => s + inv.currentPrice * inv.quantity,
      0,
    );

    const totalAssets = physicalAssets.reduce(
      (s, a) => s + calcDepreciation(a.purchasePrice, a.residualValue, a.usefulLife, a.purchaseDate),
      0,
    );

    const totalDebt = debts.reduce(
      (s, d) => s + d.monthlyInstallment * d.remainingMonth,
      0,
    );

    const monthlyInstallment = debts.reduce((s, d) => s + d.monthlyInstallment, 0);
    const debtRatio = monthlyIncome > 0 ? (monthlyInstallment / monthlyIncome) * 100 : 0;
    const netWorth = cash + totalSavings + totalInvestment + totalAssets - totalDebt;

    const savingsRate = monthlyIncome > 0
      ? Math.max(0, ((monthlyIncome - monthlyExpense) / monthlyIncome) * 100)
      : 0;

    const expenseRatio = monthlyIncome > 0
      ? Math.min(100, (monthlyExpense / monthlyIncome) * 100)
      : 0;

    const incomeTrend = prevIncome > 0
      ? ((monthlyIncome - prevIncome) / prevIncome) * 100
      : 0;

    const expenseTrend = prevExpense > 0
      ? ((monthlyExpense - prevExpense) / prevExpense) * 100
      : 0;

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
      savingsRate,
      expenseRatio,
      incomeTrend,
      expenseTrend,
    };
  }, [incomes, expenses, debts, savings, investments, physicalAssets, monthStart, monthEnd, prevMonthStart, prevMonthEnd]);

  const topExpenseCategories = useMemo(() => {
    const monthExpenses = expenses.filtered('date >= $0 AND date <= $1', monthStart, monthEnd);
    const catMap: Record<string, number> = {};
    for (const e of monthExpenses) {
      catMap[e.category] = (catMap[e.category] ?? 0) + e.amount;
    }
    return Object.entries(catMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [expenses, monthStart, monthEnd]);

  // Neraca (itemized balance sheet)
  const neraca = useMemo(() => {
    const totalIncomeAllTime = incomes.reduce((s, i) => s + i.amount, 0);
    const investmentCost = investments.reduce((s, inv) => s + inv.buyPrice * inv.quantity, 0);
    const totalAset = Math.max(0, summary.cash) + summary.totalSavings + investmentCost + summary.totalAssets;
    const kekayaanBersih = totalAset - summary.totalDebt;
    return { totalIncomeAllTime, investmentCost, totalAset, kekayaanBersih };
  }, [incomes, investments, summary]);

  // Debt reminder tiers (lunas / hari-ini / mendesak / segera / aman)
  const debtReminders = useMemo(() => {
    return debts.map((d) => {
      const paidThisMonth = debtPayments
        .filtered('debtId == $0 AND date >= $1', d._id.toHexString(), monthStart)
        .length > 0;
      const status = getReminderStatus(
        { id: d._id.toHexString(), name: d.name, monthlyInstallment: d.monthlyInstallment, remainingMonth: d.remainingMonth, dueDate: d.dueDate, paidThisMonth },
      );
      return { debt: d, status };
    }).filter((x) => x.status !== null) as Array<{ debt: DebtModel; status: NonNullable<ReturnType<typeof getReminderStatus>> }>;
  }, [debts, debtPayments, monthStart]);

  const urgentReminders = useMemo(() => debtReminders.filter((r) => r.status.urgent), [debtReminders]);
  const normalReminders = useMemo(() => debtReminders.filter((r) => !r.status.urgent && r.status.tier !== 'lunas'), [debtReminders]);
  const paidReminders = useMemo(() => debtReminders.filter((r) => r.status.tier === 'lunas'), [debtReminders]);

  // Roadmap bebas hutang (snowball order)
  const roadmap = useMemo(() =>
    getDebtRoadmap(debts.map((d) => ({
      id: d._id.toHexString(), name: d.name, remainingMonth: d.remainingMonth, monthlyInstallment: d.monthlyInstallment,
    }))), [debts]);

  // Proyeksi finansial
  const trailing30d = useMemo(() => getTrailing30d(incomes as unknown as { date: string; amount: number }[], expenses as unknown as { date: string; amount: number }[]), [incomes, expenses]);
  const maxRemainingMonth = useMemo(() => (debts.length ? Math.max(...debts.map((d) => d.remainingMonth)) : 0), [debts]);
  const projection = useMemo(() => getFinancialProjection({
    cashNow: summary.cash,
    totalSavings: summary.totalSavings,
    maxRemainingMonth,
    monthlyInstallmentTotal: summary.monthlyInstallment,
    trailingExpense30d: trailing30d.expense,
  }), [summary, maxRemainingMonth, trailing30d]);

  // Rekomendasi (multi-card)
  const suggestions = useMemo(() => generateFinancialSuggestions({
    cashNow: summary.cash,
    debtRatioPct: summary.debtRatio,
    debtRatioLimit: settings.debtRatioLimit,
    urgentDebtNames: urgentReminders.map((r) => r.debt.name),
    almostPaidOffDebts: debts.filter((d) => d.remainingMonth > 0 && d.remainingMonth <= 2).map((d) => ({ name: d.name, remainingMonth: d.remainingMonth })),
  }), [summary, settings, urgentReminders, debts]);

  const monthLabel = now.format('MMMM YYYY');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.topbar} />

      {/* Topbar */}
      <View style={styles.topbar}>
        <View>
          <Text style={styles.topbarTitle}>💰 Dompetku</Text>
          <Text style={styles.topbarSub}>{monthLabel}</Text>
        </View>
        <Text style={styles.topbarDate}>{formatDate(now.toDate(), 'DD MMM YYYY')}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Net Worth + Cashflow Card */}
        <Card style={styles.netWorthCard} padding={SPACING.xl}>
          <Text style={styles.netWorthLabel}>NET WORTH</Text>
          <Text style={[styles.netWorthAmount, { color: summary.netWorth >= 0 ? COLORS.income : COLORS.expense }]}>
            {formatCurrency(summary.netWorth)}
          </Text>

          {/* Income vs Expense row with trend */}
          <View style={styles.cashflowRow}>
            <View style={styles.cashflowItem}>
              <Text style={styles.cashflowLabel}>▲ Pemasukan</Text>
              <Text style={[styles.cashflowValue, { color: COLORS.income }]}>
                {formatCompact(summary.monthlyIncome)}
              </Text>
              {summary.incomeTrend !== 0 && (
                <Text style={[styles.trendText, { color: summary.incomeTrend >= 0 ? COLORS.income : COLORS.expense }]}>
                  {summary.incomeTrend >= 0 ? '▲' : '▼'} {Math.abs(summary.incomeTrend).toFixed(0)}% vs bln lalu
                </Text>
              )}
            </View>
            <View style={styles.divider} />
            <View style={styles.cashflowItem}>
              <Text style={styles.cashflowLabel}>▼ Pengeluaran</Text>
              <Text style={[styles.cashflowValue, { color: COLORS.expense }]}>
                {formatCompact(summary.monthlyExpense)}
              </Text>
              {summary.expenseTrend !== 0 && (
                <Text style={[styles.trendText, { color: summary.expenseTrend <= 0 ? COLORS.income : COLORS.expense }]}>
                  {summary.expenseTrend >= 0 ? '▲' : '▼'} {Math.abs(summary.expenseTrend).toFixed(0)}% vs bln lalu
                </Text>
              )}
            </View>
          </View>

          {/* Cashflow progress bar */}
          {summary.monthlyIncome > 0 && (
            <View style={styles.cashflowBarWrap}>
              <View style={styles.cashflowBarTrack}>
                <View
                  style={[
                    styles.cashflowBarFill,
                    {
                      width: `${summary.expenseRatio}%` as any,
                      backgroundColor: summary.expenseRatio > 80 ? COLORS.expense : COLORS.income,
                    },
                  ]}
                />
              </View>
              <Text style={styles.cashflowBarLabel}>
                {summary.expenseRatio.toFixed(0)}% income terpakai
              </Text>
            </View>
          )}
        </Card>

        {/* Savings Rate + Cashflow Badges */}
        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: COLORS.income + '18', borderColor: COLORS.income + '40' }]}>
            <Text style={styles.badgeEmoji}>💰</Text>
            <Text style={[styles.badgeValue, { color: COLORS.income }]}>
              {summary.savingsRate.toFixed(0)}%
            </Text>
            <Text style={styles.badgeLabel}>Tingkat Nabung</Text>
          </View>
          <View style={[
            styles.badge,
            {
              backgroundColor: (summary.cashflow >= 0 ? COLORS.income : COLORS.expense) + '18',
              borderColor: (summary.cashflow >= 0 ? COLORS.income : COLORS.expense) + '40',
            },
          ]}>
            <Text style={styles.badgeEmoji}>{summary.cashflow >= 0 ? '✅' : '⚠️'}</Text>
            <Text style={[styles.badgeValue, { color: summary.cashflow >= 0 ? COLORS.income : COLORS.expense }]}>
              {summary.cashflow >= 0 ? '+' : ''}{formatCompact(summary.cashflow)}
            </Text>
            <Text style={styles.badgeLabel}>Cashflow Bln Ini</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: COLORS.savings + '18', borderColor: COLORS.savings + '40' }]}>
            <Text style={styles.badgeEmoji}>🏦</Text>
            <Text style={[styles.badgeValue, { color: COLORS.savings }]}>
              {formatCompact(summary.totalSavings)}
            </Text>
            <Text style={styles.badgeLabel}>Total Tabungan</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Aksi Cepat</Text>
        <View style={styles.quickRow}>
          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: COLORS.income }]}
            onPress={() => navigation.navigate('Transaction' as never, { screen: 'IncomeForm', params: {} } as never)}
            activeOpacity={0.8}
          >
            <Text style={styles.quickBtnIcon}>💵</Text>
            <Text style={styles.quickBtnText}>+ Pemasukan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: COLORS.expense }]}
            onPress={() => navigation.navigate('Transaction' as never, { screen: 'ExpenseForm', params: {} } as never)}
            activeOpacity={0.8}
          >
            <Text style={styles.quickBtnIcon}>🛒</Text>
            <Text style={styles.quickBtnText}>+ Pengeluaran</Text>
          </TouchableOpacity>
        </View>

        {/* Financial Summary Grid */}
        <Text style={styles.sectionTitle}>Ringkasan Keuangan</Text>
        <View style={styles.grid}>
          <SummaryItem label="Kas" value={summary.cash} color={COLORS.income} emoji="💵" />
          <SummaryItem label="Tabungan" value={summary.totalSavings} color={COLORS.savings} emoji="🏦" />
          <SummaryItem label="Investasi" value={summary.totalInvestment} color={COLORS.investment} emoji="📈" />
          <SummaryItem label="Aset Fisik" value={summary.totalAssets} color={COLORS.asset} emoji="🏠" />
          <SummaryItem label="Total Hutang" value={summary.totalDebt} color={COLORS.debt} emoji="📋" negative />
          <SummaryItem label="Cicilan/Bln" value={summary.monthlyInstallment} color={COLORS.debt} emoji="📅" negative />
        </View>

        {/* Top Expense Categories */}
        {topExpenseCategories.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Pengeluaran Terbesar Bulan Ini</Text>
            <Card padding={SPACING.md}>
              {topExpenseCategories.map(([cat, amount], idx) => {
                const pct = summary.monthlyExpense > 0 ? (amount / summary.monthlyExpense) * 100 : 0;
                return (
                  <View key={cat} style={[styles.catRow, idx > 0 && { marginTop: SPACING.sm }]}>
                    <View style={styles.catInfo}>
                      <Text style={styles.catRank}>#{idx + 1}</Text>
                      <Text style={styles.catName}>{cat}</Text>
                    </View>
                    <View style={styles.catBarWrap}>
                      <View style={styles.catBarTrack}>
                        <View style={[styles.catBarFill, { width: `${pct}%` as any }]} />
                      </View>
                    </View>
                    <View style={styles.catAmountWrap}>
                      <Text style={styles.catAmount}>{formatCompact(amount)}</Text>
                      <Text style={styles.catPct}>{pct.toFixed(0)}%</Text>
                    </View>
                  </View>
                );
              })}
            </Card>
          </>
        )}

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
                  { color: summary.debtRatio > settings.debtRatioLimit ? COLORS.danger : COLORS.success },
                ]}>
                  {summary.debtRatio > settings.debtRatioLimit ? '⚠️ Melebihi batas' : '✅ Aman'}
                </Text>
              </View>
              <ProgressBar
                progress={Math.min(summary.debtRatio, 100)}
                color={summary.debtRatio > settings.debtRatioLimit ? COLORS.danger : COLORS.success}
                style={{ marginTop: SPACING.sm }}
              />
              <Text style={styles.debtRatioHint}>Batas: {settings.debtRatioLimit}% • Cicilan: {formatCompact(summary.monthlyInstallment)}/bln</Text>
            </Card>
          </>
        )}

        {/* Goals */}
        {goals.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Financial Goals</Text>
            {goals.slice(0, 3).map(goal => {
              const linked = savings.find(s => s._id.toHexString() === goal.savingId);
              const balance = goal.savingId ? (linked?.balance ?? 0) : goal.manualAmount;
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

        {/* Pengingat Pembayaran (urgency tiers) */}
        {(urgentReminders.length > 0 || normalReminders.length > 0 || paidReminders.length > 0) && (
          <>
            <Text style={styles.sectionTitle}>🔔 Pengingat Pembayaran</Text>
            {urgentReminders.map(({ debt: d, status }) => (
              <View key={d._id.toHexString()} style={[styles.reminderTierRow, { backgroundColor: status.bg }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.reminderTierLabel, { color: status.color }]}>{status.label}</Text>
                  <Text style={styles.reminderTierSub}>{d.name} — {formatCompact(d.monthlyInstallment)}</Text>
                </View>
              </View>
            ))}
            {normalReminders.map(({ debt: d, status }) => (
              <View key={d._id.toHexString()} style={styles.reminderPlainRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.reminderPlainName}>{d.name}</Text>
                  <Text style={styles.reminderPlainSub}>{status.label} · {formatCompact(d.monthlyInstallment)}</Text>
                </View>
                <View style={styles.tagBlue}>
                  <Text style={styles.tagBlueText}>Belum bayar</Text>
                </View>
              </View>
            ))}
            {paidReminders.length > 0 && (
              <View style={{ marginTop: SPACING.sm }}>
                <Text style={styles.paidLabel}>Sudah Dibayar Bulan Ini</Text>
                {paidReminders.map(({ debt: d }) => (
                  <View key={d._id.toHexString()} style={styles.paidRow}>
                    <Text style={styles.paidName}>{d.name}</Text>
                    <Text style={styles.paidCheck}>✅ Lunas</Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}

        {/* Neraca Keuangan */}
        <Text style={styles.sectionTitle}>⚖️ Neraca Keuangan</Text>
        <Card padding={SPACING.lg}>
          <NeracaRow label="💰 Total Pendapatan" value={neraca.totalIncomeAllTime} color={COLORS.income} />
          <NeracaRow label="💵 Kas Bersih" value={summary.cash} color={COLORS.savings} />
          <NeracaRow label="🏦 Total Tabungan" value={summary.totalSavings} color={COLORS.investment} />
          <NeracaRow label="📈 Total Investasi (harga beli)" value={neraca.investmentCost} color={COLORS.asset} />
          <NeracaRow label="🖥️ Aset Fisik (nilai skrg)" value={summary.totalAssets} color={COLORS.debt} />
          <View style={styles.neracaDivider} />
          <NeracaRow label="✅ Total Aset" value={neraca.totalAset} color={COLORS.income} bold />
          <NeracaRow label="💳 Total Sisa Hutang" value={-summary.totalDebt} color={COLORS.expense} />
          <View style={[styles.kekayaanBox, { marginTop: SPACING.sm }]}>
            <Text style={styles.kekayaanLabel}>⚖️ Kekayaan Bersih</Text>
            <Text style={[styles.kekayaanValue, { color: neraca.kekayaanBersih >= 0 ? COLORS.income : COLORS.expense }]}>
              {formatCurrency(neraca.kekayaanBersih)}
            </Text>
          </View>
        </Card>

        {/* Cashflow 7 Hari */}
        <Text style={styles.sectionTitle}>💹 Cashflow 7 Hari</Text>
        <Card padding={SPACING.lg}>
          <View style={styles.cfSummaryRow}>
            <Text style={[styles.cfSummaryText, { color: COLORS.income }]}>
              ⬆ Masuk: {formatCompact(cashflow7d.reduce((s, d) => s + d.income, 0))}
            </Text>
            <Text style={[styles.cfSummaryText, { color: COLORS.expense }]}>
              ⬇ Keluar: {formatCompact(cashflow7d.reduce((s, d) => s + d.expense, 0))}
            </Text>
          </View>
          <GroupedBarChart data={cashflow7d} height={140} />
        </Card>

        {/* Cashflow 1 Tahun */}
        <Text style={styles.sectionTitle}>📊 Cashflow 1 Tahun</Text>
        <Card padding={SPACING.lg}>
          {(() => {
            const totalInc12 = cashflow12m.reduce((s, d) => s + d.income, 0);
            const totalExp12 = cashflow12m.reduce((s, d) => s + d.expense, 0);
            const net12 = totalInc12 - totalExp12;
            return (
              <View style={styles.cf12Grid}>
                <View style={[styles.cf12Box, { backgroundColor: '#d1fae5' }]}>
                  <Text style={[styles.cf12Label, { color: '#065f46' }]}>Total Masuk</Text>
                  <Text style={[styles.cf12Value, { color: '#065f46' }]}>{formatCompact(totalInc12)}</Text>
                  <Text style={[styles.cf12Sub, { color: '#065f46' }]}>avg {formatCompact(totalInc12 / 12)}/bln</Text>
                </View>
                <View style={[styles.cf12Box, { backgroundColor: '#fee2e2' }]}>
                  <Text style={[styles.cf12Label, { color: '#991b1b' }]}>Total Keluar</Text>
                  <Text style={[styles.cf12Value, { color: '#991b1b' }]}>{formatCompact(totalExp12)}</Text>
                  <Text style={[styles.cf12Sub, { color: '#991b1b' }]}>avg {formatCompact(totalExp12 / 12)}/bln</Text>
                </View>
                <View style={[styles.cf12Box, { backgroundColor: net12 >= 0 ? '#dbeafe' : '#fee2e2' }]}>
                  <Text style={[styles.cf12Label, { color: net12 >= 0 ? '#1e40af' : '#991b1b' }]}>Net Cashflow</Text>
                  <Text style={[styles.cf12Value, { color: net12 >= 0 ? '#1e40af' : '#991b1b' }]}>
                    {net12 >= 0 ? '+' : ''}{formatCompact(net12)}
                  </Text>
                </View>
              </View>
            );
          })()}
          <GroupedBarChart data={cashflow12m} height={170} />
        </Card>

        {/* Roadmap Bebas Hutang */}
        <Text style={styles.sectionTitle}>🗺️ Roadmap Bebas Hutang</Text>
        <Card padding={SPACING.lg}>
          {roadmap.length === 0 ? (
            <Text style={styles.roadmapDoneText}>🎉 Semua hutang lunas!</Text>
          ) : (
            roadmap.map((item) => (
              <View key={item.id} style={styles.roadmapRow}>
                <View style={[styles.roadmapStep, { borderColor: item.color }]}>
                  <Text style={[styles.roadmapStepText, { color: item.color }]}>{item.step}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.roadmapName, { color: item.color }]}>{item.name}</Text>
                  <Text style={styles.roadmapSub}>
                    Sisa {item.remainingMonth} bln · {formatCompact(item.monthlyInstallment)}/bln · Lunas: {item.payoffLabel}
                  </Text>
                  <Text style={styles.roadmapTotal}>Total sisa: {formatCompact(item.totalRemaining)}</Text>
                  <ProgressBar progress={item.progressPct} color={item.color} height={5} style={{ marginTop: 4 }} />
                </View>
              </View>
            ))
          )}
        </Card>

        {/* Proyeksi Finansial */}
        <Text style={styles.sectionTitle}>🔮 Proyeksi Finansial</Text>
        <View style={styles.grid}>
          <ProyeksiItem label="Kas bersih saat ini" value={formatCompact(projection.cashNow)} sub="nyata dari transaksi" color={projection.cashNow >= 0 ? COLORS.income : COLORS.expense} />
          <ProyeksiItem label="Bebas hutang" value={projection.debtFreeMonths > 0 ? `${projection.debtFreeMonths} bln lagi` : 'Bebas 🎉'} sub={projection.debtFreeLabel} color={COLORS.savings} />
          <ProyeksiItem label="Total tabungan" value={formatCompact(projection.totalSavings)} sub="semua pos gabungan" color={COLORS.investment} />
          <ProyeksiItem label="Dana darurat (3×cicilan)" value={projection.emergencyFundLabel} sub={`${formatCompact(projection.emergencyFundTarget)} target`} color={COLORS.debt} />
        </View>

        {/* Rekomendasi (multi-card) */}
        <Text style={styles.sectionTitle}>💡 Saran Hari Ini</Text>
        <Card padding={SPACING.md}>
          {suggestions.map((s, idx) => (
            <View key={idx} style={[styles.suggestionItem, idx > 0 && { marginTop: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: SPACING.sm }]}>
              <View style={[styles.suggestionIcon, { backgroundColor: s.bg }]}>
                <Text style={{ fontSize: 16 }}>{s.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.suggestionItemText}>{s.text}</Text>
                <View style={[styles.suggestionTag, { backgroundColor: s.tagColor + '22' }]}>
                  <Text style={[styles.suggestionTagText, { color: s.tagColor }]}>{s.tag}</Text>
                </View>
              </View>
            </View>
          ))}
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
  return (
    <Card style={styles.summaryItem} padding={SPACING.md}>
      <Text style={styles.summaryEmoji}>{emoji}</Text>
      <Text style={[styles.summaryValue, { color }]}>{negative ? '-' : ''}{formatCompact(value)}</Text>
      <Text style={styles.summaryLabel} numberOfLines={1}>{label}</Text>
    </Card>
  );
}

function NeracaRow({ label, value, color, bold }: { label: string; value: number; color: string; bold?: boolean }) {
  return (
    <View style={styles.neracaRow}>
      <Text style={[styles.neracaLabel, bold && { fontWeight: '700', color: COLORS.text }]}>{label}</Text>
      <Text style={[styles.neracaValue, { color }, bold && { fontWeight: '700' }]}>{formatCurrency(value)}</Text>
    </View>
  );
}

function ProyeksiItem({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <View style={styles.proyeksiItem}>
      <Text style={styles.proyeksiLabel}>{label}</Text>
      <Text style={[styles.proyeksiValue, { color }]}>{value}</Text>
      <Text style={styles.proyeksiSub} numberOfLines={1}>{sub}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.topbar },
  topbar: {
    backgroundColor: COLORS.topbar,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  topbarTitle: { fontSize: FONTS.lg, fontWeight: '700', color: '#ffffff' },
  topbarSub: { fontSize: FONTS.xs, color: 'rgba(255,255,255,0.5)', marginTop: 1 },
  topbarDate: { fontSize: FONTS.xs, color: 'rgba(255,255,255,0.6)' },

  scroll: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxxl },

  netWorthCard: { marginBottom: SPACING.sm, borderColor: COLORS.border },
  netWorthLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  netWorthAmount: { fontSize: 28, fontWeight: '800', marginBottom: SPACING.md },

  cashflowRow: { flexDirection: 'row', alignItems: 'flex-start' },
  cashflowItem: { flex: 1, alignItems: 'center' },
  cashflowLabel: { fontSize: FONTS.xs, color: COLORS.textMuted },
  cashflowValue: { fontSize: FONTS.lg, fontWeight: '700', marginTop: 2 },
  trendText: { fontSize: FONTS.xs, marginTop: 3, fontWeight: '500' },
  divider: { width: 1, height: 44, backgroundColor: COLORS.border, marginTop: 4 },

  cashflowBarWrap: { marginTop: SPACING.md },
  cashflowBarTrack: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.round,
    overflow: 'hidden',
  },
  cashflowBarFill: {
    height: 6,
    borderRadius: RADIUS.round,
  },
  cashflowBarLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
    textAlign: 'right',
  },

  badgeRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  badge: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  badgeEmoji: { fontSize: 16, marginBottom: 4 },
  badgeValue: { fontSize: FONTS.md, fontWeight: '800' },
  badgeLabel: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 2, textAlign: 'center' },

  quickRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm },
  quickBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  quickBtnIcon: { fontSize: 16 },
  quickBtnText: { fontSize: FONTS.sm, fontWeight: '700', color: '#ffffff' },

  sectionTitle: {
    fontSize: FONTS.xs,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  summaryItem: { width: '31%', alignItems: 'center' },
  summaryEmoji: { fontSize: 20, marginBottom: SPACING.xs },
  summaryValue: { fontSize: FONTS.md, fontWeight: '700' },
  summaryLabel: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 2, textAlign: 'center' },

  catRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  catInfo: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, width: 110 },
  catRank: { fontSize: FONTS.xs, color: COLORS.textMuted, width: 18 },
  catName: { fontSize: FONTS.sm, color: COLORS.text, fontWeight: '500', flex: 1 },
  catBarWrap: { flex: 1 },
  catBarTrack: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.round,
    overflow: 'hidden',
  },
  catBarFill: { height: 6, backgroundColor: COLORS.expense, borderRadius: RADIUS.round },
  catAmountWrap: { alignItems: 'flex-end', width: 60 },
  catAmount: { fontSize: FONTS.xs, fontWeight: '600', color: COLORS.text },
  catPct: { fontSize: FONTS.xs, color: COLORS.textMuted },

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

  reminderTierRow: {
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderTierLabel: { fontSize: FONTS.sm, fontWeight: '700' },
  reminderTierSub: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 1 },

  reminderPlainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  reminderPlainName: { fontSize: FONTS.sm, fontWeight: '600', color: COLORS.text },
  reminderPlainSub: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 1 },
  tagBlue: { backgroundColor: '#dbeafe', paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: RADIUS.round },
  tagBlueText: { fontSize: FONTS.xs, fontWeight: '700', color: '#1e40af' },

  paidLabel: {
    fontSize: FONTS.xs, fontWeight: '700', color: COLORS.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: SPACING.xs,
  },
  paidRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  paidName: { fontSize: FONTS.xs, color: COLORS.textMuted },
  paidCheck: { fontSize: FONTS.xs, color: COLORS.income },

  neracaRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  neracaLabel: { fontSize: FONTS.sm, color: COLORS.text },
  neracaValue: { fontSize: FONTS.sm, fontWeight: '600' },
  neracaDivider: { height: 2, backgroundColor: COLORS.border, marginVertical: SPACING.xs },
  kekayaanBox: {
    backgroundColor: COLORS.subtleBg, borderRadius: RADIUS.md, padding: SPACING.md,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  kekayaanLabel: { fontSize: FONTS.sm, fontWeight: '700', color: COLORS.text },
  kekayaanValue: { fontSize: FONTS.md, fontWeight: '700' },

  cfSummaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  cfSummaryText: { fontSize: FONTS.sm, fontWeight: '600' },

  cf12Grid: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm },
  cf12Box: { flex: 1, borderRadius: RADIUS.md, padding: SPACING.sm },
  cf12Label: { fontSize: FONTS.xs, textTransform: 'uppercase', marginBottom: 2 },
  cf12Value: { fontSize: FONTS.sm, fontWeight: '700' },
  cf12Sub: { fontSize: FONTS.xs, marginTop: 1 },

  roadmapDoneText: { fontSize: FONTS.sm, color: COLORS.income, textAlign: 'center', padding: SPACING.md },
  roadmapRow: { flexDirection: 'row', gap: SPACING.sm, alignItems: 'flex-start', marginBottom: SPACING.md },
  roadmapStep: {
    width: 26, height: 26, borderRadius: RADIUS.round, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  roadmapStepText: { fontSize: FONTS.xs, fontWeight: '700' },
  roadmapName: { fontSize: FONTS.sm, fontWeight: '700' },
  roadmapSub: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 2 },
  roadmapTotal: { fontSize: FONTS.xs, color: COLORS.savings, marginTop: 1 },

  proyeksiItem: { width: '48%', backgroundColor: COLORS.subtleBg, borderRadius: RADIUS.md, padding: SPACING.sm },
  proyeksiLabel: { fontSize: FONTS.xs, color: COLORS.textMuted, textTransform: 'uppercase' },
  proyeksiValue: { fontSize: FONTS.md, fontWeight: '700', marginTop: 2 },
  proyeksiSub: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 1 },

  suggestionItem: { flexDirection: 'row', gap: SPACING.sm, alignItems: 'flex-start' },
  suggestionIcon: {
    width: 32, height: 32, borderRadius: RADIUS.md,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  suggestionItemText: { fontSize: FONTS.sm, color: COLORS.text, lineHeight: 19 },
  suggestionTag: { alignSelf: 'flex-start', paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: RADIUS.round, marginTop: 3 },
  suggestionTagText: { fontSize: FONTS.xs, fontWeight: '700' },
});
