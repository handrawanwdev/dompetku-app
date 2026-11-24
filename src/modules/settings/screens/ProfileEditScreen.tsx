import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { COLORS, FONTS, ICON_SIZES, SPACING, RADIUS } from '../../../theme';
import { Text, Input, DateInput, Button } from '../../../components/common';
import { useSettingsStore } from '../../../store/settingsStore';
import { useRootNavigation } from '../../../navigation/types';
import {
  AVATAR_COLORS,
  AVATAR_EMOJIS,
  FINANCIAL_FOCUS,
  MAX_FOCUS,
  ProfileAvatar,
  avatarColor,
} from '../components/ProfileAvatar';

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {hint ? <Text style={styles.sectionHint}>{hint}</Text> : null}
      {children}
    </View>
  );
}

export function ProfileEditScreen() {
  const nav = useRootNavigation();
  const { settings, updateSettings } = useSettingsStore();
  const [nick, setNick] = useState(settings.displayName ?? '');
  const [fullName, setFullName] = useState(settings.fullName ?? '');
  const [bio, setBio] = useState(settings.bio ?? '');
  const [occupation, setOccupation] = useState(settings.occupation ?? '');
  const [city, setCity] = useState(settings.city ?? '');
  const [focus, setFocus] = useState<string[]>(settings.financialFocus ?? []);
  const [emoji, setEmoji] = useState(settings.avatarEmoji ?? '');
  const [color, setColor] = useState(settings.avatarColor ?? 'primary');
  const [birthday, setBirthday] = useState(settings.birthday ?? '');

  const accent = avatarColor(color);
  const initial = (nick || fullName).trim().charAt(0).toUpperCase();

  const toggleFocus = (f: string) =>
    setFocus((cur) => (cur.includes(f) ? cur.filter((x) => x !== f) : cur.length < MAX_FOCUS ? [...cur, f] : cur));

  const save = () => {
    updateSettings({
      displayName: nick.trim(),
      fullName: fullName.trim(),
      bio: bio.trim(),
      occupation: occupation.trim(),
      city: city.trim(),
      financialFocus: focus,
      avatarEmoji: emoji,
      avatarColor: color,
      birthday: birthday || undefined,
      // Tanggal berubah: kartu ulang tahun di dashboard boleh muncul lagi.
      ...(birthday !== (settings.birthday ?? '') ? { birthdayCardHiddenYear: undefined } : {}),
    });
    nav.goBack();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Ubah profil</Text>
          <Text style={styles.subtitle}>Semua isian opsional. Yang kosong tidak ditampilkan di profil.</Text>

          <Section title="Foto profil">
            <View style={styles.preview}>
              <ProfileAvatar name={nick || fullName} emoji={emoji} color={color} size={88} />
            </View>
            <View style={styles.wrap}>
              <TouchableOpacity
                onPress={() => setEmoji('')}
                style={[styles.option, !emoji && { borderColor: accent }]}
                accessibilityRole="radio"
                accessibilityState={{ selected: !emoji }}
                accessibilityLabel="Inisial nama"
              >
                {initial ? (
                  <Text style={[styles.optionInitial, { color: accent }]}>{initial}</Text>
                ) : (
                  <MaterialIcons name="person" size={ICON_SIZES.lg} color={accent} />
                )}
              </TouchableOpacity>
              {AVATAR_EMOJIS.map((e) => (
                <TouchableOpacity
                  key={e}
                  onPress={() => setEmoji(e)}
                  style={[styles.option, emoji === e && { borderColor: accent }]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: emoji === e }}
                >
                  <Text style={styles.optionEmoji}>{e}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.wrap}>
              {AVATAR_COLORS.map((k) => {
                const active = color === k;
                return (
                  <TouchableOpacity
                    key={k}
                    onPress={() => setColor(k)}
                    style={[styles.swatchRing, active && { borderColor: COLORS[k] }]}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: active }}
                    accessibilityLabel={`Warna ${k}`}
                  >
                    <View style={[styles.swatch, { backgroundColor: COLORS[k] }]} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </Section>

          <Section title="Identitas">
            <Input
              label="Nama panggilan"
              placeholder="Dipakai untuk menyapa kamu"
              value={nick}
              onChangeText={setNick}
              maxLength={30}
            />
            <Input label="Nama lengkap" placeholder="Contoh: HANDRAWAN" value={fullName} onChangeText={setFullName} maxLength={60} />
            <DateInput label="Ulang tahun" value={birthday} onChange={setBirthday} />
            {birthday ? (
              <TouchableOpacity onPress={() => setBirthday('')} hitSlop={8} style={styles.clear}>
                <Text style={styles.clearText}>Hapus tanggal</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.hint}>Untuk ucapan di hari H dan pengingat seminggu sebelumnya.</Text>
            )}
          </Section>

          <Section title="Tentang kamu">
            <Input
              label="Bio"
              placeholder="Contoh: Lagi nabung buat DP rumah"
              value={bio}
              onChangeText={setBio}
              maxLength={80}
            />
            <Input label="Pekerjaan" placeholder="Contoh: Desainer grafis" value={occupation} onChangeText={setOccupation} maxLength={40} />
            <Input label="Kota" placeholder="Contoh: Bandung" value={city} onChangeText={setCity} maxLength={40} />
          </Section>

          <Section title="Fokus keuangan" hint={`Pilih sampai ${MAX_FOCUS} hal yang lagi kamu kejar. ${focus.length}/${MAX_FOCUS} dipilih.`}>
            <View style={styles.wrap}>
              {FINANCIAL_FOCUS.map((f) => {
                const active = focus.includes(f);
                const disabled = !active && focus.length >= MAX_FOCUS;
                return (
                  <TouchableOpacity
                    key={f}
                    onPress={() => toggleFocus(f)}
                    disabled={disabled}
                    style={[
                      styles.focusChip,
                      active && { borderColor: accent, backgroundColor: accent + '1A' },
                      disabled && styles.focusChipDisabled,
                    ]}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: active, disabled }}
                  >
                    {active && <MaterialIcons name="check" size={ICON_SIZES.xs} color={accent} />}
                    <Text style={[styles.focusText, active && { color: accent, fontWeight: '700' }]}>{f}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Section>

          <Button title="Simpan" onPress={save} fullWidth style={styles.saveBtn} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.xl, paddingBottom: SPACING.xxxl },
  title: { fontSize: FONTS.xxl, fontWeight: '700', color: COLORS.text },
  subtitle: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: SPACING.xs },
  section: { marginTop: SPACING.xl },
  sectionTitle: { fontSize: FONTS.md, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  sectionHint: { fontSize: FONTS.xs, color: COLORS.textSecondary, marginTop: -SPACING.sm, marginBottom: SPACING.md },
  preview: { alignItems: 'center', marginBottom: SPACING.lg },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.md },
  option: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  optionEmoji: { fontSize: 22 },
  optionInitial: { fontSize: FONTS.lg, fontWeight: '800' },
  swatchRing: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.round,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatch: { width: 28, height: 28, borderRadius: RADIUS.round },
  hint: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: -SPACING.sm, marginBottom: SPACING.md },
  clear: { alignSelf: 'flex-start', marginTop: -SPACING.sm, marginBottom: SPACING.md },
  clearText: { fontSize: FONTS.sm, fontWeight: '600', color: COLORS.primary },
  focusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  focusChipDisabled: { opacity: 0.4 },
  focusText: { fontSize: FONTS.sm, fontWeight: '500', color: COLORS.textSecondary },
  saveBtn: { marginTop: SPACING.xl },
});
