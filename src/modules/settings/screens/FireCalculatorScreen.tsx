import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@realm/react';

import { COLORS, FONTS, SPACING } from '../../../theme';
import { Card } from '../../../components/common/Card';
import { ProgressBar } from '../../../components/common/ProgressBar';
import { BackButton } from '../../../components/common/BackButton';
import { IncomeModel } from '../../../models/IncomeModel';
import { ExpenseModel } from '../../../models/ExpenseModel';
import { DebtModel } from '../../../models/DebtModel';
import { SavingModel } from '../../../models/SavingModel';
import { InvestmentModel } from '../../../models/InvestmentModel';
import { PhysicalAssetModel } from '../../../models/PhysicalAssetModel';
import { formatCurrency } from '../../../utils/currency';
import { startOfMonth, endOfMonth } from '../../../utils/date';
import { calcDepreciation, calcFireProgress } from '../../../utils/finance';
import { SettingsStackParamList } from './SettingsMainScreen';

type NavProp = NativeStackNavigationProp<SettingsStackParamList, 'FireCalculatorScreen'>;

interface Props { navigation: NavProp; }

export function FireCalculatorScreen({ navigation }: Props) {
  const monthStart = startOfMonth();
  const monthEnd = endOfMonth();

  const expenses = useQuery(ExpenseModel).filtered('date >= $0 AND date <= $1', monthStart, monthEnd);
  const debts = useQuery(DebtModel).filtered('isActive == true');
  const savings = useQuery(SavingModel);
  const investments = useQuery(InvestmentModel).filtered('sold == false');
  const physicalAssets = useQuery(PhysicalAssetModel).filtered('sold == false');

  const monthlyExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const totalSavings = savings.reduce((s, sv) => s + sv.balance, 0);
  const totalInvestment = investments.reduce((s, i) => s + i.currentPrice * i.quantity, 0);
  const totalAssets = physicalAssets.reduce(
    (s, a) => s + calcDepreciation(a.purchasePrice, a.residualValue, a.usefulLife, a.purchaseDate), 0,
  );
  const totalDebt = debts.reduce((s, d) => s + d.monthlyInstallment * d.remainingMonth, 0);

  const currentAmount = Math.max(0, totalSavings + totalInvestment + totalAssets - totalDebt);
  const fire = calcFireProgress(monthlyExpense, currentAmount);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} color={COLORS.text} />
        </View>

        <Text style={styles.title}>🔥 FIRE Calculator</Text>
        <Text style={styles.subtitle}>Financial Independence, Retire Early — target dana bebas finansial dari pengeluaran bulanan kamu.</Text>

        <Card padding={SPACING.xl} style={{ marginTop: SPACING.lg }}>
          <Text style={styles.label}>FIRE Number</Text>
          <Text style={styles.fireNumber}>{formatCurrency(fire.fireNumber)}</Text>
          <Text style={styles.formula}>= Pengeluaran Bulanan ({formatCurrency(monthlyExpense)}) × 12 × 25</Text>
        </Card>

        <Card padding={SPACING.xl} style={{ marginTop: SPACING.md }}>
          <Text style={styles.label}>Progress Saat Ini</Text>
          <Text style={styles.progressPct}>{fire.progressPct.toFixed(1)}%</Text>
          <ProgressBar progress={fire.progressPct} color={COLORS.savings} height={10} style={{ marginTop: SPACING.sm }} />

          <View style={styles.row}>
            <View>
              <Text style={styles.rowLabel}>Terkumpul</Text>
              <Text style={[styles.rowValue, { color: COLORS.income }]}>{formatCurrency(fire.currentAmount)}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.rowLabel}>Masih Butuh</Text>
              <Text style={[styles.rowValue, { color: COLORS.expense }]}>{formatCurrency(fire.remaining)}</Text>
            </View>
          </View>
        </Card>

        {monthlyExpense === 0 && (
          <Text style={styles.hint}>Belum ada catatan pengeluaran bulan ini — perhitungan FIRE Number butuh data pengeluaran bulanan.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md, marginLeft: -SPACING.sm },
  title: { fontSize: FONTS.xxl, fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: SPACING.xs, lineHeight: 20 },
  label: { fontSize: FONTS.xs, color: COLORS.textMuted, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4 },
  fireNumber: { fontSize: FONTS.xxxl, fontWeight: '800', color: COLORS.text, marginTop: 4 },
  formula: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: SPACING.xs },
  progressPct: { fontSize: FONTS.xxxl, fontWeight: '800', color: COLORS.savings, marginTop: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.lg },
  rowLabel: { fontSize: FONTS.xs, color: COLORS.textMuted },
  rowValue: { fontSize: FONTS.md, fontWeight: '700', marginTop: 2 },
  hint: { fontSize: FONTS.xs, color: COLORS.warning, marginTop: SPACING.md, textAlign: 'center' },
});
