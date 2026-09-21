import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@realm/react';
import dayjs from 'dayjs';

import { COLORS, FONTS, SPACING, RADIUS } from '../../../theme';
import { Card } from '../../../components/common/Card';
import { EmptyState } from '../../../components/common/EmptyState';
import { GroupedBarChart } from '../../../components/charts/GroupedBarChart';
import { IncomeModel } from '../../../models/IncomeModel';
import { ExpenseModel } from '../../../models/ExpenseModel';
import { formatCurrency, formatCompact } from '../../../utils/currency';

type Mode = 'bulanan' | 'tahunan';

function categoryBreakdown(rows: Array<{ category: string; amount: number }>) {
  const map: Record<string, number> = {};
  for (const r of rows) map[r.category] = (map[r.category] ?? 0) + r.amount;
  return Object.entries(map)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

function CategoryBarList({ items, total, color }: { items: { category: string; amount: number }[]; total: number; color: string }) {
  if (!items.length) {
    return <Text style={styles.emptyText}>Belum ada data</Text>;
  }
  return (
    <View>
      {items.slice(0, 6).map((item, idx) => {
        const pct = total > 0 ? (item.amount / total) * 100 : 0;
        return (
          <View key={item.category} style={[styles.catRow, idx > 0 && { marginTop: SPACING.sm }]}>
            <View style={styles.catInfo}>
              <Text style={styles.catRank}>#{idx + 1}</Text>
              <Text style={styles.catName} numberOfLines={1}>{item.category}</Text>
            </View>
            <View style={styles.catBarWrap}>
              <View style={styles.catBarTrack}>
                <View style={[styles.catBarFill, { width: `${pct}%` as any, backgroundColor: color }]} />
              </View>
            </View>
            <View style={styles.catAmountWrap}>
              <Text style={styles.catAmount}>{formatCompact(item.amount)}</Text>
              <Text style={styles.catPct}>{pct.toFixed(0)}%</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

function SummaryBox({ label, value, sub, color, bg }: { label: string; value: string; sub?: string; color: string; bg: string }) {
  return (
    <View style={[styles.summaryBox, { backgroundColor: bg }]}>
      <Text style={[styles.summaryBoxLabel, { color }]}>{label}</Text>
      <Text style={[styles.summaryBoxValue, { color }]}>{value}</Text>
      {sub ? <Text style={[styles.summaryBoxSub, { color }]}>{sub}</Text> : null}
    </View>
  );
}

export function ReportScreen() {
  const [mode, setMode] = useState<Mode>('bulanan');
  const [monthCursor, setMonthCursor] = useState(() => dayjs());
  const [yearCursor, setYearCursor] = useState(() => dayjs().year());

  const incomes = useQuery(IncomeModel);
  const expenses = useQuery(ExpenseModel);

  const monthly = useMemo(() => {
    const monthStart = monthCursor.startOf('month').format('YYYY-MM-DD');
    const monthEnd = monthCursor.endOf('month').format('YYYY-MM-DD');
    const mIncomes = incomes.filtered('date >= $0 AND date <= $1', monthStart, monthEnd);
    const mExpenses = expenses.filtered('date >= $0 AND date <= $1', monthStart, monthEnd);

    const totalIncome = mIncomes.reduce((s, i) => s + i.amount, 0);
    const totalExpense = mExpenses.reduce((s, e) => s + e.amount, 0);

    const incomeByCategory = categoryBreakdown([...mIncomes].map(i => ({ category: i.category, amount: i.amount })));
    const expenseByCategory = categoryBreakdown([...mExpenses].map(e => ({ category: e.category, amount: e.amount })));

    return {
      label: monthCursor.format('MMMM YYYY'),
      totalIncome,
      totalExpense,
      net: totalIncome - totalExpense,
      incomeByCategory,
      expenseByCategory,
      count: mIncomes.length + mExpenses.length,
    };
  }, [incomes, expenses, monthCursor]);

  const yearly = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const d = dayjs(`${yearCursor}-${String(i + 1).padStart(2, '0')}-01`);
      const start = d.startOf('month').format('YYYY-MM-DD');
      const end = d.endOf('month').format('YYYY-MM-DD');
      const income = incomes.filtered('date >= $0 AND date <= $1', start, end).reduce((s, x) => s + x.amount, 0);
      const expense = expenses.filtered('date >= $0 AND date <= $1', start, end).reduce((s, x) => s + x.amount, 0);
      return { label: d.format('MMM'), income, expense };
    });

    const yearStart = `${yearCursor}-01-01`;
    const yearEnd = `${yearCursor}-12-31`;
    const yIncomes = incomes.filtered('date >= $0 AND date <= $1', yearStart, yearEnd);
    const yExpenses = expenses.filtered('date >= $0 AND date <= $1', yearStart, yearEnd);

    const totalIncome = months.reduce((s, m) => s + m.income, 0);
    const totalExpense = months.reduce((s, m) => s + m.expense, 0);
    const expenseByCategory = categoryBreakdown([...yExpenses].map(e => ({ category: e.category, amount: e.amount })));

    return {
      months,
      totalIncome,
      totalExpense,
      net: totalIncome - totalExpense,
      avgIncome: totalIncome / 12,
      avgExpense: totalExpense / 12,
      expenseByCategory,
      count: yIncomes.length + yExpenses.length,
    };
  }, [incomes, expenses, yearCursor]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Mode toggle */}
        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[styles.modeBtn, mode === 'bulanan' && styles.modeBtnActive]}
            onPress={() => setMode('bulanan')}
            activeOpacity={0.8}
          >
            <Text style={[styles.modeBtnText, mode === 'bulanan' && styles.modeBtnTextActive]}>Bulanan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeBtn, mode === 'tahunan' && styles.modeBtnActive]}
            onPress={() => setMode('tahunan')}
            activeOpacity={0.8}
          >
            <Text style={[styles.modeBtnText, mode === 'tahunan' && styles.modeBtnTextActive]}>Tahunan</Text>
          </TouchableOpacity>
        </View>

        {mode === 'bulanan' ? (
          <>
            {/* Month navigator */}
            <View style={styles.navigator}>
              <TouchableOpacity style={styles.navBtn} onPress={() => setMonthCursor(c => c.subtract(1, 'month'))}>
                <Text style={styles.navBtnText}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.navigatorLabel}>{monthly.label}</Text>
              <TouchableOpacity style={styles.navBtn} onPress={() => setMonthCursor(c => c.add(1, 'month'))}>
                <Text style={styles.navBtnText}>›</Text>
              </TouchableOpacity>
            </View>

            {monthly.count === 0 ? (
              <EmptyState emoji="📊" title="Belum ada transaksi" subtitle="Tidak ada data untuk bulan ini" />
            ) : (
              <>
                <View style={styles.summaryGrid}>
                  <SummaryBox label="Masuk" value={formatCompact(monthly.totalIncome)} color="#065f46" bg="#d1fae5" />
                  <SummaryBox label="Keluar" value={formatCompact(monthly.totalExpense)} color="#991b1b" bg="#fee2e2" />
                  <SummaryBox
                    label="Net"
                    value={`${monthly.net >= 0 ? '+' : ''}${formatCompact(monthly.net)}`}
                    color={monthly.net >= 0 ? '#1e40af' : '#991b1b'}
                    bg={monthly.net >= 0 ? '#dbeafe' : '#fee2e2'}
                  />
                </View>

                <Text style={styles.sectionTitle}>💵 Pemasukan per Kategori</Text>
                <Card padding={SPACING.md}>
                  <CategoryBarList items={monthly.incomeByCategory} total={monthly.totalIncome} color={COLORS.income} />
                </Card>

                <Text style={styles.sectionTitle}>🛒 Pengeluaran per Kategori</Text>
                <Card padding={SPACING.md}>
                  <CategoryBarList items={monthly.expenseByCategory} total={monthly.totalExpense} color={COLORS.expense} />
                </Card>
              </>
            )}
          </>
        ) : (
          <>
            {/* Year navigator */}
            <View style={styles.navigator}>
              <TouchableOpacity style={styles.navBtn} onPress={() => setYearCursor(y => y - 1)}>
                <Text style={styles.navBtnText}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.navigatorLabel}>{yearCursor}</Text>
              <TouchableOpacity style={styles.navBtn} onPress={() => setYearCursor(y => y + 1)}>
                <Text style={styles.navBtnText}>›</Text>
              </TouchableOpacity>
            </View>

            {yearly.count === 0 ? (
              <EmptyState emoji="📊" title="Belum ada transaksi" subtitle="Tidak ada data untuk tahun ini" />
            ) : (
              <>
                <View style={styles.summaryGrid}>
                  <SummaryBox label="Total Masuk" value={formatCompact(yearly.totalIncome)} sub={`avg ${formatCompact(yearly.avgIncome)}/bln`} color="#065f46" bg="#d1fae5" />
                  <SummaryBox label="Total Keluar" value={formatCompact(yearly.totalExpense)} sub={`avg ${formatCompact(yearly.avgExpense)}/bln`} color="#991b1b" bg="#fee2e2" />
                  <SummaryBox
                    label="Net Cashflow"
                    value={`${yearly.net >= 0 ? '+' : ''}${formatCompact(yearly.net)}`}
                    color={yearly.net >= 0 ? '#1e40af' : '#991b1b'}
                    bg={yearly.net >= 0 ? '#dbeafe' : '#fee2e2'}
                  />
                </View>

                <Text style={styles.sectionTitle}>📊 Cashflow 12 Bulan</Text>
                <Card padding={SPACING.lg}>
                  <GroupedBarChart data={yearly.months} height={180} />
                </Card>

                <Text style={styles.sectionTitle}>🛒 Pengeluaran per Kategori (Setahun)</Text>
                <Card padding={SPACING.md}>
                  <CategoryBarList items={yearly.expenseByCategory} total={yearly.totalExpense} color={COLORS.expense} />
                </Card>
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },

  modeToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.subtleBg,
    borderRadius: RADIUS.lg,
    padding: 3,
    marginBottom: SPACING.lg,
    gap: 2,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  modeBtnActive: {
    backgroundColor: COLORS.card,
  },
  modeBtnText: {
    fontSize: FONTS.sm,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  modeBtnTextActive: {
    color: COLORS.text,
    fontWeight: '700',
  },

  navigator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnText: { fontSize: FONTS.xl, color: COLORS.text, fontWeight: '700' },
  navigatorLabel: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text, minWidth: 140, textAlign: 'center' },

  summaryGrid: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  summaryBox: { flex: 1, borderRadius: RADIUS.md, padding: SPACING.sm },
  summaryBoxLabel: { fontSize: FONTS.xs, textTransform: 'uppercase', marginBottom: 2 },
  summaryBoxValue: { fontSize: FONTS.sm, fontWeight: '700' },
  summaryBoxSub: { fontSize: FONTS.xs, marginTop: 1 },

  sectionTitle: {
    fontSize: FONTS.xs,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },

  catRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  catInfo: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, width: 110 },
  catRank: { fontSize: FONTS.xs, color: COLORS.textMuted, width: 18 },
  catName: { fontSize: FONTS.sm, color: COLORS.text, fontWeight: '500', flex: 1 },
  catBarWrap: { flex: 1 },
  catBarTrack: { height: 6, backgroundColor: COLORS.border, borderRadius: RADIUS.round, overflow: 'hidden' },
  catBarFill: { height: 6, borderRadius: RADIUS.round },
  catAmountWrap: { alignItems: 'flex-end', width: 64 },
  catAmount: { fontSize: FONTS.xs, fontWeight: '600', color: COLORS.text },
  catPct: { fontSize: FONTS.xs, color: COLORS.textMuted },

  emptyText: { fontSize: FONTS.sm, color: COLORS.textMuted, textAlign: 'center', padding: SPACING.md },
});
