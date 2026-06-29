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
import { IncomeModel } from '../../../models/IncomeModel';
import { today } from '../../../utils/date';
import type { IncomeStackParamList } from './IncomeListScreen';

// ─── Types ────────────────────────────────────────────────────────────────────

type NavProp = NativeStackNavigationProp<IncomeStackParamList, 'IncomeForm'>;
type RouteType = RouteProp<IncomeStackParamList, 'IncomeForm'>;

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
  allocationDebt: z.string().optional(),
  allocationSavings: z.string().optional(),
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
      date: today(),
      note: '',
      allocationDebt: '0',
      allocationSavings: '0',
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (existingIncome) {
      setValue('amount', existingIncome.amount.toString());
      setValue('category', existingIncome.category);
      setValue('date', existingIncome.date);
      setValue('note', existingIncome.note);
      setValue('allocationDebt', existingIncome.allocationDebt.toString());
      setValue('allocationSavings', existingIncome.allocationSavings.toString());
    }
  }, [existingIncome, setValue]);

  const watchedDebt = parseFloat(watch('allocationDebt') || '0') || 0;
  const watchedSavings = parseFloat(watch('allocationSavings') || '0') || 0;
  const allocationCash = Math.max(0, 100 - watchedDebt - watchedSavings);

  const onSubmit = (data: FormValues) => {
    const amount = parseFloat(data.amount.replace(/[^0-9.]/g, ''));
    const debtPct = parseFloat(data.allocationDebt ?? '0') || 0;
    const savingsPct = parseFloat(data.allocationSavings ?? '0') || 0;
    const cashPct = Math.max(0, 100 - debtPct - savingsPct);
    const debtAmt = (amount * debtPct) / 100;
    const savingsAmt = (amount * savingsPct) / 100;
    const cashAmt = (amount * cashPct) / 100;

    realm.write(() => {
      if (isEdit && existingIncome) {
        existingIncome.amount = amount;
        existingIncome.category = data.category;
        existingIncome.date = data.date;
        existingIncome.note = data.note ?? '';
        existingIncome.allocationDebt = debtAmt;
        existingIncome.allocationSavings = savingsAmt;
        existingIncome.allocationCash = cashAmt;
      } else {
        realm.create(IncomeModel, {
          _id: new Realm.BSON.ObjectId(),
          amount,
          category: data.category,
          date: data.date,
          note: data.note ?? '',
          allocationDebt: debtAmt,
          allocationSavings: savingsAmt,
          allocationCash: cashAmt,
          createdAt: new Date(),
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
            realm.write(() => realm.delete(existingIncome));
          }
          navigation.goBack();
        },
      },
    ]);
  };

  const selectedCategory = watch('category');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEdit ? 'Edit Pemasukan' : 'Tambah Pemasukan'}</Text>
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

          {/* Allocation */}
          <Card style={styles.allocationCard}>
            <Text style={styles.allocationTitle}>Alokasi</Text>
            <Text style={styles.allocationSubtitle}>
              Total persentase alokasi hutang + tabungan = max 100%
            </Text>

            <View style={styles.allocationRow}>
              <View style={styles.allocationField}>
                <Controller
                  control={control}
                  name="allocationDebt"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      label="Hutang %"
                      placeholder="0"
                      keyboardType="numeric"
                      value={value}
                      onChangeText={onChange}
                      suffix="%"
                    />
                  )}
                />
              </View>
              <View style={styles.allocationSpacer} />
              <View style={styles.allocationField}>
                <Controller
                  control={control}
                  name="allocationSavings"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      label="Tabungan %"
                      placeholder="0"
                      keyboardType="numeric"
                      value={value}
                      onChangeText={onChange}
                      suffix="%"
                    />
                  )}
                />
              </View>
            </View>

            <View style={styles.cashRow}>
              <Text style={styles.cashLabel}>Kas (otomatis)</Text>
              <Text style={styles.cashValue}>{allocationCash.toFixed(0)}%</Text>
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
  allocationRow: {
    flexDirection: 'row',
  },
  allocationField: {
    flex: 1,
  },
  allocationSpacer: {
    width: SPACING.md,
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
