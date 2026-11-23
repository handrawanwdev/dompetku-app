import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { COLORS, FONTS, ICON_SIZES, SPACING, RADIUS } from '../../../theme';
import { Card } from '../../../components/common/Card';
import { useSettingsStore } from '../../../store/settingsStore';
import { ALL_MENU_IDS, DEFAULT_MENU, MENU_ITEMS, sanitizeMenu, type MenuId } from '../../../navigation/menu';

function IconBtn({
  icon,
  color = COLORS.textSecondary,
  disabled,
  label,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  color?: string;
  disabled?: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.iconBtn, disabled && { opacity: 0.3 }]}
      hitSlop={6}
      accessibilityLabel={label}
    >
      <MaterialIcons name={icon} size={ICON_SIZES.lg} color={color} />
    </TouchableOpacity>
  );
}

function ItemHead({ id }: { id: MenuId }) {
  const m = MENU_ITEMS[id];
  return (
    <>
      <View style={[styles.itemIcon, { backgroundColor: m.color + '1A' }]}>
        <MaterialIcons name={m.icon} size={ICON_SIZES.md} color={m.color} />
      </View>
      <View style={styles.itemText}>
        <Text style={styles.itemLabel}>{m.label}</Text>
        <Text style={styles.itemHint} numberOfLines={1}>{m.hint}</Text>
      </View>
    </>
  );
}

/** Pilih & urutkan menu utama yang tampil di dashboard. */
export function MenuEditScreen() {
  const { settings, updateSettings } = useSettingsStore();
  const selected = sanitizeMenu(settings.menuItems ?? DEFAULT_MENU);
  const others = ALL_MENU_IDS.filter((id) => !selected.includes(id));

  const save = (next: MenuId[]) => updateSettings({ menuItems: next });
  const move = (i: number, dir: -1 | 1) => {
    const next = [...selected];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    save(next);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Ubah menu</Text>
        <Text style={styles.desc}>Taruh yang paling sering kamu pakai di atas. Menu ini muncul di dashboard.</Text>

        <Text style={styles.sectionTitle}>Di dashboard</Text>
        <Card padding={0}>
          {selected.length === 0 && <Text style={styles.empty}>Masih kosong. Pilih dari daftar di bawah.</Text>}
          {selected.map((id, i) => (
            <View key={id}>
              {i > 0 && <View style={styles.separator} />}
              <View style={styles.item}>
                <ItemHead id={id} />
                <IconBtn icon="keyboard-arrow-up" label="Naikkan" disabled={i === 0} onPress={() => move(i, -1)} />
                <IconBtn icon="keyboard-arrow-down" label="Turunkan" disabled={i === selected.length - 1} onPress={() => move(i, 1)} />
                <IconBtn icon="remove-circle-outline" color={COLORS.danger} label="Keluarkan dari dashboard" onPress={() => save(selected.filter((x) => x !== id))} />
              </View>
            </View>
          ))}
        </Card>

        {others.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Bisa ditambahkan</Text>
            <Card padding={0}>
              {others.map((id, i) => (
                <View key={id}>
                  {i > 0 && <View style={styles.separator} />}
                  <TouchableOpacity style={styles.item} onPress={() => save([...selected, id])} activeOpacity={0.7}>
                    <ItemHead id={id} />
                    <MaterialIcons name="add-circle-outline" size={ICON_SIZES.lg} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              ))}
            </Card>
          </>
        )}

        <TouchableOpacity style={styles.reset} onPress={() => save(DEFAULT_MENU)} hitSlop={8}>
          <Text style={styles.resetText}>Kembalikan ke bawaan</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  title: { fontSize: FONTS.xxl, fontWeight: '700', color: COLORS.text },
  desc: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: SPACING.xs },
  sectionTitle: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text, marginTop: SPACING.xl, marginBottom: SPACING.sm },
  item: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg },
  itemIcon: { width: 36, height: 36, borderRadius: RADIUS.round, alignItems: 'center', justifyContent: 'center' },
  itemText: { flex: 1, marginLeft: SPACING.xs },
  itemLabel: { fontSize: FONTS.md, fontWeight: '600', color: COLORS.text },
  itemHint: { fontSize: FONTS.xs, color: COLORS.textSecondary, marginTop: 1 },
  iconBtn: { padding: 4 },
  separator: { height: 1, backgroundColor: COLORS.border, marginLeft: SPACING.lg * 2 + 36 },
  empty: { fontSize: FONTS.sm, color: COLORS.textSecondary, padding: SPACING.lg },
  reset: { alignSelf: 'center', marginTop: SPACING.xl },
  resetText: { fontSize: FONTS.sm, fontWeight: '600', color: COLORS.primary },
});
