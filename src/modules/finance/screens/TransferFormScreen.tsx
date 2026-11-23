import React, { useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet, StatusBar, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRealm } from '@realm/react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Realm from 'realm';

import { COLORS, FONTS, SPACING } from '../../../theme';
import { Text, Button, Input, CurrencyInput, DateInput, BackButton } from '../../../components/common';
import { TransferModel } from '../../../models/TransferModel';
import { formatCurrency } from '../../../utils/currency';
import { today } from '../../../utils/date';
import type { RootStackParamList } from '../../../navigation/types';
import { AccountPicker } from '../components/AccountPicker';
import { useAccounts } from '../useAccounts';

type Props = NativeStackScreenProps<RootStackParamList, 'TransferForm'>;

/** Pindah saldo antar kantong, misal top up GoPay dari BCA. Saldo total tidak berubah. */
export function TransferFormScreen({ navigation, route }: Props) {
  const { id, fromId: initialFrom, toId: initialTo } = route.params ?? {};
  const realm = useRealm();
  const { list, byId } = useAccounts();
  const existing = useMemo(
    () => (id ? realm.objectForPrimaryKey(TransferModel, new Realm.BSON.ObjectId(id)) : null),
    [realm, id],
  );

  const [fromId, setFromId] = useState(existing?.fromId ?? initialFrom ?? list[0]?.id ?? '');
  const [toId, setToId] = useState(existing?.toId ?? initialTo ?? '');
  const [amount, setAmount] = useState(existing ? String(existing.amount) : '');
  const [date, setDate] = useState(existing?.date ?? today());
  const [note, setNote] = useState(existing?.note ?? '');

  const pickFrom = (v: string) => {
    setFromId(v);
    if (v === toId) setToId('');
  };

  const handleSave = () => {
    const value = parseFloat(amount || '0');
    if (!fromId || !toId) {
      Alert.alert('Pilih kantong', 'Pilih kantong asal dan tujuan dulu.');
      return;
    }
    if (value <= 0) {
      Alert.alert('Nominal kosong', 'Isi nominal yang dipindah.');
      return;
    }
    // Saldo asal, tidak menghitung transfer yang sedang diedit.
    const fromBalance = (byId(fromId)?.balance ?? 0) + (existing && existing.fromId === fromId ? existing.amount : 0)
      - (existing && existing.toId === fromId ? existing.amount : 0);
    if (value > fromBalance) {
      Alert.alert('Saldo tidak cukup', `Saldo ${byId(fromId)?.account.name ?? ''} ${formatCurrency(fromBalance)}.`);
      return;
    }

    realm.write(() => {
      if (existing) {
        existing.fromId = fromId;
        existing.toId = toId;
        existing.amount = value;
        existing.date = date;
        existing.note = note.trim();
      } else {
        realm.create(TransferModel, {
          _id: new Realm.BSON.ObjectId(),
          fromId,
          toId,
          amount: value,
          date,
          note: note.trim(),
          createdAt: new Date(),
        });
      }
    });
    navigation.goBack();
  };

  const handleDelete = () => {
    if (!existing) return;
    Alert.alert('Hapus pindah saldo', 'Saldo kedua kantong kembali seperti sebelumnya.', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => {
          navigation.goBack();
          realm.write(() => realm.delete(existing));
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Pindah saldo</Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text style={styles.intro}>Contoh: top up GoPay dari BCA, atau tarik tunai. Saldo total tidak berubah.</Text>
          <CurrencyInput label="Nominal" value={amount} onChangeText={setAmount} />
          <AccountPicker label="Dari" value={fromId} onChange={pickFrom} />
          <AccountPicker label="Ke" value={toId} onChange={setToId} exclude={fromId} />
          <DateInput label="Tanggal" value={date} onChange={setDate} />
          <Input label="Catatan (opsional)" placeholder="Contoh: top up" value={note} onChangeText={setNote} />

          <Button title={existing ? 'Simpan' : 'Pindahkan'} onPress={handleSave} fullWidth style={{ marginTop: SPACING.sm }} />
          {existing && (
            <Button title="Hapus" onPress={handleDelete} variant="danger" fullWidth style={{ marginTop: SPACING.md }} />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  title: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text },
  content: { padding: SPACING.xl, paddingTop: SPACING.sm, paddingBottom: SPACING.xxxl },
  intro: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginBottom: SPACING.lg, lineHeight: 20 },
});
