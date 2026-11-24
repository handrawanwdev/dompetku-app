import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { hasPin } from '../../../services/AppLockService';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { COLORS, FONTS, ICON_SIZES, SPACING, RADIUS, PALETTES, THEME_ID } from '../../../theme';
import { Card } from '../../../components/common/Card';
import { MENU_ITEMS, type MenuId } from '../../../navigation/menu';
import { useRootNavigation } from '../../../navigation/types';

const GROUPS: { title: string; items: MenuId[] }[] = [
  { title: 'Tampilan & aturan', items: ['theme', 'parameters'] },
  { title: 'Data & bantuan', items: ['data', 'diagnosis'] },
];

function Row({
  icon,
  color,
  label,
  trailing,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  label: string;
  trailing?: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.rowIcon, { backgroundColor: color + '1A' }]}>
        <MaterialIcons name={icon} size={ICON_SIZES.md} color={color} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      {trailing ? <Text style={styles.rowTrailing}>{trailing}</Text> : null}
      <MaterialIcons name="chevron-right" size={ICON_SIZES.lg} color={COLORS.textMuted} />
    </TouchableOpacity>
  );
}

/** Semua pengaturan app. Dibuka dari ikon gear di Profil. */
export function SettingsScreen() {
  const nav = useRootNavigation();
  const [locked, setLocked] = useState(hasPin());
  useFocusEffect(useCallback(() => setLocked(hasPin()), []));

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Pengaturan</Text>

        <Text style={styles.sectionTitle}>Keamanan</Text>
        <Card padding={0} style={styles.card}>
          <Row
            icon={locked ? 'lock' : 'lock-open'}
            color={locked ? COLORS.success : COLORS.primary}
            label="Kunci aplikasi"
            trailing={locked ? 'Aktif' : 'Mati'}
            onPress={() => nav.navigate('AppLock')}
          />
        </Card>

        <Text style={styles.sectionTitle}>Dashboard</Text>
        <Card padding={0} style={styles.card}>
          <Row icon="dashboard-customize" color={COLORS.primary} label="Ubah menu dashboard" onPress={() => nav.navigate('MenuEdit')} />
        </Card>

        {GROUPS.map((g) => (
          <View key={g.title}>
            <Text style={styles.sectionTitle}>{g.title}</Text>
            <Card padding={0} style={styles.card}>
              {g.items.map((id, i) => {
                const m = MENU_ITEMS[id];
                return (
                  <View key={id}>
                    {i > 0 && <View style={styles.separator} />}
                    <Row
                      icon={m.icon}
                      color={m.color}
                      label={m.label}
                      trailing={id === 'theme' ? PALETTES[THEME_ID].label : undefined}
                      onPress={() => m.open(nav)}
                    />
                  </View>
                );
              })}
            </Card>
          </View>
        ))}

        {__DEV__ && (
          <>
            <Text style={styles.sectionTitle}>Developer</Text>
            <Card padding={0} style={styles.card}>
              <Row icon="build" color={COLORS.textSecondary} label="DevTools" onPress={() => nav.navigate('DevTools')} />
            </Card>
          </>
        )}

        <Text style={styles.footer}>Dompetku v1.0 · data tersimpan di HP ini saja</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  title: { fontSize: FONTS.xxl, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.lg },
  card: { marginBottom: SPACING.sm },
  sectionTitle: { fontSize: FONTS.md, fontWeight: '700', color: COLORS.textSecondary, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.lg },
  rowIcon: { width: 36, height: 36, borderRadius: RADIUS.round, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { flex: 1, fontSize: FONTS.md, fontWeight: '500', color: COLORS.text },
  rowTrailing: { fontSize: FONTS.sm, color: COLORS.textSecondary },
  separator: { height: 1, backgroundColor: COLORS.border, marginLeft: SPACING.lg * 2 + 36 },
  footer: { fontSize: FONTS.xs, color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.xl },
});
