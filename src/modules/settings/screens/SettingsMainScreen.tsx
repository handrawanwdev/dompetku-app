import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRealm, useQuery } from '@realm/react';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import Realm from 'realm';

import { COLORS, FONTS, SPACING, RADIUS } from '../../../theme';
import { Card } from '../../../components/common/Card';
import { IncomeModel } from '../../../models/IncomeModel';
import { ExpenseModel } from '../../../models/ExpenseModel';
import { DebtModel } from '../../../models/DebtModel';
import { DebtPaymentModel } from '../../../models/DebtPaymentModel';
import { SavingModel } from '../../../models/SavingModel';
import { SavingHistoryModel } from '../../../models/SavingHistoryModel';
import { InvestmentModel } from '../../../models/InvestmentModel';
import { PhysicalAssetModel } from '../../../models/PhysicalAssetModel';
import { GoalModel } from '../../../models/GoalModel';
import { CategoryModel } from '../../../models/CategoryModel';

export type SettingsStackParamList = {
  SettingsMain: undefined;
  ParametersScreen: undefined;
  CategoriesScreen: undefined;
  GoalsNavScreen: undefined;
};

type NavProp = NativeStackNavigationProp<SettingsStackParamList>;

interface Props {
  navigation: NavProp;
}

export function SettingsMainScreen({ navigation }: Props) {
  const realm = useRealm();
  const incomes = useQuery(IncomeModel);
  const expenses = useQuery(ExpenseModel);
  const debts = useQuery(DebtModel);
  const debtPayments = useQuery(DebtPaymentModel);
  const savings = useQuery(SavingModel);
  const savingHistory = useQuery(SavingHistoryModel);
  const investments = useQuery(InvestmentModel);
  const physicalAssets = useQuery(PhysicalAssetModel);
  const goals = useQuery(GoalModel);
  const categories = useQuery(CategoryModel);

  const handleExport = async () => {
    try {
      const data = {
        version: 1,
        exportDate: new Date().toISOString(),
        incomes: incomes.map(i => ({ ...i, _id: i._id.toHexString() })),
        expenses: expenses.map(e => ({ ...e, _id: e._id.toHexString() })),
        debts: debts.map(d => ({ ...d, _id: d._id.toHexString() })),
        debtPayments: debtPayments.map(p => ({ ...p, _id: p._id.toHexString() })),
        savings: savings.map(s => ({ ...s, _id: s._id.toHexString() })),
        savingHistory: savingHistory.map(h => ({ ...h, _id: h._id.toHexString() })),
        investments: investments.map(i => ({ ...i, _id: i._id.toHexString() })),
        physicalAssets: physicalAssets.map(a => ({ ...a, _id: a._id.toHexString() })),
        goals: goals.map(g => ({ ...g, _id: g._id.toHexString() })),
        categories: categories.map(c => ({ ...c, _id: c._id.toHexString() })),
      };

      const filename = `dompetku_backup_${new Date().toISOString().split('T')[0]}.json`;
      const file = new File(Paths.document, filename);
      file.write(JSON.stringify(data, null, 2));

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri, { mimeType: 'application/json' });
      } else {
        Alert.alert('Sukses', `Data diekspor`);
      }
    } catch (e) {
      Alert.alert('Error', 'Gagal mengekspor data');
    }
  };

  const handleImport = async () => {
    Alert.alert(
      'Import Data',
      'Data saat ini akan diganti dengan data dari file backup. Lanjutkan?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Import',
          style: 'destructive',
          onPress: async () => {
            try {
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
                data.expenses?.forEach((item: any) => {
                  realm.create(ExpenseModel, { ...item, _id: new Realm.BSON.ObjectId(item._id), createdAt: new Date(item.createdAt) });
                });
                data.debts?.forEach((item: any) => {
                  realm.create(DebtModel, { ...item, _id: new Realm.BSON.ObjectId(item._id), createdAt: new Date(item.createdAt) });
                });
                data.debtPayments?.forEach((item: any) => {
                  realm.create(DebtPaymentModel, { ...item, _id: new Realm.BSON.ObjectId(item._id), createdAt: new Date(item.createdAt) });
                });
                data.savings?.forEach((item: any) => {
                  realm.create(SavingModel, { ...item, _id: new Realm.BSON.ObjectId(item._id), createdAt: new Date(item.createdAt) });
                });
                data.savingHistory?.forEach((item: any) => {
                  realm.create(SavingHistoryModel, { ...item, _id: new Realm.BSON.ObjectId(item._id), createdAt: new Date(item.createdAt) });
                });
                data.investments?.forEach((item: any) => {
                  realm.create(InvestmentModel, { ...item, _id: new Realm.BSON.ObjectId(item._id), createdAt: new Date(item.createdAt) });
                });
                data.physicalAssets?.forEach((item: any) => {
                  realm.create(PhysicalAssetModel, { ...item, _id: new Realm.BSON.ObjectId(item._id), createdAt: new Date(item.createdAt) });
                });
                data.goals?.forEach((item: any) => {
                  realm.create(GoalModel, { ...item, _id: new Realm.BSON.ObjectId(item._id), createdAt: new Date(item.createdAt) });
                });
                data.categories?.forEach((item: any) => {
                  realm.create(CategoryModel, { ...item, _id: new Realm.BSON.ObjectId(item._id), createdAt: new Date(item.createdAt) });
                });
              });

              Alert.alert('Sukses', 'Data berhasil diimport');
            } catch (e) {
              Alert.alert('Error', 'Gagal mengimport data. Pastikan file valid.');
            }
          },
        },
      ]
    );
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Data',
      'Semua data akan dihapus permanen. Lanjutkan?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            realm.write(() => realm.deleteAll());
            Alert.alert('Sukses', 'Data berhasil direset');
          },
        },
      ]
    );
  };

  const MenuItem = ({ emoji, label, onPress, danger }: { emoji: string; label: string; onPress: () => void; danger?: boolean }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.menuEmoji}>{emoji}</Text>
      <Text style={[styles.menuLabel, danger && { color: COLORS.danger }]}>{label}</Text>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.header}>Pengaturan</Text>

        <Text style={styles.sectionTitle}>Preferensi</Text>
        <Card padding={0}>
          <MenuItem emoji="⚙️" label="Parameter" onPress={() => navigation.navigate('ParametersScreen')} />
          <View style={styles.separator} />
          <MenuItem emoji="🏷️" label="Kategori" onPress={() => navigation.navigate('CategoriesScreen')} />
          <View style={styles.separator} />
          <MenuItem emoji="🎯" label="Financial Goals" onPress={() => navigation.navigate('GoalsNavScreen')} />
        </Card>

        <Text style={styles.sectionTitle}>Data</Text>
        <Card padding={0}>
          <MenuItem emoji="📤" label="Export JSON" onPress={handleExport} />
          <View style={styles.separator} />
          <MenuItem emoji="📥" label="Import JSON" onPress={handleImport} />
          <View style={styles.separator} />
          <MenuItem emoji="🗑️" label="Reset Semua Data" onPress={handleReset} danger />
        </Card>

        <Text style={styles.sectionTitle}>Info</Text>
        <Card padding={SPACING.lg}>
          <Text style={styles.appName}>Dompetku v1.0</Text>
          <Text style={styles.appDesc}>Aplikasi manajemen keuangan pribadi. Offline first, data tersimpan lokal.</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  header: { fontSize: FONTS.xxl, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.xl },
  sectionTitle: { fontSize: FONTS.sm, color: COLORS.textMuted, marginBottom: SPACING.sm, marginTop: SPACING.lg, textTransform: 'uppercase', letterSpacing: 0.5 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg, gap: SPACING.md },
  menuEmoji: { fontSize: 20 },
  menuLabel: { flex: 1, fontSize: FONTS.md, color: COLORS.text, fontWeight: '500' },
  menuArrow: { fontSize: FONTS.lg, color: COLORS.textMuted },
  separator: { height: 1, backgroundColor: COLORS.border, marginLeft: SPACING.lg * 2 + 20 },
  appName: { fontSize: FONTS.md, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.xs },
  appDesc: { fontSize: FONTS.sm, color: COLORS.textSecondary, lineHeight: 20 },
});
