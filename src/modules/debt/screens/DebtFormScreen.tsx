import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet, StatusBar, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRealm, useObject } from '@realm/react';
import Realm from 'realm';

import { COLORS, FONTS, ICON_SIZES, RADIUS, SPACING } from '../../../theme';
import { Text, Button, Input, CurrencyInput, BackButton } from '../../../components/common';
import { DebtModel } from '../../../models/DebtModel';
import { ExpenseModel } from '../../../models/ExpenseModel';
import { IncomeModel } from '../../../models/IncomeModel';
import { today } from '../../../utils/date';
import { loanRef } from '../../../utils/journal';
import { getLoanIncome, mainAccountId, syncLoanIncome } from '../../../services/AllocationService';
import { AccountPicker } from '../../finance/components/AccountPicker';
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
  // Uang pinjaman yang benar-benar diterima (pinjam tunai/transfer). Cicilan barang = tidak.
  const [loanIn, setLoanIn] = useState(false);
  const [loanAmount, setLoanAmount] = useState('');
  const [loanAccount, setLoanAccount] = useState(() => mainAccountId(realm));
  const [errors, setErrors] = useState<{ name?: string; total?: string; dueDate?: string; loan?: string }>({});

  useEffect(() => {
    if (!existing || !id) return;
    setName(existing.name);
    setTotal(String(existing.totalAmount));
    setPaidBefore(existing.paidBefore ? String(existing.paidBefore) : '');
    setInstallment(existing.monthlyInstallment ? String(existing.monthlyInstallment) : '');
    setDueDate(existing.dueDate ? String(existing.dueDate) : '');
    setNote(existing.note);
    const loan = getLoanIncome(realm, existing._id.toHexString());
    setLoanIn(Boolean(loan));
    if (loan) {
      setLoanAmount(String(loan.amount));
      setLoanAccount(loan.accountId);
    }
  }, [existing, id, realm]);

  const handleSave = () => {
    const next: typeof errors = {};
    const day = dueDate ? parseInt(dueDate, 10) : 0;
    if (!name.trim()) next.name = 'Isi nama dulu';
    if (toNumber(total) <= 0) next.total = 'Isi total yang harus dibayar';
    if (dueDate && (!day || day < 1 || day > 31)) next.dueDate = 'Tanggal 1 sampai 31';
    if (loanIn && toNumber(loanAmount) <= 0) next.loan = 'Isi uang yang diterima';
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
      const debt = isEdit && existing ? Object.assign(existing, data) : realm.create(DebtModel, { ...data, startDate: today() });
      syncLoanIncome(
        realm,
        debt._id.toHexString(),
        loanIn ? { amount: toNumber(loanAmount), accountId: loanAccount, date: debt.startDate, note: `Pinjaman ${data.name}` } : null,
      );
    });
    navigation.goBack();
  };

  const handleDelete = () => {
    if (!existing) return;
    Alert.alert('Hapus catatan utang', `Hapus "${existing.name}"? Transaksi pembayaran dan uang pinjaman masuknya tetap ada di riwayat.`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => {
          const debtId = existing._id.toHexString();
          realm.write(() => {
            for (const e of realm.objects(ExpenseModel).filtered('debtId == $0', debtId)) e.debtId = '';
            // Lepas link supaya baris pinjaman jadi pemasukan biasa yang bisa diubah/dihapus.
            for (const i of realm.objects(IncomeModel).filtered('ref == $0', loanRef(debtId))) i.ref = '';
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
          <Text style={styles.hint}>Isi kalau sebagian sudah kamu bayar sebelum pakai Dompetku.</Text>

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

          <TouchableOpacity
            style={styles.toggle}
            onPress={() => setLoanIn(!loanIn)}
            activeOpacity={0.7}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: loanIn }}
          >
            <MaterialIcons
              name={loanIn ? 'check-box' : 'check-box-outline-blank'}
              size={ICON_SIZES.lg}
              color={loanIn ? COLORS.primary : COLORS.textMuted}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleLabel}>Uang pinjamannya masuk ke kantong</Text>
              <Text style={styles.toggleSub}>
                {loanIn
                  ? 'Tercatat sebagai "Pinjaman masuk". Tidak dihitung sebagai pemasukan bulanan di Dashboard.'
                  : 'Pilih kalau pinjam uang tunai/transfer. Cicilan barang (motor, HP) biarkan kosong.'}
              </Text>
            </View>
          </TouchableOpacity>
          {loanIn && (
            <View style={styles.loanBox}>
              <CurrencyInput label="Uang yang diterima" value={loanAmount} onChangeText={setLoanAmount} error={errors.loan} />
              <AccountPicker label="Masuk ke" value={loanAccount} onChange={setLoanAccount} />
            </View>
          )}

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
  saveBtn: { marginTop: SPACING.lg, marginBottom: SPACING.sm },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.sm,
  },
  toggleLabel: { fontSize: FONTS.md, fontWeight: '600', color: COLORS.text },
  toggleSub: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: 2 },
  loanBox: { marginTop: SPACING.md },
});
