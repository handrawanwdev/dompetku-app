import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { MaterialIcons } from '@expo/vector-icons';
import Realm from 'realm';

import { COLORS, FONTS, ICON_SIZES, SPACING, RADIUS } from '../../../theme';
import {
  Text,
  Button,
  Input,
  DateInput,
  CurrencyInput,
  BackButton,
  TransactionSuccessAnimation,
  SavingSuccessAnimation,
} from '../../../components/common';
import { ExpenseModel } from '../../../models/ExpenseModel';
import { CategoryModel } from '../../../models/CategoryModel';
import { ReminderModel } from '../../../models/ReminderModel';
import { markReminderDone } from '../../../services/ReminderService';
import { useDebts } from '../../debt/useDebts';
import { useGoals } from '../../goal/useGoals';
import { goalAvailable, syncGoalStatus } from '../../../services/GoalService';
import { getBalances, mainAccountId } from '../../../services/AllocationService';
import { AccountPicker } from '../../finance/components/AccountPicker';
import { useAccounts } from '../../finance/useAccounts';
import { KIND_META, SPEND_KINDS, isSpendKind, isKeptKind, type SpendKind } from '../../../utils/budget';
import { formatCurrency } from '../../../utils/currency';
import { today } from '../../../utils/date';
import type { RootStackParamList } from '../../../navigation/types';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'ExpenseForm'>;
type RouteType = RouteProp<RootStackParamList, 'ExpenseForm'>;

const schema = z.object({
  amount: z
    .string()
    .min(1, 'Nominal wajib diisi')
    .refine((v) => parseFloat(v.replace(/[^0-9.]/g, '')) > 0, 'Nominal harus lebih dari 0'),
  category: z.string().min(1, 'Pilih kategori dulu'),
  kind: z.enum(['need', 'obligation', 'want', 'saving', 'invest']),
  fromSavings: z.boolean(),
  debtId: z.string(),
  date: z.string().min(1, 'Tanggal wajib diisi'),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ExpenseFormScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteType>();
  const realm = useRealm();
  const {
    id,
    kind: initialKind,
    debtId: initialDebtId,
    category: initialCategory,
    goalId: initialGoalId,
    fromSavings: initialFromSavings,
    billId,
    billPeriod,
  } = route.params ?? {};
  const isEdit = Boolean(id);

  const allExpenses = useQuery(ExpenseModel);
  const existing = useMemo(() => {
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
      category: initialCategory ?? '',
      kind: isSpendKind(initialKind) ? initialKind : 'need',
      fromSavings: initialFromSavings ?? false,
      debtId: initialDebtId ?? '',
      date: today(),
      note: '',
    },
  });

  useEffect(() => {
    if (existing) {
      setValue('amount', existing.amount.toString());
      setValue('category', existing.category);
      setValue('kind', isSpendKind(existing.kind) ? existing.kind : 'need');
      setValue('fromSavings', existing.source === 'savings');
      setValue('debtId', existing.debtId);
      setValue('date', existing.date);
      setValue('note', existing.note);
    }
  }, [existing, setValue]);

  const expenseCategories = useQuery(CategoryModel, (c) => c.filtered('type == "expense"').sorted('createdAt'), []);
  const selectedCategory = watch('category');

  // Kategori dikelompokkan per jenis. Jenis yang dipilih dari filter tampil paling atas.
  const groups = useMemo(() => {
    const order = isSpendKind(initialKind)
      ? [initialKind, ...SPEND_KINDS.filter((k) => k !== initialKind)]
      : SPEND_KINDS;
    const items = expenseCategories.map((c) => ({ name: c.name, emoji: c.emoji, kind: isSpendKind(c.kind) ? c.kind : 'need' as SpendKind }));
    // Kategori transaksi lama yang sudah tidak ada di daftar tetap bisa dipilih saat edit.
    if (existing && !items.some((c) => c.name === existing.category)) {
      items.push({ name: existing.category, emoji: '📌', kind: isSpendKind(existing.kind) ? existing.kind : 'need' });
    }
    return order.map((k) => ({ kind: k, items: items.filter((c) => c.kind === k) }));
  }, [expenseCategories, existing, initialKind]);

  const pickCategory = (name: string, k: SpendKind) => {
    setValue('category', name, { shouldValidate: true });
    setValue('kind', k);
  };

  const kind = watch('kind');
  const fromSavings = watch('fromSavings') && kind !== 'saving';
  const debtId = watch('debtId');

  // Kewajiban yang bisa dihubungkan: yang belum lunas, plus yang sedang terpilih.
  const debts = useDebts();
  const debtOptions = useMemo(
    () => debts.filter((d) => !d.lunas || d.id === debtId),
    [debts, debtId],
  );
  const pickDebt = (id: string) => {
    setValue('debtId', id);
    const d = debts.find((x) => x.id === id);
    if (d && !watch('amount') && d.debt.monthlyInstallment > 0) {
      setValue('amount', String(Math.min(d.debt.monthlyInstallment, d.remaining)));
    }
  };

  // Dibuka dari halaman kewajiban: isi nominal cicilan sekali di awal.
  useEffect(() => {
    if (!existing && initialDebtId) pickDebt(initialDebtId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dibuka dari pengingat tagihan (daftar atau notif): isi nominal, kategori, catatan.
  useEffect(() => {
    if (existing || !billId || !Realm.BSON.ObjectId.isValid(billId)) return;
    const bill = realm.objectForPrimaryKey(ReminderModel, new Realm.BSON.ObjectId(billId));
    if (!bill) return;
    if (bill.amount > 0) setValue('amount', String(bill.amount));
    const cat = expenseCategories.find((c) => c.name === bill.categoryName);
    if (cat) pickCategory(cat.name, isSpendKind(cat.kind) ? cat.kind : 'need');
    setValue('note', bill.title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Saldo yang tersedia, tidak menghitung baris yang sedang diedit.
  const balances = getBalances(realm);
  const available = useMemo(() => {
    let spendable = balances.spendable;
    let savings = balances.savings;
    if (existing) {
      if (existing.source === 'cash') spendable += existing.amount;
      if (existing.source === 'savings') savings += existing.amount;
      else if (existing.kind === 'saving') savings -= existing.amount;
    }
    return { spendable, savings };
  }, [balances.spendable, balances.savings, existing]);

  // Pembelian investasi/aset: nominal/kategori/tanggal dikelola dari halamannya.
  const linkedRef = existing?.assetRef ?? '';
  // Goal: setoran (jenis Tabungan) atau pemakaian dana (bayar pakai tabungan).
  const goals = useGoals();
  const [goalId, setGoalId] = useState(() => existing?.goalId ?? initialGoalId ?? '');
  const initialGoalPocket = useMemo(
    () => (existing ? '' : goals.find((g) => g.id === initialGoalId)?.goal.accountId ?? ''),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const savingsPockets = useAccounts().list.filter((a) => a.account.isSavings);
  // Pakai dana goal: ambil dari kantong goal, atau kantong tabungan pertama.
  const [accountId, setAccountId] = useState(
    () =>
      existing?.accountId ??
      ((initialFromSavings && (initialGoalPocket || savingsPockets[0]?.id)) || mainAccountId(realm)),
  );
  // Sisihkan: kantong tabungan tujuan. Baru = kantong goal, lalu kantong tabungan pertama.
  const [toAccountId, setToAccountId] = useState(
    () => existing?.toAccountId ?? (initialGoalPocket || savingsPockets[0]?.id || ''),
  );

  const goalOptions = useMemo(
    () => goals.filter((g) => g.id === goalId || (kind === 'saving' ? !g.done : g.saved > 0)),
    [goals, goalId, kind],
  );
  const pickGoal = (gid: string) => {
    setGoalId(gid);
    const pocket = goals.find((g) => g.id === gid)?.goal.accountId;
    if (!pocket) return;
    if (kind === 'saving') {
      if (pocket !== accountId) setToAccountId(pocket);
    } else {
      setAccountId(pocket);
    }
  };
  const goalPicker = (label: string) =>
    goalOptions.length > 0 && (
      <View style={styles.goalPicker}>
        <Text style={styles.debtLabel}>{label}</Text>
        <View style={styles.chipWrap}>
          {[{ id: '', label: 'Tidak untuk goal' }, ...goalOptions.map((g) => ({ id: g.id, label: g.goal.name }))].map((o) => {
            const active = goalId === o.id;
            return (
              <TouchableOpacity
                key={o.id || 'none'}
                onPress={() => pickGoal(o.id)}
                style={[styles.chip, active && { borderColor: COLORS.saving, backgroundColor: COLORS.saving + '1A' }]}
                activeOpacity={0.7}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{o.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {goalId ? (() => {
          const g = goals.find((x) => x.id === goalId);
          if (!g) return null;
          return (
            <Text style={styles.debtHint}>
              {kind === 'saving'
                ? `Terkumpul ${formatCurrency(Math.max(g.saved, 0))} dari ${formatCurrency(g.goal.target)}.`
                : `Dana goal ${formatCurrency(Math.max(g.saved, 0))} akan berkurang.`}
            </Text>
          );
        })() : null}
      </View>
    );

  const toggleFromSavings = () => {
    const next = !fromSavings;
    setValue('fromSavings', next);
    // Bayar pakai tabungan: ambil dari kantong tabungan kalau ada.
    if (next && savingsPockets.length && !savingsPockets.some((a) => a.id === accountId)) {
      setAccountId(savingsPockets[0].id);
    }
  };

  const savingRef = useRef(false);
  const [success, setSuccess] = useState<{ amount: number; kind: SpendKind } | null>(null);
  const reachedRef = useRef('');

  const finish = () => {
    const reached = reachedRef.current;
    if (reached) {
      Alert.alert('Goal tercapai', `Target "${reached}" sudah terkumpul.`);
      reachedRef.current = '';
    }
    navigation.goBack();
  };

  const onSubmit = (data: FormValues) => {
    if (savingRef.current) return;
    const amount = parseFloat(data.amount.replace(/[^0-9.]/g, ''));
    const useSavings = data.fromSavings && data.kind !== 'saving';

    if (useSavings && amount > available.savings) {
      Alert.alert('Tabungan tidak cukup', `Tabungan kamu ${formatCurrency(available.savings)}.`);
      return;
    }
    if ((data.kind === 'saving' || (data.kind === 'invest' && !useSavings)) && amount > available.spendable) {
      Alert.alert('Saldo tidak cukup', `Saldo yang bisa dipakai ${formatCurrency(available.spendable)}.`);
      return;
    }

    const category = data.category;
    const source = useSavings ? 'savings' : 'cash';
    const linkedDebt = data.kind === 'obligation' ? data.debtId : '';
    const savedTo = data.kind === 'saving' && toAccountId !== accountId ? toAccountId : '';
    const linkedGoal = data.kind === 'saving' || useSavings ? goalId : '';
    const prevGoal = existing?.goalId ?? '';

    if (useSavings && linkedGoal) {
      const left = goalAvailable(realm, linkedGoal, existing?._id.toHexString());
      if (amount > left) {
        Alert.alert('Dana goal tidak cukup', `Dana goal ini ${formatCurrency(Math.max(left, 0))}.`);
        return;
      }
    }

    savingRef.current = true;
    realm.write(() => {
      if (isEdit && existing) {
        existing.amount = amount;
        existing.kind = data.kind;
        existing.category = category;
        existing.source = source;
        existing.savingId = '';
        existing.debtId = linkedDebt;
        existing.accountId = accountId;
        existing.toAccountId = savedTo;
        existing.goalId = linkedGoal;
        existing.date = data.date;
        existing.note = data.note ?? '';
      } else {
        realm.create(ExpenseModel, {
          _id: new Realm.BSON.ObjectId(),
          amount,
          kind: data.kind,
          category,
          source,
          savingId: '',
          debtId: linkedDebt,
          accountId,
          toAccountId: savedTo,
          goalId: linkedGoal,
          date: data.date,
          note: data.note ?? '',
          createdAt: new Date(),
        });
      }
      if (!isEdit && billId && billPeriod) markReminderDone(realm, billId, billPeriod);
      if (prevGoal && prevGoal !== linkedGoal) syncGoalStatus(realm, prevGoal);
      if (syncGoalStatus(realm, linkedGoal)) {
        reachedRef.current = goals.find((g) => g.id === linkedGoal)?.goal.name ?? '';
      }
    });

    if (isEdit) {
      finish();
    } else {
      setSuccess({ amount, kind: data.kind });
    }
  };

  const handleDelete = () => {
    Alert.alert('Hapus catatan ini?', 'Saldo kamu akan dihitung ulang tanpa catatan ini.', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => {
          if (existing) {
            const gid = existing.goalId;
            realm.write(() => {
              realm.delete(existing);
              syncGoalStatus(realm, gid);
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

      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {linkedRef ? (
            <View style={styles.linkedCard}>
              <View style={styles.linkedHead}>
                <MaterialIcons name={KIND_META.invest.icon} size={ICON_SIZES.md} color={COLORS.invest} />
                <Text style={styles.linkedTitle}>{existing?.category} · {formatCurrency(existing?.amount ?? 0)}</Text>
              </View>
              <Text style={styles.linkedText}>
                Dicatat otomatis dari halaman {linkedRef.startsWith('asset:') ? 'Aset' : 'Investasi'}. Nominal, kategori,
                dan tanggal ikut data di sana. Di sini kamu cuma bisa ganti kantongnya.
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate(linkedRef.startsWith('asset:') ? 'Assets' : 'Investments')}
                hitSlop={8}
              >
                <Text style={styles.manageLink}>Buka {linkedRef.startsWith('asset:') ? 'Aset' : 'Investasi'}</Text>
              </TouchableOpacity>
            </View>
          ) : (
          <>
          <Controller
            control={control}
            name="amount"
            render={({ field: { onChange, value } }) => (
              <CurrencyInput label="Nominal" value={value} onChangeText={onChange} error={errors.amount?.message} />
            )}
          />

          {/* Kategori, dikelompokkan per jenis */}
          <View style={styles.fieldGroup}>
            <View style={styles.categoryHead}>
              <Text style={styles.fieldLabel}>Kategori</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Categories')}
                hitSlop={8}
              >
                <Text style={styles.manageLink}>Atur kategori</Text>
              </TouchableOpacity>
            </View>
            {groups.map((g) => {
              if (!g.items.length) return null;
              const m = KIND_META[g.kind];
              return (
                <View key={g.kind} style={styles.group}>
                  <View style={styles.groupHead}>
                    <MaterialIcons name={m.icon} size={ICON_SIZES.sm} color={m.color} />
                    <Text style={styles.groupLabel}>{m.label}</Text>
                  </View>
                  <View style={styles.chipWrap}>
                    {g.items.map((c) => {
                      const active = selectedCategory === c.name;
                      return (
                        <TouchableOpacity
                          key={c.name}
                          onPress={() => pickCategory(c.name, c.kind)}
                          style={[styles.chip, active && { borderColor: m.color, backgroundColor: m.color + '1A' }]}
                          activeOpacity={0.7}
                          accessibilityRole="radio"
                          accessibilityState={{ selected: active }}
                        >
                          <Text style={styles.chipEmoji}>{c.emoji}</Text>
                          <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{c.name}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  {/* Hubungkan ke kewajiban: pembayarannya mengurangi sisa utang */}
                  {g.kind === 'obligation' && kind === 'obligation' && debtOptions.length > 0 && (
            <View style={styles.debtPicker}>
              <Text style={styles.debtLabel}>Untuk kewajiban</Text>
              <View style={styles.chipWrap}>
                {[{ id: '', label: 'Tidak terkait' }, ...debtOptions.map((d) => ({ id: d.id, label: d.debt.name }))].map((o) => {
                  const active = debtId === o.id;
                  return (
                    <TouchableOpacity
                      key={o.id || 'none'}
                      onPress={() => pickDebt(o.id)}
                      style={[styles.chip, active && { borderColor: COLORS.obligation, backgroundColor: COLORS.obligation + '1A' }]}
                      activeOpacity={0.7}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: active }}
                    >
                      <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{o.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {debtId ? (
                <Text style={styles.debtHint}>
                  Sisa {formatCurrency(debts.find((d) => d.id === debtId)?.remaining ?? 0)} akan berkurang.
                </Text>
              ) : null}
            </View>
                  )}
                </View>
              );
            })}
            {errors.category && <Text style={styles.errorText}>{errors.category.message}</Text>}
          </View>
          </>
          )}

          {/* Sumber dana */}
          {linkedRef ? (
            <AccountPicker label="Dibayar dari" value={accountId} onChange={setAccountId} />
          ) : kind === 'saving' ? (
            <>
              <AccountPicker label="Diambil dari" value={accountId} onChange={setAccountId} />
              <AccountPicker
                label="Simpan ke"
                onlySavings
                value={toAccountId}
                onChange={setToAccountId}
                exclude={accountId}
                noneLabel="Biarkan di kantong ini"
              />
              {goalPicker('Untuk goal')}
              <Text style={styles.balanceHint}>
                Disisihkan dari saldo bisa dipakai ({formatCurrency(available.spendable)}).
              </Text>
            </>
          ) : (
            <>
            <AccountPicker label="Dibayar dari" value={accountId} onChange={setAccountId} />
            <TouchableOpacity
              style={styles.toggleRow}
              onPress={toggleFromSavings}
              activeOpacity={0.7}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: fromSavings }}
            >
              <MaterialIcons
                name={fromSavings ? 'check-box' : 'check-box-outline-blank'}
                size={ICON_SIZES.lg}
                color={fromSavings ? COLORS.primary : COLORS.textMuted}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleLabel}>Bayar pakai tabungan</Text>
                <Text style={styles.toggleSub}>Tabungan kamu {formatCurrency(available.savings)}</Text>
              </View>
            </TouchableOpacity>
            {fromSavings && goalPicker('Ambil dari goal')}
            </>
          )}

          {!linkedRef && (
          <>
          <Controller
            control={control}
            name="date"
            render={({ field: { onChange, value } }) => (
              <DateInput label="Tanggal" value={value} onChange={onChange} error={errors.date?.message} />
            )}
          />

          <Controller
            control={control}
            name="note"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Catatan (opsional)"
                placeholder={kind === 'saving' ? 'Contoh: dana darurat' : kind === 'invest' ? 'Contoh: beli reksa dana' : 'Contoh: makan siang'}
                value={value}
                onChangeText={onChange}
                multiline
                numberOfLines={3}
                style={{ height: 72, textAlignVertical: 'top' }}
              />
            )}
          />
          </>
          )}

          <Button
            title={isEdit ? 'Simpan perubahan' : 'Simpan'}
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            fullWidth
            style={styles.saveBtn}
          />

          {isEdit && !linkedRef && (
            <Button
              title="Hapus"
              onPress={handleDelete}
              variant="ghost"
              fullWidth
              style={styles.deleteBtn}
              textStyle={{ color: COLORS.danger }}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <TransactionSuccessAnimation
        visible={success !== null && !isKeptKind(success.kind)}
        amount={success?.amount ?? 0}
        kind="expense"
        onFinish={finish}
      />
      <SavingSuccessAnimation
        visible={success !== null && isKeptKind(success.kind)}
        amount={success?.amount ?? 0}
        type="deposit"
        onFinish={finish}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  linkedCard: {
    backgroundColor: COLORS.invest + '14',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  linkedHead: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  linkedTitle: { flex: 1, fontSize: FONTS.md, fontWeight: '700', color: COLORS.text },
  linkedText: { fontSize: FONTS.sm, color: COLORS.textSecondary, lineHeight: 20 },
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  scroll: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: SPACING.xl, paddingBottom: SPACING.xxxl },
  fieldGroup: { marginBottom: SPACING.lg },
  fieldLabel: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    fontWeight: '500',
  },
  categoryHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  manageLink: { fontSize: FONTS.sm, fontWeight: '600', color: COLORS.primary },
  group: { marginBottom: SPACING.md },
  groupHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: SPACING.sm },
  groupLabel: { fontSize: FONTS.sm, fontWeight: '700', color: COLORS.text },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  chipEmoji: { fontSize: FONTS.md },
  chipLabel: { fontSize: FONTS.sm, fontWeight: '500', color: COLORS.textSecondary },
  chipLabelActive: { color: COLORS.text, fontWeight: '700' },
  errorText: { fontSize: FONTS.sm, color: COLORS.danger, marginTop: SPACING.xs },
  debtPicker: { marginTop: SPACING.md, padding: SPACING.md, borderRadius: RADIUS.md, backgroundColor: COLORS.subtleBg },
  debtLabel: { fontSize: FONTS.sm, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.sm },
  goalPicker: { marginBottom: SPACING.lg, padding: SPACING.md, borderRadius: RADIUS.md, backgroundColor: COLORS.subtleBg },
  debtHint: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: SPACING.sm },
  balanceHint: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: -SPACING.xs, marginBottom: SPACING.lg },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  toggleLabel: { fontSize: FONTS.md, fontWeight: '600', color: COLORS.text },
  toggleSub: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: 2 },
  saveBtn: { marginBottom: SPACING.md },
  deleteBtn: { marginBottom: SPACING.md },
});
