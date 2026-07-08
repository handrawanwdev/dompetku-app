import React, { useState } from 'react';
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
import { CurrencyInput } from '../../../components/common/CurrencyInput';
import { PassiveIncomeModel } from '../../../models/PassiveIncomeModel';
import { PASSIVE_INCOME_CATEGORIES, PASSIVE_INCOME_FREQUENCIES } from '../../../utils/finance';
import { PassiveIncomeStackParamList } from './PassiveIncomeListScreen';

type NavProp = NativeStackNavigationProp<PassiveIncomeStackParamList, 'PassiveIncomeForm'>;
type RoutePropT = RouteProp<PassiveIncomeStackParamList, 'PassiveIncomeForm'>;

interface Props { navigation: NavProp; route: RoutePropT; }

export function PassiveIncomeFormScreen({ navigation, route }: Props) {
  const realm = useRealm();
  const editId = route.params?.id;

  const existing = editId
    ? realm.objectForPrimaryKey(PassiveIncomeModel, new Realm.BSON.ObjectId(editId))
    : null;

  const [category, setCategory] = useState(existing?.category ?? PASSIVE_INCOME_CATEGORIES[0].value);
  const [amount, setAmount] = useState(existing?.amount?.toString() ?? '');
  const [frequency, setFrequency] = useState(existing?.frequency ?? 'monthly');
  const [note, setNote] = useState(existing?.note ?? '');

  const handleSave = () => {
    const amountValue = parseFloat(amount.replace(/[^0-9.]/g, ''));
    if (!amountValue) { Alert.alert('Error', 'Nominal harus diisi'); return; }

    realm.write(() => {
      if (existing) {
        existing.category = category;
        existing.amount = amountValue;
        existing.frequency = frequency;
        existing.note = note;
      } else {
        realm.create(PassiveIncomeModel, { category, amount: amountValue, frequency, note });
      }
    });
    navigation.goBack();
  };

  const handleDelete = () => {
    if (!existing) return;
    Alert.alert('Hapus', 'Hapus sumber passive income ini?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: () => { realm.write(() => realm.delete(existing)); navigation.goBack(); } },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <BackButton onPress={() => navigation.goBack()} color={COLORS.text} />
          </View>

          <Text style={styles.label}>Kategori</Text>
          <View style={styles.chipRow}>
            {PASSIVE_INCOME_CATEGORIES.map((c) => (
              <TouchableOpacity
                key={c.value}
                style={[styles.chip, category === c.value && styles.chipActive]}
                onPress={() => setCategory(c.value)}
              >
                <Text style={styles.chipEmoji}>{c.emoji}</Text>
                <Text style={[styles.chipText, category === c.value && styles.chipTextActive]}>{c.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Card padding={SPACING.lg} style={{ marginTop: SPACING.md }}>
            <CurrencyInput label="Nominal" value={amount} onChangeText={setAmount} placeholder="2.000.000" />

            <Text style={styles.fieldLabel}>Frekuensi</Text>
            <View style={styles.chipRow}>
              {PASSIVE_INCOME_FREQUENCIES.map((f) => (
                <TouchableOpacity
                  key={f.value}
                  style={[styles.freqChip, frequency === f.value && styles.chipActive]}
                  onPress={() => setFrequency(f.value)}
                >
                  <Text style={[styles.chipText, frequency === f.value && styles.chipTextActive]}>{f.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Catatan (opsional)</Text>
            <TextInput
              style={styles.input}
              value={note}
              onChangeText={setNote}
              placeholder="Misal: Dividen saham BBCA"
              placeholderTextColor={COLORS.textMuted}
            />
          </Card>

          <Button title={editId ? 'Simpan Perubahan' : 'Tambah Passive Income'} onPress={handleSave} fullWidth style={{ marginTop: SPACING.xl }} />
          {editId && <Button title="Hapus" onPress={handleDelete} variant="danger" fullWidth style={{ marginTop: SPACING.sm }} />}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.xl, marginLeft: -SPACING.sm },
  label: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginBottom: SPACING.sm, fontWeight: '500' },
  fieldLabel: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginBottom: SPACING.sm, marginTop: SPACING.xs, fontWeight: '500' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md, borderRadius: RADIUS.round, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface },
  freqChip: { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.lg, borderRadius: RADIUS.round, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface },
  chipActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '18' },
  chipEmoji: { fontSize: 16 },
  chipText: { fontSize: FONTS.sm, color: COLORS.textSecondary, fontWeight: '600' },
  chipTextActive: { color: COLORS.primary },
  input: { backgroundColor: COLORS.background, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, color: COLORS.text, fontSize: FONTS.md, marginBottom: SPACING.md },
});
