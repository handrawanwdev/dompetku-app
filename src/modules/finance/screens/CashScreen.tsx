import React, { useMemo } from 'react';
import { View, FlatList, StyleSheet, StatusBar, ListRenderItemInfo } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRealm, useQuery } from '@realm/react';

import { COLORS, FONTS, ICON_SIZES, SPACING, RADIUS } from '../../../theme';
import { Card, Text, EmptyState, AmountDisplay } from '../../../components/common';
import { IncomeModel } from '../../../models/IncomeModel';
import { ExpenseModel } from '../../../models/ExpenseModel';
import { getKasBebasBalance } from '../../../services/AllocationService';
import { formatCurrency } from '../../../utils/currency';
import { formatDate } from '../../../utils/date';

interface CashRow {
  id: string;
  date: string;
  category: string;
  note: string;
  amount: number;
  kind: 'in' | 'out';
}

function CashItem({ item }: { item: CashRow }) {
  const color = item.kind === 'in' ? COLORS.income : COLORS.expense;
  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemCategory}>{item.category}</Text>
        <Text style={styles.itemDate}>{formatDate(item.date)}</Text>
        {item.note ? (
          <Text style={styles.itemNote} numberOfLines={1}>{item.note}</Text>
        ) : null}
      </View>
      <Text style={[styles.itemAmount, { color }]}>
        {item.kind === 'in' ? '+ ' : '- '}{formatCurrency(item.amount)}
      </Text>
    </View>
  );
}

export function CashScreen() {
  const realm = useRealm();
  const incomes = useQuery(IncomeModel);
  const expenses = useQuery(ExpenseModel);

  const balance = getKasBebasBalance(realm);

  const rows = useMemo<CashRow[]>(() => {
    const cashIncomes: CashRow[] = incomes
      .filtered('allocationCash > 0')
      .map((i) => ({
        id: i._id.toHexString(),
        date: i.date,
        category: i.category,
        note: i.note,
        amount: i.allocationCash,
        kind: 'in' as const,
      }));
    const cashExpenses: CashRow[] = expenses
      .filtered("source == 'cash'")
      .map((e) => ({
        id: e._id.toHexString(),
        date: e.date,
        category: e.category,
        note: e.note,
        amount: e.amount,
        kind: 'out' as const,
      }));
    return [...cashIncomes, ...cashExpenses]
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .slice(0, 30);
  }, [incomes, expenses]);

  const renderItem = ({ item }: ListRenderItemInfo<CashRow>) => <CashItem item={item} />;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <MaterialIcons name="payments" size={ICON_SIZES.md} color={COLORS.text} />
        <Text style={styles.headerTitle}>Kas Bebas</Text>
      </View>
      <View style={styles.body}>
        <Card style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo Kas Bebas</Text>
          <AmountDisplay amount={balance} size="xl" style={{ color: COLORS.income }} />
        </Card>

        <Text style={styles.sectionTitle}>Aktivitas Terakhir</Text>
        <FlatList
          data={rows}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState emoji="💵" title="Belum ada aktivitas kas" subtitle="Transaksi cash akan muncul di sini" />
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  body: { flex: 1, paddingHorizontal: SPACING.lg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  headerTitle: { fontSize: FONTS.xl, fontWeight: '800', color: COLORS.text },
  balanceCard: { padding: SPACING.lg, marginBottom: SPACING.lg },
  balanceLabel: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  sectionTitle: {
    fontSize: FONTS.xs,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
  },
  listContent: { paddingBottom: SPACING.xxxl },
  itemContainer: {
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
  itemInfo: { flex: 1 },
  itemCategory: { fontSize: FONTS.md, fontWeight: '600', color: COLORS.text },
  itemDate: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: 2 },
  itemNote: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 2 },
  itemAmount: { fontSize: FONTS.md, fontWeight: '700', marginLeft: SPACING.sm },
});
