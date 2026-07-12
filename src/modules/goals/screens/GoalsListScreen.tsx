import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
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
import { GoalModel } from '../../../models/GoalModel';
import { SavingModel } from '../../../models/SavingModel';
import { formatCurrency } from '../../../utils/currency';
import { formatDate } from '../../../utils/date';
import { calcGoalProgress } from '../../../utils/finance';

export type GoalsStackParamList = {
  GoalsList: undefined;
  GoalForm: { id?: string };
};

export function GoalsListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<GoalsStackParamList>>();
  const goals = useQuery(GoalModel);
  const savings = useQuery(SavingModel);

  const getSavingBalance = (savingId: string): number => {
    const saving = savings.find(s => s._id.toHexString() === savingId);
    return saving?.balance ?? 0;
  };

  const getSavingName = (savingId: string): string => {
    const saving = savings.find(s => s._id.toHexString() === savingId);
    return saving?.name ?? '-';
  };

  const getProgressAmount = (goal: GoalModel): number => getSavingBalance(goal.savingId);

  const goToSaving = (savingId: string) => {
    (navigation as any).navigate('Assets', {
      screen: 'SavingsTab',
      params: { screen: 'SavingsDetail', params: { id: savingId } },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} color={COLORS.text} />
        <Text style={styles.count}>{goals.length} goal</Text>
      </View>

      <FlatList
        data={[...goals]}
        keyExtractor={g => g._id.toHexString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const balance = getProgressAmount(item);
          const progress = calcGoalProgress(balance, item.target);
          const remaining = Math.max(item.target - balance, 0);
          const isAchieved = balance >= item.target;
          return (
            <Card style={styles.goalCard} padding={SPACING.lg}>
              <TouchableOpacity onPress={() => navigation.navigate('GoalForm', { id: item._id.toHexString() })} activeOpacity={0.7}>
                <View style={styles.goalHeader}>
                  <Text style={styles.goalEmoji}>{item.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.goalName}>{item.name}</Text>
                    <Text style={styles.goalSaving}>📦 {getSavingName(item.savingId)}</Text>
                  </View>
                  {isAchieved ? (
                    <View style={styles.achievedBadge}>
                      <Text style={styles.achievedText}>✅ Tercapai</Text>
                    </View>
                  ) : (
                    <Text style={styles.goalPercent}>{progress.toFixed(0)}%</Text>
                  )}
                </View>

                <ProgressBar
                  progress={progress}
                  color={isAchieved ? COLORS.income : COLORS.primary}
                  style={{ marginVertical: SPACING.sm }}
                />

                <View style={styles.goalAmounts}>
                  <View>
                    <Text style={styles.amountLabel}>Terkumpul</Text>
                    <Text style={[styles.amountValue, { color: COLORS.primary }]}>{formatCurrency(balance)}</Text>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={styles.amountLabel}>Target</Text>
                    <Text style={styles.amountValue}>{formatCurrency(item.target)}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.amountLabel}>Sisa</Text>
                    <Text style={[styles.amountValue, { color: COLORS.expense }]}>{formatCurrency(remaining)}</Text>
                  </View>
                </View>

                <View style={styles.deadlineRow}>
                  <Text style={styles.deadlineLabel}>🎯 Deadline:</Text>
                  <Text style={styles.deadlineDate}>{formatDate(item.deadline)}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.setorBtn} onPress={() => goToSaving(item.savingId)}>
                <Text style={styles.setorBtnText}>Setor via Tabungan</Text>
              </TouchableOpacity>
            </Card>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            emoji="🎯"
            title="Belum ada goals"
            subtitle="Tap + untuk membuat financial goal pertama kamu"
          />
        }
      />

      <FAB color={COLORS.primary} onPress={() => navigation.navigate('GoalForm', {})} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, paddingBottom: SPACING.md },
  count: { fontSize: FONTS.sm, color: COLORS.textSecondary },
  listContent: { padding: SPACING.lg, paddingBottom: 100, flexGrow: 1 },
  goalCard: { marginBottom: SPACING.sm },
  goalHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.xs },
  goalEmoji: { fontSize: 32 },
  goalName: { fontSize: FONTS.md, fontWeight: '700', color: COLORS.text },
  goalSaving: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 2 },
  goalPercent: { fontSize: FONTS.xl, fontWeight: '800', color: COLORS.primary },
  achievedBadge: { backgroundColor: COLORS.income + '22', paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: RADIUS.sm },
  achievedText: { fontSize: FONTS.xs, color: COLORS.income, fontWeight: '600' },
  goalAmounts: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  amountLabel: { fontSize: FONTS.xs, color: COLORS.textMuted },
  amountValue: { fontSize: FONTS.sm, fontWeight: '700', color: COLORS.text, marginTop: 2 },
  deadlineRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: SPACING.sm },
  deadlineLabel: { fontSize: FONTS.xs, color: COLORS.textMuted },
  deadlineDate: { fontSize: FONTS.sm, color: COLORS.warning, fontWeight: '600' },

  setorBtn: {
    marginTop: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
  },
  setorBtnText: { fontSize: FONTS.sm, fontWeight: '700', color: COLORS.primary },
});
