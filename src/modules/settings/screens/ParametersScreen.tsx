import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS } from '../../../theme';
import { Card } from '../../../components/common/Card';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { useSettingsStore } from '../../../store/settingsStore';

export function ParametersScreen() {
  const { settings, updateSettings } = useSettingsStore();
  const [debtRatioLimit, setDebtRatioLimit] = useState(settings.debtRatioLimit.toString());
  const [workingDays, setWorkingDays] = useState(settings.workingDays.toString());

  useEffect(() => {
    setDebtRatioLimit(settings.debtRatioLimit.toString());
    setWorkingDays(settings.workingDays.toString());
  }, [settings]);

  const handleSave = () => {
    const ratio = parseFloat(debtRatioLimit);
    const days = parseInt(workingDays);

    if (isNaN(ratio) || ratio < 1 || ratio > 100) {
      Alert.alert('Error', 'Batas rasio hutang harus antara 1-100%');
      return;
    }
    if (isNaN(days) || days < 1 || days > 31) {
      Alert.alert('Error', 'Hari kerja harus antara 1-31');
      return;
    }

    updateSettings({ debtRatioLimit: ratio, workingDays: days });
    Alert.alert('Sukses', 'Parameter berhasil disimpan');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.header}>Parameter</Text>

        <Card padding={SPACING.lg}>
          <Input
            label="Batas Rasio Hutang (%)"
            value={debtRatioLimit}
            onChangeText={setDebtRatioLimit}
            keyboardType="numeric"
            suffix="%"
            placeholder="30"
          />
          <Text style={styles.hint}>
            Rekomendasi: maksimal 30% dari pendapatan bulanan
          </Text>

          <View style={{ height: SPACING.lg }} />

          <Input
            label="Hari Kerja per Bulan"
            value={workingDays}
            onChangeText={setWorkingDays}
            keyboardType="numeric"
            suffix="hari"
            placeholder="22"
          />
          <Text style={styles.hint}>
            Digunakan untuk kalkulasi pendapatan harian
          </Text>
        </Card>

        <Button
          title="Simpan Parameter"
          onPress={handleSave}
          fullWidth
          style={{ marginTop: SPACING.xl }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  header: { fontSize: FONTS.xxl, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.xl },
  hint: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: -SPACING.sm, marginBottom: SPACING.sm },
});
