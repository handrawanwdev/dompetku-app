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
import { ExpenseModel } from '../../../models/ExpenseModel';
import { SavingModel } from '../../../models/SavingModel';
import { today } from '../../../utils/date';
import { applyExpenseFunding, reverseExpenseFunding } from '../../../services/AllocationService';
import type { CashflowStackParamList } from '../../transaction/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type NavProp = NativeStackNavigationProp<CashflowStackParamList, 'ExpenseForm'>;
type RouteType = RouteProp<CashflowStackParamList, 'ExpenseForm'>;

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: 'Makan & Minum', emoji: '🍜' },
  { label: 'Transportasi', emoji: '🚗' },
  { label: 'Belanja', emoji: '🛍️' },
  { label: 'Tagihan', emoji: '📄' },
  { label: 'Kesehatan', emoji: '🏥' },
  { label: 'Hiburan', emoji: '🎬' },
  { label: 'Pendidikan', emoji: '📚' },
  { label: 'Rumah', emoji: '🏠' },
  { label: 'Komunikasi', emoji: '📱' },
  { label: 'Lainnya', emoji: '💸' },
];

const SOURCES = [
  { value: 'cash', label: 'Kas Bebas', color: COLORS.warning },
  { value: 'savings', label: 'Tabungan', color: COLORS.savings },
];

// ─── Validation ───────────────────────────────────────────────────────────────

const schema = z.object({
  amount: z
    .string()
    .min(1, 'Nominal wajib diisi')
    .refine((v) => parseFloat(v.replace(/[^0-9.]/g, '')) > 0, 'Nominal harus lebih dari 0'),
  category: z.string().min(1, 'Kategori wajib dipilih'),
  source: z.string().min(1, 'Sumber dana wajib dipilih'),
  date: z.string().min(1, 'Tanggal wajib diisi'),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

// ─── Screen ───────────────────────────────────────────────────────────────────

export function ExpenseFormScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteType>();
  const realm = useRealm();
  const { id } = route.params ?? {};
  const isEdit = Boolean(id);

  const allExpenses = useQuery(ExpenseModel);
  const existingExpense = useMemo(() => {
    if (!id) return null;
    return allExpenses.find((e) => e._id.toHexString() === id) ?? null;
  }, [allExpenses, id]);

  const savings = useQuery(SavingModel);
  const [savingId, setSavingId] = useState('');
  const [showSavingPicker, setShowSavingPicker] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: '',
      category: '',
      source: 'cash',
      date: today(),
      note: '',
    },
  });

  useEffect(() => {
    if (existingExpense) {
      setValue('amount', existingExpense.amount.toString());
      setValue('category', existingExpense.category);
      setValue('source', existingExpense.source);
      setValue('date', existingExpense.date);
      setValue('note', existingExpense.note);
      setSavingId(existingExpense.savingId ?? '');
    }
  }, [existingExpense, setValue]);

  const selectedCategory = watch('category');
  const selectedSource = watch('source');
  const selectedSaving = savings.find((s) => s._id.toHexString() === savingId);

  const onSubmit = (data: FormValues) => {
    const amount = parseFloat(data.amount.replace(/[^0-9.]/g, ''));

    if (data.source === 'savings') {
      if (!savingId) {
        Alert.alert('Validasi', 'Pilih pos tabungan sumber dana');
        return;
      }
      const saving = savings.find((s) => s._id.toHexString() === savingId);
      // If editing and re-funding from the same pos, its current balance already
      // has the old amount deducted — add it back for an accurate availability check.
      const alreadyDeducted = isEdit && existingExpense?.source === 'savings' && existingExpense.savingId === savingId
        ? existingExpense.amount
        : 0;
      if (!saving || saving.balance + alreadyDeducted < amount) {
        Alert.alert('Validasi', 'Saldo tabungan tidak mencukupi');
        return;
      }
    }

    realm.write(() => {
      if (isEdit && existingExpense) {
        // Refund whatever the previous save deducted before applying the new one
        reverseExpenseFunding(realm, {
          source: existingExpense.source,
          savingId: existingExpense.savingId,
          amount: existingExpense.amount,
        });

        applyExpenseFunding(realm, {
          source: data.source, savingId, amount, category: data.category, date: data.date,
        });

        existingExpense.amount = amount;
        existingExpense.category = data.category;
        existingExpense.source = data.source;
        existingExpense.savingId = data.source === 'savings' ? savingId : '';
        existingExpense.date = data.date;
        existingExpense.note = data.note ?? '';
      } else {
        applyExpenseFunding(realm, {
          source: data.source, savingId, amount, category: data.category, date: data.date,
        });

        realm.create(ExpenseModel, {
          _id: new Realm.BSON.ObjectId(),
          amount,
          category: data.category,
          source: data.source,
          savingId: data.source === 'savings' ? savingId : '',
          date: data.date,
          note: data.note ?? '',
          createdAt: new Date(),
        });
      }
    });

    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert('Hapus Pengeluaran', 'Yakin ingin menghapus pengeluaran ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => {
          if (existingExpense) {
            realm.write(() => {
              reverseExpenseFunding(realm, {
                source: existingExpense.source,
                savingId: existingExpense.savingId,
                amount: existingExpense.amount,
              });
              realm.delete(existingExpense);
            });
          }
          navigation.goBack();
        },
      },
    ]);
  };

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
                    <Text style={[styles.chipLabel, isSelected ? styles.chipLabelSelected : null]}>
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

          {/* Source Radio */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Sumber Dana</Text>
            <View style={styles.sourceRow}>
              {SOURCES.map((src) => {
                const isSelected = selectedSource === src.value;
                return (
                  <TouchableOpacity
                    key={src.value}
                    onPress={() => setValue('source', src.value, { shouldValidate: true })}
                    style={[
                      styles.sourceOption,
                      isSelected && { borderColor: src.color, backgroundColor: src.color + '22' },
                    ]}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.radioCircle,
                        isSelected && { borderColor: src.color, backgroundColor: src.color },
                      ]}
                    />
                    <Text style={[styles.sourceLabel, isSelected ? { color: src.color } : null]}>
                      {src.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {errors.source && (
              <Text style={styles.errorText}>{errors.source.message}</Text>
            )}
            {selectedSource === 'savings' && (
              <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowSavingPicker(true)}>
                <Text style={selectedSaving ? styles.pickerValue : styles.pickerPlaceholder}>
                  {selectedSaving ? `${selectedSaving.emoji} ${selectedSaving.name} — ${selectedSaving.balance.toLocaleString('id-ID')}` : 'Pilih pos tabungan...'}
                </Text>
                <Text style={styles.pickerArrow}>›</Text>
              </TouchableOpacity>
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

          {/* Save */}
          <Button
            title={isEdit ? 'Simpan Perubahan' : 'Simpan Pengeluaran'}
            onPress={handleSubmit(onSubmit)}
            variant="danger"
            loading={isSubmitting}
            fullWidth
            style={styles.saveBtn}
          />

          {/* Delete */}
          {isEdit && (
            <Button
              title="Hapus Pengeluaran"
              onPress={handleDelete}
              variant="ghost"
              fullWidth
              style={styles.deleteBtn}
              textStyle={{ color: COLORS.danger }}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Saving Picker Modal */}
      <Modal visible={showSavingPicker} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Pilih Pos Tabungan</Text>
            {savings.length === 0 ? (
              <Text style={styles.emptyPickerText}>Belum ada tabungan. Buat tabungan terlebih dahulu.</Text>
            ) : (
              savings.map((s) => (
                <TouchableOpacity
                  key={s._id.toHexString()}
                  style={[styles.pickerItem, s._id.toHexString() === savingId && styles.pickerItemActive]}
                  onPress={() => { setSavingId(s._id.toHexString()); setShowSavingPicker(false); }}
                >
                  <Text style={styles.pickerItemText}>{s.emoji} {s.name}</Text>
                  <Text style={styles.pickerItemBalance}>{s.balance.toLocaleString('id-ID')}</Text>
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
    backgroundColor: COLORS.expense,
    borderColor: COLORS.expense,
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
  sourceRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
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
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: RADIUS.round,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  sourceLabel: {
    fontSize: FONTS.md,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  errorText: {
    fontSize: FONTS.sm,
    color: COLORS.danger,
    marginTop: SPACING.xs,
  },
  saveBtn: {
    marginBottom: SPACING.md,
  },
  deleteBtn: {
    borderColor: COLORS.danger,
    marginBottom: SPACING.md,
  },
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
  pickerItemBalance: { fontSize: FONTS.sm, color: COLORS.textSecondary },
  emptyPickerText: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    padding: SPACING.xl,
  },
});
