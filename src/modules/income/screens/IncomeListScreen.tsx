import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ListRenderItemInfo,
} from 'react-native';
import { useQuery } from '@realm/react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';

import { COLORS, FONTS, SPACING, RADIUS } from '../../../theme';
import { Card, Text, EmptyState, AmountDisplay } from '../../../components/common';
import { IncomeModel } from '../../../models/IncomeModel';
import { formatCurrency } from '../../../utils/currency';
import { formatDate } from '../../../utils/date';

// ─── Navigation Types ─────────────────────────────────────────────────────────

export type IncomeStackParamList = {
  IncomeList: undefined;
  IncomeForm: { id?: string };
};

type NavProp = NativeStackNavigationProp<IncomeStackParamList>;

// ─── Month Filter Helpers ─────────────────────────────────────────────────────

interface MonthOption {
  label: string;
  yearMonth: string; // 'YYYY-MM'
}

function buildMonthOptions(): MonthOption[] {
  return [0, 1, 2].map((offset) => {
    const d = dayjs().subtract(offset, 'month');
    return {
      label: d.format('MMM YY'),
      yearMonth: d.format('YYYY-MM'),
    };
  });
}

// ─── Income Item ──────────────────────────────────────────────────────────────

const CATEGORY_EMOJIS: Record<string, string> = {
  Gaji: '💼',
  Freelance: '💻',
  Bonus: '🎁',
  Investasi: '📈',
  Bisnis: '🏪',
  Lainnya: '💰',
};

interface IncomeItemProps {
  item: IncomeModel;
  onPress: () => void;
}

function IncomeItem({ item, onPress }: IncomeItemProps) {
  const emoji = CATEGORY_EMOJIS[item.category] ?? '💰';
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.itemContainer}>
      <View style={styles.itemLeft}>
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{emoji}</Text>
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemCategory}>{item.category}</Text>
          <Text style={styles.itemDate}>{formatDate(item.date)}</Text>
          {item.note ? (
            <Text style={styles.itemNote} numberOfLines={1}>
              {item.note}
            </Text>
          ) : null}
        </View>
      </View>
      <AmountDisplay amount={item.amount} size="md" style={styles.itemAmount} />
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function IncomeListScreen() {
  const navigation = useNavigation<NavProp>();
  const monthOptions = useMemo(() => buildMonthOptions(), []);
  const [selectedYearMonth, setSelectedYearMonth] = useState<string>(monthOptions[0].yearMonth);

  const allIncomes = useQuery(IncomeModel);

  const filteredIncomes = useMemo(() => {
    return allIncomes
      .filtered('date BEGINSWITH $0', selectedYearMonth)
      .sorted('date', true);
  }, [allIncomes, selectedYearMonth]);

  const totalAmount = useMemo(
    () => filteredIncomes.reduce((sum, i) => sum + i.amount, 0),
    [filteredIncomes],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<IncomeModel>) => (
      <IncomeItem
        item={item}
        onPress={() => navigation.navigate('IncomeForm', { id: item._id.toHexString() })}
      />
    ),
    [navigation],
  );

  const keyExtractor = useCallback((item: IncomeModel) => item._id.toHexString(), []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Pemasukan</Text>
          <Text style={styles.headerSubtitle}>Kelola pendapatan kamu</Text>
        </View>
        <View style={styles.headerAmountBadge}>
          <Text style={styles.headerAmountLabel}>Total</Text>
          <Text style={styles.headerAmount}>{formatCurrency(totalAmount)}</Text>
        </View>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryWrapper}>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total {monthOptions.find(m => m.yearMonth === selectedYearMonth)?.label}</Text>
          <AmountDisplay amount={totalAmount} size="xl" style={{ color: COLORS.income }} />
          <Text style={styles.summaryCount}>{filteredIncomes.length} transaksi</Text>
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
        data={filteredIncomes as unknown as IncomeModel[]}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            emoji="💰"
            title="Belum ada pemasukan"
            subtitle="Tap tombol + untuk menambah pemasukan"
          />
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('IncomeForm', {})}
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
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: FONTS.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  headerAmountBadge: {
    alignItems: 'flex-end',
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
    color: COLORS.income,
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
    backgroundColor: COLORS.income,
    borderColor: COLORS.income,
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
  itemCategory: {
    fontSize: FONTS.md,
    fontWeight: '600',
    color: COLORS.text,
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
    color: COLORS.income,
    fontWeight: '700',
    marginLeft: SPACING.sm,
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.xxl,
    right: SPACING.xl,
    width: 56,
    height: 56,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.income,
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
