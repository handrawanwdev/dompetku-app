import React from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { COLORS, FONTS, ICON_SIZES, RADIUS, SHADOWS, SPACING } from '../../theme';
import { BackButton, Card, ProgressBar, Text } from '../../components/common';
import { formatCompact } from '../../utils/currency';
import { LEVELS } from '../../utils/freedomLevel';
import { useRootNavigation } from '../../navigation/types';
import { useFreedomLevel } from './useFreedomLevel';

/** Level sekarang, yang perlu dilakukan untuk naik, dan tangga 0–7. */
export function FreedomLevelScreen() {
  const nav = useRootNavigation();
  const f = useFreedomLevel();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <BackButton onPress={() => nav.goBack()} />
        <Text style={styles.title}>Level keuangan</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Posisi sekarang */}
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>Kamu di level</Text>
          <Text style={styles.heroLevel}>
            {f.level} · {f.current.name}
          </Text>
          <Text style={styles.heroShort}>{f.current.short}</Text>
          {f.next && (
            <>
              <ProgressBar progress={f.nextProgress * 100} color={COLORS.heroText} height={6} style={styles.heroBar} />
              <Text style={styles.heroNext}>
                {Math.round(f.nextProgress * 100)}% menuju {f.next.name}
              </Text>
            </>
          )}
        </View>

        {/* Yang perlu dilakukan */}
        {f.next && (
          <>
            <Text style={styles.section}>Supaya naik ke {f.next.name}</Text>
            <Card padding={SPACING.lg}>
              {f.nextCriteria.map((c, i) => (
                <View key={c.label} style={[styles.crit, i > 0 && styles.critGap]}>
                  <MaterialIcons
                    name={c.done ? 'check-circle' : 'radio-button-unchecked'}
                    size={ICON_SIZES.lg}
                    color={c.done ? COLORS.success : COLORS.textMuted}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.critLabel, c.done && styles.critDone]}>{c.label}</Text>
                    <Text style={styles.critNow}>{c.now}</Text>
                  </View>
                </View>
              ))}
            </Card>
          </>
        )}

        {/* Tangga level */}
        <Text style={styles.section}>Semua level</Text>
        <Card padding={SPACING.sm}>
          {LEVELS.map((l) => {
            const reached = l.level <= f.level;
            const current = l.level === f.level;
            return (
              <View key={l.level} style={[styles.step, current && styles.stepCurrent]}>
                <View style={[styles.stepBadge, reached && styles.stepBadgeReached]}>
                  <Text style={[styles.stepNum, reached && styles.stepNumReached]}>{l.level}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.stepName, !reached && styles.muted]}>{l.name}</Text>
                  <Text style={[styles.stepShort, !reached && styles.muted]}>{l.short}</Text>
                </View>
              </View>
            );
          })}
        </Card>

        <Text style={styles.footnote}>
          {f.targetAssets > 0
            ? `Target aset = biaya hidup setahun × 25 (Rp ${formatCompact(f.targetAssets)}). `
            : ''}
          {f.partial ? 'Dihitung dari catatan bulan ini.' : `Dihitung dari rata-rata ${f.months} bulan terakhir.`}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  title: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text },
  content: { padding: SPACING.lg, paddingTop: 0, paddingBottom: SPACING.xxxl },

  hero: { backgroundColor: COLORS.primaryDark, borderRadius: RADIUS.xl, padding: SPACING.xl, ...SHADOWS.lg },
  heroLabel: { fontSize: FONTS.sm, color: COLORS.heroMuted, fontWeight: '600' },
  heroLevel: { fontSize: FONTS.xxl, fontWeight: '800', color: COLORS.heroText, marginTop: SPACING.xs },
  heroShort: { fontSize: FONTS.sm, color: COLORS.heroMuted, marginTop: 2 },
  heroBar: { marginTop: SPACING.lg, backgroundColor: 'rgba(255,255,255,0.2)' },
  heroNext: { fontSize: FONTS.xs, color: COLORS.heroMuted, marginTop: SPACING.sm },

  section: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text, marginTop: SPACING.xl, marginBottom: SPACING.sm },

  crit: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm },
  critGap: { marginTop: SPACING.md },
  critLabel: { fontSize: FONTS.md, fontWeight: '600', color: COLORS.text },
  critDone: { color: COLORS.textSecondary },
  critNow: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: 2 },

  step: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.sm, borderRadius: RADIUS.md },
  stepCurrent: { backgroundColor: COLORS.primarySoft },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.round,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeReached: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  stepNum: { fontSize: FONTS.sm, fontWeight: '700', color: COLORS.textMuted },
  stepNumReached: { color: COLORS.onPrimary },
  stepName: { fontSize: FONTS.md, fontWeight: '700', color: COLORS.text },
  stepShort: { fontSize: FONTS.sm, color: COLORS.textSecondary },
  muted: { color: COLORS.textMuted },

  footnote: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: SPACING.lg, lineHeight: 18 },
});
