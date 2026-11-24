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
import { useRealm, useObject } from '@realm/react';
import Realm from 'realm';

import { COLORS, FONTS, ICON_SIZES, SPACING, RADIUS } from '../../../theme';
import { Button } from '../../../components/common/Button';
import { BackButton } from '../../../components/common/BackButton';
import { CurrencyInput } from '../../../components/common/CurrencyInput';
import { AssetSuccessAnimation } from '../../../components/common/AssetSuccessAnimation';
import { PhysicalAssetModel } from '../../../models/PhysicalAssetModel';
import { formatCurrency, parseCurrency } from '../../../utils/currency';
import { formatDate, today } from '../../../utils/date';
import { routeSaleProceeds } from '../../../services/AllocationService';

import type { AssetsStackParamList } from './PhysicalAssetListScreen';

type Props = NativeStackScreenProps<AssetsStackParamList, 'PhysicalAssetSell'>;

export function PhysicalAssetSellScreen({ navigation, route }: Props) {
  const { id } = route.params;
  const realm = useRealm();
  const asset = useObject(PhysicalAssetModel, new Realm.BSON.ObjectId(id));

  const [sellPriceInput, setSellPriceInput] = useState('');
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
      Alert.alert('Harga jual belum diisi', 'Isi harga yang kamu terima.');
      return;
    }

    const date = today();
    const name = asset.name;
    realm.write(() => {
      routeSaleProceeds(realm, { amount: sellPrice, profit: sellProfit, assetName: name, date, ref: `asset:${asset._id.toHexString()}` });
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
          <Text style={styles.headerTitle}>Jual aset</Text>
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

          <Text style={styles.fieldLabel}>Harga jual</Text>
          <CurrencyInput
            value={sellPriceInput}
            onChangeText={setSellPriceInput}
            placeholder={asset.purchasePrice.toLocaleString('id-ID')}
          />

          {sellPrice > 0 && (
            <View style={[styles.profitBox, { backgroundColor: sellProfit >= 0 ? COLORS.successBg : COLORS.dangerBg }]}>
              <Text style={[styles.profitText, { color: sellProfit >= 0 ? COLORS.successText : COLORS.dangerText }]}>
                {sellProfit >= 0 ? '🟢 Untung: +' : '🔴 Rugi: '}{formatCurrency(Math.abs(sellProfit))}
              </Text>
            </View>
          )}

          <Text style={styles.destHint}>Uang hasil jualnya langsung masuk ke saldo kamu.</Text>

          <Button title="Jual sekarang" onPress={confirmSell} fullWidth style={styles.saveBtn} />
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
  destHint: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: SPACING.md },
  saveBtn: { marginTop: SPACING.lg },
});
