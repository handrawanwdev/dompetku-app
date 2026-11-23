import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { COLORS, FONTS, ICON_SIZES, SPACING, RADIUS, SHADOWS, PALETTES, THEME_ID } from '../../../theme';
import { Card } from '../../../components/common/Card';
import { DateInput } from '../../../components/common';
import { getBirthdayInfo } from '../../../utils/birthday';
import { useSettingsStore } from '../../../store/settingsStore';
import { MENU_ITEMS, type MenuId } from '../../../navigation/menu';
import { useRootNavigation } from '../../../navigation/types';

// Profil cuma berisi pengaturan. Fitur keuangan dibuka dari menu dashboard.
const GROUPS: { title: string; items: MenuId[] }[] = [
  { title: 'Pengaturan', items: ['theme', 'parameters'] },
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

export function ProfileScreen() {
  const nav = useRootNavigation();
  const { settings, updateSettings } = useSettingsStore();
  const [name, setName] = useState(settings.displayName ?? '');

  const initial = name.trim().charAt(0).toUpperCase();

  const bday = getBirthdayInfo(settings.birthday);
  const birthdayHint = !bday
    ? 'Isi supaya kami bisa kasih ucapan dan pengingat seminggu sebelumnya.'
    : bday.isToday
      ? 'Hari ini ulang tahunmu. Selamat! 🎂'
      : `${bday.daysUntil} hari lagi. Pengingat datang seminggu sebelumnya, ucapan di hari H.`;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.profile}>
          <View style={styles.avatar}>
            {initial ? (
              <Text style={styles.avatarText}>{initial}</Text>
            ) : (
              <MaterialIcons name="person" size={36} color={COLORS.primary} />
            )}
          </View>
          <TextInput
            style={styles.nameInput}
            value={name}
            onChangeText={setName}
            onEndEditing={() => updateSettings({ displayName: name.trim() })}
            placeholder="Nama kamu"
            placeholderTextColor={COLORS.textMuted}
            returnKeyType="done"
            maxLength={30}
          />
          <Text style={styles.nameHint}>Ketuk untuk ubah nama</Text>
        </View>

        <Card padding={SPACING.lg} style={styles.card}>
          <DateInput
            label="Ulang tahun"
            value={settings.birthday ?? ''}
            onChange={(v) => updateSettings({ birthday: v, birthdayCardHiddenYear: undefined })}
          />
          <Text style={styles.birthdayHint}>{birthdayHint}</Text>
          {settings.birthday ? (
            <TouchableOpacity onPress={() => updateSettings({ birthday: undefined })} hitSlop={8} style={styles.clearBtn}>
              <Text style={styles.clearText}>Hapus tanggal</Text>
            </TouchableOpacity>
          ) : null}
        </Card>

        {GROUPS.map((g) => (
          <View key={g.title}>
            <Text style={styles.sectionTitle}>{g.title}</Text>
            <Card padding={0} style={styles.card}>
              {g.title === 'Pengaturan' && (
                <Row icon="dashboard-customize" color={COLORS.primary} label="Ubah menu dashboard" onPress={() => nav.navigate('MenuEdit')} />
              )}
              {g.items.map((id, i) => {
                const m = MENU_ITEMS[id];
                return (
                  <View key={id}>
                    {(i > 0 || g.title === 'Pengaturan') && <View style={styles.separator} />}
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
  profile: { alignItems: 'center', paddingVertical: SPACING.xl },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  avatarText: { fontSize: 32, fontWeight: '800', color: COLORS.primary },
  nameInput: {
    marginTop: SPACING.md,
    minWidth: 160,
    textAlign: 'center',
    fontSize: FONTS.xl,
    fontWeight: '700',
    color: COLORS.text,
    paddingVertical: SPACING.xs,
  },
  nameHint: { fontSize: FONTS.xs, color: COLORS.textMuted },
  birthdayHint: { fontSize: FONTS.xs, color: COLORS.textSecondary, marginTop: -SPACING.xs },
  clearBtn: { alignSelf: 'flex-start', marginTop: SPACING.sm },
  clearText: { fontSize: FONTS.sm, fontWeight: '600', color: COLORS.primary },
  card: { marginBottom: SPACING.sm },
  sectionTitle: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.lg },
  rowIcon: { width: 36, height: 36, borderRadius: RADIUS.round, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { flex: 1, fontSize: FONTS.md, fontWeight: '500', color: COLORS.text },
  rowTrailing: { fontSize: FONTS.sm, color: COLORS.textSecondary },
  separator: { height: 1, backgroundColor: COLORS.border, marginLeft: SPACING.lg * 2 + 36 },
  footer: { fontSize: FONTS.xs, color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.xl },
});
