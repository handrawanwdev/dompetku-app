import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useQuery } from '@realm/react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { COLORS, FONTS, SPACING, RADIUS } from '../../../theme';
import { Card } from '../../../components/common/Card';
import { ProgressBar } from '../../../components/common/ProgressBar';
import { EmptyState } from '../../../components/common/EmptyState';
import { GoalModel } from '../../../models/GoalModel';
import { SavingModel } from '../../../models/SavingModel';
import { formatCurrency, formatCompact } from '../../../utils/currency';
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

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <Text style={styles.title}>Financial Goals</Text>
        <Text style={styles.count}>{goals.length} goal</Text>
      </View>

      <FlatList
        data={[...goals]}
        keyExtractor={g => g._id.toHexString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const balance = getSavingBalance(item.savingId);
          const progress = calcGoalProgress(balance, item.target);
          const remaining = Math.max(item.target - balance, 0);
          const isAchieved = balance >= item.target;
          return (
            <TouchableOpacity onPress={() => navigation.navigate('GoalForm', { id: item._id.toHexString() })} activeOpacity={0.7}>
              <Card style={styles.goalCard} padding={SPACING.lg}>
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
              </Card>
            </TouchableOpacity>
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

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('GoalForm', {})}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, paddingBottom: SPACING.md },
  title: { fontSize: FONTS.xxl, fontWeight: '700', color: COLORS.text },
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
  fab: { position: 'absolute', bottom: SPACING.xxl, right: SPACING.xl, width: 56, height: 56, borderRadius: RADIUS.round, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  fabIcon: { fontSize: 28, color: '#fff', lineHeight: 32, fontWeight: '400' },
});
