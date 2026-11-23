import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet, StatusBar, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRealm, useObject } from '@realm/react';
import Realm from 'realm';

import { COLORS, FONTS, SPACING } from '../../../theme';
import { Text, Button, Input, CurrencyInput, BackButton } from '../../../components/common';
import { DebtModel } from '../../../models/DebtModel';
import { ExpenseModel } from '../../../models/ExpenseModel';
import { today } from '../../../utils/date';
import type { DebtStackParamList } from '../types';

type Props = NativeStackScreenProps<DebtStackParamList, 'DebtForm'>;

const toNumber = (v: string) => parseFloat(v.replace(/[^0-9.]/g, '')) || 0;

export function DebtFormScreen({ navigation, route }: Props) {
  const { id } = route.params ?? {};
  const realm = useRealm();
  const key = useMemo(() => (id ? new Realm.BSON.ObjectId(id) : new Realm.BSON.ObjectId()), [id]);
  const existing = useObject(DebtModel, key);
  const isEdit = Boolean(id && existing);

  const [name, setName] = useState('');
  const [total, setTotal] = useState('');
  const [paidBefore, setPaidBefore] = useState('');
  const [installment, setInstallment] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<{ name?: string; total?: string; dueDate?: string }>({});

  useEffect(() => {
    if (!existing || !id) return;
    setName(existing.name);
    setTotal(String(existing.totalAmount));
    setPaidBefore(existing.paidBefore ? String(existing.paidBefore) : '');
    setInstallment(existing.monthlyInstallment ? String(existing.monthlyInstallment) : '');
    setDueDate(existing.dueDate ? String(existing.dueDate) : '');
    setNote(existing.note);
  }, [existing, id]);

  const handleSave = () => {
    const next: typeof errors = {};
    const day = dueDate ? parseInt(dueDate, 10) : 0;
    if (!name.trim()) next.name = 'Isi nama dulu';
    if (toNumber(total) <= 0) next.total = 'Isi total yang harus dibayar';
    if (dueDate && (!day || day < 1 || day > 31)) next.dueDate = 'Tanggal 1 sampai 31';
    setErrors(next);
    if (Object.keys(next).length) return;

    realm.write(() => {
      const data = {
        name: name.trim(),
        totalAmount: toNumber(total),
        paidBefore: toNumber(paidBefore),
        monthlyInstallment: toNumber(installment),
        dueDate: day,
        note: note.trim(),
      };
      if (isEdit && existing) Object.assign(existing, data);
      else realm.create(DebtModel, { ...data, startDate: today() });
    });
    navigation.goBack();
  };

  const handleDelete = () => {
    if (!existing) return;
    Alert.alert('Hapus catatan utang', `Hapus "${existing.name}"? Transaksi pembayarannya tetap ada di riwayat.`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => {
          const debtId = existing._id.toHexString();
          realm.write(() => {
            for (const e of realm.objects(ExpenseModel).filtered('debtId == $0', debtId)) e.debtId = '';
            realm.delete(existing);
          });
          navigation.popToTop();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>{isEdit ? 'Ubah cicilan/utang' : 'Cicilan atau utang baru'}</Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Input
            label="Nama"
            placeholder="Contoh: Cicilan motor, Kartu kredit BCA"
            value={name}
            onChangeText={setName}
            error={errors.name}
          />
          <CurrencyInput label="Total yang harus dibayar" value={total} onChangeText={setTotal} error={errors.total} />
          <CurrencyInput label="Sudah dibayar sebelumnya (opsional)" value={paidBefore} onChangeText={setPaidBefore} />
          <Text style={styles.hint}>Isi kalau sebagian sudah dibayar sebelum mulai pakai app.</Text>

          <CurrencyInput label="Cicilan per bulan (opsional)" value={installment} onChangeText={setInstallment} />
          <Input
            label="Tanggal jatuh tempo tiap bulan (opsional)"
            placeholder="1-31"
            keyboardType="number-pad"
            maxLength={2}
            value={dueDate}
            onChangeText={(v) => setDueDate(v.replace(/[^0-9]/g, ''))}
            error={errors.dueDate}
          />
          <Input label="Catatan (opsional)" value={note} onChangeText={setNote} />

          <Button title={isEdit ? 'Simpan perubahan' : 'Simpan'} onPress={handleSave} fullWidth style={styles.saveBtn} />
          {isEdit && (
            <Button
              title="Hapus"
              onPress={handleDelete}
              variant="ghost"
              fullWidth
              textStyle={{ color: COLORS.danger }}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  title: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text },
  content: { padding: SPACING.xl, paddingBottom: SPACING.xxxl },
  hint: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: -SPACING.sm, marginBottom: SPACING.md },
  saveBtn: { marginTop: SPACING.md, marginBottom: SPACING.sm },
});
