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

import { COLORS, FONTS, SPACING, RADIUS } from '../../../theme';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { EmptyState } from '../../../components/common/EmptyState';
import { CurrencyInput } from '../../../components/common/CurrencyInput';
import { FAB } from '../../../components/common/FAB';
import { InvestmentModel } from '../../../models/InvestmentModel';
import { SavingModel } from '../../../models/SavingModel';
import { formatCurrency, formatCompact, parseCurrency } from '../../../utils/currency';
import { calcROI, calcProfitLoss } from '../../../utils/finance';
import { formatDate, today } from '../../../utils/date';
import { routeSaleProceeds } from '../../../services/AllocationService';

export type InvestmentStackParamList = {
  InvestmentList: undefined;
  InvestmentForm: { id?: string };
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
  const realm = useRealm();
  const allInvestments = useQuery(InvestmentModel);
  const savings = useQuery(SavingModel);

  const activeInvestments = useMemo(() => allInvestments.filtered('sold == false'), [allInvestments]);
  const soldInvestments = useMemo(
    () => allInvestments.filtered('sold == true').sorted('sellDate', true),
    [allInvestments],
  );

  const [sellTarget, setSellTarget] = useState<InvestmentModel | null>(null);
  const [sellPriceInput, setSellPriceInput] = useState('');
  const [destination, setDestination] = useState<'cash' | 'savings'>('cash');
  const [savingId, setSavingId] = useState('');

  const summary = useMemo(() => {
    const totalInvested = activeInvestments.reduce((s, i) => s + i.buyPrice * i.quantity, 0);
    const totalCurrent = activeInvestments.reduce((s, i) => s + i.currentPrice * i.quantity, 0);
    const totalPL = totalCurrent - totalInvested;
    const overallROI = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0;
    return { totalInvested, totalCurrent, totalPL, overallROI };
  }, [activeInvestments]);

  const costBasis = sellTarget ? sellTarget.buyPrice * sellTarget.quantity : 0;
  const sellPrice = parseCurrency(sellPriceInput);
  const sellProfit = sellPrice - costBasis;

  const openSellModal = (investment: InvestmentModel) => {
    setSellTarget(investment);
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
              <TouchableOpacity style={styles.sellBtn} onPress={() => openSellModal(item)}>
                <Text style={styles.sellBtnText}>💸 Jual</Text>
              </TouchableOpacity>
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

      {/* Sell Modal */}
      <Modal visible={!!sellTarget} transparent animationType="slide" onRequestClose={closeSellModal}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity style={styles.modalBackdrop} onPress={closeSellModal} activeOpacity={1} />
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>💸 Jual Investasi</Text>
            {sellTarget && (
              <>
                <View style={styles.modalAssetBox}>
                  <Text style={styles.modalAssetLabel}>Aset</Text>
                  <Text style={styles.modalAssetName}>{sellTarget.name}</Text>
                  <Text style={styles.modalAssetSub}>Modal beli: {formatCurrency(costBasis)} · {formatDate(sellTarget.buyDate)}</Text>
                </View>

                <Text style={styles.fieldLabel}>Harga Jual</Text>
                <CurrencyInput
                  value={sellPriceInput}
                  onChangeText={setSellPriceInput}
                  placeholder={costBasis.toLocaleString('id-ID')}
                />

                {sellPrice > 0 && (
                  <View style={[styles.profitBox, { backgroundColor: sellProfit >= 0 ? '#d1fae5' : '#fee2e2' }]}>
                    <Text style={[styles.profitText, { color: sellProfit >= 0 ? '#065f46' : '#991b1b' }]}>
                      {sellProfit >= 0 ? '🟢 Profit: +' : '🔴 Rugi: '}{formatCurrency(Math.abs(sellProfit))}
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
  sellBtn: {
    marginTop: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.investment,
    alignItems: 'center',
  },
  sellBtnText: { fontSize: FONTS.sm, fontWeight: '700', color: COLORS.investment },

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
