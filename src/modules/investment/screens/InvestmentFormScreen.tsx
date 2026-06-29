import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useRealm } from '@realm/react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Realm from 'realm';

import { COLORS, FONTS, SPACING, RADIUS } from '../../../theme';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { InvestmentModel } from '../../../models/InvestmentModel';
import { today } from '../../../utils/date';
import { InvestmentStackParamList } from './InvestmentListScreen';

const INVESTMENT_TYPES = [
  { value: 'stock', label: 'Saham', emoji: '📊' },
  { value: 'crypto', label: 'Kripto', emoji: '🪙' },
  { value: 'gold', label: 'Emas', emoji: '🥇' },
  { value: 'mutual_fund', label: 'Reksa Dana', emoji: '📈' },
  { value: 'bond', label: 'Obligasi', emoji: '📜' },
  { value: 'property', label: 'Properti', emoji: '🏘️' },
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

  const handleSave = () => {
    if (!name.trim()) { Alert.alert('Error', 'Nama investasi wajib diisi'); return; }
    const bp = parseFloat(buyPrice.replace(/[^0-9.]/g, ''));
    const qty = parseFloat(quantity.replace(/[^0-9.]/g, ''));
    const cp = parseFloat(currentPrice.replace(/[^0-9.]/g, ''));
    if (!bp || !qty || !cp) { Alert.alert('Error', 'Isi semua data harga dengan benar'); return; }

    realm.write(() => {
      if (existing) {
        existing.type = type;
        existing.name = name;
        existing.buyPrice = bp;
        existing.quantity = qty;
        existing.currentPrice = cp;
        existing.buyDate = buyDate;
        existing.note = note;
      } else {
        realm.create(InvestmentModel, { type, name, buyPrice: bp, quantity: qty, currentPrice: cp, buyDate, note });
      }
    });
    navigation.goBack();
  };

  const handleDelete = () => {
    if (!existing) return;
    Alert.alert('Hapus', `Hapus investasi "${existing.name}"?`, [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: () => { realm.write(() => realm.delete(existing)); navigation.goBack(); } },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.back}>‹ Kembali</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{editId ? 'Edit Investasi' : 'Tambah Investasi'}</Text>
        </View>

        {/* Type Selector */}
        <Text style={styles.label}>Jenis Investasi</Text>
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
          <Field label="Nama" value={name} onChange={setName} placeholder="Misal: BBCA, BTC, Emas 24K" />
          <Field label="Harga Beli per Unit (Rp)" value={buyPrice} onChange={setBuyPrice} keyboardType="numeric" placeholder="0" />
          <Field label="Jumlah / Lot" value={quantity} onChange={setQuantity} keyboardType="numeric" placeholder="0" />
          <Field label="Harga Saat Ini per Unit (Rp)" value={currentPrice} onChange={setCurrentPrice} keyboardType="numeric" placeholder="0" />
          <Field label="Tanggal Beli" value={buyDate} onChange={setBuyDate} placeholder="YYYY-MM-DD" />
          <Field label="Catatan (opsional)" value={note} onChange={setNote} placeholder="..." multiline />
        </Card>

        <Button title={editId ? 'Simpan Perubahan' : 'Tambah Investasi'} onPress={handleSave} fullWidth style={{ marginTop: SPACING.xl }} />
        {editId && <Button title="Hapus Investasi" onPress={handleDelete} variant="danger" fullWidth style={{ marginTop: SPACING.sm }} />}
      </ScrollView>
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
  header: { marginBottom: SPACING.xl },
  back: { fontSize: FONTS.md, color: COLORS.primary, fontWeight: '500', marginBottom: SPACING.sm },
  title: { fontSize: FONTS.xxl, fontWeight: '700', color: COLORS.text },
  label: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginBottom: SPACING.sm, fontWeight: '500' },
  typeChip: { alignItems: 'center', paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg, marginRight: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border },
  typeChipActive: { borderColor: COLORS.investment, backgroundColor: COLORS.investment + '22' },
  typeEmoji: { fontSize: 24, marginBottom: 4 },
  typeLabel: { fontSize: FONTS.xs, color: COLORS.textSecondary, fontWeight: '500' },
  typeLabelActive: { color: COLORS.investment, fontWeight: '700' },
});
