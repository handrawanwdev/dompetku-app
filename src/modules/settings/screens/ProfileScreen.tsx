import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useQuery } from '@realm/react';
import dayjs from 'dayjs';

import { COLORS, FONTS, ICON_SIZES, SPACING, RADIUS, SHADOWS } from '../../../theme';
import { Text, Button, ProgressBar } from '../../../components/common';
import { IncomeModel } from '../../../models/IncomeModel';
import { ExpenseModel } from '../../../models/ExpenseModel';
import { AccountModel } from '../../../models/AccountModel';
import { useSettingsStore } from '../../../store/settingsStore';
import { useRootNavigation } from '../../../navigation/types';
import { ProfileAvatar, avatarColor } from '../components/ProfileAvatar';
import { birthdayLine, profileCompleteness } from '../profile';

/** Tanggal paling awal user mulai memakai app: transaksi atau kantong pertama. */
function useJoinedSince() {
  const firstIncome = useQuery(IncomeModel, (c) => c.sorted('createdAt'), [])[0];
  const firstExpense = useQuery(ExpenseModel, (c) => c.sorted('createdAt'), [])[0];
  const firstAccount = useQuery(AccountModel, (c) => c.sorted('createdAt'), [])[0];
  const times = [firstIncome?.createdAt, firstExpense?.createdAt, firstAccount?.createdAt]
    .filter((d): d is Date => Boolean(d))
    .map((d) => d.getTime());
  return times.length ? dayjs(Math.min(...times)) : null;
}

function InfoRow({
  icon,
  label,
  value,
  note,
  first,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string;
  note?: string;
  first?: boolean;
}) {
  return (
    <View style={[styles.infoRow, !first && styles.infoRowBorder]}>
      <View style={styles.infoIcon}>
        <MaterialIcons name={icon} size={ICON_SIZES.md} color={COLORS.textSecondary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
        {note ? <Text style={styles.infoNote}>{note}</Text> : null}
      </View>
    </View>
  );
}

export function ProfileScreen() {
  const nav = useRootNavigation();
  const { settings } = useSettingsStore();
  const since = useJoinedSince();

  const nick = settings.displayName?.trim();
  const full = settings.fullName?.trim();
  const title = full || nick;
  const accent = avatarColor(settings.avatarColor);
  const bday = birthdayLine(settings.birthday);
  const focus = settings.financialFocus ?? [];
  const { percent, missing } = profileCompleteness(settings);
  const edit = () => nav.navigate('ProfileEdit');

  const about = [
    bday && { icon: 'cake' as const, label: 'Ulang tahun', value: bday.value, note: bday.note },
    settings.occupation?.trim() && { icon: 'work-outline' as const, label: 'Pekerjaan', value: settings.occupation.trim() },
    settings.city?.trim() && { icon: 'place' as const, label: 'Tinggal di', value: settings.city.trim() },
    since && { icon: 'event-available' as const, label: 'Pakai Dompetku sejak', value: since.format('MMMM YYYY') },
  ].filter(Boolean) as { icon: keyof typeof MaterialIcons.glyphMap; label: string; value: string; note?: string }[];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.topbar}>
        <Text style={styles.topbarTitle}>Profil</Text>
        <TouchableOpacity
          onPress={() => nav.navigate('Settings')}
          hitSlop={8}
          style={styles.gear}
          accessibilityRole="button"
          accessibilityLabel="Pengaturan"
        >
          <MaterialIcons name="settings" size={ICON_SIZES.xl} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Identitas */}
        <View style={styles.hero}>
          <View style={[styles.heroBand, { backgroundColor: accent + '1F' }]} />
          <View style={styles.heroBody}>
            <TouchableOpacity onPress={edit} activeOpacity={0.8} style={styles.avatarRing} accessibilityLabel="Ubah avatar">
              <ProfileAvatar name={nick || full} emoji={settings.avatarEmoji} color={settings.avatarColor} />
              <View style={[styles.avatarEdit, { backgroundColor: accent }]}>
                <MaterialIcons name="edit" size={14} color={COLORS.onPrimary} />
              </View>
            </TouchableOpacity>
            <Text style={[styles.name, !title && styles.namePlaceholder]}>{title || 'Tanpa nama'}</Text>
            {full && nick && full.toLowerCase() !== nick.toLowerCase() ? (
              <Text style={styles.nick}>Dipanggil {nick}</Text>
            ) : null}
            {settings.bio ? <Text style={styles.bio}>“{settings.bio}”</Text> : null}
            <Button title="Ubah profil" onPress={edit} variant="secondary" size="sm" style={styles.editBtn} />
          </View>
        </View>

        {/* Kelengkapan, hilang sendiri kalau sudah 100% */}
        {percent < 100 && (
          <TouchableOpacity onPress={edit} activeOpacity={0.8} style={styles.complete}>
            <View style={styles.completeHead}>
              <Text style={styles.completeTitle}>Profil {percent}% lengkap</Text>
              <Text style={styles.completeLink}>Lengkapi</Text>
            </View>
            <ProgressBar progress={percent} color={accent} height={6} style={{ marginTop: SPACING.sm }} />
            <Text style={styles.completeSub} numberOfLines={2}>
              Belum diisi: {missing.join(', ')}
            </Text>
          </TouchableOpacity>
        )}

        {/* Tentang saya */}
        {about.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Tentang saya</Text>
            <View style={styles.card}>
              {about.map((r, i) => (
                <InfoRow key={r.label} {...r} first={i === 0} />
              ))}
            </View>
          </>
        )}

        {/* Fokus keuangan */}
        {focus.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Lagi fokus ke</Text>
            <View style={styles.focusWrap}>
              {focus.map((f) => (
                <View key={f} style={[styles.focusChip, { backgroundColor: accent + '1A', borderColor: accent + '55' }]}>
                  <MaterialIcons name="flag" size={ICON_SIZES.xs} color={accent} />
                  <Text style={[styles.focusText, { color: accent }]}>{f}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={styles.privacy}>
          <MaterialIcons name="lock-outline" size={ICON_SIZES.sm} color={COLORS.textSecondary} />
          <Text style={styles.privacyText}>Info profil cuma tersimpan di HP ini dan tidak dikirim ke mana pun.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  topbarTitle: { fontSize: FONTS.xl, fontWeight: '700', color: COLORS.text },
  gear: { width: 40, height: 40, borderRadius: RADIUS.round, alignItems: 'center', justifyContent: 'center' },
  content: { padding: SPACING.lg, paddingTop: 0, paddingBottom: SPACING.xxxl },
  hero: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  heroBand: { height: 72 },
  heroBody: { alignItems: 'center', paddingHorizontal: SPACING.xl, paddingBottom: SPACING.xl, marginTop: -52 },
  avatarRing: { padding: 4, borderRadius: RADIUS.round, backgroundColor: COLORS.card },
  avatarEdit: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    width: 26,
    height: 26,
    borderRadius: RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  name: { fontSize: FONTS.xxl, fontWeight: '800', color: COLORS.text, marginTop: SPACING.md, textAlign: 'center' },
  namePlaceholder: { color: COLORS.textMuted },
  nick: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: 2 },
  bio: {
    fontSize: FONTS.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  editBtn: { marginTop: SPACING.lg, minWidth: 160 },
  complete: {
    marginTop: SPACING.md,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  completeHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  completeTitle: { fontSize: FONTS.md, fontWeight: '700', color: COLORS.text },
  completeLink: { fontSize: FONTS.sm, fontWeight: '700', color: COLORS.primary },
  completeSub: { fontSize: FONTS.xs, color: COLORS.textSecondary, marginTop: SPACING.sm },
  sectionTitle: { fontSize: FONTS.md, fontWeight: '700', color: COLORS.textSecondary, marginTop: SPACING.xl, marginBottom: SPACING.sm },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: SPACING.md },
  infoRowBorder: { borderTopWidth: 1, borderTopColor: COLORS.border },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.subtleBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: { fontSize: FONTS.xs, color: COLORS.textSecondary },
  infoValue: { fontSize: FONTS.md, fontWeight: '600', color: COLORS.text, marginTop: 1 },
  infoNote: { fontSize: FONTS.xs, fontWeight: '600', color: COLORS.primary, marginTop: 2 },
  focusWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  focusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.round,
    borderWidth: 1,
  },
  focusText: { fontSize: FONTS.sm, fontWeight: '600' },
  privacy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.xl,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.subtleBg,
  },
  privacyText: { flex: 1, fontSize: FONTS.sm, color: COLORS.textSecondary },
});
