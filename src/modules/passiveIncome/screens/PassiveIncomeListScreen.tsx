import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@realm/react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { COLORS, FONTS, SPACING, RADIUS } from '../../../theme';
import { Card } from '../../../components/common/Card';
import { ProgressBar } from '../../../components/common/ProgressBar';
import { EmptyState } from '../../../components/common/EmptyState';
import { FAB } from '../../../components/common/FAB';
import { BackButton } from '../../../components/common/BackButton';
import { PassiveIncomeModel } from '../../../models/PassiveIncomeModel';
import { ExpenseModel } from '../../../models/ExpenseModel';
import { formatCurrency, formatCompact } from '../../../utils/currency';
import { startOfMonth, endOfMonth } from '../../../utils/date';
import { PASSIVE_INCOME_CATEGORIES, toMonthlyAmount, getPassiveIncomeStatus } from '../../../utils/finance';

export type PassiveIncomeStackParamList = {
  PassiveIncomeList: undefined;
  PassiveIncomeForm: { id?: string };
};

function categoryMeta(value: string) {
  return PASSIVE_INCOME_CATEGORIES.find((c) => c.value === value) ?? { value, label: value, emoji: '💰' };
}

export function PassiveIncomeListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<PassiveIncomeStackParamList>>();
  const entries = useQuery(PassiveIncomeModel);
  const monthStart = startOfMonth();
  const monthEnd = endOfMonth();
  const expenses = useQuery(ExpenseModel).filtered('date >= $0 AND date <= $1', monthStart, monthEnd);
  const monthlyExpense = expenses.reduce((s, e) => s + e.amount, 0);

  const status = getPassiveIncomeStatus(
    entries.map((e) => ({ amount: e.amount, frequency: e.frequency })),
    monthlyExpense,
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} color={COLORS.text} />
        <Text style={styles.count}>{entries.length} sumber</Text>
      </View>

      <Card style={styles.progressCard} padding={SPACING.lg}>
        <Text style={styles.progressLabel}>Passive Income / Bulan</Text>
        <Text style={styles.progressValue}>{formatCurrency(status.monthlyTotal)}</Text>
        <ProgressBar progress={status.progressPct} color={COLORS.savings} height={10} style={{ marginTop: SPACING.sm }} />
        <View style={styles.progressFooter}>
          <Text style={styles.progressPct}>{status.progressPct.toFixed(0)}% dari Freedom Target</Text>
          <Text style={styles.progressTarget}>Target: {formatCompact(status.freedomTarget)}</Text>
        </View>
        {status.remaining > 0 && (
          <Text style={styles.progressRemaining}>Butuh +{formatCompact(status.remaining)}/bulan lagi untuk menutup pengeluaran</Text>
        )}
      </Card>

      <FlatList
        data={[...entries]}
        keyExtractor={(e) => e._id.toHexString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const meta = categoryMeta(item.category);
          const monthly = toMonthlyAmount(item.amount, item.frequency);
          return (
            <TouchableOpacity onPress={() => navigation.navigate('PassiveIncomeForm', { id: item._id.toHexString() })} activeOpacity={0.7}>
              <Card style={styles.itemCard} padding={SPACING.lg}>
                <View style={styles.itemRow}>
                  <Text style={styles.itemEmoji}>{meta.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>{meta.label}</Text>
                    <Text style={styles.itemFreq}>{item.frequency === 'yearly' ? 'Tahunan' : 'Bulanan'}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.itemAmount}>{formatCurrency(item.amount)}</Text>
                    <Text style={styles.itemMonthly}>≈ {formatCompact(monthly)}/bln</Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            emoji="💎"
            title="Belum ada passive income"
            subtitle="Tap + untuk mencatat dividen, sewa properti, royalti, atau yield pertama kamu"
          />
        }
      />

      <FAB color={COLORS.primary} onPress={() => navigation.navigate('PassiveIncomeForm', {})} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, paddingBottom: 0 },
  count: { fontSize: FONTS.sm, color: COLORS.textSecondary },
  progressCard: { marginHorizontal: SPACING.lg, marginTop: SPACING.md },
  progressLabel: { fontSize: FONTS.sm, color: COLORS.textMuted, fontWeight: '600' },
  progressValue: { fontSize: FONTS.xxl, fontWeight: '800', color: COLORS.savings, marginTop: 2 },
  progressFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.sm },
  progressPct: { fontSize: FONTS.xs, color: COLORS.textSecondary },
  progressTarget: { fontSize: FONTS.xs, color: COLORS.textMuted },
  progressRemaining: { fontSize: FONTS.xs, color: COLORS.warning, marginTop: SPACING.sm },
  listContent: { padding: SPACING.lg, paddingBottom: 100, flexGrow: 1 },
  itemCard: { marginBottom: SPACING.sm },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  itemEmoji: { fontSize: 28 },
  itemName: { fontSize: FONTS.md, fontWeight: '700', color: COLORS.text },
  itemFreq: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 2 },
  itemAmount: { fontSize: FONTS.sm, fontWeight: '700', color: COLORS.text },
  itemMonthly: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 2 },
});
