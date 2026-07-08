import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ListRenderItemInfo,
  TextStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@realm/react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';

import { COLORS, FONTS, SPACING, RADIUS } from '../../../theme';
import { Card, Text, EmptyState, AmountDisplay } from '../../../components/common';
import { ExpenseModel } from '../../../models/ExpenseModel';
import { formatCurrency } from '../../../utils/currency';
import { formatDate } from '../../../utils/date';

// ─── Navigation Types ─────────────────────────────────────────────────────────

export type ExpenseStackParamList = {
  ExpenseList: undefined;
  ExpenseForm: { id?: string };
};

type NavProp = NativeStackNavigationProp<ExpenseStackParamList>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface MonthOption {
  label: string;
  yearMonth: string;
}

function buildMonthOptions(): MonthOption[] {
  return [0, 1, 2].map((offset) => {
    const d = dayjs().subtract(offset, 'month');
    return { label: d.format('MMM YY'), yearMonth: d.format('YYYY-MM') };
  });
}

const CATEGORY_EMOJIS: Record<string, string> = {
  'Makan & Minum': '🍜',
  Transportasi: '🚗',
  Belanja: '🛍️',
  Tagihan: '📄',
  Kesehatan: '🏥',
  Hiburan: '🎬',
  Pendidikan: '📚',
  Rumah: '🏠',
  Komunikasi: '📱',
  Lainnya: '💸',
};

const SOURCE_LABELS: Record<string, string> = {
  cash: 'Kas',
  savings: 'Tabungan',
};

const SOURCE_COLORS: Record<string, string> = {
  cash: COLORS.warning,
  savings: COLORS.savings,
};

// ─── Expense Item ─────────────────────────────────────────────────────────────

interface ExpenseItemProps {
  item: ExpenseModel;
  onPress: () => void;
}

function ExpenseItem({ item, onPress }: ExpenseItemProps) {
  const emoji = CATEGORY_EMOJIS[item.category] ?? '💸';
  const sourceBg = SOURCE_COLORS[item.source] ?? COLORS.textMuted;
  const sourceLabel = SOURCE_LABELS[item.source] ?? item.source;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.itemContainer}>
      <View style={styles.itemLeft}>
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{emoji}</Text>
        </View>
        <View style={styles.itemInfo}>
          <View style={styles.itemTopRow}>
            <Text style={styles.itemCategory}>{item.category}</Text>
            <View style={[styles.sourceBadge, { backgroundColor: sourceBg + '22' }]}>
              <Text style={[styles.sourceBadgeText, { color: sourceBg }] as TextStyle[]}>{sourceLabel}</Text>
            </View>
          </View>
          <Text style={styles.itemDate}>{formatDate(item.date)}</Text>
          {item.note ? (
            <Text style={styles.itemNote} numberOfLines={1}>
              {item.note}
            </Text>
          ) : null}
        </View>
      </View>
      <Text style={styles.itemAmount}>- {formatCurrency(item.amount)}</Text>
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function ExpenseListScreen() {
  const navigation = useNavigation<NavProp>();
  const monthOptions = useMemo(() => buildMonthOptions(), []);
  const [selectedYearMonth, setSelectedYearMonth] = useState<string>(monthOptions[0].yearMonth);

  const allExpenses = useQuery(ExpenseModel);

  const filteredExpenses = useMemo(() => {
    return allExpenses
      .filtered('date BEGINSWITH $0', selectedYearMonth)
      .sorted('date', true);
  }, [allExpenses, selectedYearMonth]);

  const totalAmount = useMemo(
    () => filteredExpenses.reduce((sum, e) => sum + e.amount, 0),
    [filteredExpenses],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ExpenseModel>) => (
      <ExpenseItem
        item={item}
        onPress={() => navigation.navigate('ExpenseForm', { id: item._id.toHexString() })}
      />
    ),
    [navigation],
  );

  const keyExtractor = useCallback((item: ExpenseModel) => item._id.toHexString(), []);

  const currentMonthLabel = monthOptions.find((m) => m.yearMonth === selectedYearMonth)?.label;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerAmountBadge}>
          <Text style={styles.headerAmountLabel}>Total Pengeluaran</Text>
          <Text style={styles.headerAmount}>- {formatCurrency(totalAmount)}</Text>
        </View>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryWrapper}>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total {currentMonthLabel}</Text>
          <AmountDisplay amount={totalAmount} size="xl" style={{ color: COLORS.expense }} />
          <Text style={styles.summaryCount}>{filteredExpenses.length} transaksi</Text>
        </Card>
      </View>

      {/* Month Filter */}
      <View style={styles.filterRow}>
        {monthOptions.map((opt) => {
          const isActive = opt.yearMonth === selectedYearMonth;
          return (
            <TouchableOpacity
              key={opt.yearMonth}
              onPress={() => setSelectedYearMonth(opt.yearMonth)}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterChipText, isActive ? styles.filterChipTextActive : null]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* List */}
      <FlatList
        data={filteredExpenses as unknown as ExpenseModel[]}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            emoji="💸"
            title="Belum ada pengeluaran"
            subtitle="Tap tombol + untuk mencatat pengeluaran"
          />
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('ExpenseForm', {})}
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
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  headerAmountBadge: {
    alignItems: 'flex-start',
  },
  headerAmountLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerAmount: {
    fontSize: FONTS.lg,
    fontWeight: '700',
    color: COLORS.expense,
  },
  summaryWrapper: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
  },
  summaryCard: {
    padding: SPACING.lg,
  },
  summaryLabel: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  summaryCount: {
    fontSize: FONTS.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  filterChip: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.expense,
    borderColor: COLORS.expense,
  },
  filterChipText: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 100,
    flexGrow: 1,
  },
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
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emojiContainer: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  emoji: {
    fontSize: 20,
  },
  itemInfo: {
    flex: 1,
  },
  itemTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  itemCategory: {
    fontSize: FONTS.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  sourceBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  sourceBadgeText: {
    fontSize: FONTS.xs,
    fontWeight: '600',
  },
  itemDate: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  itemNote: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  itemAmount: {
    fontSize: FONTS.md,
    fontWeight: '700',
    color: COLORS.expense,
    marginLeft: SPACING.sm,
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.xxl,
    right: SPACING.xl,
    width: 56,
    height: 56,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.expense,
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
});
