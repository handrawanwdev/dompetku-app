import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRealm, useObject } from '@realm/react';
import Realm from 'realm';

import { COLORS, FONTS, SPACING } from '../../../theme';
import { Button } from '../../../components/common/Button';
import { BackButton } from '../../../components/common/BackButton';
import { CurrencyInput } from '../../../components/common/CurrencyInput';
import { InvestmentModel } from '../../../models/InvestmentModel';
import { PassiveIncomeModel } from '../../../models/PassiveIncomeModel';
import { IncomeModel } from '../../../models/IncomeModel';
import { parseCurrency } from '../../../utils/currency';
import { PASSIVE_INCOME_FREQUENCIES } from '../../../utils/finance';
import { today } from '../../../utils/date';

import type { InvestmentStackParamList } from './InvestmentListScreen';

type Props = NativeStackScreenProps<InvestmentStackParamList, 'InvestmentDividend'>;

export function InvestmentDividendScreen({ navigation, route }: Props) {
  const { id } = route.params;
  const realm = useRealm();
  const investment = useObject(InvestmentModel, new Realm.BSON.ObjectId(id));

  const [dividendAmountInput, setDividendAmountInput] = useState('');
  const [dividendFrequency, setDividendFrequency] = useState<'monthly' | 'yearly'>('monthly');

  if (!investment) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} color={COLORS.text} />
        </View>
      </SafeAreaView>
    );
  }

  const dividendAmount = parseCurrency(dividendAmountInput);

  const confirmDividend = () => {
    if (!dividendAmount || dividendAmount <= 0) {
      Alert.alert('Validasi', 'Isi nominal dividen');
      return;
    }
    realm.write(() => {
      realm.create(PassiveIncomeModel, {
        category: 'dividen',
        amount: dividendAmount,
        frequency: dividendFrequency,
        note: `Dividen ${investment.name}`,
        recurring: false,
      });
      realm.create(IncomeModel, {
        category: 'Dividen',
        amount: dividendAmount,
        allocationCash: dividendAmount,
        allocationDebt: 0,
        allocationSavings: 0,
        date: today(),
        note: `Dividen ${investment.name}`,
        type: 'passive',
      });
    });
    navigation.goBack();
    Alert.alert('Tersimpan', 'Dividen masuk Kas Bebas & dicatat sebagai passive income');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} color={COLORS.text} />
        <Text style={styles.headerTitle}>💰 Catat Dividen</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.assetBox}>
            <Text style={styles.assetLabel}>Aset</Text>
            <Text style={styles.assetName}>{investment.name}</Text>
          </View>

          <Text style={styles.fieldLabel}>Nominal Dividen</Text>
          <CurrencyInput
            value={dividendAmountInput}
            onChangeText={setDividendAmountInput}
            placeholder="500.000"
          />

          <Text style={styles.fieldLabel}>Frekuensi</Text>
          <View style={styles.destRow}>
            {PASSIVE_INCOME_FREQUENCIES.map((f) => (
              <TouchableOpacity
                key={f.value}
                style={[styles.destOption, dividendFrequency === f.value && styles.destOptionActive]}
                onPress={() => setDividendFrequency(f.value)}
              >
                <Text style={[styles.destText, dividendFrequency === f.value && styles.destTextActive]}>{f.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.dividendHint}>
            Dicatat sebagai sumber passive income "Dividen {investment.name}" — bisa diedit di menu Passive Income.
          </Text>

          <Button title="Simpan" onPress={confirmDividend} fullWidth style={styles.saveBtn} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text },
  scroll: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  assetBox: { backgroundColor: COLORS.subtleBg, borderRadius: 12, padding: SPACING.md, marginBottom: SPACING.md },
  assetLabel: { fontSize: FONTS.xs, color: COLORS.textMuted },
  assetName: { fontSize: FONTS.md, fontWeight: '700', color: COLORS.text, marginTop: 2 },
  fieldLabel: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginBottom: SPACING.xs, fontWeight: '500', marginTop: SPACING.sm },
  destRow: { flexDirection: 'row', gap: SPACING.sm },
  destOption: {
    flex: 1, paddingVertical: SPACING.sm, borderRadius: 12,
    borderWidth: 1.5, borderColor: COLORS.border, alignItems: 'center',
  },
  destOptionActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '18' },
  destText: { fontSize: FONTS.sm, fontWeight: '600', color: COLORS.textSecondary },
  destTextActive: { color: COLORS.primary },
  dividendHint: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: SPACING.md, lineHeight: 17 },
  saveBtn: { marginTop: SPACING.lg },
});
