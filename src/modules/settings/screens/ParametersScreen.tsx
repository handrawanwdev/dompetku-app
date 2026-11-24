import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS } from '../../../theme';
import { Card } from '../../../components/common/Card';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { useSettingsStore } from '../../../store/settingsStore';
import { KIND_META, SPEND_KINDS, DEFAULT_KIND_TARGETS, type KindTargets, type SpendKind } from '../../../utils/budget';

const toInputs = (t: KindTargets) =>
  Object.fromEntries(SPEND_KINDS.map((k) => [k, String(t[k])])) as Record<SpendKind, string>;

const DAY_LABELS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export function ParametersScreen() {
  const { settings, updateSettings } = useSettingsStore();
  const [targets, setTargets] = useState(() => toInputs(settings.kindTargets));
  const [workingDays, setWorkingDays] = useState(settings.workingDays.toString());

  useEffect(() => {
    setTargets(toInputs(settings.kindTargets));
    setWorkingDays(settings.workingDays.toString());
  }, [settings]);

  const parsed = Object.fromEntries(
    SPEND_KINDS.map((k) => [k, parseInt(targets[k], 10)]),
  ) as KindTargets;
  const total = SPEND_KINDS.reduce((s, k) => s + (Number.isNaN(parsed[k]) ? 0 : parsed[k]), 0);

  const toggleHariLibur = (day: number) => {
    const current = settings.hariLibur ?? [0];
    const next = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day].sort();
    updateSettings({ hariLibur: next });
  };

  const handleSave = () => {
    const days = parseInt(workingDays);

    if (SPEND_KINDS.some((k) => Number.isNaN(parsed[k]) || parsed[k] < 0 || parsed[k] > 100)) {
      Alert.alert('Target belum pas', 'Isi tiap target dengan angka bulat 0 sampai 100.');
      return;
    }
    if (total !== 100) {
      Alert.alert('Total belum 100%', `Totalnya sekarang ${total}%. Sesuaikan supaya pas 100%.`);
      return;
    }
    if (isNaN(days) || days < 1 || days > 31) {
      Alert.alert('Hari kerja belum pas', 'Isi angka 1 sampai 31.');
      return;
    }

    updateSettings({ kindTargets: parsed, workingDays: days });
    Alert.alert('Tersimpan', 'Target dan batas sudah diperbarui.');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.scroll}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.header}>Target & batas</Text>

        <Card padding={SPACING.lg}>
          <Text style={styles.label}>Target pembagian uang tiap bulan</Text>
          <Text style={styles.dayHint}>
            Porsi tiap jenis dari pemasukan bulanan. Totalnya harus 100%.
          </Text>
          {SPEND_KINDS.map((k) => (
            <View key={k}>
              <Input
                label={KIND_META[k].label}
                value={targets[k]}
                onChangeText={(v) => setTargets((t) => ({ ...t, [k]: v.replace(/[^0-9]/g, '') }))}
                keyboardType="number-pad"
                maxLength={3}
                suffix="%"
                placeholder={String(DEFAULT_KIND_TARGETS[k])}
              />
              {k === 'obligation' && (
                <Text style={styles.hint}>Juga jadi batas cicilan sehat di Dashboard.</Text>
              )}
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={[styles.totalText, total !== 100 && styles.totalWarn]}>
              Total {total}%{total !== 100 ? ` · ${total < 100 ? 'kurang' : 'lebih'} ${Math.abs(100 - total)}%` : ''}
            </Text>
            <TouchableOpacity onPress={() => setTargets(toInputs(DEFAULT_KIND_TARGETS))} hitSlop={8}>
              <Text style={styles.resetText}>Pakai bawaan</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card padding={SPACING.lg} style={{ marginTop: SPACING.lg }}>

          <Input
            label="Hari kerja per bulan"
            value={workingDays}
            onChangeText={setWorkingDays}
            keyboardType="numeric"
            suffix="hari"
            placeholder="22"
          />
          <Text style={styles.hint}>
            Dipakai untuk menghitung pemasukan per hari
          </Text>
        </Card>

        <Card padding={SPACING.lg} style={{ marginTop: SPACING.lg }}>
          <Text style={styles.label}>Hari libur tiap minggu</Text>
          <Text style={styles.dayHint}>
            Hari yang kamu pilih nggak dihitung hari kerja. Target nabung harian buat cicilan ikut menyesuaikan.
          </Text>
          <View style={styles.dayRow}>
            {DAY_LABELS.map((label, idx) => {
              const active = (settings.hariLibur ?? [0]).includes(idx);
              return (
                <TouchableOpacity
                  key={idx}
                  style={[styles.dayChip, active && styles.dayChipActive]}
                  onPress={() => toggleHariLibur(idx)}
                >
                  <Text style={[styles.dayChipText, active && styles.dayChipTextActive]}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        <Button
          title="Simpan"
          onPress={handleSave}
          fullWidth
          style={{ marginTop: SPACING.xl }}
        />
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  header: { fontSize: FONTS.xxl, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.xl },
  hint: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: -SPACING.sm, marginBottom: SPACING.sm },
  label: { fontSize: FONTS.sm, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  totalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: SPACING.sm },
  totalText: { fontSize: FONTS.sm, fontWeight: '700', color: COLORS.text },
  totalWarn: { color: COLORS.dangerText },
  resetText: { fontSize: FONTS.sm, fontWeight: '600', color: COLORS.primary },
  dayHint: { fontSize: FONTS.xs, color: COLORS.textMuted, marginBottom: SPACING.md },
  dayRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  dayChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  dayChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '18',
  },
  dayChipText: { fontSize: FONTS.sm, fontWeight: '600', color: COLORS.textSecondary },
  dayChipTextActive: { color: COLORS.primary },
});
