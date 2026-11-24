import React, { useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

import { COLORS, FONTS, ICON_SIZES, SPACING, RADIUS, SHADOWS } from '../../../theme';
import { Text, EmptyState, ProgressBar, FAB, BackButton } from '../../../components/common';
import { formatCurrency } from '../../../utils/currency';
import { formatDate } from '../../../utils/date';
import { goalStatus, type GoalInfo } from '../../../services/GoalService';
import { useAccounts } from '../../finance/useAccounts';
import { useGoals } from '../useGoals';
import type { GoalStackParamList } from '../types';

type NavProp = NativeStackNavigationProp<GoalStackParamList>;

export function GoalItem({ info, onPress }: { info: GoalInfo; onPress: () => void }) {
  const { goal } = info;
  const status = goalStatus(info);
  const sub = info.done
    ? `Tercapai ${formatDate(goal.doneAt || new Date())}`
    : [
        `Kurang ${formatCurrency(info.remaining)}`,
        info.perMonth ? `${formatCurrency(Math.ceil(info.perMonth))}/bln` : null,
        goal.deadline ? `s.d. ${formatDate(goal.deadline, 'MMM YYYY')}` : null,
      ].filter(Boolean).join(' · ');

  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.itemHead}>
        <View style={styles.itemIcon}>
          <MaterialIcons name={goal.icon as keyof typeof MaterialIcons.glyphMap} size={ICON_SIZES.md} color={COLORS.saving} />
        </View>
        <Text style={styles.itemName} numberOfLines={1}>{goal.name}</Text>
        {status && (
          <View style={[styles.badge, { backgroundColor: status.bg }]}>
            <Text style={[styles.badgeText, { color: status.color }]}>{status.label}</Text>
          </View>
        )}
      </View>
      <Text style={styles.itemAmount}>
        {formatCurrency(Math.max(info.saved, 0))}
        <Text style={styles.itemTarget}> / {formatCurrency(goal.target)}</Text>
      </Text>
      <ProgressBar progress={info.progress} color={COLORS.saving} style={{ marginTop: SPACING.sm }} />
      <Text style={styles.itemSub} numberOfLines={1}>{sub}</Text>
    </TouchableOpacity>
  );
}

export function GoalListScreen() {
  const navigation = useNavigation<NavProp>();
  const goals = useGoals();
  const savingsBalance = useAccounts().totals.savings;

  const active = goals.filter((g) => !g.done);
  const done = goals.filter((g) => g.done);

  const summary = useMemo(() => {
    const allocated = goals.reduce((s, g) => s + Math.max(g.saved, 0), 0);
    return {
      saved: active.reduce((s, g) => s + Math.max(g.saved, 0), 0),
      target: active.reduce((s, g) => s + g.goal.target, 0),
      over: allocated - savingsBalance,
    };
  }, [goals, active, savingsBalance]);

  const open = (id: string) => navigation.navigate('GoalDetail', { id });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Goal</Text>
      </View>
      {goals.length === 0 ? (
        <EmptyState
          emoji="🎯"
          title="Belum ada goal"
          subtitle="Buat target seperti dana darurat, liburan, atau DP rumah. Progresnya terisi dari setoran Tabungan."
        />
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {active.length > 0 && (
            <View style={styles.summary}>
              <Text style={styles.summaryLabel}>Terkumpul untuk {active.length} goal aktif</Text>
              <Text style={styles.summaryAmount}>{formatCurrency(summary.saved)}</Text>
              <Text style={styles.summarySub}>dari total target {formatCurrency(summary.target)}</Text>
            </View>
          )}

          {summary.over >= 1 && (
            <View style={styles.warn}>
              <MaterialIcons name="error-outline" size={ICON_SIZES.md} color={COLORS.warningText} />
              <Text style={styles.warnText}>
                Dana goal {formatCurrency(summary.over)} lebih besar dari tabungan kamu. Mungkin ada tabungan yang dipakai
                tanpa memilih goal. Catat pemakaiannya dari halaman goal.
              </Text>
            </View>
          )}

          {active.map((g) => (
            <GoalItem key={g.id} info={g} onPress={() => open(g.id)} />
          ))}

          {done.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Sudah tercapai</Text>
              {done.map((g) => (
                <GoalItem key={g.id} info={g} onPress={() => open(g.id)} />
              ))}
            </>
          )}
        </ScrollView>
      )}

      <FAB color={COLORS.primary} onPress={() => navigation.navigate('GoalForm', {})} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  title: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text },
  content: { padding: SPACING.lg, paddingTop: 0, paddingBottom: 120 },
  summary: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  summaryLabel: { fontSize: FONTS.sm, fontWeight: '600', color: COLORS.textSecondary },
  summaryAmount: { fontSize: FONTS.xxl, fontWeight: '800', color: COLORS.text, marginTop: SPACING.xs },
  summarySub: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: SPACING.xs },
  warn: {
    flexDirection: 'row',
    gap: SPACING.sm,
    backgroundColor: COLORS.warningBg,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  warnText: { flex: 1, fontSize: FONTS.sm, color: COLORS.warningText, lineHeight: 18 },
  sectionTitle: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  item: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemHead: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  itemIcon: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.saving + '1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemName: { flex: 1, fontSize: FONTS.md, fontWeight: '700', color: COLORS.text },
  badge: { paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: RADIUS.round },
  badgeText: { fontSize: FONTS.xs, fontWeight: '700' },
  itemAmount: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text, marginTop: SPACING.sm },
  itemTarget: { fontSize: FONTS.sm, fontWeight: '500', color: COLORS.textSecondary },
  itemSub: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: SPACING.sm },
});
