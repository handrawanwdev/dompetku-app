import React, { useMemo, useCallback } from 'react';
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

import { COLORS, FONTS, SPACING, RADIUS } from '../../../theme';
import { Card, Text, EmptyState, AmountDisplay, ProgressBar } from '../../../components/common';
import { DebtModel } from '../../../models/DebtModel';
import { formatCurrency } from '../../../utils/currency';
import { isOverdue } from '../../../utils/date';

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
  onPress: () => void;
}

function DebtItem({ item, onPress }: DebtItemProps) {
  const remaining = item.monthlyInstallment * item.remainingMonth;
  const totalPaid = item.totalAmount - remaining;
  const progress = item.totalAmount > 0 ? Math.min((totalPaid / item.totalAmount) * 100, 100) : 0;
  const overdue = isOverdue(item.dueDate) && item.remainingMonth > 0;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <View style={styles.itemHeaderLeft}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemLender}>{item.lender}</Text>
        </View>
        <View style={[styles.statusBadge, overdue ? styles.statusOverdue : styles.statusLancar]}>
          <Text style={[styles.statusText, overdue ? styles.statusTextOverdue : styles.statusTextLancar]}>
            {overdue ? 'JATUH TEMPO' : 'LANCAR'}
          </Text>
        </View>
      </View>

      <ProgressBar
        progress={progress}
        color={overdue ? COLORS.danger : COLORS.debt}
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
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function DebtListScreen() {
  const navigation = useNavigation<NavProp>();
  const allDebts = useQuery(DebtModel).filtered('isActive == true').sorted('createdAt', true);

  const summary = useMemo(() => {
    let totalRemaining = 0;
    let totalMonthly = 0;
    for (const d of allDebts) {
      totalRemaining += d.monthlyInstallment * d.remainingMonth;
      totalMonthly += d.monthlyInstallment;
    }
    return { totalRemaining, totalMonthly, count: allDebts.length };
  }, [allDebts]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<DebtModel>) => (
      <DebtItem
        item={item}
        onPress={() => navigation.navigate('DebtDetail', { id: item._id.toHexString() })}
      />
    ),
    [navigation],
  );

  const keyExtractor = useCallback((item: DebtModel) => item._id.toHexString(), []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Hutang</Text>
          <Text style={styles.headerSubtitle}>Kelola cicilan hutangmu</Text>
        </View>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryWrapper}>
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Hutang</Text>
              <AmountDisplay amount={summary.totalRemaining} size="lg" style={{ color: COLORS.debt }} />
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Cicilan/Bln</Text>
              <AmountDisplay amount={summary.totalMonthly} size="lg" style={{ color: COLORS.warning }} />
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
        ListEmptyComponent={
          <EmptyState
            emoji="🏦"
            title="Belum ada hutang"
            subtitle="Tap tombol + untuk mencatat hutang"
          />
        }
      />

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
    backgroundColor: COLORS.background,
  },
  header: {
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
    fontSize: FONTS.lg,
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
  progressBar: {
    marginBottom: SPACING.md,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
});
