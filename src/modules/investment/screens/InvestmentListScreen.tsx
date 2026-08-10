import React, { useMemo } from 'react';
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
import { EmptyState } from '../../../components/common/EmptyState';
import { FAB } from '../../../components/common/FAB';
import { InvestmentModel } from '../../../models/InvestmentModel';
import { formatCurrency, formatCompact } from '../../../utils/currency';
import { calcROI, calcProfitLoss } from '../../../utils/finance';
import { formatDate } from '../../../utils/date';

export type InvestmentStackParamList = {
  InvestmentList: undefined;
  InvestmentForm: { id?: string };
  InvestmentSell: { id: string };
  InvestmentDividend: { id: string };
};

const TYPE_EMOJIS: Record<string, string> = {
  stock: '📊',
  crypto: '🪙',
  gold: '🥇',
  mutual_fund: '💼',
  bond: '🏛️',
  property: '🏘️',
  deposito: '🏦',
  p2p: '🤝',
};

const TYPE_LABELS: Record<string, string> = {
  stock: 'Saham',
  crypto: 'Kripto',
  gold: 'Emas',
  mutual_fund: 'Reksa Dana',
  bond: 'Obligasi',
  property: 'Properti',
  deposito: 'Deposito',
  p2p: 'P2P Lending',
};

export function InvestmentListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<InvestmentStackParamList>>();
  const allInvestments = useQuery(InvestmentModel);

  const activeInvestments = useMemo(() => allInvestments.filtered('sold == false'), [allInvestments]);
  const soldInvestments = useMemo(
    () => allInvestments.filtered('sold == true').sorted('sellDate', true),
    [allInvestments],
  );

  const summary = useMemo(() => {
    const totalInvested = activeInvestments.reduce((s, i) => s + i.buyPrice * i.quantity, 0);
    const totalCurrent = activeInvestments.reduce((s, i) => s + i.currentPrice * i.quantity, 0);
    const totalPL = totalCurrent - totalInvested;
    const overallROI = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0;
    return { totalInvested, totalCurrent, totalPL, overallROI };
  }, [activeInvestments]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.totalLabel}>Total Investasi</Text>
        <Text style={[styles.totalValue, { color: COLORS.investment }]}>
          {formatCompact(summary.totalCurrent)}
        </Text>
      </View>

      {/* Body (light bg, no gaps exposing the dark root behind it) */}
      <View style={styles.body}>
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
        data={[...activeInvestments]}
        keyExtractor={i => i._id.toHexString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const pl = calcProfitLoss(item.buyPrice, item.currentPrice, item.quantity);
          const roi = calcROI(item.buyPrice, item.currentPrice, item.quantity);
          const currentValue = item.currentPrice * item.quantity;
          return (
            <Card style={styles.investCard} padding={SPACING.md}>
              <TouchableOpacity
                onPress={() => navigation.navigate('InvestmentForm', { id: item._id.toHexString() })}
                activeOpacity={0.7}
              >
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
              </TouchableOpacity>
              <View style={styles.actionRow}>
                <TouchableOpacity style={[styles.sellBtn, styles.actionBtnHalf, styles.dividendBtn]} onPress={() => navigation.navigate('InvestmentDividend', { id: item._id.toHexString() })}>
                  <Text style={styles.dividendBtnText}>💰 Dividen</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.sellBtn, styles.actionBtnHalf]} onPress={() => navigation.navigate('InvestmentSell', { id: item._id.toHexString() })}>
                  <Text style={styles.sellBtnText}>💸 Jual</Text>
                </TouchableOpacity>
              </View>
            </Card>
          );
        }}
        ListEmptyComponent={<EmptyState emoji="📈" title="Belum ada investasi" subtitle="Tap + untuk menambah portfolio investasi" />}
        ListFooterComponent={
          soldInvestments.length > 0 ? (
            <View style={styles.soldSection}>
              <Text style={styles.soldTitle}>Riwayat Terjual</Text>
              {soldInvestments.map((item) => {
                const realizedPL = item.sellPrice - item.buyPrice * item.quantity;
                return (
                  <View key={item._id.toHexString()} style={styles.soldRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.soldName}>{TYPE_EMOJIS[item.type] ?? '📊'} {item.name}</Text>
                      <Text style={styles.soldDate}>Terjual {formatDate(item.sellDate)} · {formatCompact(item.sellPrice)}</Text>
                    </View>
                    <Text style={[styles.soldPL, { color: realizedPL >= 0 ? COLORS.income : COLORS.expense }]}>
                      {realizedPL >= 0 ? '+' : ''}{formatCompact(realizedPL)}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : null
        }
      />
      </View>

      <FAB color={COLORS.investment} onPress={() => navigation.navigate('InvestmentForm', {})} />
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
  body: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.background, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.lg },
  totalLabel: { fontSize: FONTS.sm, fontWeight: '600', color: COLORS.textSecondary },
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
  actionRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm },
  actionBtnHalf: { flex: 1, marginTop: 0 },
  sellBtn: {
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.investment,
    alignItems: 'center',
  },
  sellBtnText: { fontSize: FONTS.sm, fontWeight: '700', color: COLORS.investment },
  dividendBtn: { borderColor: COLORS.income },
  dividendBtnText: { fontSize: FONTS.sm, fontWeight: '700', color: COLORS.income },

  soldSection: { marginTop: SPACING.lg },
  soldTitle: {
    fontSize: FONTS.xs, fontWeight: '700', color: COLORS.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: SPACING.sm,
  },
  soldRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  soldName: { fontSize: FONTS.sm, fontWeight: '600', color: COLORS.text },
  soldDate: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 1 },
  soldPL: { fontSize: FONTS.sm, fontWeight: '700' },
});
