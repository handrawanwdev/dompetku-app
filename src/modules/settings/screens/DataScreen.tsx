import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRealm, useQuery } from '@realm/react';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import Realm from 'realm';

import { COLORS, FONTS, ICON_SIZES, SPACING, RADIUS } from '../../../theme';
import { Card } from '../../../components/common/Card';
import { IncomeModel } from '../../../models/IncomeModel';
import { ExpenseModel } from '../../../models/ExpenseModel';
import { DebtModel } from '../../../models/DebtModel';
import { InvestmentModel } from '../../../models/InvestmentModel';
import { PhysicalAssetModel } from '../../../models/PhysicalAssetModel';
import { CategoryModel } from '../../../models/CategoryModel';
import { PassiveIncomeModel } from '../../../models/PassiveIncomeModel';
import { AccountModel } from '../../../models/AccountModel';
import { TransferModel } from '../../../models/TransferModel';
import { GoalModel } from '../../../models/GoalModel';
import { ReminderModel } from '../../../models/ReminderModel';
import { isSpendKind, kindFromLegacyCategory } from '../../../utils/budget';
import { today } from '../../../utils/date';
import { normalizeExpenseCategories } from '../../../services/CategoryService';
import { convertLegacyDebt } from '../../../utils/debt';
import { pauseAutoLock } from '../../../services/AppLockService';

function Row({
  icon,
  color,
  label,
  sub,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  label: string;
  sub: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.rowIcon, { backgroundColor: color + '1A' }]}>
        <MaterialIcons name={icon} size={ICON_SIZES.md} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowLabel, color === COLORS.danger && { color: COLORS.danger }]}>{label}</Text>
        <Text style={styles.rowSub}>{sub}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={ICON_SIZES.lg} color={COLORS.textMuted} />
    </TouchableOpacity>
  );
}

/** Backup, restore, dan reset data. */
export function DataScreen() {
  const realm = useRealm();
  const incomes = useQuery(IncomeModel);
  const expenses = useQuery(ExpenseModel);
  const debts = useQuery(DebtModel);
  const investments = useQuery(InvestmentModel);
  const physicalAssets = useQuery(PhysicalAssetModel);
  const categories = useQuery(CategoryModel);
  const passiveIncomes = useQuery(PassiveIncomeModel);
  const accounts = useQuery(AccountModel);
  const transfers = useQuery(TransferModel);
  const goals = useQuery(GoalModel);
  const reminders = useQuery(ReminderModel);

  const handleExport = async () => {
    try {
      const data = {
        version: 6,
        exportDate: new Date().toISOString(),
        incomes: incomes.map(i => ({ ...i, _id: i._id.toHexString() })),
        expenses: expenses.map(e => ({ ...e, _id: e._id.toHexString() })),
        debts: debts.map(d => ({ ...d, _id: d._id.toHexString() })),
        investments: investments.map(i => ({ ...i, _id: i._id.toHexString() })),
        physicalAssets: physicalAssets.map(a => ({ ...a, _id: a._id.toHexString() })),
        categories: categories.map(c => ({ ...c, _id: c._id.toHexString() })),
        passiveIncomes: passiveIncomes.map(p => ({ ...p, _id: p._id.toHexString() })),
        accounts: accounts.map(a => ({ ...a, _id: a._id.toHexString() })),
        transfers: transfers.map(t => ({ ...t, _id: t._id.toHexString() })),
        goals: goals.map(g => ({ ...g, _id: g._id.toHexString() })),
        reminders: reminders.map(r => ({ ...r, _id: r._id.toHexString() })),
      };

      const filename = `dompetku_backup_${new Date().toISOString().split('T')[0]}.json`;
      const file = new File(Paths.document, filename);
      file.write(JSON.stringify(data, null, 2));

      if (await Sharing.isAvailableAsync()) {
        pauseAutoLock();
        await Sharing.shareAsync(file.uri, { mimeType: 'application/json' });
      } else {
        Alert.alert('File cadangan siap', 'Simpan file-nya di tempat yang aman.');
      }
    } catch (e) {
      Alert.alert('Gagal membuat cadangan', 'Coba lagi sebentar.');
    }
  };

  const handleImport = async () => {
    Alert.alert(
      'Pulihkan dari file?',
      'Semua data di HP ini akan diganti dengan isi file cadangan.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Pulihkan',
          style: 'destructive',
          onPress: async () => {
            try {
              pauseAutoLock();
              const result = await DocumentPicker.getDocumentAsync({
                type: 'application/json',
                copyToCacheDirectory: true,
              });

              if (result.canceled) return;

              const content = await new File(result.assets[0].uri).text();
              const data = JSON.parse(content);

              realm.write(() => {
                realm.deleteAll();
                data.incomes?.forEach((item: any) => {
                  realm.create(IncomeModel, { ...item, _id: new Realm.BSON.ObjectId(item._id), createdAt: new Date(item.createdAt) });
                });
                let legacySavingsTotal = 0;
                let derivedSavings = 0;
                data.expenses?.forEach((item: any) => {
                  // Backup lama (v1) belum punya jenis — petakan dari kategori.
                  const kind = isSpendKind(item.kind) ? item.kind : kindFromLegacyCategory(item.category);
                  const legacySaving = !item.kind && kind === 'saving';
                  realm.create(ExpenseModel, {
                    ...item,
                    kind,
                    category: legacySaving ? 'Tabungan' : item.category,
                    isInternal: legacySaving ? false : (item.isInternal ?? false),
                    _id: new Realm.BSON.ObjectId(item._id),
                    createdAt: new Date(item.createdAt),
                  });
                  if (item.source === 'savings') derivedSavings -= item.amount;
                  else if (kind === 'saving') derivedSavings += item.amount;
                });
                // Backup lama (≤ v2) pakai 5 tipe utang + DebtPayment terpisah.
                data.debts?.forEach((item: any) => {
                  const base = {
                    _id: new Realm.BSON.ObjectId(item._id),
                    name: item.name,
                    startDate: item.startDate ?? today(),
                    createdAt: new Date(item.createdAt),
                  };
                  if (!item.debtType) {
                    realm.create(DebtModel, { ...base, totalAmount: item.totalAmount, paidBefore: item.paidBefore ?? 0, monthlyInstallment: item.monthlyInstallment ?? 0, dueDate: item.dueDate ?? 0, note: item.note ?? '' });
                    return;
                  }
                  const paid = (data.debtPayments ?? [])
                    .filter((p: any) => p.debtId === item._id)
                    .reduce((s: number, p: any) => s + p.amount, 0);
                  const converted = convertLegacyDebt(item, paid, 0);
                  if (converted) realm.create(DebtModel, { ...base, ...converted });
                });
                // Backup lama (v1) menyimpan pos tabungan terpisah — gabungkan saldonya.
                data.savings?.forEach((item: any) => {
                  legacySavingsTotal += item.balance ?? 0;
                });
                const diff = legacySavingsTotal - derivedSavings;
                if (data.savings && Math.abs(diff) >= 1) {
                  realm.create(ExpenseModel, {
                    _id: new Realm.BSON.ObjectId(),
                    date: today(),
                    category: 'Saldo awal tabungan',
                    kind: 'saving',
                    amount: diff,
                    source: 'adjust',
                    note: 'Gabungan saldo pos tabungan lama',
                    isInternal: true,
                    createdAt: new Date(),
                  });
                }
                data.investments?.forEach((item: any) => {
                  realm.create(InvestmentModel, { ...item, _id: new Realm.BSON.ObjectId(item._id), createdAt: new Date(item.createdAt) });
                });
                data.physicalAssets?.forEach((item: any) => {
                  realm.create(PhysicalAssetModel, { ...item, _id: new Realm.BSON.ObjectId(item._id), createdAt: new Date(item.createdAt) });
                });
                data.categories?.forEach((item: any) => {
                  realm.create(CategoryModel, { ...item, _id: new Realm.BSON.ObjectId(item._id), createdAt: new Date(item.createdAt) });
                });
                data.passiveIncomes?.forEach((item: any) => {
                  realm.create(PassiveIncomeModel, { ...item, _id: new Realm.BSON.ObjectId(item._id), createdAt: new Date(item.createdAt) });
                });
                data.accounts?.forEach((item: any) => {
                  realm.create(AccountModel, { ...item, _id: new Realm.BSON.ObjectId(item._id), createdAt: new Date(item.createdAt) });
                });
                data.transfers?.forEach((item: any) => {
                  realm.create(TransferModel, { ...item, _id: new Realm.BSON.ObjectId(item._id), createdAt: new Date(item.createdAt) });
                });
                // Ambil field yang dikenal saja (goal skema lama punya savingId/emoji).
                data.goals?.forEach((item: any) => {
                  realm.create(GoalModel, {
                    _id: new Realm.BSON.ObjectId(item._id),
                    name: item.name,
                    icon: item.icon ?? 'flag',
                    target: item.target,
                    deadline: item.deadline ?? '',
                    accountId: item.accountId ?? '',
                    doneAt: item.doneAt ?? '',
                    note: item.note ?? '',
                    createdAt: new Date(item.createdAt),
                  });
                });
                data.reminders?.forEach((item: any) => {
                  realm.create(ReminderModel, {
                    _id: new Realm.BSON.ObjectId(item._id),
                    title: item.title,
                    amount: item.amount ?? 0,
                    categoryName: item.categoryName ?? '',
                    repeat: item.repeat ?? 'monthly',
                    dueDate: item.dueDate,
                    lastDonePeriod: item.lastDonePeriod ?? '',
                    createdAt: new Date(item.createdAt),
                  });
                });
                normalizeExpenseCategories(realm);
              });

              Alert.alert('Data dipulihkan', 'Semua data dari file cadangan sudah masuk.');
            } catch (e) {
              Alert.alert('File tidak bisa dibaca', 'Pastikan yang dipilih file cadangan dari Dompetku.');
            }
          },
        },
      ]
    );
  };

  const handleReset = () => {
    Alert.alert(
      'Hapus semua data?',
      'Semua catatan akan hilang permanen dan tidak bisa dikembalikan. Buat cadangan dulu kalau ragu.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus semua',
          style: 'destructive',
          onPress: () => {
            realm.write(() => realm.deleteAll());
            Alert.alert('Data sudah dihapus', 'Dompetku kembali kosong seperti baru.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Cadangkan data</Text>
        <Text style={styles.desc}>Semua data cuma ada di HP ini. Buat cadangan sesekali supaya aman kalau HP hilang atau ganti HP.</Text>
        <Card padding={0}>
          <Row icon="file-upload" color={COLORS.income} label="Simpan ke file" sub="Buat file cadangan untuk disimpan di Drive atau dipindah ke HP lain" onPress={handleExport} />
          <View style={styles.separator} />
          <Row icon="file-download" color={COLORS.need} label="Pulihkan dari file" sub="Ganti data sekarang dengan isi file cadangan" onPress={handleImport} />
          <View style={styles.separator} />
          <Row icon="delete-outline" color={COLORS.danger} label="Hapus semua data" sub="Hapus permanen, tidak bisa dibatalkan" onPress={handleReset} />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  title: { fontSize: FONTS.xxl, fontWeight: '700', color: COLORS.text },
  desc: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: SPACING.xs, marginBottom: SPACING.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.lg },
  rowIcon: { width: 36, height: 36, borderRadius: RADIUS.round, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { fontSize: FONTS.md, fontWeight: '600', color: COLORS.text },
  rowSub: { fontSize: FONTS.xs, color: COLORS.textSecondary, marginTop: 2 },
  separator: { height: 1, backgroundColor: COLORS.border, marginLeft: SPACING.lg * 2 + 36 },
});
