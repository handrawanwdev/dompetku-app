import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
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
import { Text, Button, Input, DateInput, CurrencyInput, BackButton } from '../../../components/common';
import { IncomeModel } from '../../../models/IncomeModel';
import { today } from '../../../utils/date';
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

  // Populate form when editing
  useEffect(() => {
    if (existingIncome) {
      setValue('amount', existingIncome.amount.toString());
      setValue('category', existingIncome.category);
      setValue('date', existingIncome.date);
      setValue('note', existingIncome.note);
    }
  }, [existingIncome, setValue]);

  const savingRef = useRef(false);

  const onSubmit = (data: FormValues) => {
    if (savingRef.current) return;
    const amount = parseFloat(data.amount.replace(/[^0-9.]/g, ''));

    savingRef.current = true;
    realm.write(() => {
      if (isEdit && existingIncome) {
        existingIncome.amount = amount;
        existingIncome.category = data.category;
        existingIncome.date = data.date;
        existingIncome.note = data.note ?? '';
        existingIncome.allocationDebt = 0;
        existingIncome.allocationSavings = 0;
        existingIncome.allocationCash = amount;
        existingIncome.allocationDebtId = '';
        existingIncome.allocationSavingId = '';
      } else {
        realm.create(IncomeModel, {
          _id: new Realm.BSON.ObjectId(),
          amount,
          category: data.category,
          date: data.date,
          note: data.note ?? '',
          allocationDebt: 0,
          allocationSavings: 0,
          allocationCash: amount,
          allocationDebtId: '',
          allocationSavingId: '',
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
            realm.write(() => {
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
  saveBtn: {
    marginBottom: SPACING.md,
  },
  deleteBtn: {
    marginBottom: SPACING.md,
  },
});
