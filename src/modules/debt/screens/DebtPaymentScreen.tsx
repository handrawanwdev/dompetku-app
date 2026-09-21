import React, { useMemo, useState } from 'react';
import {
  View,
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
import { useRealm, useQuery, useObject } from '@realm/react';
import Realm from 'realm';

import { COLORS, FONTS, SPACING, RADIUS } from '../../../theme';
import { Text, Button, Input, DateInput, CurrencyInput, BackButton, DebtPaymentSuccessAnimation } from '../../../components/common';
import type { DebtPaymentKind } from '../../../components/common/DebtPaymentSuccessAnimation';
import { DebtModel } from '../../../models/DebtModel';
import { DebtPaymentModel } from '../../../models/DebtPaymentModel';
import { SavingModel } from '../../../models/SavingModel';
import { getKasBebasBalance, applyDebtPaymentFunding } from '../../../services/AllocationService';
import { formatCurrency } from '../../../utils/currency';
import { today } from '../../../utils/date';
import type { DebtStackParamList } from './DebtListScreen';

const FUNDING_SOURCES = [
  { value: 'cash', label: 'Kas Bebas', color: COLORS.warning },
  { value: 'savings', label: 'Tabungan', color: COLORS.savings },
];

type Props = NativeStackScreenProps<DebtStackParamList, 'DebtPayment'>;

export function DebtPaymentScreen({ navigation, route }: Props) {
  const { debtId, mode } = route.params;
  const realm = useRealm();
  const debt = useObject(DebtModel, new Realm.BSON.ObjectId(debtId));
  const savings = useQuery(SavingModel);
  const kasBebasBalance = getKasBebasBalance(realm);

  const allPayments = useQuery(DebtPaymentModel);
  const totalPaidSoFar = useMemo(
    () => allPayments.filtered('debtId == $0', debtId).reduce((s, p) => s + p.amount, 0),
    [allPayments, debtId],
  );

  const showFundingSource = mode !== 'usage';
  const title = mode === 'usage'
    ? 'Catat Pemakaian'
    : debt?.debtType === 'cicilan'
      ? 'Bayar Cicilan'
      : debt?.debtType === 'revolving' || debt?.debtType === 'tagihan_rutin'
        ? 'Bayar Tagihan'
        : 'Bayar Utang';
  const amountLabel = mode === 'usage' ? 'Nominal Pemakaian' : 'Nominal Pembayaran';
  const paymentKind: DebtPaymentKind = debt?.debtType === 'cicilan'
    ? 'installment'
    : debt?.debtType === 'revolving' || debt?.debtType === 'tagihan_rutin'
      ? 'bill'
      : 'debt';

  const defaultAmount = useMemo(() => {
    if (!debt) return 0;
    if (mode === 'usage') return 0;
    if (debt.debtType === 'cicilan') return debt.monthlyInstallment;
    if (debt.debtType === 'revolving') return debt.monthlyInstallment > 0 ? debt.monthlyInstallment : debt.currentBalance;
    if (debt.debtType === 'tagihan_rutin') return debt.monthlyInstallment;
    // tanpa_tenor, berjangka
    return Math.max(0, debt.totalAmount - totalPaidSoFar);
  }, [debt, mode, totalPaidSoFar]);

  const [amount, setAmount] = useState(() => defaultAmount.toString());
  const [date, setDate] = useState(today());
  const [note, setNote] = useState('');
  const [source, setSource] = useState('cash');
  const [savingId, setSavingId] = useState('');
  const [showSavingPicker, setShowSavingPicker] = useState(false);
  const [amountError, setAmountError] = useState('');
  const [sourceError, setSourceError] = useState('');
  const [successAmount, setSuccessAmount] = useState<number | null>(null);

  const selectedSaving = savings.find((s) => s._id.toHexString() === savingId);

  if (!debt) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  const handleConfirm = () => {
    const parsed = parseFloat(amount.replace(/[^0-9.]/g, ''));
    if (!parsed || parsed <= 0) {
      setAmountError('Nominal harus lebih dari 0');
      return;
    }
    setAmountError('');
    if (showFundingSource) {
      if (source === 'cash' && parsed > kasBebasBalance) {
        setSourceError('Kas Bebas tidak mencukupi');
        return;
      }
      if (source === 'savings') {
        if (!savingId) {
          setSourceError('Pilih pos tabungan sumber dana');
          return;
        }
        if (!selectedSaving || selectedSaving.balance < parsed) {
          setSourceError('Saldo tabungan tidak mencukupi');
          return;
        }
      }
    }
    setSourceError('');

    if (mode === 'usage') {
      realm.write(() => {
        debt.currentBalance = Math.min(debt.totalAmount, debt.currentBalance + parsed);
      });
      navigation.goBack();
      return;
    }

    try {
      realm.write(() => {
        const funding = applyDebtPaymentFunding(realm, {
          source,
          savingId,
          amount: parsed,
          lender: debt.lender,
          date,
        });
        if (!funding.ok) throw new Error(funding.error);

        realm.create(DebtPaymentModel, {
          _id: new Realm.BSON.ObjectId(),
          debtId,
          amount: parsed,
          date,
          note,
          source,
          savingId: source === 'savings' ? savingId : '',
          createdAt: new Date(),
        });

        if (debt.debtType === 'cicilan') {
          const newRemaining = Math.max(0, debt.remainingMonth - 1);
          debt.remainingMonth = newRemaining;
          if (newRemaining === 0) debt.isActive = false;
        } else if (debt.debtType === 'revolving') {
          debt.currentBalance = Math.max(0, debt.currentBalance - parsed);
        } else if (debt.debtType === 'tanpa_tenor' || debt.debtType === 'berjangka') {
          if (totalPaidSoFar + parsed >= debt.totalAmount) debt.isActive = false;
        }
      });
      setSuccessAmount(parsed);
    } catch (e) {
      Alert.alert('Validasi', e instanceof Error ? e.message : 'Gagal memproses pembayaran');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <CurrencyInput
            label={amountLabel}
            value={amount}
            onChangeText={(v) => { setAmount(v); setAmountError(''); }}
            error={amountError}
          />

          {showFundingSource && (
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Sumber Dana</Text>
              <View style={styles.sourceRow}>
                {FUNDING_SOURCES.map((src) => {
                  const isSelected = source === src.value;
                  return (
                    <TouchableOpacity
                      key={src.value}
                      onPress={() => { setSource(src.value); setSourceError(''); setShowSavingPicker(false); }}
                      style={[styles.sourceOption, isSelected && { borderColor: src.color, backgroundColor: src.color + '22' }]}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.radioCircle, isSelected && { borderColor: src.color, backgroundColor: src.color }]} />
                      <Text style={[styles.sourceLabel, isSelected ? { color: src.color } : null]}>{src.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {source === 'cash' && (
                <Text style={styles.sourceHint}>Saldo Kas Bebas: {formatCurrency(kasBebasBalance)}</Text>
              )}
              {source === 'savings' && (
                <>
                  <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowSavingPicker(!showSavingPicker)}>
                    <Text style={selectedSaving ? styles.pickerValue : styles.pickerPlaceholder}>
                      {selectedSaving ? `${selectedSaving.emoji} ${selectedSaving.name} — ${formatCurrency(selectedSaving.balance)}` : 'Pilih pos tabungan...'}
                    </Text>
                    <Text style={styles.pickerArrow}>{showSavingPicker ? '▲' : '▼'}</Text>
                  </TouchableOpacity>
                  {showSavingPicker && (
                    <View style={styles.pickerDropdown}>
                      {savings.length === 0 ? (
                        <Text style={styles.emptyPickerText}>Belum ada tabungan.</Text>
                      ) : (
                        savings.map((s) => (
                          <TouchableOpacity
                            key={s._id.toHexString()}
                            style={[styles.pickerItem, s._id.toHexString() === savingId && styles.pickerItemActive]}
                            onPress={() => { setSavingId(s._id.toHexString()); setSourceError(''); setShowSavingPicker(false); }}
                          >
                            <Text style={styles.pickerItemText}>{s.emoji} {s.name}</Text>
                            <Text style={styles.pickerItemBalance}>{formatCurrency(s.balance)}</Text>
                          </TouchableOpacity>
                        ))
                      )}
                    </View>
                  )}
                </>
              )}
              {sourceError ? <Text style={styles.errorText}>{sourceError}</Text> : null}
            </View>
          )}

          <DateInput label="Tanggal" value={date} onChange={setDate} />

          <Input label="Catatan (opsional)" placeholder="Tambah catatan..." value={note} onChangeText={setNote} />

          <Button title="Konfirmasi" onPress={handleConfirm} fullWidth style={styles.saveBtn} />
        </ScrollView>
      </KeyboardAvoidingView>

      <DebtPaymentSuccessAnimation
        visible={successAmount !== null}
        amount={successAmount ?? 0}
        kind={paymentKind}
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
  headerTitle: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text },
  scroll: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  saveBtn: { marginTop: SPACING.lg },
  fieldGroup: { marginBottom: SPACING.md },
  fieldLabel: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginBottom: SPACING.sm, fontWeight: '500' },
  sourceRow: { flexDirection: 'row', gap: SPACING.md },
  sourceOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  radioCircle: { width: 18, height: 18, borderRadius: RADIUS.round, borderWidth: 2, borderColor: COLORS.border },
  sourceLabel: { fontSize: FONTS.md, fontWeight: '500', color: COLORS.textSecondary },
  sourceHint: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: SPACING.sm },
  errorText: { fontSize: FONTS.sm, color: COLORS.danger, marginTop: SPACING.xs },
  pickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginTop: SPACING.sm,
  },
  pickerValue: { flex: 1, fontSize: FONTS.md, color: COLORS.text },
  pickerPlaceholder: { flex: 1, fontSize: FONTS.md, color: COLORS.textMuted },
  pickerArrow: { fontSize: FONTS.sm, color: COLORS.textMuted },
  pickerDropdown: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.xs,
    overflow: 'hidden',
  },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  pickerItemActive: { backgroundColor: COLORS.primary + '11' },
  pickerItemText: { fontSize: FONTS.md, color: COLORS.text },
  pickerItemBalance: { fontSize: FONTS.sm, color: COLORS.textSecondary },
  emptyPickerText: { fontSize: FONTS.sm, color: COLORS.textSecondary, textAlign: 'center', padding: SPACING.md },
});
