import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { COLORS, FONTS, ICON_SIZES, SPACING, RADIUS, PALETTES, THEME_ID, setThemeId, type ThemeId } from '../../../theme';

export function ThemeScreen() {
  const choose = (id: ThemeId) => {
    Alert.alert(`Pakai tema ${PALETTES[id].label}?`, 'App akan dimuat ulang sebentar. Data kamu tidak berubah.', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Pakai', onPress: () => { setThemeId(id); } },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Tema</Text>
        <Text style={styles.desc}>Pilih warna yang paling kamu suka.</Text>

        <View style={styles.grid}>
          {(Object.keys(PALETTES) as ThemeId[]).map((id) => {
            const p = PALETTES[id];
            const c = p.colors;
            const active = id === THEME_ID;
            return (
              <TouchableOpacity
                key={id}
                style={[styles.card, { borderColor: active ? COLORS.primary : COLORS.border }]}
                activeOpacity={0.8}
                disabled={active}
                onPress={() => choose(id)}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
              >
                {/* Pratinjau mini: latar, kartu utama, dan tombol */}
                <View style={[styles.preview, { backgroundColor: c.background }]}>
                  <View style={[styles.previewHero, { backgroundColor: c.primaryDark }]}>
                    <View style={[styles.previewLine, { backgroundColor: c.heroMuted, width: '45%' }]} />
                    <View style={[styles.previewLine, { backgroundColor: c.heroText, width: '70%', height: 8 }]} />
                  </View>
                  <View style={styles.previewRow}>
                    <View style={[styles.previewChip, { backgroundColor: c.primarySoft }]} />
                    <View style={[styles.previewChip, { backgroundColor: c.surface, borderColor: c.border, borderWidth: 1 }]} />
                  </View>
                  <View style={[styles.previewBtn, { backgroundColor: c.primary }]} />
                </View>
                <View style={styles.cardFoot}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardLabel}>{p.label}</Text>
                    <Text style={styles.cardDesc} numberOfLines={1}>{p.description}</Text>
                  </View>
                  {active && <MaterialIcons name="check-circle" size={ICON_SIZES.lg} color={COLORS.primary} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  title: { fontSize: FONTS.xxl, fontWeight: '700', color: COLORS.text },
  desc: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: SPACING.xs, marginBottom: SPACING.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
  card: {
    flexBasis: '47%',
    flexGrow: 1,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
  },
  preview: { padding: SPACING.sm, gap: 6 },
  previewHero: { borderRadius: RADIUS.sm, padding: SPACING.sm, gap: 5 },
  previewLine: { height: 5, borderRadius: 3 },
  previewRow: { flexDirection: 'row', gap: 6 },
  previewChip: { flex: 1, height: 16, borderRadius: RADIUS.sm },
  previewBtn: { height: 12, borderRadius: RADIUS.round },
  cardFoot: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, gap: SPACING.sm },
  cardLabel: { fontSize: FONTS.md, fontWeight: '700', color: COLORS.text },
  cardDesc: { fontSize: FONTS.xs, color: COLORS.textSecondary, marginTop: 2 },
});
