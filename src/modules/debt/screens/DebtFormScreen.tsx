import React, { useEffect, useMemo } from 'react';
import {
  View,
  ScrollView,
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

import { COLORS, FONTS, SPACING } from '../../../theme';
import { Text, Button, Input, BackButton } from '../../../components/common';
import { DebtModel } from '../../../models/DebtModel';
import { today } from '../../../utils/date';
import type { DebtStackParamList } from './DebtListScreen';

// ─── Types ────────────────────────────────────────────────────────────────────

type NavProp = NativeStackNavigationProp<DebtStackParamList, 'DebtForm'>;
type RouteType = RouteProp<DebtStackParamList, 'DebtForm'>;

// ─── Validation ───────────────────────────────────────────────────────────────

const schema = z.object({
  name: z.string().min(1, 'Nama hutang wajib diisi'),
  lender: z.string().min(1, 'Pemberi hutang wajib diisi'),
  totalAmount: z
    .string()
    .min(1, 'Total hutang wajib diisi')
    .refine((v) => parseFloat(v.replace(/[^0-9.]/g, '')) > 0, 'Total harus lebih dari 0'),
  monthlyInstallment: z
    .string()
    .min(1, 'Cicilan bulanan wajib diisi')
    .refine((v) => parseFloat(v.replace(/[^0-9.]/g, '')) > 0, 'Cicilan harus lebih dari 0'),
  remainingMonth: z
    .string()
    .min(1, 'Sisa bulan wajib diisi')
    .refine((v) => parseInt(v, 10) > 0, 'Sisa bulan harus lebih dari 0'),
  dueDate: z
    .string()
    .min(1, 'Tanggal jatuh tempo wajib diisi')
    .refine(
      (v) => parseInt(v, 10) >= 1 && parseInt(v, 10) <= 31,
      'Masukkan tanggal 1-31',
    ),
  startDate: z.string().min(1, 'Tanggal mulai wajib diisi'),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

// ─── Screen ───────────────────────────────────────────────────────────────────

export function DebtFormScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteType>();
  const realm = useRealm();
  const { id } = route.params ?? {};
  const isEdit = Boolean(id);

  const allDebts = useQuery(DebtModel);
  const existingDebt = useMemo(() => {
    if (!id) return null;
    return allDebts.find((d) => d._id.toHexString() === id) ?? null;
  }, [allDebts, id]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      lender: '',
      totalAmount: '',
      monthlyInstallment: '',
      remainingMonth: '',
      dueDate: '',
      startDate: today(),
      note: '',
    },
  });

  useEffect(() => {
    if (existingDebt) {
      setValue('name', existingDebt.name);
      setValue('lender', existingDebt.lender);
      setValue('totalAmount', existingDebt.totalAmount.toString());
      setValue('monthlyInstallment', existingDebt.monthlyInstallment.toString());
      setValue('remainingMonth', existingDebt.remainingMonth.toString());
      setValue('dueDate', existingDebt.dueDate.toString());
      setValue('startDate', existingDebt.startDate);
      setValue('note', existingDebt.note);
    }
  }, [existingDebt, setValue]);

  const onSubmit = (data: FormValues) => {
    const totalAmount = parseFloat(data.totalAmount.replace(/[^0-9.]/g, ''));
    const monthlyInstallment = parseFloat(data.monthlyInstallment.replace(/[^0-9.]/g, ''));
    const remainingMonth = parseInt(data.remainingMonth, 10);
    const dueDate = parseInt(data.dueDate, 10);

    realm.write(() => {
      if (isEdit && existingDebt) {
        existingDebt.name = data.name;
        existingDebt.lender = data.lender;
        existingDebt.totalAmount = totalAmount;
        existingDebt.monthlyInstallment = monthlyInstallment;
        existingDebt.remainingMonth = remainingMonth;
        existingDebt.dueDate = dueDate;
        existingDebt.startDate = data.startDate;
        existingDebt.note = data.note ?? '';
      } else {
        realm.create(DebtModel, {
          _id: new Realm.BSON.ObjectId(),
          name: data.name,
          lender: data.lender,
          totalAmount,
          monthlyInstallment,
          remainingMonth,
          dueDate,
          startDate: data.startDate,
          note: data.note ?? '',
          isActive: true,
          createdAt: new Date(),
        });
      }
    });

    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert('Hapus Hutang', 'Yakin ingin menghapus hutang ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => {
          if (existingDebt) {
            realm.write(() => {
              existingDebt.isActive = false;
            });
          }
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.topbar} />

      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>{isEdit ? 'Edit Hutang' : 'Tambah Hutang'}</Text>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Name */}
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Nama Hutang"
                placeholder="contoh: KPR Bank BCA"
                value={value}
                onChangeText={onChange}
                error={errors.name?.message}
              />
            )}
          />

          {/* Lender */}
          <Controller
            control={control}
            name="lender"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Pemberi Hutang / Kreditur"
                placeholder="contoh: Bank BCA"
                value={value}
                onChangeText={onChange}
                error={errors.lender?.message}
              />
            )}
          />

          {/* Total Amount */}
          <Controller
            control={control}
            name="totalAmount"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Total Hutang"
                prefix="Rp"
                placeholder="0"
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
                error={errors.totalAmount?.message}
              />
            )}
          />

          {/* Monthly Installment */}
          <Controller
            control={control}
            name="monthlyInstallment"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Cicilan Per Bulan"
                prefix="Rp"
                placeholder="0"
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
                error={errors.monthlyInstallment?.message}
              />
            )}
          />

          {/* Remaining Month & Due Date row */}
          <View style={styles.rowFields}>
            <View style={styles.halfField}>
              <Controller
                control={control}
                name="remainingMonth"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Sisa Bulan"
                    placeholder="0"
                    keyboardType="numeric"
                    value={value}
                    onChangeText={onChange}
                    suffix="bln"
                    error={errors.remainingMonth?.message}
                  />
                )}
              />
            </View>
            <View style={styles.fieldSpacer} />
            <View style={styles.halfField}>
              <Controller
                control={control}
                name="dueDate"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Tgl Jatuh Tempo"
                    placeholder="1-31"
                    keyboardType="numeric"
                    value={value}
                    onChangeText={onChange}
                    prefix="Tgl"
                    error={errors.dueDate?.message}
                  />
                )}
              />
            </View>
          </View>

          {/* Start Date */}
          <Controller
            control={control}
            name="startDate"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Tanggal Mulai"
                placeholder="YYYY-MM-DD"
                value={value}
                onChangeText={onChange}
                error={errors.startDate?.message}
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
            title={isEdit ? 'Simpan Perubahan' : 'Simpan Hutang'}
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            fullWidth
            style={styles.saveBtn}
          />

          {/* Delete */}
          {isEdit && (
            <Button
              title="Nonaktifkan Hutang"
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
    backgroundColor: COLORS.topbar,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.topbar,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: FONTS.lg,
    fontWeight: '600',
    color: '#ffffff',
  },
  headerRight: {
    width: 36,
  },
  scroll: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  rowFields: {
    flexDirection: 'row',
  },
  halfField: {
    flex: 1,
  },
  fieldSpacer: {
    width: SPACING.md,
  },
  saveBtn: {
    marginBottom: SPACING.md,
  },
  deleteBtn: {
    marginBottom: SPACING.md,
  },
});
