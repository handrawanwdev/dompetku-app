import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '../../../components/common';
import { COLORS, FONTS, ICON_SIZES, RADIUS, SPACING } from '../../../theme';
import { formatCurrency } from '../../../utils/currency';
import { birthdayWish, type BirthdayCelebration } from '../../../utils/birthday';
import { closingLine, type BirthdayRecap } from '../birthdayRecap';

type Icon = keyof typeof MaterialIcons.glyphMap;

function stats(r: BirthdayRecap): { icon: Icon; color: string; value: string; label: string }[] {
  const out: { icon: Icon; color: string; value: string; label: string }[] = [];
  if (r.records > 0) {
    out.push({ icon: 'edit-note', color: COLORS.primary, value: `${r.records} catatan`, label: `di ${r.activeDays} hari berbeda. Konsisten itu tidak mudah.` });
  }
  if (r.saved > 0) out.push({ icon: 'savings', color: COLORS.saving, value: formatCurrency(r.saved), label: 'kamu sisihkan untuk tabungan' });
  if (r.invested > 0) out.push({ icon: 'trending-up', color: COLORS.invest, value: formatCurrency(r.invested), label: 'kamu tanam di investasi' });
  if (r.debtPaid > 0) {
    out.push({
      icon: 'credit-score',
      color: COLORS.obligation,
      value: formatCurrency(r.debtPaid),
      label: r.debtsCleared > 0 ? `dibayar untuk kewajiban, ${r.debtsCleared} sudah lunas` : 'dibayar untuk cicilan dan utang',
    });
  }
  if (r.goalsReached > 0) out.push({ icon: 'flag', color: COLORS.want, value: `${r.goalsReached} goal`, label: 'berhasil kamu capai' });
  return out;
}

interface Props {
  celebration: BirthdayCelebration;
  name?: string;
  recap: BirthdayRecap;
  onClose: () => void;
}

/** Ucapan, rekap capaian setahun, dan kalimat penyemangat. Muncul setelah lilin ditiup. */
export function BirthdayLetter({ celebration, name, recap, onClose }: Props) {
  const items = stats(recap);
  const sapaan = name ? `, ${name}` : '';
  const ke = celebration.age > 0 ? ` ke-${celebration.age}` : '';
  let step = 0;
  const enter = () => FadeInDown.delay(150 + step++ * 140).duration(450);

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Animated.Text entering={enter()} style={styles.title}>
        Selamat ulang tahun{ke}{sapaan}!
      </Animated.Text>
      {celebration.daysLate > 0 && (
        <Animated.Text entering={enter()} style={styles.late}>
          Kejutannya sedikit terlambat, tapi doanya tetap sama tulusnya.
        </Animated.Text>
      )}
      <Animated.Text entering={enter()} style={styles.wish}>
        {birthdayWish(celebration.year)}
      </Animated.Text>

      <Animated.View entering={enter()} style={styles.sheet}>
        <Text style={styles.sheetTitle}>
          {items.length ? 'Setahun terakhir, kamu sudah…' : 'Tahun ini awal perjalananmu'}
        </Text>
        {items.map((s) => (
          <Animated.View key={s.icon} entering={enter()} style={styles.stat}>
            <View style={[styles.statIcon, { backgroundColor: s.color + '1A' }]}>
              <MaterialIcons name={s.icon} size={ICON_SIZES.md} color={s.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          </Animated.View>
        ))}
        <Animated.View entering={enter()} style={styles.closing}>
          <MaterialIcons name="favorite" size={ICON_SIZES.md} color={COLORS.primary} />
          <Text style={styles.closingText}>{closingLine(recap)}</Text>
        </Animated.View>
        <Animated.Text entering={enter()} style={styles.thanks}>
          Terima kasih sudah memercayakan catatan keuanganmu ke Dompetku. Kami bangga menemanimu.
        </Animated.Text>
      </Animated.View>

      <Animated.View entering={enter()}>
        <Pressable style={styles.btn} onPress={onClose} accessibilityRole="button">
          <Text style={styles.btnText}>Terima kasih, Dompetku</Text>
        </Pressable>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl, paddingBottom: SPACING.xxxl },
  title: { fontSize: 28, lineHeight: 34, fontWeight: '800', color: COLORS.heroText, textAlign: 'center' },
  late: { fontSize: FONTS.sm, color: COLORS.heroMuted, textAlign: 'center', marginTop: SPACING.sm, fontStyle: 'italic' },
  wish: { fontSize: FONTS.lg, lineHeight: 24, color: COLORS.heroText, textAlign: 'center', marginTop: SPACING.md },
  sheet: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginTop: SPACING.xl,
  },
  sheetTitle: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  stat: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: SPACING.sm },
  statIcon: { width: 40, height: 40, borderRadius: RADIUS.round, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: FONTS.lg, fontWeight: '800', color: COLORS.text },
  statLabel: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: 1 },
  closing: {
    flexDirection: 'row',
    gap: SPACING.sm,
    backgroundColor: COLORS.primarySoft,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  closingText: { flex: 1, fontSize: FONTS.md, lineHeight: 20, fontWeight: '600', color: COLORS.text },
  thanks: { fontSize: FONTS.sm, lineHeight: 19, color: COLORS.textSecondary, marginTop: SPACING.md, textAlign: 'center' },
  btn: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.round,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  btnText: { fontSize: FONTS.md, fontWeight: '800', color: COLORS.primary },
});
