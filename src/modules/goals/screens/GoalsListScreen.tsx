import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useRealm } from '@realm/react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { COLORS, FONTS, SPACING, RADIUS } from '../../../theme';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { ProgressBar } from '../../../components/common/ProgressBar';
import { EmptyState } from '../../../components/common/EmptyState';
import { CurrencyInput } from '../../../components/common/CurrencyInput';
import { FAB } from '../../../components/common/FAB';
import { GoalModel } from '../../../models/GoalModel';
import { SavingModel } from '../../../models/SavingModel';
import { formatCurrency, formatCompact, parseCurrency } from '../../../utils/currency';
import { formatDate } from '../../../utils/date';
import { calcGoalProgress } from '../../../utils/finance';

export type GoalsStackParamList = {
  GoalsList: undefined;
  GoalForm: { id?: string };
};

export function GoalsListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<GoalsStackParamList>>();
  const realm = useRealm();
  const goals = useQuery(GoalModel);
  const savings = useQuery(SavingModel);

  const [setorTarget, setSetorTarget] = useState<GoalModel | null>(null);
  const [setorInput, setSetorInput] = useState('');

  const getSavingBalance = (savingId: string): number => {
    const saving = savings.find(s => s._id.toHexString() === savingId);
    return saving?.balance ?? 0;
  };

  const getSavingName = (savingId: string): string => {
    const saving = savings.find(s => s._id.toHexString() === savingId);
    return saving?.name ?? '-';
  };

  const getProgressAmount = (goal: GoalModel): number =>
    goal.savingId ? getSavingBalance(goal.savingId) : goal.manualAmount;

  const openSetorModal = (goal: GoalModel) => {
    setSetorTarget(goal);
    setSetorInput('');
  };

  const closeSetorModal = () => setSetorTarget(null);

  const confirmSetor = () => {
    if (!setorTarget) return;
    const amt = parseCurrency(setorInput);
    if (!amt || amt <= 0) {
      Alert.alert('Validasi', 'Isi nominal setoran');
      return;
    }
    realm.write(() => {
      setorTarget.manualAmount = (setorTarget.manualAmount ?? 0) + amt;
    });
    closeSetorModal();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
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
          const isLinked = !!item.savingId;
          return (
            <Card style={styles.goalCard} padding={SPACING.lg}>
              <TouchableOpacity onPress={() => navigation.navigate('GoalForm', { id: item._id.toHexString() })} activeOpacity={0.7}>
                <View style={styles.goalHeader}>
                  <Text style={styles.goalEmoji}>{item.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.goalName}>{item.name}</Text>
                    <Text style={styles.goalSaving}>
                      {isLinked ? `📦 ${getSavingName(item.savingId)}` : '✏️ Manual'}
                    </Text>
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

              {!isLinked && (
                <TouchableOpacity style={styles.setorBtn} onPress={() => openSetorModal(item)}>
                  <Text style={styles.setorBtnText}>+ Setor</Text>
                </TouchableOpacity>
              )}
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

      {/* Setor Modal (manual/unlinked goals) */}
      <Modal visible={!!setorTarget} transparent animationType="slide" onRequestClose={closeSetorModal}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity style={styles.modalBackdrop} onPress={closeSetorModal} activeOpacity={1} />
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>+ Setor Goal</Text>
            {setorTarget && (
              <>
                <Text style={styles.modalGoalName}>{setorTarget.emoji} {setorTarget.name}</Text>
                <Text style={styles.fieldLabel}>Nominal Setoran</Text>
                <CurrencyInput
                  value={setorInput}
                  onChangeText={setSetorInput}
                />
                <View style={styles.modalActions}>
                  <Button title="Batal" onPress={closeSetorModal} variant="secondary" style={styles.modalBtnHalf} />
                  <Button title="Setor" onPress={confirmSetor} style={styles.modalBtnHalf} />
                </View>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', padding: SPACING.lg, paddingBottom: SPACING.md },
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

  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)' },
  modalSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  modalTitle: { fontSize: FONTS.xl, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  modalGoalName: { fontSize: FONTS.md, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.md },
  fieldLabel: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginBottom: SPACING.xs, fontWeight: '500' },
  input: {
    backgroundColor: COLORS.inputBg, borderRadius: RADIUS.md, borderWidth: 1.5,
    borderColor: COLORS.border, padding: SPACING.md, color: COLORS.text, fontSize: FONTS.md,
  },
  modalActions: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.lg },
  modalBtnHalf: { flex: 1 },
});
