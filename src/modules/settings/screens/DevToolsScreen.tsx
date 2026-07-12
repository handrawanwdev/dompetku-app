import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRealm } from '@realm/react';

import { COLORS, FONTS, SPACING, RADIUS } from '../../../theme';
import { Card } from '../../../components/common/Card';
import { seedDummyData, clearAllData, SeedSummary } from '../../../services/DevSeeder';

export function DevToolsScreen() {
  const realm = useRealm();
  const [lastSummary, setLastSummary] = useState<SeedSummary | null>(null);

  const handleSeed = () => {
    Alert.alert(
      'Seed Data Dummy',
      'Data dummy akan ditambahkan ke database saat ini (tanpa menghapus data lama). Lanjutkan?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Seed',
          onPress: () => {
            try {
              const summary = seedDummyData(realm);
              setLastSummary(summary);
              Alert.alert('Sukses', 'Data dummy berhasil ditambahkan');
            } catch (e) {
              Alert.alert('Error', 'Gagal seed data dummy');
            }
          },
        },
      ],
    );
  };

  const handleClear = () => {
    Alert.alert('Hapus Semua Data', 'Semua data di database akan dihapus permanen. Lanjutkan?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => {
          clearAllData(realm);
          setLastSummary(null);
          Alert.alert('Sukses', 'Database dikosongkan');
        },
      },
    ]);
  };

  const handleReseed = () => {
    Alert.alert(
      'Reset & Seed',
      'Database akan dikosongkan lalu diisi ulang dengan data dummy. Lanjutkan?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Reset & Seed',
          style: 'destructive',
          onPress: () => {
            clearAllData(realm);
            const summary = seedDummyData(realm);
            setLastSummary(summary);
            Alert.alert('Sukses', 'Database direset dan diisi data dummy');
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.header}>DevTools</Text>
        <Text style={styles.warning}>⚠️ Hanya untuk pengembangan. Tidak muncul di build production.</Text>

        <Text style={styles.sectionTitle}>Seeder</Text>
        <Card padding={0}>
          <MenuItem label="🌱 Seed Data Dummy" desc="Tambah data contoh ke database" onPress={handleSeed} />
          <View style={styles.separator} />
          <MenuItem label="♻️ Reset & Seed Ulang" desc="Kosongkan lalu isi data dummy" onPress={handleReseed} danger />
          <View style={styles.separator} />
          <MenuItem label="🗑️ Hapus Semua Data" desc="Kosongkan database" onPress={handleClear} danger />
        </Card>

        {lastSummary && (
          <>
            <Text style={styles.sectionTitle}>Hasil Seed Terakhir</Text>
            <Card>
              {Object.entries(lastSummary).map(([key, value]) => (
                <View key={key} style={styles.row}>
                  <Text style={styles.rowLabel}>{key}</Text>
                  <Text style={styles.rowValue}>{value}</Text>
                </View>
              ))}
            </Card>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({
  label,
  desc,
  onPress,
  danger,
}: {
  label: string;
  desc: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.menuLabel, danger && { color: COLORS.danger }]}>{label}</Text>
        <Text style={styles.menuDesc}>{desc}</Text>
      </View>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  header: { fontSize: FONTS.xl, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.xs },
  warning: { fontSize: FONTS.sm, color: COLORS.textMuted, marginBottom: SPACING.lg },
  sectionTitle: { fontSize: FONTS.sm, color: COLORS.textMuted, marginBottom: SPACING.sm, marginTop: SPACING.lg, textTransform: 'uppercase', letterSpacing: 0.5 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg, gap: SPACING.md },
  menuLabel: { fontSize: FONTS.md, color: COLORS.text, fontWeight: '600' },
  menuDesc: { fontSize: FONTS.xs, color: COLORS.textSecondary, marginTop: 2 },
  menuArrow: { fontSize: FONTS.lg, color: COLORS.textMuted },
  separator: { height: 1, backgroundColor: COLORS.border, marginLeft: SPACING.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.xs },
  rowLabel: { fontSize: FONTS.sm, color: COLORS.textSecondary, textTransform: 'capitalize' },
  rowValue: { fontSize: FONTS.sm, color: COLORS.text, fontWeight: '600' },
});
