import React, { useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@realm/react';
import { MaterialIcons } from '@expo/vector-icons';

import { COLORS, FONTS, ICON_SIZES, SPACING, RADIUS, SHADOWS } from '../../../theme';
import { Text, Button, ProgressBar, BackButton } from '../../../components/common';
import { ExpenseModel } from '../../../models/ExpenseModel';
import { CategoryModel } from '../../../models/CategoryModel';
import { formatCurrency } from '../../../utils/currency';
import { formatDate } from '../../../utils/date';
import { goalStatus } from '../../../services/GoalService';
import { useAccounts } from '../../finance/useAccounts';
import { useGoals } from '../useGoals';
import type { GoalStackParamList } from '../types';
import { useRootNavigation } from '../../../navigation/types';

type Props = NativeStackScreenProps<GoalStackParamList, 'GoalDetail'>;

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export function GoalDetailScreen({ navigation, route }: Props) {
  const { id } = route.params;
  const rootNav = useRootNavigation();
  const info = useGoals().find((g) => g.id === id);
  const { byId } = useAccounts();
  const rows = useQuery(ExpenseModel, (c) => c.filtered('goalId == $0', id).sorted([['date', true], ['createdAt', true]]), [id]);
  const history = useMemo(() => [...rows], [rows]);
  const savingCategory = useQuery(CategoryModel, (c) => c.filtered('type == "expense" AND kind == "saving"').sorted('createdAt'), [])[0]?.name ?? 'Tabungan';

  if (!info) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  const { goal } = info;
  const status = goalStatus(info);
  const pocket = goal.accountId ? byId(goal.accountId)?.account.name : null;

  const deposit = () => rootNav.navigate('ExpenseForm', { kind: 'saving', category: savingCategory, goalId: id });
  const useFunds = () => rootNav.navigate('ExpenseForm', { goalId: id, fromSavings: true });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title} numberOfLines={1}>{goal.name}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('GoalForm', { id })} hitSlop={8} accessibilityLabel="Ubah">
          <MaterialIcons name="edit" size={ICON_SIZES.lg} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHead}>
            <View style={styles.cardIcon}>
              <MaterialIcons name={goal.icon as keyof typeof MaterialIcons.glyphMap} size={ICON_SIZES.xl} color={COLORS.saving} />
            </View>
            {status && (
              <View style={[styles.badge, { backgroundColor: status.bg }]}>
                <Text style={[styles.badgeText, { color: status.color }]}>{status.label}</Text>
              </View>
            )}
          </View>
          <Text style={styles.cardLabel}>Terkumpul</Text>
          <Text style={styles.cardAmount}>{formatCurrency(Math.max(info.saved, 0))}</Text>
          <ProgressBar progress={info.progress} color={COLORS.saving} height={10} style={{ marginTop: SPACING.md }} />
          <Text style={styles.cardSub}>
            {Math.round(info.progress)}% dari {formatCurrency(goal.target)}
          </Text>
        </View>

        <View style={styles.info}>
          {!info.done && <Row label="Kurang" value={formatCurrency(info.remaining)} />}
          {info.done && goal.doneAt ? <Row label="Tercapai" value={formatDate(goal.doneAt)} /> : null}
          <Row label="Tenggat" value={goal.deadline ? formatDate(goal.deadline) : 'Tanpa tenggat'} />
          {info.perMonth ? (
            <Row label="Setor per bulan" value={`${formatCurrency(Math.ceil(info.perMonth))} · ${info.monthsLeft} bln lagi`} />
          ) : null}
          <Row label="Kantong" value={pocket ?? 'Bebas'} />
          {goal.note ? <Row label="Catatan" value={goal.note} /> : null}
        </View>

        <View style={styles.actions}>
          <Button title="Setor" onPress={deposit} style={styles.actionBtn} />
          {info.saved > 0 && <Button title="Pakai dana" onPress={useFunds} variant="secondary" style={styles.actionBtn} />}
        </View>

        <Text style={styles.sectionTitle}>Riwayat</Text>
        {history.length === 0 ? (
          <Text style={styles.empty}>
            Belum ada setoran. Setor dari sini, atau catat uang keluar jenis Tabungan lalu pilih goal ini.
          </Text>
        ) : (
          history.map((e) => {
            const used = e.source === 'savings';
            return (
              <TouchableOpacity
                key={e._id.toHexString()}
                style={styles.entry}
                onPress={() => rootNav.navigate('ExpenseForm', { id: e._id.toHexString() })}
                activeOpacity={0.7}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.entryTitle}>{used ? `Dipakai · ${e.category}` : 'Setor'}</Text>
                  <Text style={styles.entryMeta} numberOfLines={1}>
                    {formatDate(e.date)}
                    {e.note ? ` · ${e.note}` : ''}
                  </Text>
                </View>
                <Text style={[styles.entryAmount, { color: used ? COLORS.expense : COLORS.income }]}>
                  {used ? '-' : '+'}{formatCurrency(e.amount)}
                </Text>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  title: { flex: 1, fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.sm,
  },
  cardHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.md },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.saving + '1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: { fontSize: FONTS.sm, fontWeight: '600', color: COLORS.textSecondary },
  cardAmount: { fontSize: FONTS.xxl, fontWeight: '800', color: COLORS.text, marginTop: SPACING.xs },
  cardSub: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: SPACING.sm },
  badge: { paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: RADIUS.round },
  badgeText: { fontSize: FONTS.xs, fontWeight: '700' },
  info: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: SPACING.md, paddingVertical: SPACING.md },
  rowLabel: { fontSize: FONTS.sm, color: COLORS.textSecondary },
  rowValue: { flexShrink: 1, fontSize: FONTS.sm, fontWeight: '600', color: COLORS.text, textAlign: 'right' },
  actions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.lg },
  actionBtn: { flex: 1 },
  sectionTitle: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text, marginTop: SPACING.xl, marginBottom: SPACING.sm },
  empty: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: SPACING.xs },
  entry: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  entryTitle: { fontSize: FONTS.md, fontWeight: '600', color: COLORS.text },
  entryMeta: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: 2 },
  entryAmount: { fontSize: FONTS.md, fontWeight: '700' },
});
