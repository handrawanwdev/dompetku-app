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
import { DebtModel, DebtType } from '../../../models/DebtModel';
import { today } from '../../../utils/date';
import type { DebtStackParamList } from './DebtListScreen';

// ─── Types ────────────────────────────────────────────────────────────────────

type NavProp = NativeStackNavigationProp<DebtStackParamList, 'DebtForm'>;
type RouteType = RouteProp<DebtStackParamList, 'DebtForm'>;

// ─── Debt Type Options ──────────────────────────────────────────────────────────

const DEBT_TYPES: Array<{ value: DebtType; label: string; hint: string }> = [
  { value: 'tanpa_tenor', label: 'Tanpa Tenor', hint: 'Gak ada tanggal jatuh tempo, dibayar kapan aja. Contoh: pinjam teman, keluarga.' },
  { value: 'berjangka', label: 'Berjangka', hint: 'Ada satu tanggal jatuh tempo pelunasan. Contoh: pinjaman bank, koperasi.' },
  { value: 'cicilan', label: 'Cicilan', hint: 'Dibayar berkala tiap bulan sampai lunas. Contoh: motor, mobil, HP, KPR.' },
  { value: 'revolving', label: 'Revolving', hint: 'Limit bisa dipakai lagi setelah dibayar. Contoh: kartu kredit, paylater.' },
  { value: 'tagihan_rutin', label: 'Tagihan Rutin', hint: 'Muncul berkala tiap bulan, nominal bisa beda-beda. Contoh: listrik, internet, BPJS.' },
];

const HAS_TOTAL_AMOUNT: DebtType[] = ['tanpa_tenor', 'berjangka', 'cicilan', 'revolving'];
const HAS_DUE_DATE: DebtType[] = ['cicilan', 'revolving', 'tagihan_rutin'];

// ─── Validation ───────────────────────────────────────────────────────────────

const schema = z
  .object({
    name: z.string().min(1, 'Nama hutang wajib diisi'),
    lender: z.string().min(1, 'Pemberi hutang wajib diisi'),
    debtType: z.enum(['tanpa_tenor', 'berjangka', 'cicilan', 'revolving', 'tagihan_rutin']),
    totalAmount: z.string(),
    monthlyInstallment: z.string(),
    remainingMonth: z.string(),
    dueDate: z.string(),
    dueDateFull: z.string(),
    currentBalance: z.string(),
    startDate: z.string().min(1, 'Tanggal mulai wajib diisi'),
    note: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const totalNum = parseFloat(data.totalAmount.replace(/[^0-9.]/g, ''));
    const monthlyNum = parseFloat(data.monthlyInstallment.replace(/[^0-9.]/g, ''));
    const remNum = parseInt(data.remainingMonth, 10);
    const dueDateNum = parseInt(data.dueDate, 10);
    const label = data.debtType === 'revolving' ? 'Limit' : 'Jumlah';

    if (HAS_TOTAL_AMOUNT.includes(data.debtType) && (!data.totalAmount || !(totalNum > 0))) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${label} harus lebih dari 0`, path: ['totalAmount'] });
    }
    if (data.debtType === 'berjangka' && !data.dueDateFull) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Tanggal jatuh tempo wajib diisi', path: ['dueDateFull'] });
    }
    if (data.debtType === 'cicilan') {
      if (!data.monthlyInstallment || !(monthlyNum > 0)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Cicilan harus lebih dari 0', path: ['monthlyInstallment'] });
      }
      if (!data.remainingMonth || !(remNum > 0)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Sisa bulan harus lebih dari 0', path: ['remainingMonth'] });
      }
    }
    if (HAS_DUE_DATE.includes(data.debtType) && (!data.dueDate || !(dueDateNum >= 1 && dueDateNum <= 31))) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Masukkan tanggal 1-31', path: ['dueDate'] });
    }
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
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      lender: '',
      debtType: 'cicilan',
      totalAmount: '',
      monthlyInstallment: '',
      remainingMonth: '',
      dueDate: '',
      dueDateFull: '',
      currentBalance: '',
      startDate: today(),
      note: '',
    },
  });

  const debtType = watch('debtType');
  const activeType = DEBT_TYPES.find((t) => t.value === debtType) ?? DEBT_TYPES[2];

  useEffect(() => {
    if (existingDebt) {
      setValue('name', existingDebt.name);
      setValue('lender', existingDebt.lender);
      setValue('debtType', existingDebt.debtType);
      setValue('totalAmount', existingDebt.totalAmount.toString());
      setValue('monthlyInstallment', existingDebt.monthlyInstallment.toString());
      setValue('remainingMonth', existingDebt.remainingMonth.toString());
      setValue('dueDate', existingDebt.dueDate.toString());
      setValue('dueDateFull', existingDebt.dueDateFull);
      setValue('currentBalance', existingDebt.currentBalance.toString());
      setValue('startDate', existingDebt.startDate);
      setValue('note', existingDebt.note);
    }
  }, [existingDebt, setValue]);

  const savingRef = useRef(false);

  const onSubmit = (data: FormValues) => {
    if (savingRef.current) return;
    const totalAmount = HAS_TOTAL_AMOUNT.includes(data.debtType)
      ? parseFloat(data.totalAmount.replace(/[^0-9.]/g, '')) || 0
      : 0;
    const monthlyInstallment = data.monthlyInstallment
      ? parseFloat(data.monthlyInstallment.replace(/[^0-9.]/g, '')) || 0
      : 0;
    const remainingMonth = data.debtType === 'cicilan' ? parseInt(data.remainingMonth, 10) || 0 : 0;
    const dueDate = HAS_DUE_DATE.includes(data.debtType) ? parseInt(data.dueDate, 10) || 0 : 0;
    const dueDateFull = data.debtType === 'berjangka' ? data.dueDateFull : '';
    const currentBalance = data.debtType === 'revolving'
      ? Math.min(totalAmount, parseFloat(data.currentBalance.replace(/[^0-9.]/g, '')) || 0)
      : 0;

    savingRef.current = true;
    realm.write(() => {
      if (isEdit && existingDebt) {
        existingDebt.name = data.name;
        existingDebt.lender = data.lender;
        existingDebt.debtType = data.debtType;
        existingDebt.totalAmount = totalAmount;
        existingDebt.monthlyInstallment = monthlyInstallment;
        existingDebt.remainingMonth = remainingMonth;
        existingDebt.dueDate = dueDate;
        existingDebt.dueDateFull = dueDateFull;
        existingDebt.currentBalance = currentBalance;
        existingDebt.startDate = data.startDate;
        existingDebt.note = data.note ?? '';
      } else {
        realm.create(DebtModel, {
          _id: new Realm.BSON.ObjectId(),
          name: data.name,
          lender: data.lender,
          debtType: data.debtType,
          totalAmount,
          monthlyInstallment,
          remainingMonth,
          dueDate,
          dueDateFull,
          currentBalance,
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

          {/* Debt Type */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Jenis Hutang</Text>
            {DEBT_TYPES.map((t) => {
              const isSelected = debtType === t.value;
              return (
                <TouchableOpacity
                  key={t.value}
                  onPress={() => setValue('debtType', t.value)}
                  style={[styles.typeOption, isSelected && styles.typeOptionActive]}
                  activeOpacity={0.7}
                >
                  <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]} />
                  <Text style={[styles.typeLabel, isSelected && styles.typeLabelActive]}>{t.label}</Text>
                </TouchableOpacity>
              );
            })}
            <Text style={styles.typeHint}>{activeType.hint}</Text>
          </View>

          {/* Total Amount / Limit — tanpa_tenor, berjangka, cicilan, revolving */}
          {HAS_TOTAL_AMOUNT.includes(debtType) && (
            <Controller
              control={control}
              name="totalAmount"
              render={({ field: { onChange, value } }) => (
                <CurrencyInput
                  label={debtType === 'revolving' ? 'Limit Kredit' : 'Jumlah Hutang'}
                  value={value}
                  onChangeText={onChange}
                  error={errors.totalAmount?.message}
                />
              )}
            />
          )}

          {/* Current Balance — revolving only */}
          {debtType === 'revolving' && (
            <Controller
              control={control}
              name="currentBalance"
              render={({ field: { onChange, value } }) => (
                <CurrencyInput
                  label="Saldo Terpakai Saat Ini (opsional)"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          )}

          {/* Monthly Installment — cicilan (required), revolving/tagihan_rutin (estimate) */}
          {debtType !== 'tanpa_tenor' && debtType !== 'berjangka' && (
            <Controller
              control={control}
              name="monthlyInstallment"
              render={({ field: { onChange, value } }) => (
                <CurrencyInput
                  label={debtType === 'cicilan' ? 'Cicilan Per Bulan' : 'Estimasi Tagihan/Bulan (opsional)'}
                  value={value}
                  onChangeText={onChange}
                  error={errors.monthlyInstallment?.message}
                />
              )}
            />
          )}

          {/* Remaining Month (cicilan only) & Due Date row */}
          {HAS_DUE_DATE.includes(debtType) && (
            <View style={styles.rowFields}>
              {debtType === 'cicilan' && (
                <>
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
                </>
              )}
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
          )}

          {/* Due Date Full — berjangka only */}
          {debtType === 'berjangka' && (
            <Controller
              control={control}
              name="dueDateFull"
              render={({ field: { onChange, value } }) => (
                <DateInput
                  label="Tanggal Jatuh Tempo"
                  value={value}
                  onChange={onChange}
                  error={errors.dueDateFull?.message}
                />
              )}
            />
          )}

          {/* Start Date */}
          <Controller
            control={control}
            name="startDate"
            render={({ field: { onChange, value } }) => (
              <DateInput
                label="Tanggal Mulai"
                value={value}
                onChange={onChange}
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
  rowFields: {
    flexDirection: 'row',
  },
  halfField: {
    flex: 1,
  },
  fieldSpacer: {
    width: SPACING.md,
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
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  typeOptionActive: {
    borderColor: COLORS.debt,
    backgroundColor: COLORS.debt + '18',
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: RADIUS.round,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  radioCircleActive: {
    borderColor: COLORS.debt,
    backgroundColor: COLORS.debt,
  },
  typeLabel: {
    fontSize: FONTS.md,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  typeLabelActive: {
    color: COLORS.debt,
    fontWeight: '700',
  },
  typeHint: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  saveBtn: {
    marginBottom: SPACING.md,
  },
  deleteBtn: {
    marginBottom: SPACING.md,
  },
});
