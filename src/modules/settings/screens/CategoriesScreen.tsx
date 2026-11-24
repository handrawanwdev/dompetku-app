import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useRealm, useQuery } from '@realm/react';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, ICON_SIZES, SPACING, RADIUS } from '../../../theme';
import { useSettingsStore } from '../../../store/settingsStore';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { EmptyState } from '../../../components/common/EmptyState';
import { CategoryModel } from '../../../models/CategoryModel';
import { DEFAULT_INCOME_CATEGORIES } from '../../../constants';
import { ensureDefaultExpenseCategories } from '../../../services/CategoryService';
import { KIND_META, SPEND_KINDS, isSpendKind } from '../../../utils/budget';
import type { RootStackParamList } from '../../../navigation/types';

type CategoryType = 'income' | 'expense';

export function CategoriesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const realm = useRealm();
  const categories = useQuery(CategoryModel);
  const [activeTab, setActiveTab] = useState<CategoryType>('expense');
  const targets = useSettingsStore((s) => s.settings.kindTargets);

  const filtered = categories.filtered('type == $0', activeTab).sorted('name');

  const handleSeedDefaults = () => {
    realm.write(() => {
      if (activeTab === 'expense') {
        ensureDefaultExpenseCategories(realm);
        return;
      }
      DEFAULT_INCOME_CATEGORIES.forEach((d) => {
        const exists = categories.filtered('name == $0 AND type == "income"', d.name).length > 0;
        if (!exists) realm.create(CategoryModel, { name: d.name, type: 'income', emoji: d.emoji });
      });
    });
  };

  const handleDelete = (item: CategoryModel) => {
    Alert.alert('Hapus kategori', `Hapus "${item.name}"? Transaksi lama tetap tersimpan.`, [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: () => realm.write(() => realm.delete(item)) },
    ]);
  };

  const renderItem = (item: CategoryModel) => (
    <Card key={item._id.toHexString()} style={styles.categoryItem} padding={SPACING.md}>
      <TouchableOpacity
        style={styles.categoryMain}
        onPress={() => navigation.navigate('CategoryForm', { type: activeTab, id: item._id.toHexString() })}
        activeOpacity={0.7}
      >
        <Text style={styles.categoryEmoji}>{item.emoji}</Text>
        <Text style={styles.categoryName}>{item.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteBtn} hitSlop={8}>
        <MaterialIcons name="close" size={ICON_SIZES.md} color={COLORS.textMuted} />
      </TouchableOpacity>
    </Card>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.container}>
        <Text style={styles.header}>Kategori</Text>

        <View style={styles.tabs}>
          {(['expense', 'income'] as CategoryType[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'income' ? 'Pemasukan' : 'Uang keluar'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filtered.length === 0 ? (
          <View style={{ flex: 1 }}>
            <EmptyState
              emoji="🏷️"
              title="Belum ada kategori"
              subtitle="Bikin sendiri, atau pakai kategori bawaan biar cepat."
            />
            <Button title="Pakai kategori bawaan" onPress={handleSeedDefaults} variant="secondary" style={{ margin: SPACING.lg }} />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.list}>
            {activeTab === 'expense' ? (
              <>
                <Text style={styles.hint}>Tiap kategori masuk ke satu jenis. Transaksi otomatis ikut jenis kategorinya.</Text>
                {SPEND_KINDS.map((k) => {
                  const items = filtered.filter((c) => (isSpendKind(c.kind) ? c.kind : 'need') === k);
                  if (!items.length) return null;
                  const m = KIND_META[k];
                  return (
                    <View key={k} style={styles.group}>
                      <View style={styles.groupHead}>
                        <MaterialIcons name={m.icon} size={ICON_SIZES.sm} color={m.color} />
                        <Text style={styles.groupLabel}>{m.label}</Text>
                        <Text style={styles.groupTarget}>target {targets[k]}% pemasukan</Text>
                      </View>
                      <View style={styles.groupItems}>{items.map(renderItem)}</View>
                    </View>
                  );
                })}
              </>
            ) : (
              <View style={styles.groupItems}>{filtered.map(renderItem)}</View>
            )}
          </ScrollView>
        )}

        <View style={styles.footer}>
          {filtered.length > 0 && (
            <Button
              title="Bawaan"
              onPress={handleSeedDefaults}
              variant="ghost"
              size="sm"
              style={{ flex: 1, marginRight: SPACING.sm }}
            />
          )}
          <Button
            title="+ Tambah"
            onPress={() => navigation.navigate('CategoryForm', { type: activeTab })}
            style={{ flex: 2 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  header: { fontSize: FONTS.xxl, fontWeight: '700', color: COLORS.text, padding: SPACING.lg, paddingBottom: 0 },
  tabs: { flexDirection: 'row', margin: SPACING.lg, backgroundColor: COLORS.subtleBg, borderRadius: RADIUS.round, padding: 4 },
  tab: { flex: 1, paddingVertical: SPACING.sm, borderRadius: RADIUS.round, alignItems: 'center' },
  tabActive: { backgroundColor: COLORS.surface },
  tabText: { fontSize: FONTS.sm, color: COLORS.textSecondary, fontWeight: '500' },
  tabTextActive: { color: COLORS.primary, fontWeight: '700' },
  list: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg },
  hint: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginBottom: SPACING.lg },
  group: { marginBottom: SPACING.lg },
  groupHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: SPACING.sm },
  groupLabel: { fontSize: FONTS.md, fontWeight: '700', color: COLORS.text },
  groupTarget: { fontSize: FONTS.xs, color: COLORS.textMuted, marginLeft: 'auto' },
  groupItems: { gap: SPACING.sm },
  categoryItem: { flexDirection: 'row', alignItems: 'center' },
  categoryMain: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  categoryEmoji: { fontSize: 22, marginRight: SPACING.md },
  categoryName: { flex: 1, fontSize: FONTS.md, color: COLORS.text },
  deleteBtn: { padding: SPACING.xs },
  footer: { flexDirection: 'row', padding: SPACING.lg, paddingTop: 0 },
});
