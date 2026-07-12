import React, { useMemo, useState } from 'react';
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
import dayjs from 'dayjs';

import { COLORS, FONTS, SPACING, RADIUS } from '../../../theme';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { EmptyState } from '../../../components/common/EmptyState';
import { CurrencyInput } from '../../../components/common/CurrencyInput';
import { FAB } from '../../../components/common/FAB';
import { PhysicalAssetModel } from '../../../models/PhysicalAssetModel';
import { SavingModel } from '../../../models/SavingModel';
import { formatCurrency, formatCompact, parseCurrency } from '../../../utils/currency';
import { calcDepreciation } from '../../../utils/finance';
import { formatDate, today } from '../../../utils/date';
import { routeSaleProceeds } from '../../../services/AllocationService';

export type AssetsStackParamList = {
  PhysicalAssetList: undefined;
  PhysicalAssetForm: { id?: string };
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
  const realm = useRealm();
  const allAssets = useQuery(PhysicalAssetModel);
  const savings = useQuery(SavingModel);

  const assets = useMemo(() => allAssets.filtered('sold == false'), [allAssets]);
  const soldAssets = useMemo(() => allAssets.filtered('sold == true').sorted('sellDate', true), [allAssets]);

  const [sellTarget, setSellTarget] = useState<PhysicalAssetModel | null>(null);
  const [sellPriceInput, setSellPriceInput] = useState('');
  const [destination, setDestination] = useState<'cash' | 'savings'>('cash');
  const [savingId, setSavingId] = useState('');

  const totalCurrentValue = useMemo(() =>
    assets.reduce((s, a) => s + calcDepreciation(a.purchasePrice, a.residualValue, a.usefulLife, a.purchaseDate), 0),
    [assets]
  );

  const totalPurchaseValue = useMemo(() =>
    assets.reduce((s, a) => s + a.purchasePrice, 0),
    [assets]
  );

  const sellPrice = parseCurrency(sellPriceInput);
  const sellProfit = sellTarget ? sellPrice - sellTarget.purchasePrice : 0;

  const openSellModal = (asset: PhysicalAssetModel) => {
    setSellTarget(asset);
    setSellPriceInput('');
    setDestination('cash');
    setSavingId('');
  };

  const closeSellModal = () => setSellTarget(null);

  const confirmSell = () => {
    if (!sellTarget) return;
    if (!sellPrice || sellPrice <= 0) {
      Alert.alert('Validasi', 'Isi harga jual');
      return;
    }
    if (destination === 'savings' && !savingId) {
      Alert.alert('Validasi', 'Pilih pos tabungan tujuan');
      return;
    }

    const date = today();
    const name = sellTarget.name;
    realm.write(() => {
      const result = routeSaleProceeds(realm, {
        destination, savingId, amount: sellPrice, profit: sellProfit, assetName: name, date,
      });
      if (!result.ok) {
        Alert.alert('Validasi', result.error);
        return;
      }
      sellTarget.sold = true;
      sellTarget.sellPrice = sellPrice;
      sellTarget.sellDate = date;
    });
    closeSellModal();
  };

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
              <TouchableOpacity style={styles.sellBtn} onPress={() => openSellModal(item)}>
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

      {/* Sell Modal */}
      <Modal visible={!!sellTarget} transparent animationType="slide" onRequestClose={closeSellModal}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity style={styles.modalBackdrop} onPress={closeSellModal} activeOpacity={1} />
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>💸 Jual Aset</Text>
            {sellTarget && (
              <>
                <View style={styles.modalAssetBox}>
                  <Text style={styles.modalAssetLabel}>Aset</Text>
                  <Text style={styles.modalAssetName}>{sellTarget.name}</Text>
                  <Text style={styles.modalAssetSub}>Harga beli: {formatCurrency(sellTarget.purchasePrice)} · {formatDate(sellTarget.purchaseDate)}</Text>
                </View>

                <Text style={styles.fieldLabel}>Harga Jual</Text>
                <CurrencyInput
                  value={sellPriceInput}
                  onChangeText={setSellPriceInput}
                  placeholder={sellTarget.purchasePrice.toLocaleString('id-ID')}
                />

                {sellPrice > 0 && (
                  <View style={[styles.profitBox, { backgroundColor: sellProfit >= 0 ? '#d1fae5' : '#fee2e2' }]}>
                    <Text style={[styles.profitText, { color: sellProfit >= 0 ? '#065f46' : '#991b1b' }]}>
                      {sellProfit >= 0 ? '🟢 Untung: +' : '🔴 Rugi: '}{formatCurrency(Math.abs(sellProfit))}
                    </Text>
                  </View>
                )}

                <Text style={styles.fieldLabel}>Hasil Jual Masuk Ke</Text>
                <View style={styles.destRow}>
                  <TouchableOpacity
                    style={[styles.destOption, destination === 'cash' && styles.destOptionActive]}
                    onPress={() => setDestination('cash')}
                  >
                    <Text style={[styles.destText, destination === 'cash' && styles.destTextActive]}>💵 Kas Bebas</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.destOption, destination === 'savings' && styles.destOptionActive]}
                    onPress={() => setDestination('savings')}
                  >
                    <Text style={[styles.destText, destination === 'savings' && styles.destTextActive]}>🏦 Tabungan</Text>
                  </TouchableOpacity>
                </View>

                {destination === 'savings' && (
                  <View style={styles.savingPickerWrap}>
                    {savings.length === 0 ? (
                      <Text style={styles.emptyPickerText}>Belum ada pos tabungan.</Text>
                    ) : (
                      savings.map((s) => (
                        <TouchableOpacity
                          key={s._id.toHexString()}
                          style={[styles.savingItem, s._id.toHexString() === savingId && styles.savingItemActive]}
                          onPress={() => setSavingId(s._id.toHexString())}
                        >
                          <Text style={styles.savingName}>{s.emoji} {s.name}</Text>
                          {s._id.toHexString() === savingId && <Text style={{ color: COLORS.primary }}>✓</Text>}
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                )}

                <View style={styles.modalActions}>
                  <Button title="Batal" onPress={closeSellModal} variant="secondary" style={styles.modalBtnHalf} />
                  <Button title="Jual Sekarang" onPress={confirmSell} style={styles.modalBtnHalf} />
                </View>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
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

  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)' },
  modalSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
    paddingBottom: SPACING.xxxl,
    maxHeight: '85%',
  },
  modalTitle: { fontSize: FONTS.xl, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.lg },
  modalAssetBox: { backgroundColor: COLORS.subtleBg, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md },
  modalAssetLabel: { fontSize: FONTS.xs, color: COLORS.textMuted },
  modalAssetName: { fontSize: FONTS.md, fontWeight: '700', color: COLORS.text, marginTop: 2 },
  modalAssetSub: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 2 },
  fieldLabel: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginBottom: SPACING.xs, fontWeight: '500', marginTop: SPACING.sm },
  input: {
    backgroundColor: COLORS.inputBg, borderRadius: RADIUS.md, borderWidth: 1.5,
    borderColor: COLORS.border, padding: SPACING.md, color: COLORS.text, fontSize: FONTS.md,
  },
  profitBox: { borderRadius: RADIUS.md, padding: SPACING.md, marginTop: SPACING.sm },
  profitText: { fontSize: FONTS.sm, fontWeight: '700' },
  destRow: { flexDirection: 'row', gap: SPACING.sm },
  destOption: {
    flex: 1, paddingVertical: SPACING.sm, borderRadius: RADIUS.md,
    borderWidth: 1.5, borderColor: COLORS.border, alignItems: 'center',
  },
  destOptionActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '18' },
  destText: { fontSize: FONTS.sm, fontWeight: '600', color: COLORS.textSecondary },
  destTextActive: { color: COLORS.primary },
  savingPickerWrap: { marginTop: SPACING.sm },
  savingItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: SPACING.md, borderRadius: RADIUS.md, marginBottom: SPACING.sm,
    borderWidth: 1, borderColor: COLORS.border,
  },
  savingItemActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '11' },
  savingName: { fontSize: FONTS.md, color: COLORS.text },
  emptyPickerText: { fontSize: FONTS.sm, color: COLORS.textSecondary, textAlign: 'center', padding: SPACING.md },
  modalActions: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.lg },
  modalBtnHalf: { flex: 1 },
});
