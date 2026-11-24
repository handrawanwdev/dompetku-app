import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Text } from '../../../components/common';
import { COLORS, FONTS, ICON_SIZES, RADIUS, SPACING } from '../../../theme';
import { useSettingsStore } from '../../../store/settingsStore';
import { birthdayWish, getBirthdayInfo } from '../../../utils/birthday';
import { useRootNavigation } from '../../../navigation/types';
import { useBirthdaySurprise } from '../../birthday/BirthdaySurprise';

/** Muncul seminggu menjelang ulang tahun, lalu jadi kartu ucapan di hari H. */
export function BirthdayCard() {
  const nav = useRootNavigation();
  const { settings, updateSettings } = useSettingsStore();
  const openSurprise = useBirthdaySurprise((s) => s.open);
  const info = getBirthdayInfo(settings.birthday);
  const year = new Date().getFullYear();

  if (!info || info.daysUntil > 7 || settings.birthdayCardHiddenYear === year) return null;

  const name = settings.displayName?.trim();
  const hide = () => updateSettings({ birthdayCardHiddenYear: year });

  if (info.isToday) {
    return (
      <View style={[styles.card, styles.today]}>
        <TouchableOpacity style={styles.close} onPress={hide} hitSlop={10} accessibilityLabel="Tutup ucapan">
          <MaterialIcons name="close" size={ICON_SIZES.md} color={COLORS.heroMuted} />
        </TouchableOpacity>
        <Text style={styles.cake}>🎂</Text>
        <Text style={styles.todayTitle}>
          Selamat ulang tahun{info.turningAge > 0 ? ` ke-${info.turningAge}` : ''}
          {name ? `, ${name}` : ''}!
        </Text>
        <Text style={styles.todayBody}>{birthdayWish(year)}</Text>
        <TouchableOpacity style={styles.replayBtn} onPress={openSurprise} activeOpacity={0.8}>
          <MaterialIcons name="card-giftcard" size={ICON_SIZES.sm} color={COLORS.primary} />
          <Text style={styles.replayText}>Buka kadonya lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.card, styles.soon]}>
      <Text style={styles.soonEmoji}>🎉</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.soonTitle}>
          {info.daysUntil === 1 ? 'Besok ulang tahunmu!' : `${info.daysUntil} hari lagi ulang tahunmu`}
        </Text>
        <Text style={styles.soonBody}>Mau sisihkan sedikit buat merayakannya?</Text>
        <TouchableOpacity
          style={styles.soonBtn}
          onPress={() => nav.navigate('ExpenseForm', { kind: 'saving', category: 'Tabungan' })}
          activeOpacity={0.8}
        >
          <Text style={styles.soonBtnText}>Sisihkan</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={hide} hitSlop={10} accessibilityLabel="Tutup pengingat">
        <MaterialIcons name="close" size={ICON_SIZES.md} color={COLORS.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: RADIUS.xl, marginBottom: SPACING.md },
  today: {
    backgroundColor: COLORS.primary,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  close: { position: 'absolute', top: SPACING.md, right: SPACING.md },
  cake: { fontSize: 44 },
  todayTitle: {
    fontSize: FONTS.xl,
    fontWeight: '800',
    color: COLORS.onPrimary,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  todayBody: {
    fontSize: FONTS.md,
    lineHeight: 21,
    color: COLORS.onPrimary,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  replayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.round,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    marginTop: SPACING.lg,
  },
  replayText: { fontSize: FONTS.sm, fontWeight: '700', color: COLORS.primary },
  soon: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    backgroundColor: COLORS.primarySoft,
    padding: SPACING.lg,
  },
  soonEmoji: { fontSize: 28 },
  soonTitle: { fontSize: FONTS.md, fontWeight: '700', color: COLORS.text },
  soonBody: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: 2 },
  soonBtn: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.round,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    marginTop: SPACING.md,
  },
  soonBtnText: { fontSize: FONTS.sm, fontWeight: '700', color: COLORS.onPrimary },
});
