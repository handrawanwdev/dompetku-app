import React, { useEffect, useMemo } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRealm, useQuery } from '@realm/react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Realm from 'realm';

import { COLORS, FONTS, SPACING, RADIUS } from '../../../theme';
import { Card, Text, Button, Input } from '../../../components/common';
import { ExpenseModel } from '../../../models/ExpenseModel';
import { today } from '../../../utils/date';
import type { ExpenseStackParamList } from './ExpenseListScreen';

// ─── Types ────────────────────────────────────────────────────────────────────

type NavProp = NativeStackNavigationProp<ExpenseStackParamList, 'ExpenseForm'>;
type RouteType = RouteProp<ExpenseStackParamList, 'ExpenseForm'>;

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
  { value: 'cash', label: 'Kas', color: COLORS.warning },
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
    }
  }, [existingExpense, setValue]);

  const selectedCategory = watch('category');
  const selectedSource = watch('source');

  const onSubmit = (data: FormValues) => {
    const amount = parseFloat(data.amount.replace(/[^0-9.]/g, ''));

    realm.write(() => {
      if (isEdit && existingExpense) {
        existingExpense.amount = amount;
        existingExpense.category = data.category;
        existingExpense.source = data.source;
        existingExpense.date = data.date;
        existingExpense.note = data.note ?? '';
      } else {
        realm.create(ExpenseModel, {
          _id: new Realm.BSON.ObjectId(),
          amount,
          category: data.category,
          source: data.source,
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
            realm.write(() => realm.delete(existingExpense));
          }
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEdit ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'}</Text>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Amount */}
          <Controller
            control={control}
            name="amount"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Nominal"
                prefix="Rp"
                placeholder="0"
                keyboardType="numeric"
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
                    <Text style={[styles.sourceLabel, isSelected && { color: src.color }]}>
                      {src.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {errors.source && (
              <Text style={styles.errorText}>{errors.source.message}</Text>
            )}
          </View>

          {/* Date */}
          <Controller
            control={control}
            name="date"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Tanggal"
                placeholder="YYYY-MM-DD"
                value={value}
                onChangeText={onChange}
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
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: FONTS.xl,
    color: COLORS.text,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: FONTS.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  headerRight: {
    width: 36,
  },
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
});
