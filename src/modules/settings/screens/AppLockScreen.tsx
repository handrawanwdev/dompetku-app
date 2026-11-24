import React, { useCallback, useState } from 'react';
import { View, ScrollView, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { COLORS, FONTS, ICON_SIZES, RADIUS, SPACING } from '../../../theme';
import { Text, Button } from '../../../components/common';
import { useRootNavigation } from '../../../navigation/types';
import {
  RELOCK_OPTIONS,
  authenticateBiometric,
  getBiometricEnabled,
  getDeviceAuthInfo,
  getRelockAfter,
  hasPin,
  setBiometricEnabled,
  setRelockAfter,
  type DeviceAuthInfo,
} from '../../../services/AppLockService';

function Row({
  icon,
  label,
  sub,
  danger,
  onPress,
  right,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  sub?: string;
  danger?: boolean;
  onPress?: () => void;
  right?: React.ReactNode;
}) {
  const color = danger ? COLORS.danger : COLORS.primary;
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} disabled={!onPress} activeOpacity={0.7}>
      <View style={[styles.rowIcon, { backgroundColor: color + '1A' }]}>
        <MaterialIcons name={icon} size={ICON_SIZES.md} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowLabel, danger && { color: COLORS.danger }]}>{label}</Text>
        {sub ? <Text style={styles.rowSub}>{sub}</Text> : null}
      </View>
      {right ?? (onPress ? <MaterialIcons name="chevron-right" size={ICON_SIZES.lg} color={COLORS.textMuted} /> : null)}
    </TouchableOpacity>
  );
}

/** Pengaturan kunci aplikasi (opsional, bawaan mati). */
export function AppLockScreen() {
  const nav = useRootNavigation();
  const [enabled, setEnabled] = useState(hasPin());
  const [bio, setBio] = useState(getBiometricEnabled());
  const [relock, setRelock] = useState(getRelockAfter());
  const [device, setDevice] = useState<DeviceAuthInfo | null>(null);

  // Segarkan setelah kembali dari layar PIN (aktif/ubah/matikan).
  useFocusEffect(
    useCallback(() => {
      setEnabled(hasPin());
      setBio(getBiometricEnabled());
      getDeviceAuthInfo().then(setDevice);
    }, []),
  );

  const toggleBio = async (next: boolean) => {
    if (next && !(await authenticateBiometric(`Aktifkan buka pakai ${device?.label ?? 'biometrik'}`))) return;
    setBiometricEnabled(next);
    setBio(next);
  };

  const pickRelock = (s: number) => {
    setRelockAfter(s);
    setRelock(s);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={[styles.heroIcon, enabled && { backgroundColor: COLORS.successBg }]}>
            <MaterialIcons name={enabled ? 'lock' : 'lock-open'} size={32} color={enabled ? COLORS.successText : COLORS.primary} />
          </View>
          <Text style={styles.title}>Kunci aplikasi</Text>
          <Text style={styles.desc}>
            {enabled
              ? 'Dompetku minta PIN setiap dibuka. Catatan keuanganmu aman walau HP dipinjam orang lain.'
              : 'Minta PIN setiap Dompetku dibuka, supaya catatan keuanganmu tidak bisa dilihat orang lain yang memegang HP kamu.'}
          </Text>
          {!enabled && (
            <Button title="Aktifkan kunci" onPress={() => nav.navigate('PinFlow', { mode: 'create' })} style={styles.cta} />
          )}
        </View>

        {enabled && (
          <>
            <Text style={styles.sectionTitle}>Cara membuka</Text>
            <View style={styles.card}>
              <Row icon="dialpad" label="PIN 6 angka" sub="Selalu bisa dipakai" />
              <View style={styles.separator} />
              {device?.biometric ? (
                <Row
                  icon="fingerprint"
                  label={`Pakai ${device.label}`}
                  sub="Lebih cepat, PIN tetap jadi cadangan"
                  onPress={() => toggleBio(!bio)}
                  right={<Switch value={bio} onValueChange={toggleBio} trackColor={{ true: COLORS.primary }} />}
                />
              ) : (
                <Row icon="fingerprint" label="Sidik jari/wajah" sub="Belum diatur di HP ini. Atur dulu di Pengaturan HP." />
              )}
            </View>

            <Text style={styles.sectionTitle}>Kunci lagi setelah ditinggal</Text>
            <View style={styles.chips}>
              {RELOCK_OPTIONS.map((o) => {
                const active = relock === o.seconds;
                return (
                  <TouchableOpacity
                    key={o.seconds}
                    onPress={() => pickRelock(o.seconds)}
                    style={[styles.chip, active && styles.chipActive]}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: active }}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{o.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={styles.hint}>Saat Dompetku baru dibuka, PIN selalu diminta.</Text>

            <Text style={styles.sectionTitle}>PIN</Text>
            <View style={styles.card}>
              <Row icon="password" label="Ubah PIN" onPress={() => nav.navigate('PinFlow', { mode: 'change' })} />
              <View style={styles.separator} />
              <Row icon="lock-open" label="Matikan kunci" danger onPress={() => nav.navigate('PinFlow', { mode: 'disable' })} />
            </View>

            <View style={styles.note}>
              <MaterialIcons name="help-outline" size={ICON_SIZES.sm} color={COLORS.textSecondary} />
              <Text style={styles.noteText}>
                Lupa PIN? Di layar kunci, ketuk "Lupa PIN?" lalu buktikan ini HP kamu pakai sidik jari, wajah, atau kunci
                layar HP. Datamu tetap aman.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  hero: { alignItems: 'center', paddingVertical: SPACING.lg },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: FONTS.xxl, fontWeight: '700', color: COLORS.text, marginTop: SPACING.md },
  desc: { fontSize: FONTS.sm, color: COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.xs, lineHeight: 20 },
  cta: { marginTop: SPACING.lg, minWidth: 200 },
  sectionTitle: { fontSize: FONTS.md, fontWeight: '700', color: COLORS.textSecondary, marginTop: SPACING.xl, marginBottom: SPACING.sm },
  card: { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.lg },
  rowIcon: { width: 36, height: 36, borderRadius: RADIUS.round, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { fontSize: FONTS.md, fontWeight: '600', color: COLORS.text },
  rowSub: { fontSize: FONTS.xs, color: COLORS.textSecondary, marginTop: 2 },
  separator: { height: 1, backgroundColor: COLORS.border, marginLeft: SPACING.lg * 2 + 36 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  chip: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: FONTS.sm, fontWeight: '500', color: COLORS.textSecondary },
  chipTextActive: { color: COLORS.onPrimary, fontWeight: '700' },
  hint: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: SPACING.sm },
  note: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.xl,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.subtleBg,
  },
  noteText: { flex: 1, fontSize: FONTS.sm, color: COLORS.textSecondary, lineHeight: 19 },
});
