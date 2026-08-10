import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Realm from 'realm';
import { useQuery, useObject } from '@realm/react';

import { SavingModel, SavingHistoryModel } from '../../../models';
import { COLORS, FONTS, SPACING, RADIUS } from '../../../theme';
import { formatCurrency } from '../../../utils/currency';
import { formatDate } from '../../../utils/date';
import { calcGoalProgress } from '../../../utils/finance';
import { ProgressBar } from '../../../components/common/ProgressBar';
import { EmptyState } from '../../../components/common/EmptyState';
import { BackButton } from '../../../components/common/BackButton';

import type { SavingsStackParamList } from './SavingsListScreen';

type Props = NativeStackScreenProps<SavingsStackParamList, 'SavingsDetail'>;
type ModalType = 'deposit' | 'withdraw' | 'transfer';

const TYPE_LABEL: Record<string, string> = {
  deposit: 'Setor',
  withdraw: 'Tarik',
  transfer: 'Transfer',
};

const TYPE_COLOR: Record<string, string> = {
  deposit: COLORS.income,
  withdraw: COLORS.expense,
  transfer: COLORS.warning,
};

export function SavingsDetailScreen({ navigation, route }: Props) {
  const { id } = route.params;

  // useObject gives reactive updates when saving changes
  const saving = useObject(SavingModel, new Realm.BSON.ObjectId(id));
  const history = useQuery(
    SavingHistoryModel,
    objs => objs.filtered('savingId == $0', id).sorted('date', true),
    [id],
  );
  if (!saving) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} color={COLORS.text} />
        </View>
        <EmptyState emoji="🏦" title="Tabungan tidak ditemukan" />
      </SafeAreaView>
    );
  }

  const progress = calcGoalProgress(saving.balance, saving.target);
  const remaining = Math.max(saving.target - saving.balance, 0);

  const openMove = (type: ModalType) => {
    navigation.navigate('SavingsMove', { id, type });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={[...history]}
        keyExtractor={item => item._id.toHexString()}
        contentContainerStyle={[styles.list, history.length === 0 && styles.listEmpty]}
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <BackButton onPress={() => navigation.goBack()} color={COLORS.text} />
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => navigation.navigate('SavingsForm', { id })}
              >
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>

            {/* Summary Card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <View>
                  <Text style={styles.summaryLabel}>Saldo Saat Ini</Text>
                  <Text style={styles.summaryBalance}>{formatCurrency(saving.balance)}</Text>
                </View>
                <View style={styles.summaryRight}>
                  <Text style={styles.summaryLabel}>Progress</Text>
                  <Text
                    style={[styles.summaryPct, progress >= 100 && styles.summaryPctDone]}
                  >
                    {progress.toFixed(1)}%
                  </Text>
                </View>
              </View>

              <ProgressBar
                progress={progress}
                color={progress >= 100 ? COLORS.income : COLORS.savings}
                height={8}
                style={styles.progressBar}
              />

              <View style={styles.targetRow}>
                <Text style={styles.targetLabel}>Target: {formatCurrency(saving.target)}</Text>
                {remaining > 0 && (
                  <Text style={styles.remainLabel}>Sisa: {formatCurrency(remaining)}</Text>
                )}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.actionDeposit]}
                onPress={() => openMove('deposit')}
                activeOpacity={0.75}
              >
                <Text style={styles.actionIcon}>⬆️</Text>
                <Text style={[styles.actionLabel, { color: COLORS.income }]}>Setor</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.actionWithdraw]}
                onPress={() => openMove('withdraw')}
                activeOpacity={0.75}
              >
                <Text style={styles.actionIcon}>⬇️</Text>
                <Text style={[styles.actionLabel, { color: COLORS.expense }]}>Tarik</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.actionTransfer]}
                onPress={() => openMove('transfer')}
                activeOpacity={0.75}
              >
                <Text style={styles.actionIcon}>↔️</Text>
                <Text style={[styles.actionLabel, { color: COLORS.warning }]}>Transfer</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.historyTitle}>Riwayat Transaksi</Text>
          </>
        }
        ListEmptyComponent={
          <EmptyState
            emoji="📋"
            title="Belum ada transaksi"
            subtitle="Mulai setor untuk mencatat riwayat"
          />
        }
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <View
              style={[
                styles.typeBadge,
                { backgroundColor: (TYPE_COLOR[item.type] ?? COLORS.primary) + '22' },
              ]}
            >
              <Text
                style={[
                  styles.typeText,
                  { color: TYPE_COLOR[item.type] ?? COLORS.primary },
                ]}
              >
                {TYPE_LABEL[item.type] ?? item.type}
              </Text>
            </View>
            <View style={styles.historyInfo}>
              <Text style={styles.historyDate}>{formatDate(item.date)}</Text>
              {!!item.note && (
                <Text style={styles.historyNote} numberOfLines={1}>
                  {item.note}
                </Text>
              )}
            </View>
            <Text
              style={[
                styles.historyAmount,
                {
                  color:
                    item.type === 'deposit'
                      ? COLORS.income
                      : item.type === 'withdraw'
                        ? COLORS.expense
                        : COLORS.warning,
                },
              ]}
            >
              {item.type === 'withdraw' ? '-' : '+'}
              {formatCurrency(item.amount)}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    paddingBottom: SPACING.xxxl,
  },
  listEmpty: {
    flexGrow: 1,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  editBtn: { paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs },
  editText: { fontSize: FONTS.md, color: COLORS.primary, fontWeight: '500' },
  // Summary
  summaryCard: {
    margin: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  summaryRight: { alignItems: 'flex-end' },
  summaryLabel: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  summaryBalance: { fontSize: FONTS.xxl, fontWeight: '700', color: COLORS.text },
  summaryPct: { fontSize: FONTS.xl, fontWeight: '700', color: COLORS.savings },
  summaryPctDone: { color: COLORS.income },
  progressBar: { marginBottom: SPACING.sm },
  targetRow: { flexDirection: 'row', justifyContent: 'space-between' },
  targetLabel: { fontSize: FONTS.sm, color: COLORS.textSecondary },
  remainLabel: { fontSize: FONTS.sm, color: COLORS.warning },
  // Actions
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionDeposit: { backgroundColor: COLORS.income + '18' },
  actionWithdraw: { backgroundColor: COLORS.expense + '18' },
  actionTransfer: { backgroundColor: COLORS.warning + '18' },
  actionIcon: { fontSize: 20, marginBottom: SPACING.xs },
  actionLabel: { fontSize: FONTS.sm, fontWeight: '600' },
  historyTitle: {
    fontSize: FONTS.lg,
    fontWeight: '600',
    color: COLORS.text,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  // History Item
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  typeBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    marginRight: SPACING.md,
    minWidth: 62,
    alignItems: 'center',
  },
  typeText: { fontSize: FONTS.xs, fontWeight: '600' },
  historyInfo: { flex: 1 },
  historyDate: { fontSize: FONTS.sm, color: COLORS.textSecondary },
  historyNote: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 2 },
  historyAmount: { fontSize: FONTS.md, fontWeight: '600' },
});
