import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useRealm, useQuery } from '@realm/react';
import { COLORS, FONTS, SPACING, RADIUS } from '../../../theme';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { EmptyState } from '../../../components/common/EmptyState';
import { CategoryModel } from '../../../models/CategoryModel';
import { DEFAULT_INCOME_CATEGORIES, DEFAULT_EXPENSE_CATEGORIES } from '../../../constants';
import type { SettingsStackParamList } from './SettingsMainScreen';

type CategoryType = 'income' | 'expense';

export function CategoriesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<SettingsStackParamList>>();
  const realm = useRealm();
  const categories = useQuery(CategoryModel);
  const [activeTab, setActiveTab] = useState<CategoryType>('income');

  const filtered = categories.filtered('type == $0', activeTab).sorted('name');

  const handleSeedDefaults = () => {
    const defaults = activeTab === 'income' ? DEFAULT_INCOME_CATEGORIES : DEFAULT_EXPENSE_CATEGORIES;
    realm.write(() => {
      defaults.forEach(d => {
        const exists = categories.filtered('name == $0 AND type == $1', d.name, activeTab).length > 0;
        if (!exists) {
          realm.create(CategoryModel, {
            name: d.name,
            type: activeTab,
            emoji: d.emoji,
          });
        }
      });
    });
  };

  const handleDelete = (item: CategoryModel) => {
    Alert.alert('Hapus Kategori', `Hapus "${item.name}"?`, [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: () => realm.write(() => realm.delete(item)) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.header}>Kategori</Text>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['income', 'expense'] as CategoryType[]).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'income' ? '💰 Pemasukan' : '💸 Pengeluaran'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filtered.length === 0 ? (
          <View style={{ flex: 1 }}>
            <EmptyState
              emoji="🏷️"
              title="Belum ada kategori"
              subtitle="Tambah kategori baru atau muat data default"
            />
            <Button
              title="Muat Kategori Default"
              onPress={handleSeedDefaults}
              variant="secondary"
              style={{ margin: SPACING.lg }}
            />
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={item => item._id.toHexString()}
            contentContainerStyle={{ padding: SPACING.lg }}
            renderItem={({ item }) => (
              <Card style={styles.categoryItem} padding={SPACING.md}>
                <Text style={styles.categoryEmoji}>{item.emoji}</Text>
                <Text style={styles.categoryName}>{item.name}</Text>
                <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteBtn}>
                  <Text style={styles.deleteText}>✕</Text>
                </TouchableOpacity>
              </Card>
            )}
            ItemSeparatorComponent={() => <View style={{ height: SPACING.sm }} />}
          />
        )}

        <View style={styles.footer}>
          {filtered.length > 0 && (
            <Button
              title="Default"
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
  tabs: { flexDirection: 'row', margin: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: 4 },
  tab: { flex: 1, paddingVertical: SPACING.sm, borderRadius: RADIUS.sm, alignItems: 'center' },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: FONTS.sm, color: COLORS.textSecondary, fontWeight: '500' },
  tabTextActive: { color: '#fff', fontWeight: '600' },
  categoryItem: { flexDirection: 'row', alignItems: 'center' },
  categoryEmoji: { fontSize: 22, marginRight: SPACING.md },
  categoryName: { flex: 1, fontSize: FONTS.md, color: COLORS.text },
  deleteBtn: { padding: SPACING.xs },
  deleteText: { fontSize: FONTS.md, color: COLORS.danger },
  footer: { flexDirection: 'row', padding: SPACING.lg, paddingTop: 0 },
});
