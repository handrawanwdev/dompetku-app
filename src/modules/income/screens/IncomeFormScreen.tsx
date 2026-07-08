import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRealm, useQuery } from '@realm/react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Realm from 'realm';

import { COLORS, FONTS, SPACING, RADIUS } from '../../../theme';
import { Card, Text, Button, Input, DateInput, CurrencyInput, BackButton } from '../../../components/common';
import { IncomeModel } from '../../../models/IncomeModel';
import { DebtModel } from '../../../models/DebtModel';
import { SavingModel } from '../../../models/SavingModel';
import { today } from '../../../utils/date';
import { formatCurrency, parseCurrency } from '../../../utils/currency';
import { applyIncomeAllocation, reverseIncomeAllocation } from '../../../services/AllocationService';
import type { CashflowStackParamList } from '../../transaction/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type NavProp = NativeStackNavigationProp<CashflowStackParamList, 'IncomeForm'>;
type RouteType = RouteProp<CashflowStackParamList, 'IncomeForm'>;

// ─── Categories ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: 'Gaji', emoji: '💼' },
  { label: 'Freelance', emoji: '💻' },
  { label: 'Bonus', emoji: '🎁' },
  { label: 'Investasi', emoji: '📈' },
  { label: 'Bisnis', emoji: '🏪' },
  { label: 'Lainnya', emoji: '💰' },
];

// ─── Validation ───────────────────────────────────────────────────────────────

const schema = z.object({
  amount: z
    .string()
    .min(1, 'Nominal wajib diisi')
    .refine((v) => parseFloat(v.replace(/[^0-9.]/g, '')) > 0, 'Nominal harus lebih dari 0'),
  category: z.string().min(1, 'Kategori wajib dipilih'),
  date: z.string().min(1, 'Tanggal wajib diisi'),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

// ─── Screen ───────────────────────────────────────────────────────────────────

export function IncomeFormScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteType>();
  const realm = useRealm();
  const { id } = route.params ?? {};
  const isEdit = Boolean(id);

  const allIncomes = useQuery(IncomeModel);
  const existingIncome = useMemo(() => {
    if (!id) return null;
    return allIncomes.find((i) => i._id.toHexString() === id) ?? null;
  }, [allIncomes, id]);

  const activeDebts = useQuery(DebtModel).filtered('isActive == true');
  const savings = useQuery(SavingModel);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      amount: '',
      category: '',
      date: today(),
      note: '',
    },
  });

  // Alokasi ke hutang / tabungan (nominal, bukan persen — sesuai prototipe)
  const [debtId, setDebtId] = useState('');
  const [debtAllocInput, setDebtAllocInput] = useState('');
  const [savingId, setSavingId] = useState('');
  const [savingAllocInput, setSavingAllocInput] = useState('');
  const [showDebtPicker, setShowDebtPicker] = useState(false);
  const [showSavingPicker, setShowSavingPicker] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (existingIncome) {
      setValue('amount', existingIncome.amount.toString());
      setValue('category', existingIncome.category);
      setValue('date', existingIncome.date);
      setValue('note', existingIncome.note);
      setDebtId(existingIncome.allocationDebtId ?? '');
      setDebtAllocInput(existingIncome.allocationDebt > 0 ? existingIncome.allocationDebt.toString() : '');
      setSavingId(existingIncome.allocationSavingId ?? '');
      setSavingAllocInput(existingIncome.allocationSavings > 0 ? existingIncome.allocationSavings.toString() : '');
    }
  }, [existingIncome, setValue]);

  const watchedAmount = parseCurrency(watch('amount') || '0');
  const debtAllocAmount = parseCurrency(debtAllocInput);
  const savingAllocAmount = parseCurrency(savingAllocInput);
  const kasBebas = Math.max(0, watchedAmount - debtAllocAmount - savingAllocAmount);

  const selectedDebt = activeDebts.find((d) => d._id.toHexString() === debtId);
  const selectedSaving = savings.find((s) => s._id.toHexString() === savingId);

  const onSubmit = (data: FormValues) => {
    const amount = parseFloat(data.amount.replace(/[^0-9.]/g, ''));
    const debtAmt = debtId ? debtAllocAmount : 0;
    const savingAmt = savingId ? savingAllocAmount : 0;
    const cashAmt = Math.max(0, amount - debtAmt - savingAmt);

    realm.write(() => {
      if (isEdit && existingIncome) {
        // Undo the previous allocation's effect on debt/saving before re-applying
        reverseIncomeAllocation(realm, {
          debtId: existingIncome.allocationDebtId,
          debtAmount: existingIncome.allocationDebt,
          savingId: existingIncome.allocationSavingId,
          savingAmount: existingIncome.allocationSavings,
        });

        existingIncome.amount = amount;
        existingIncome.category = data.category;
        existingIncome.date = data.date;
        existingIncome.note = data.note ?? '';
        existingIncome.allocationDebt = debtAmt;
        existingIncome.allocationSavings = savingAmt;
        existingIncome.allocationCash = cashAmt;
        existingIncome.allocationDebtId = debtId;
        existingIncome.allocationSavingId = savingId;

        applyIncomeAllocation(realm, {
          debtId, debtAmount: debtAmt, savingId, savingAmount: savingAmt,
          category: data.category, date: data.date,
        });
      } else {
        realm.create(IncomeModel, {
          _id: new Realm.BSON.ObjectId(),
          amount,
          category: data.category,
          date: data.date,
          note: data.note ?? '',
          allocationDebt: debtAmt,
          allocationSavings: savingAmt,
          allocationCash: cashAmt,
          allocationDebtId: debtId,
          allocationSavingId: savingId,
          createdAt: new Date(),
        });

        applyIncomeAllocation(realm, {
          debtId, debtAmount: debtAmt, savingId, savingAmount: savingAmt,
          category: data.category, date: data.date,
        });
      }
    });

    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert('Hapus Pemasukan', 'Yakin ingin menghapus pemasukan ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => {
          if (existingIncome) {
            realm.write(() => {
              reverseIncomeAllocation(realm, {
                debtId: existingIncome.allocationDebtId,
                debtAmount: existingIncome.allocationDebt,
                savingId: existingIncome.allocationSavingId,
                savingAmount: existingIncome.allocationSavings,
              });
              realm.delete(existingIncome);
            });
          }
          navigation.goBack();
        },
      },
    ]);
  };

  const selectedCategory = watch('category');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Amount */}
          <Controller
            control={control}
            name="amount"
            render={({ field: { onChange, value } }) => (
              <CurrencyInput
                label="Nominal"
                value={value}
                onChangeText={onChange}
                error={errors.amount?.message}
              />
            )}
          />

          {/* Category Chips */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Kategori</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsRow}
            >
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.label;
                return (
                  <TouchableOpacity
                    key={cat.label}
                    onPress={() => setValue('category', cat.label, { shouldValidate: true })}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.chipEmoji}>{cat.emoji}</Text>
                    <Text style={[styles.chipLabel, isSelected && styles.chipLabelSelected]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            {errors.category && (
              <Text style={styles.errorText}>{errors.category.message}</Text>
            )}
          </View>

          {/* Date */}
          <Controller
            control={control}
            name="date"
            render={({ field: { onChange, value } }) => (
              <DateInput
                label="Tanggal"
                value={value}
                onChange={onChange}
                error={errors.date?.message}
              />
            )}
          />

          {/* Note */}
          <Controller
            control={control}
            name="note"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Catatan (opsional)"
                placeholder="Tambah catatan..."
                value={value}
                onChangeText={onChange}
                multiline
                numberOfLines={3}
                style={{ height: 72, textAlignVertical: 'top' }}
              />
            )}
          />

          {/* Allocation */}
          <Card style={styles.allocationCard}>
            <Text style={styles.allocationTitle}>Alokasi Langsung (opsional)</Text>
            <Text style={styles.allocationSubtitle}>
              Pisahkan sebagian pemasukan ke hutang atau tabungan tertentu
            </Text>

            <Text style={styles.fieldLabel}>Ke Hutang</Text>
            <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowDebtPicker(true)}>
              <Text style={selectedDebt ? styles.pickerValue : styles.pickerPlaceholder}>
                {selectedDebt ? selectedDebt.name : '— Tidak —'}
              </Text>
              <Text style={styles.pickerArrow}>›</Text>
            </TouchableOpacity>
            {!!debtId && (
              <CurrencyInput
                value={debtAllocInput}
                onChangeText={setDebtAllocInput}
              />
            )}

            <Text style={styles.fieldLabel}>Ke Tabungan</Text>
            <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowSavingPicker(true)}>
              <Text style={selectedSaving ? styles.pickerValue : styles.pickerPlaceholder}>
                {selectedSaving ? `${selectedSaving.emoji} ${selectedSaving.name}` : '— Tidak —'}
              </Text>
              <Text style={styles.pickerArrow}>›</Text>
            </TouchableOpacity>
            {!!savingId && (
              <CurrencyInput
                value={savingAllocInput}
                onChangeText={setSavingAllocInput}
              />
            )}

            <View style={styles.cashRow}>
              <Text style={styles.cashLabel}>Kas Bebas (otomatis)</Text>
              <Text style={styles.cashValue}>{formatCurrency(kasBebas)}</Text>
            </View>
          </Card>

          {/* Save */}
          <Button
            title={isEdit ? 'Simpan Perubahan' : 'Simpan Pemasukan'}
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            fullWidth
            style={styles.saveBtn}
          />

          {/* Delete */}
          {isEdit && (
            <Button
              title="Hapus Pemasukan"
              onPress={handleDelete}
              variant="danger"
              fullWidth
              style={styles.deleteBtn}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Debt Picker Modal */}
      <Modal visible={showDebtPicker} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Pilih Hutang</Text>
            <TouchableOpacity
              style={styles.pickerItem}
              onPress={() => { setDebtId(''); setDebtAllocInput(''); setShowDebtPicker(false); }}
            >
              <Text style={styles.pickerItemText}>— Tidak —</Text>
            </TouchableOpacity>
            {activeDebts.length === 0 ? (
              <Text style={styles.emptyPickerText}>Belum ada hutang aktif.</Text>
            ) : (
              activeDebts.map((d) => (
                <TouchableOpacity
                  key={d._id.toHexString()}
                  style={[styles.pickerItem, d._id.toHexString() === debtId && styles.pickerItemActive]}
                  onPress={() => { setDebtId(d._id.toHexString()); setShowDebtPicker(false); }}
                >
                  <Text style={styles.pickerItemText}>{d.name}</Text>
                  {d._id.toHexString() === debtId && <Text style={{ color: COLORS.primary }}>✓</Text>}
                </TouchableOpacity>
              ))
            )}
            <Button title="Tutup" onPress={() => setShowDebtPicker(false)} variant="ghost" style={{ marginTop: SPACING.lg }} />
          </View>
        </View>
      </Modal>

      {/* Saving Picker Modal */}
      <Modal visible={showSavingPicker} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Pilih Tabungan</Text>
            <TouchableOpacity
              style={styles.pickerItem}
              onPress={() => { setSavingId(''); setSavingAllocInput(''); setShowSavingPicker(false); }}
            >
              <Text style={styles.pickerItemText}>— Tidak —</Text>
            </TouchableOpacity>
            {savings.length === 0 ? (
              <Text style={styles.emptyPickerText}>Belum ada tabungan.</Text>
            ) : (
              savings.map((s) => (
                <TouchableOpacity
                  key={s._id.toHexString()}
                  style={[styles.pickerItem, s._id.toHexString() === savingId && styles.pickerItemActive]}
                  onPress={() => { setSavingId(s._id.toHexString()); setShowSavingPicker(false); }}
                >
                  <Text style={styles.pickerItemText}>{s.emoji} {s.name}</Text>
                  {s._id.toHexString() === savingId && <Text style={{ color: COLORS.primary }}>✓</Text>}
                </TouchableOpacity>
              ))
            )}
            <Button title="Tutup" onPress={() => setShowSavingPicker(false)} variant="ghost" style={{ marginTop: SPACING.lg }} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  scroll: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  fieldGroup: {
    marginBottom: SPACING.md,
  },
  fieldLabel: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    fontWeight: '500',
  },
  chipsRow: {
    gap: SPACING.sm,
    paddingRight: SPACING.xl,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipSelected: {
    backgroundColor: COLORS.income,
    borderColor: COLORS.income,
  },
  chipEmoji: {
    fontSize: FONTS.md,
  },
  chipLabel: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  chipLabelSelected: {
    color: '#FFFFFF',
  },
  errorText: {
    fontSize: FONTS.sm,
    color: COLORS.danger,
    marginTop: SPACING.xs,
  },
  allocationCard: {
    marginBottom: SPACING.xl,
    padding: SPACING.lg,
  },
  allocationTitle: {
    fontSize: FONTS.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  allocationSubtitle: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  pickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  pickerValue: { flex: 1, fontSize: FONTS.md, color: COLORS.text },
  pickerPlaceholder: { flex: 1, fontSize: FONTS.md, color: COLORS.textMuted },
  pickerArrow: { fontSize: FONTS.lg, color: COLORS.textMuted },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modal: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
    maxHeight: '70%',
  },
  modalTitle: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.lg },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pickerItemActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '11' },
  pickerItemText: { fontSize: FONTS.md, color: COLORS.text },
  emptyPickerText: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    padding: SPACING.xl,
  },
  cashRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: SPACING.xs,
  },
  cashLabel: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
  },
  cashValue: {
    fontSize: FONTS.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  saveBtn: {
    marginBottom: SPACING.md,
  },
  deleteBtn: {
    marginBottom: SPACING.md,
  },
});
