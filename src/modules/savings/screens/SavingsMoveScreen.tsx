import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Realm from 'realm';
import { useRealm, useQuery, useObject } from '@realm/react';

import { SavingModel } from '../../../models';
import { depositToSavingFromCash, withdrawFromSavingToCash, transferBetweenSavings } from '../../../services/AllocationService';
import { COLORS, FONTS, SPACING, RADIUS } from '../../../theme';
import { formatCurrency, parseCurrency } from '../../../utils/currency';
import { today } from '../../../utils/date';
import { Button } from '../../../components/common/Button';
import { BackButton } from '../../../components/common/BackButton';
import { DateInput } from '../../../components/common/DateInput';
import { CurrencyInput } from '../../../components/common/CurrencyInput';

import type { SavingsStackParamList } from './SavingsListScreen';

type Props = NativeStackScreenProps<SavingsStackParamList, 'SavingsMove'>;
type MoveType = 'cash' | 'saving';

export function SavingsMoveScreen({ navigation, route }: Props) {
  const { id, type } = route.params;
  const realm = useRealm();

  const saving = useObject(SavingModel, new Realm.BSON.ObjectId(id));
  const allSavings = useQuery(SavingModel);
  const otherSavings = [...allSavings].filter(s => s._id.toHexString() !== id);

  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(today());
  const [note, setNote] = useState('');
  const [moveType, setMoveType] = useState<MoveType>('cash');
  const [targetSavingId, setTargetSavingId] = useState<string | null>(null);
  const [showSavingPicker, setShowSavingPicker] = useState(false);

  const selectedTarget = otherSavings.find(s => s._id.toHexString() === targetSavingId);

  if (!saving) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} color={COLORS.text} />
        </View>
      </SafeAreaView>
    );
  }

  const title = type === 'deposit' ? 'Setor Tabungan' : type === 'withdraw' ? 'Tarik Tabungan' : 'Transfer Tabungan';

  const handleConfirm = () => {
    const amt = parseCurrency(amount);
    if (!amt || amt <= 0) {
      Alert.alert('Validasi', 'Jumlah harus lebih dari 0');
      return;
    }
    if (!date) {
      Alert.alert('Validasi', 'Tanggal harus diisi');
      return;
    }

    const needsTargetSaving =
      type === 'transfer' || ((type === 'deposit' || type === 'withdraw') && moveType === 'saving');
    if (needsTargetSaving && !targetSavingId) {
      Alert.alert('Validasi', 'Pilih tabungan terlebih dahulu');
      return;
    }

    let result: { ok: true } | { ok: false; error: string } | null = null;

    realm.write(() => {
      if (type === 'deposit') {
        result = moveType === 'saving' && targetSavingId
          ? transferBetweenSavings(realm, { fromSavingId: targetSavingId, toSavingId: id, amount: amt, date, note: note.trim() })
          : depositToSavingFromCash(realm, { savingId: id, amount: amt, date, note: note.trim() });
      } else if (type === 'withdraw') {
        result = moveType === 'saving' && targetSavingId
          ? transferBetweenSavings(realm, { fromSavingId: id, toSavingId: targetSavingId, amount: amt, date, note: note.trim() })
          : withdrawFromSavingToCash(realm, { savingId: id, amount: amt, date, note: note.trim() });
      } else if (type === 'transfer' && targetSavingId) {
        result = transferBetweenSavings(realm, { fromSavingId: id, toSavingId: targetSavingId, amount: amt, date, note: note.trim() });
      }
    });

    if (result && !(result as { ok: boolean }).ok) {
      Alert.alert('Validasi', (result as { ok: false; error: string }).error);
      return;
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} color={COLORS.text} />
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {(type === 'deposit' || type === 'withdraw') && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {type === 'deposit' ? 'Sumber Dana' : 'Tujuan Dana'}
              </Text>
              <View style={styles.moveTypeRow}>
                <TouchableOpacity
                  style={[styles.moveTypeBtn, moveType === 'cash' && styles.moveTypeBtnActive]}
                  onPress={() => { setMoveType('cash'); setTargetSavingId(null); setShowSavingPicker(false); }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.moveTypeText, moveType === 'cash' && styles.moveTypeTextActive]}>
                    Kas Bebas
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.moveTypeBtn, moveType === 'saving' && styles.moveTypeBtnActive]}
                  onPress={() => { setMoveType('saving'); setTargetSavingId(null); setShowSavingPicker(false); }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.moveTypeText, moveType === 'saving' && styles.moveTypeTextActive]}>
                    Tabungan Lain
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {(type === 'transfer' || ((type === 'deposit' || type === 'withdraw') && moveType === 'saving')) && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {type === 'deposit' ? 'Tabungan Sumber' : 'Tabungan Tujuan'}
              </Text>
              <TouchableOpacity
                style={styles.pickerBtn}
                onPress={() => setShowSavingPicker(!showSavingPicker)}
                activeOpacity={0.8}
              >
                <Text style={selectedTarget ? styles.pickerValue : styles.pickerPlaceholder}>
                  {selectedTarget ? `${selectedTarget.emoji} ${selectedTarget.name}` : 'Pilih tabungan tujuan...'}
                </Text>
                <Text style={styles.pickerArrow}>{showSavingPicker ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              {showSavingPicker && (
                <View style={styles.pickerDropdown}>
                  {otherSavings.length === 0 ? (
                    <Text style={styles.pickerEmpty}>Tidak ada tabungan lain</Text>
                  ) : (
                    otherSavings.map(s => (
                      <TouchableOpacity
                        key={s._id.toHexString()}
                        style={[styles.pickerItem, targetSavingId === s._id.toHexString() && styles.pickerItemSelected]}
                        onPress={() => { setTargetSavingId(s._id.toHexString()); setShowSavingPicker(false); }}
                      >
                        <Text style={styles.pickerItemText}>{s.emoji} {s.name}</Text>
                        <Text style={styles.pickerItemBalance}>{formatCurrency(s.balance)}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              )}
            </View>
          )}

          <CurrencyInput label="Jumlah" value={amount} onChangeText={setAmount} />

          <DateInput label="Tanggal" value={date} onChange={setDate} />

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Catatan (opsional)</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                value={note}
                onChangeText={setNote}
                placeholder="Tambah catatan..."
                placeholderTextColor={COLORS.textMuted}
              />
            </View>
          </View>

          <Button title="Simpan" onPress={handleConfirm} fullWidth style={styles.saveBtn} />
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
  inputGroup: { marginBottom: SPACING.md },
  moveTypeRow: { flexDirection: 'row', gap: SPACING.sm },
  moveTypeBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  moveTypeBtnActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '18' },
  moveTypeText: { fontSize: FONTS.sm, fontWeight: '500', color: COLORS.textSecondary },
  moveTypeTextActive: { color: COLORS.primary, fontWeight: '600' },
  inputLabel: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginBottom: SPACING.xs, fontWeight: '500' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
  },
  textInput: { flex: 1, paddingVertical: SPACING.md, fontSize: FONTS.md, color: COLORS.text },
  pickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  pickerValue: { fontSize: FONTS.md, color: COLORS.text },
  pickerPlaceholder: { fontSize: FONTS.md, color: COLORS.textMuted },
  pickerArrow: { fontSize: FONTS.sm, color: COLORS.textSecondary },
  pickerDropdown: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.xs,
    overflow: 'hidden',
  },
  pickerEmpty: { padding: SPACING.md, color: COLORS.textMuted, fontSize: FONTS.sm, textAlign: 'center' },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  pickerItemSelected: { backgroundColor: COLORS.primary + '22' },
  pickerItemText: { fontSize: FONTS.md, color: COLORS.text },
  pickerItemBalance: { fontSize: FONTS.sm, color: COLORS.textSecondary },
  saveBtn: { marginTop: SPACING.lg },
});
