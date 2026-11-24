import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRealm } from '@realm/react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Realm from 'realm';

import { COLORS, FONTS, SPACING, RADIUS } from '../../../theme';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { BackButton } from '../../../components/common/BackButton';
import { DateInput } from '../../../components/common/DateInput';
import { CurrencyInput } from '../../../components/common/CurrencyInput';
import { InvestmentSuccessAnimation } from '../../../components/common/InvestmentSuccessAnimation';
import { InvestmentModel } from '../../../models/InvestmentModel';
import { today } from '../../../utils/date';
import { formatCurrency } from '../../../utils/currency';
import { ExpenseModel } from '../../../models/ExpenseModel';
import { syncPurchaseExpense, deleteLinkedTransactions, INVESTMENT_CATEGORY } from '../../../services/AllocationService';
import { PurchaseToggle } from '../../../components/common/PurchaseToggle';
import { InvestmentStackParamList } from './InvestmentListScreen';

const INVESTMENT_TYPES = [
  { value: 'stock', label: 'Saham', emoji: '📊' },
  { value: 'mutual_fund', label: 'Reksa Dana', emoji: '💼' },
  { value: 'deposito', label: 'Deposito Berjangka', emoji: '🏦' },
  { value: 'bond', label: 'Obligasi / SBN', emoji: '🏛️' },
  { value: 'gold', label: 'Emas', emoji: '🥇' },
  { value: 'property', label: 'Properti', emoji: '🏘️' },
  { value: 'p2p', label: 'P2P Lending', emoji: '🤝' },
  { value: 'crypto', label: 'Kripto', emoji: '🪙' },
];

type NavProp = NativeStackNavigationProp<InvestmentStackParamList, 'InvestmentForm'>;
type RoutePropT = RouteProp<InvestmentStackParamList, 'InvestmentForm'>;

interface Props { navigation: NavProp; route: RoutePropT; }

export function InvestmentFormScreen({ navigation, route }: Props) {
  const realm = useRealm();
  const editId = route.params?.id;

  const existing = editId
    ? realm.objectForPrimaryKey(InvestmentModel, new Realm.BSON.ObjectId(editId))
    : null;

  const [type, setType] = useState(existing?.type ?? 'stock');
  const [name, setName] = useState(existing?.name ?? '');
  const [buyPrice, setBuyPrice] = useState(existing?.buyPrice?.toString() ?? '');
  const [quantity, setQuantity] = useState(existing?.quantity?.toString() ?? '');
  const [currentPrice, setCurrentPrice] = useState(existing?.currentPrice?.toString() ?? '');
  const [buyDate, setBuyDate] = useState(existing?.buyDate ?? today());
  const [note, setNote] = useState(existing?.note ?? '');

  // Data lama yang belum punya catatan uang keluar bisa disusulkan dari sini.
  const linked = existing
    ? realm.objects(ExpenseModel).filtered('assetRef == $0', `investment:${existing._id.toHexString()}`).length > 0
    : false;
  const [recordPurchase, setRecordPurchase] = useState(!existing);
  const savingRef = useRef(false);
  const [successAmount, setSuccessAmount] = useState<number | null>(null);

  const handleSave = () => {
    if (savingRef.current) return;
    if (!name.trim()) { Alert.alert('Nama belum diisi', 'Kasih nama dulu, misalnya BBCA atau Emas Antam.'); return; }
    const bp = parseFloat(buyPrice.replace(/[^0-9.]/g, ''));
    const qty = parseFloat(quantity.replace(/[^0-9.]/g, ''));
    const cp = parseFloat(currentPrice.replace(/[^0-9.]/g, ''));
    if (!bp || !qty || !cp) { Alert.alert('Harga belum lengkap', 'Cek lagi harga beli, jumlah, dan harga sekarang.'); return; }

    savingRef.current = true;
    realm.write(() => {
      const purchase = {
        amount: bp * qty,
        date: buyDate,
        category: INVESTMENT_CATEGORY[type] ?? 'Investasi lain',
        note: `Beli ${name.trim()}`,
      };
      if (existing) {
        syncPurchaseExpense(realm, `investment:${existing._id.toHexString()}`, purchase, recordPurchase);
        existing.type = type;
        existing.name = name;
        existing.buyPrice = bp;
        existing.quantity = qty;
        existing.currentPrice = cp;
        existing.buyDate = buyDate;
        existing.note = note;
      } else {
        const created = realm.create(InvestmentModel, { type, name, buyPrice: bp, quantity: qty, currentPrice: cp, buyDate, note });
        if (recordPurchase) syncPurchaseExpense(realm, `investment:${created._id.toHexString()}`, purchase, true);
      }
    });

    if (existing) {
      navigation.goBack();
    } else {
      setSuccessAmount(bp * qty);
    }
  };

  const handleDelete = () => {
    if (!existing) return;
    Alert.alert('Hapus investasi', `Hapus "${existing.name}"? Catatan uang keluar pembelian${existing.sold ? ' dan pemasukan hasil jualnya' : 'nya'} ikut dihapus.`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => {
          realm.write(() => {
            deleteLinkedTransactions(realm, `investment:${existing._id.toHexString()}`);
            realm.delete(existing);
          });
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} color={COLORS.text} />
        </View>

        {/* Type Selector */}
        <Text style={styles.label}>Jenis investasi</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.lg }}>
          {INVESTMENT_TYPES.map(t => (
            <TouchableOpacity
              key={t.value}
              style={[styles.typeChip, type === t.value && styles.typeChipActive]}
              onPress={() => setType(t.value)}
            >
              <Text style={styles.typeEmoji}>{t.emoji}</Text>
              <Text style={[styles.typeLabel, type === t.value && styles.typeLabelActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Card padding={SPACING.lg}>
          <Field label="Nama" value={name} onChange={setName} placeholder="Contoh: BBCA, BTC, Emas 24K" />
          <CurrencyInput label="Harga beli per unit" value={buyPrice} onChangeText={setBuyPrice} />
          <Field label="Jumlah unit atau lot" value={quantity} onChange={setQuantity} keyboardType="numeric" placeholder="0" />
          <CurrencyInput label="Harga sekarang per unit" value={currentPrice} onChangeText={setCurrentPrice} />
          <DateInput label="Tanggal beli" value={buyDate} onChange={setBuyDate} />
          <Field label="Catatan (opsional)" value={note} onChange={setNote} placeholder="Contoh: beli pas harga lagi turun" multiline />
        </Card>

        {!linked && (
          <PurchaseToggle
            value={recordPurchase}
            onChange={setRecordPurchase}
            amountLabel={formatCurrency((parseFloat(buyPrice) || 0) * (parseFloat(quantity.replace(',', '.')) || 0))}
          />
        )}

        <Button title={editId ? 'Simpan perubahan' : 'Simpan'} onPress={handleSave} fullWidth style={{ marginTop: SPACING.xl }} />
        {editId && <Button title="Hapus investasi" onPress={handleDelete} variant="danger" fullWidth style={{ marginTop: SPACING.sm }} />}
      </ScrollView>
      </KeyboardAvoidingView>

      <InvestmentSuccessAnimation
        visible={successAmount !== null}
        amount={successAmount ?? 0}
        kind="add"
        onFinish={() => navigation.goBack()}
      />
    </SafeAreaView>
  );
}

function Field({ label, value, onChange, placeholder, keyboardType, multiline }: any) {
  return (
    <View style={{ marginBottom: SPACING.md }}>
      <Text style={fieldStyles.label}>{label}</Text>
      <TextInput
        style={[fieldStyles.input, multiline && { height: 80, textAlignVertical: 'top' }]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        keyboardType={keyboardType ?? 'default'}
        multiline={multiline}
      />
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  label: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginBottom: 4, fontWeight: '500' },
  input: { backgroundColor: COLORS.background, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, color: COLORS.text, fontSize: FONTS.md },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.xl, marginLeft: -SPACING.sm },
  label: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginBottom: SPACING.sm, fontWeight: '500' },
  typeChip: { alignItems: 'center', paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg, marginRight: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border },
  typeChipActive: { borderColor: COLORS.investment, backgroundColor: COLORS.investment + '22' },
  typeEmoji: { fontSize: 24, marginBottom: 4 },
  typeLabel: { fontSize: FONTS.xs, color: COLORS.textSecondary, fontWeight: '500' },
  typeLabelActive: { color: COLORS.investment, fontWeight: '700' },
});
