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
import dayjs from 'dayjs';

import { COLORS, FONTS, SPACING, RADIUS } from '../../../theme';
import { Card } from '../../../components/common/Card';
import { EmptyState } from '../../../components/common/EmptyState';
import { FAB } from '../../../components/common/FAB';
import { PhysicalAssetModel } from '../../../models/PhysicalAssetModel';
import { formatCurrency, formatCompact } from '../../../utils/currency';
import { calcDepreciation } from '../../../utils/finance';
import { formatDate } from '../../../utils/date';

export type AssetsStackParamList = {
  PhysicalAssetList: undefined;
  PhysicalAssetForm: { id?: string };
  PhysicalAssetSell: { id: string };
};

const CATEGORY_EMOJIS: Record<string, string> = {
  laptop: '💻',
  phone: '📱',
  vehicle: '🚗',
  house: '🏠',
  electronics: '🔌',
  furniture: '🛋️',
  other: '📦',
};

const CATEGORY_LABELS: Record<string, string> = {
  laptop: 'Laptop',
  phone: 'HP',
  vehicle: 'Kendaraan',
  house: 'Rumah',
  electronics: 'Elektronik',
  furniture: 'Furnitur',
  other: 'Lainnya',
};

export function PhysicalAssetListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AssetsStackParamList>>();
  const allAssets = useQuery(PhysicalAssetModel);

  const assets = useMemo(() => allAssets.filtered('sold == false'), [allAssets]);
  const soldAssets = useMemo(() => allAssets.filtered('sold == true').sorted('sellDate', true), [allAssets]);

  const totalCurrentValue = useMemo(() =>
    assets.reduce((s, a) => s + calcDepreciation(a.purchasePrice, a.residualValue, a.usefulLife, a.purchaseDate), 0),
    [assets]
  );

  const totalPurchaseValue = useMemo(() =>
    assets.reduce((s, a) => s + a.purchasePrice, 0),
    [assets]
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.totalLabel}>Nilai Aset Fisik</Text>
        <Text style={[styles.totalValue, { color: COLORS.asset }]}>
          {formatCompact(totalCurrentValue)}
        </Text>
      </View>

      {/* Summary */}
      <Card style={styles.summaryCard} padding={SPACING.lg}>
        <View style={styles.summaryRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.summaryLabel}>Harga Beli Total</Text>
            <Text style={styles.summaryValue}>{formatCurrency(totalPurchaseValue)}</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text style={styles.summaryLabel}>Nilai Sekarang</Text>
            <Text style={[styles.summaryValue, { color: COLORS.asset }]}>{formatCurrency(totalCurrentValue)}</Text>
          </View>
        </View>
        <View style={styles.depRow}>
          <Text style={styles.depLabel}>Total Penyusutan</Text>
          <Text style={[styles.depValue, { color: COLORS.expense }]}>
            -{formatCurrency(totalPurchaseValue - totalCurrentValue)}
          </Text>
        </View>
      </Card>

      <FlatList
        data={[...assets]}
        keyExtractor={a => a._id.toHexString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const currentValue = calcDepreciation(item.purchasePrice, item.residualValue, item.usefulLife, item.purchaseDate);
          const depreciation = item.purchasePrice - currentValue;
          const ageYears = dayjs().diff(dayjs(item.purchaseDate), 'year', true).toFixed(1);
          return (
            <Card style={styles.assetCard} padding={SPACING.md}>
              <TouchableOpacity
                onPress={() => navigation.navigate('PhysicalAssetForm', { id: item._id.toHexString() })}
                activeOpacity={0.7}
              >
                <View style={styles.assetHeader}>
                  <View style={styles.assetIcon}>
                    <Text style={{ fontSize: 28 }}>{CATEGORY_EMOJIS[item.category] ?? '📦'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.assetName}>{item.name}</Text>
                    <Text style={styles.assetCategory}>{CATEGORY_LABELS[item.category] ?? item.category}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.assetCurrentValue, { color: COLORS.asset }]}>{formatCurrency(currentValue)}</Text>
                    <Text style={styles.assetAge}>{ageYears} tahun</Text>
                  </View>
                </View>
                <View style={styles.assetDetails}>
                  <DetailItem label="Harga Beli" value={formatCurrency(item.purchasePrice)} />
                  <DetailItem label="Penyusutan" value={formatCurrency(depreciation)} color={COLORS.expense} />
                  <DetailItem label="Sisa Manfaat" value={`${Math.max(0, item.usefulLife - parseFloat(ageYears)).toFixed(0)} th`} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sellBtn} onPress={() => navigation.navigate('PhysicalAssetSell', { id: item._id.toHexString() })}>
                <Text style={styles.sellBtnText}>💸 Jual</Text>
              </TouchableOpacity>
            </Card>
          );
        }}
        ListEmptyComponent={<EmptyState emoji="🏠" title="Belum ada aset fisik" subtitle="Tap + untuk mencatat aset fisik kamu" />}
        ListFooterComponent={
          soldAssets.length > 0 ? (
            <View style={styles.soldSection}>
              <Text style={styles.soldTitle}>Riwayat Terjual</Text>
              {soldAssets.map((item) => {
                const realizedPL = item.sellPrice - item.purchasePrice;
                return (
                  <View key={item._id.toHexString()} style={styles.soldRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.soldName}>{CATEGORY_EMOJIS[item.category] ?? '📦'} {item.name}</Text>
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

      <FAB color={COLORS.asset} onPress={() => navigation.navigate('PhysicalAssetForm', {})} />
    </SafeAreaView>
  );
}

function DetailItem({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: FONTS.xs, color: COLORS.textMuted }}>{label}</Text>
      <Text style={{ fontSize: FONTS.sm, fontWeight: '600', color: color ?? COLORS.text, marginTop: 2 }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, paddingBottom: SPACING.md },
  totalLabel: { fontSize: FONTS.sm, fontWeight: '600', color: COLORS.textSecondary },
  totalValue: { fontSize: FONTS.xl, fontWeight: '800' },
  summaryCard: { marginHorizontal: SPACING.lg, marginBottom: SPACING.md },
  summaryRow: { flexDirection: 'row', marginBottom: SPACING.sm },
  summaryLabel: { fontSize: FONTS.xs, color: COLORS.textMuted },
  summaryValue: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text, marginTop: 2 },
  depRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.border },
  depLabel: { fontSize: FONTS.sm, color: COLORS.textSecondary },
  depValue: { fontSize: FONTS.sm, fontWeight: '600' },
  listContent: { padding: SPACING.lg, paddingBottom: 100, flexGrow: 1 },
  assetCard: { marginBottom: SPACING.sm },
  assetHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.md },
  assetIcon: { width: 48, height: 48, borderRadius: RADIUS.md, backgroundColor: COLORS.asset + '22', alignItems: 'center', justifyContent: 'center' },
  assetName: { fontSize: FONTS.md, fontWeight: '700', color: COLORS.text },
  assetCategory: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 2 },
  assetCurrentValue: { fontSize: FONTS.md, fontWeight: '700' },
  assetAge: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 2 },
  assetDetails: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: SPACING.sm },
  sellBtn: {
    marginTop: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.asset,
    alignItems: 'center',
  },
  sellBtnText: { fontSize: FONTS.sm, fontWeight: '700', color: COLORS.asset },

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
