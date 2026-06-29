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
import { PhysicalAssetModel } from '../../../models/PhysicalAssetModel';
import { today } from '../../../utils/date';
import { AssetsStackParamList } from './PhysicalAssetListScreen';

const CATEGORIES = [
  { value: 'laptop', label: 'Laptop', emoji: '💻' },
  { value: 'phone', label: 'HP', emoji: '📱' },
  { value: 'vehicle', label: 'Kendaraan', emoji: '🚗' },
  { value: 'house', label: 'Rumah', emoji: '🏠' },
  { value: 'electronics', label: 'Elektronik', emoji: '🔌' },
  { value: 'furniture', label: 'Furnitur', emoji: '🛋️' },
  { value: 'other', label: 'Lainnya', emoji: '📦' },
];

type NavProp = NativeStackNavigationProp<AssetsStackParamList, 'PhysicalAssetForm'>;
type RoutePropT = RouteProp<AssetsStackParamList, 'PhysicalAssetForm'>;

interface Props { navigation: NavProp; route: RoutePropT; }

export function PhysicalAssetFormScreen({ navigation, route }: Props) {
  const realm = useRealm();
  const editId = route.params?.id;

  const existing = editId
    ? realm.objectForPrimaryKey(PhysicalAssetModel, new Realm.BSON.ObjectId(editId))
    : null;

  const [category, setCategory] = useState(existing?.category ?? 'laptop');
  const [name, setName] = useState(existing?.name ?? '');
  const [purchasePrice, setPurchasePrice] = useState(existing?.purchasePrice?.toString() ?? '');
  const [purchaseDate, setPurchaseDate] = useState(existing?.purchaseDate ?? today());
  const [usefulLife, setUsefulLife] = useState(existing?.usefulLife?.toString() ?? '5');
  const [residualValue, setResidualValue] = useState(existing?.residualValue?.toString() ?? '0');
  const [note, setNote] = useState(existing?.note ?? '');

  const handleSave = () => {
    if (!name.trim()) { Alert.alert('Error', 'Nama aset wajib diisi'); return; }
    const pp = parseFloat(purchasePrice.replace(/[^0-9.]/g, ''));
    const ul = parseInt(usefulLife);
    const rv = parseFloat(residualValue.replace(/[^0-9.]/g, '') || '0');
    if (!pp) { Alert.alert('Error', 'Harga beli harus diisi'); return; }
    if (!ul || ul < 1) { Alert.alert('Error', 'Masa manfaat minimal 1 tahun'); return; }

    realm.write(() => {
      if (existing) {
        existing.category = category;
        existing.name = name;
        existing.purchasePrice = pp;
        existing.purchaseDate = purchaseDate;
        existing.usefulLife = ul;
        existing.residualValue = rv;
        existing.note = note;
      } else {
        realm.create(PhysicalAssetModel, { category, name, purchasePrice: pp, purchaseDate, usefulLife: ul, residualValue: rv, note });
      }
    });
    navigation.goBack();
  };

  const handleDelete = () => {
    if (!existing) return;
    Alert.alert('Hapus', `Hapus aset "${existing.name}"?`, [
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
          <Text style={styles.title}>{editId ? 'Edit Aset' : 'Tambah Aset'}</Text>
        </View>

        {/* Category */}
        <Text style={styles.label}>Kategori</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map(c => (
            <TouchableOpacity
              key={c.value}
              style={[styles.catChip, category === c.value && styles.catChipActive]}
              onPress={() => setCategory(c.value)}
            >
              <Text style={{ fontSize: 24 }}>{c.emoji}</Text>
              <Text style={[styles.catLabel, category === c.value && styles.catLabelActive]}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Card padding={SPACING.lg} style={{ marginTop: SPACING.md }}>
          <Field label="Nama Aset" value={name} onChange={setName} placeholder="Misal: MacBook Pro M3" />
          <Field label="Harga Beli (Rp)" value={purchasePrice} onChange={setPurchasePrice} keyboardType="numeric" placeholder="0" />
          <Field label="Tanggal Beli" value={purchaseDate} onChange={setPurchaseDate} placeholder="YYYY-MM-DD" />
          <Field label="Masa Manfaat (tahun)" value={usefulLife} onChange={setUsefulLife} keyboardType="numeric" placeholder="5" />
          <Field label="Nilai Sisa (Rp)" value={residualValue} onChange={setResidualValue} keyboardType="numeric" placeholder="0" />
          <Field label="Catatan (opsional)" value={note} onChange={setNote} placeholder="..." multiline />
        </Card>

        <Button title={editId ? 'Simpan Perubahan' : 'Tambah Aset'} onPress={handleSave} fullWidth style={{ marginTop: SPACING.xl }} />
        {editId && <Button title="Hapus Aset" onPress={handleDelete} variant="danger" fullWidth style={{ marginTop: SPACING.sm }} />}
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, value, onChange, placeholder, keyboardType, multiline }: any) {
  return (
    <View style={{ marginBottom: SPACING.md }}>
      <Text style={fs.label}>{label}</Text>
      <TextInput
        style={[fs.input, multiline && { height: 80, textAlignVertical: 'top' }]}
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

const fs = StyleSheet.create({
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
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  catChip: { alignItems: 'center', paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, width: '30%' },
  catChipActive: { borderColor: COLORS.asset, backgroundColor: COLORS.asset + '22' },
  catLabel: { fontSize: FONTS.xs, color: COLORS.textSecondary, fontWeight: '500', marginTop: 4, textAlign: 'center' },
  catLabelActive: { color: COLORS.asset, fontWeight: '700' },
});
