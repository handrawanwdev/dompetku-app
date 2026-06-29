import React, { useMemo } from 'react';
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
import { EmptyState } from '../../../components/common/EmptyState';
import { InvestmentModel } from '../../../models/InvestmentModel';
import { formatCurrency, formatCompact } from '../../../utils/currency';
import { calcROI, calcProfitLoss } from '../../../utils/finance';
import { formatDate } from '../../../utils/date';

export type InvestmentStackParamList = {
  InvestmentList: undefined;
  InvestmentForm: { id?: string };
};

const TYPE_EMOJIS: Record<string, string> = {
  stock: '📊',
  crypto: '🪙',
  gold: '🥇',
  mutual_fund: '📈',
  bond: '📜',
  property: '🏘️',
};

const TYPE_LABELS: Record<string, string> = {
  stock: 'Saham',
  crypto: 'Kripto',
  gold: 'Emas',
  mutual_fund: 'Reksa Dana',
  bond: 'Obligasi',
  property: 'Properti',
};

export function InvestmentListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<InvestmentStackParamList>>();
  const investments = useQuery(InvestmentModel);

  const summary = useMemo(() => {
    const totalInvested = investments.reduce((s, i) => s + i.buyPrice * i.quantity, 0);
    const totalCurrent = investments.reduce((s, i) => s + i.currentPrice * i.quantity, 0);
    const totalPL = totalCurrent - totalInvested;
    const overallROI = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0;
    return { totalInvested, totalCurrent, totalPL, overallROI };
  }, [investments]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Investasi</Text>
        <Text style={[styles.totalValue, { color: COLORS.investment }]}>
          {formatCompact(summary.totalCurrent)}
        </Text>
      </View>

      {/* Summary */}
      <Card style={styles.summaryCard} padding={SPACING.lg}>
        <View style={styles.summaryRow}>
          <SummaryCol label="Modal" value={formatCompact(summary.totalInvested)} color={COLORS.text} />
          <SummaryCol label="Nilai Saat Ini" value={formatCompact(summary.totalCurrent)} color={COLORS.investment} />
          <SummaryCol
            label="P&L"
            value={(summary.totalPL >= 0 ? '+' : '') + formatCompact(summary.totalPL)}
            color={summary.totalPL >= 0 ? COLORS.income : COLORS.expense}
          />
          <SummaryCol
            label="ROI"
            value={`${summary.overallROI >= 0 ? '+' : ''}${summary.overallROI.toFixed(1)}%`}
            color={summary.overallROI >= 0 ? COLORS.income : COLORS.expense}
          />
        </View>
      </Card>

      <FlatList
        data={[...investments]}
        keyExtractor={i => i._id.toHexString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const pl = calcProfitLoss(item.buyPrice, item.currentPrice, item.quantity);
          const roi = calcROI(item.buyPrice, item.currentPrice, item.quantity);
          const currentValue = item.currentPrice * item.quantity;
          return (
            <TouchableOpacity
              onPress={() => navigation.navigate('InvestmentForm', { id: item._id.toHexString() })}
              activeOpacity={0.7}
            >
              <Card style={styles.investCard} padding={SPACING.md}>
                <View style={styles.investHeader}>
                  <View style={styles.typeTag}>
                    <Text style={styles.typeEmoji}>{TYPE_EMOJIS[item.type] ?? '📊'}</Text>
                    <Text style={styles.typeLabel}>{TYPE_LABELS[item.type] ?? item.type}</Text>
                  </View>
                  <View style={[styles.plBadge, { backgroundColor: (pl >= 0 ? COLORS.income : COLORS.expense) + '22' }]}>
                    <Text style={[styles.plText, { color: pl >= 0 ? COLORS.income : COLORS.expense }]}>
                      {pl >= 0 ? '+' : ''}{roi.toFixed(1)}%
                    </Text>
                  </View>
                </View>
                <Text style={styles.investName}>{item.name}</Text>
                <View style={styles.investDetails}>
                  <View>
                    <Text style={styles.detailLabel}>Qty × Harga Beli</Text>
                    <Text style={styles.detailValue}>{item.quantity} × {formatCompact(item.buyPrice)}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.detailLabel}>Nilai Saat Ini</Text>
                    <Text style={[styles.detailValue, { color: COLORS.investment }]}>{formatCurrency(currentValue)}</Text>
                  </View>
                </View>
                <View style={styles.plRow}>
                  <Text style={styles.plLabel}>P&L</Text>
                  <Text style={[styles.plValue, { color: pl >= 0 ? COLORS.income : COLORS.expense }]}>
                    {pl >= 0 ? '+' : ''}{formatCurrency(pl)}
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<EmptyState emoji="📈" title="Belum ada investasi" subtitle="Tap + untuk menambah portfolio investasi" />}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('InvestmentForm', {})}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function SummaryCol({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <Text style={{ fontSize: FONTS.xs, color: COLORS.textMuted }}>{label}</Text>
      <Text style={{ fontSize: FONTS.sm, fontWeight: '700', color, marginTop: 2 }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, paddingBottom: SPACING.md },
  title: { fontSize: FONTS.xxl, fontWeight: '700', color: COLORS.text },
  totalValue: { fontSize: FONTS.xl, fontWeight: '800' },
  summaryCard: { marginHorizontal: SPACING.lg, marginBottom: SPACING.md },
  summaryRow: { flexDirection: 'row' },
  listContent: { padding: SPACING.lg, paddingBottom: 100, flexGrow: 1 },
  investCard: { marginBottom: SPACING.sm },
  investHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  typeTag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  typeEmoji: { fontSize: 16 },
  typeLabel: { fontSize: FONTS.xs, color: COLORS.textMuted, fontWeight: '500' },
  plBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: RADIUS.round },
  plText: { fontSize: FONTS.xs, fontWeight: '700' },
  investName: { fontSize: FONTS.md, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
  investDetails: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xs },
  detailLabel: { fontSize: FONTS.xs, color: COLORS.textMuted },
  detailValue: { fontSize: FONTS.sm, fontWeight: '600', color: COLORS.text, marginTop: 2 },
  plRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: SPACING.sm, marginTop: SPACING.xs },
  plLabel: { fontSize: FONTS.sm, color: COLORS.textSecondary },
  plValue: { fontSize: FONTS.sm, fontWeight: '700' },
  fab: { position: 'absolute', bottom: SPACING.xxl, right: SPACING.xl, width: 56, height: 56, borderRadius: RADIUS.round, backgroundColor: COLORS.investment, alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  fabIcon: { fontSize: 28, color: '#fff', lineHeight: 32, fontWeight: '400' },
});
