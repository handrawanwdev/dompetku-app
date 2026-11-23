import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Card, Text } from '../../../components/common';
import { COLORS, FONTS, ICON_SIZES, RADIUS, SPACING } from '../../../theme';
import { useSettingsStore } from '../../../store/settingsStore';
import { DEFAULT_MENU, MENU_ITEMS, sanitizeMenu } from '../../../navigation/menu';
import { useRootNavigation } from '../../../navigation/types';

function Tile({
  icon,
  color,
  label,
  hint,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  label: string;
  hint?: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.tile}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityHint={hint}
    >
      <View style={[styles.tileIcon, { backgroundColor: color + '1A' }]}>
        <MaterialIcons name={icon} size={ICON_SIZES.xl} color={color} />
      </View>
      <Text style={styles.tileLabel} numberOfLines={2}>{label}</Text>
    </TouchableOpacity>
  );
}

/** Grid pintasan ke halaman-halaman app. Isi & urutannya diatur user. */
export function MainMenuCard() {
  const nav = useRootNavigation();
  const menuItems = useSettingsStore((s) => s.settings.menuItems);
  const ids = sanitizeMenu(menuItems ?? DEFAULT_MENU);

  return (
    <Card padding={SPACING.md} style={styles.card}>
      <View style={styles.head}>
        <Text style={styles.headTitle}>Mau ngapain?</Text>
        <TouchableOpacity onPress={() => nav.navigate('MenuEdit')} hitSlop={8} accessibilityRole="button">
          <Text style={styles.headLink}>Ubah</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.grid}>
        {ids.map((id) => {
          const m = MENU_ITEMS[id];
          return <Tile key={id} icon={m.icon} color={m.color} label={m.label} hint={m.hint} onPress={() => m.open(nav)} />;
        })}
        {ids.length === 0 && (
          <Tile icon="add" color={COLORS.primary} label="Tambah menu" onPress={() => nav.navigate('MenuEdit')} />
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: SPACING.md },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingHorizontal: SPACING.xs, marginBottom: SPACING.md },
  headTitle: { fontSize: FONTS.md, fontWeight: '700', color: COLORS.text },
  headLink: { fontSize: FONTS.sm, fontWeight: '600', color: COLORS.primary },
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: SPACING.md },
  tile: { width: '25%', alignItems: 'center', gap: 6, paddingHorizontal: 2 },
  tileIcon: { width: 52, height: 52, borderRadius: RADIUS.lg, alignItems: 'center', justifyContent: 'center' },
  tileLabel: { fontSize: FONTS.xs, fontWeight: '600', color: COLORS.text, textAlign: 'center' },
});
