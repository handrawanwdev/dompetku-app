import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { COLORS, FONTS, SPACING, RADIUS } from '../../../theme';
import { Card } from '../../../components/common/Card';
import { BackButton } from '../../../components/common/BackButton';
import { FINANCIAL_LEVELS } from '../../../utils/financialScore';
import { SettingsStackParamList } from './SettingsMainScreen';

type NavProp = NativeStackNavigationProp<SettingsStackParamList, 'LevelGuideScreen'>;

interface Props {
  navigation: NavProp;
}

const LEVEL_EXAMPLES: Record<number, string[]> = {
  0: [
    'Pengeluaran bulanan lebih besar dari pemasukan',
    'Belum ada tabungan atau dana darurat sama sekali',
    'Hutang konsumtif menumpuk tanpa rencana pelunasan',
  ],
  1: [
    'Mulai mencatat pemasukan & pengeluaran tiap bulan',
    'Masih sering kaget karena pengeluaran mendadak',
    'Belum ada target tabungan atau dana darurat yang jelas',
  ],
  2: [
    'Cashflow bulanan pas-pasan, hampir habis tiap akhir bulan',
    'Dana darurat masih di bawah 1 bulan pengeluaran',
    'Cicilan hutang mulai terkontrol tapi belum aman',
  ],
  3: [
    'Cashflow positif secara konsisten tiap bulan',
    'Mulai punya kebiasaan menabung rutin, meski belum besar',
    'Rasio cicilan hutang di bawah batas aman (<35% pendapatan)',
  ],
  4: [
    'Dana darurat mencapai 1–3 bulan pengeluaran',
    'Cicilan hutang terkendali, tidak lagi bikin was-was',
    'Mulai ada alokasi kecil untuk investasi',
  ],
  5: [
    'Dana darurat aman di atas 3 bulan pengeluaran',
    'Investasi jalan rutin tiap bulan',
    'Ada ruang untuk mengejar financial goals (rumah, pendidikan, dll)',
  ],
  6: [
    'Nilai aset & investasi tumbuh signifikan',
    'Mulai ada passive income, meski belum menutup semua pengeluaran',
    'Hidup tidak lagi 100% bergantung pada gaji bulanan',
  ],
  7: [
    'Passive income (dividen, sewa, bunga, dll) menutup kebutuhan hidup bulanan',
    'Kerja jadi pilihan, bukan keharusan untuk bertahan hidup',
    'Cashflow, dana darurat, hutang, investasi, dan passive income semua sehat',
  ],
  8: [
    'Fokus bergeser ke melipatgandakan kekayaan lewat aset produktif',
    'Portofolio investasi terdiversifikasi dan terus berkembang',
    'Passive income jauh melebihi kebutuhan hidup',
  ],
  9: [
    'Kekayaan cukup untuk diwariskan ke generasi berikutnya',
    'Bisa memberi dampak finansial di luar diri sendiri (donasi, yayasan, dll)',
    'Lepas total dari ketergantungan pada pendapatan aktif',
  ],
};

export function LevelGuideScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} color={COLORS.text} />
        </View>

        <Text style={styles.title}>💎 Panduan Level Financial Freedom</Text>
        <Text style={styles.subtitle}>
          Skor 0–100 kamu di Dashboard dipetakan ke 10 level ini. Tiap level nunjukin
          seberapa sehat dan bebas kondisi keuangan kamu saat ini.
        </Text>

        {FINANCIAL_LEVELS.map((level) => (
          <Card key={level.level} padding={SPACING.lg} style={styles.levelCard}>
            <View style={styles.levelHeader}>
              <Text style={styles.levelIcon}>{level.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.levelName}>
                  Level {level.level} — {level.name}
                </Text>
                <Text style={styles.levelRange}>
                  Skor {level.min}–{level.max === 101 ? 100 : level.max - 1}
                </Text>
              </View>
            </View>

            <Text style={styles.levelDescription}>{level.description}</Text>

            <Text style={styles.exampleTitle}>Contoh ciri-cirinya</Text>
            {(LEVEL_EXAMPLES[level.level] ?? []).map((ex, i) => (
              <View key={i} style={styles.exampleRow}>
                <Text style={styles.exampleBullet}>•</Text>
                <Text style={styles.exampleText}>{ex}</Text>
              </View>
            ))}
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md, marginLeft: -SPACING.sm },
  title: { fontSize: FONTS.xxl, fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: SPACING.xs, marginBottom: SPACING.lg, lineHeight: 20 },

  levelCard: { marginBottom: SPACING.sm },
  levelHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  levelIcon: { fontSize: 32 },
  levelName: { fontSize: FONTS.md, fontWeight: '700', color: COLORS.text },
  levelRange: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 2 },
  levelDescription: { fontSize: FONTS.sm, color: COLORS.text, lineHeight: 20, marginBottom: SPACING.md },

  exampleTitle: {
    fontSize: FONTS.xs,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.xs,
  },
  exampleRow: { flexDirection: 'row', gap: SPACING.xs, marginTop: 4 },
  exampleBullet: { fontSize: FONTS.sm, color: COLORS.primary },
  exampleText: { flex: 1, fontSize: FONTS.sm, color: COLORS.textSecondary, lineHeight: 19 },
});
