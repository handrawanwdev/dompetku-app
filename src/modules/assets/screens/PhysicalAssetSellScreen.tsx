import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { useQuery, useRealm, useObject } from '@realm/react';
import Realm from 'realm';

import { COLORS, FONTS, ICON_SIZES, SPACING, RADIUS } from '../../../theme';
import { Button } from '../../../components/common/Button';
import { BackButton } from '../../../components/common/BackButton';
import { CurrencyInput } from '../../../components/common/CurrencyInput';
import { AssetSuccessAnimation } from '../../../components/common/AssetSuccessAnimation';
import { PhysicalAssetModel } from '../../../models/PhysicalAssetModel';
import { SavingModel } from '../../../models/SavingModel';
import { formatCurrency, parseCurrency } from '../../../utils/currency';
import { formatDate, today } from '../../../utils/date';
import { routeSaleProceeds } from '../../../services/AllocationService';

import type { AssetsStackParamList } from './PhysicalAssetListScreen';

type Props = NativeStackScreenProps<AssetsStackParamList, 'PhysicalAssetSell'>;

export function PhysicalAssetSellScreen({ navigation, route }: Props) {
  const { id } = route.params;
  const realm = useRealm();
  const asset = useObject(PhysicalAssetModel, new Realm.BSON.ObjectId(id));
  const savings = useQuery(SavingModel);

  const [sellPriceInput, setSellPriceInput] = useState('');
  const [destination, setDestination] = useState<'cash' | 'savings'>('cash');
  const [savingId, setSavingId] = useState('');
  const [successAmount, setSuccessAmount] = useState<number | null>(null);

  if (!asset) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} color={COLORS.text} />
        </View>
      </SafeAreaView>
    );
  }

  const sellPrice = parseCurrency(sellPriceInput);
  const sellProfit = sellPrice - asset.purchasePrice;

  const confirmSell = () => {
    if (!sellPrice || sellPrice <= 0) {
      Alert.alert('Validasi', 'Isi harga jual');
      return;
    }
    if (destination === 'savings' && !savingId) {
      Alert.alert('Validasi', 'Pilih pos tabungan tujuan');
      return;
    }

    const date = today();
    const name = asset.name;
    realm.write(() => {
      const result = routeSaleProceeds(realm, {
        destination, savingId, amount: sellPrice, profit: sellProfit, assetName: name, date,
      });
      if (!result.ok) {
        Alert.alert('Validasi', result.error);
        return;
      }
      asset.sold = true;
      asset.sellPrice = sellPrice;
      asset.sellDate = date;
    });
    setSuccessAmount(sellPrice);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} color={COLORS.text} />
        <View style={styles.headerTitleRow}>
          <MaterialIcons name="sell" size={ICON_SIZES.md} color={COLORS.text} />
          <Text style={styles.headerTitle}>Jual Aset</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.assetBox}>
            <Text style={styles.assetLabel}>Aset</Text>
            <Text style={styles.assetName}>{asset.name}</Text>
            <Text style={styles.assetSub}>Harga beli: {formatCurrency(asset.purchasePrice)} · {formatDate(asset.purchaseDate)}</Text>
          </View>

          <Text style={styles.fieldLabel}>Harga Jual</Text>
          <CurrencyInput
            value={sellPriceInput}
            onChangeText={setSellPriceInput}
            placeholder={asset.purchasePrice.toLocaleString('id-ID')}
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

          <Button title="Jual Sekarang" onPress={confirmSell} fullWidth style={styles.saveBtn} />
        </ScrollView>
      </KeyboardAvoidingView>

      <AssetSuccessAnimation
        visible={successAmount !== null}
        amount={successAmount ?? 0}
        kind="sell"
        onFinish={() => navigation.goBack()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  headerTitle: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text },
  scroll: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  assetBox: { backgroundColor: COLORS.subtleBg, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md },
  assetLabel: { fontSize: FONTS.xs, color: COLORS.textMuted },
  assetName: { fontSize: FONTS.md, fontWeight: '700', color: COLORS.text, marginTop: 2 },
  assetSub: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 2 },
  fieldLabel: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginBottom: SPACING.xs, fontWeight: '500', marginTop: SPACING.sm },
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
  saveBtn: { marginTop: SPACING.lg },
});
