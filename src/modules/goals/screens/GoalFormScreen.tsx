import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRealm, useQuery } from '@realm/react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Realm from 'realm';

import { COLORS, FONTS, SPACING, RADIUS } from '../../../theme';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { BackButton } from '../../../components/common/BackButton';
import { DateInput } from '../../../components/common/DateInput';
import { CurrencyInput } from '../../../components/common/CurrencyInput';
import { GoalModel } from '../../../models/GoalModel';
import { SavingModel } from '../../../models/SavingModel';
import { formatCurrency } from '../../../utils/currency';
import { today } from '../../../utils/date';
import { GoalsStackParamList } from './GoalsListScreen';

const EMOJIS = ['🎯', '🏠', '✈️', '💍', '🚗', '📚', '💻', '🌟', '💎', '🏆', '🎓', '🏖️'];

type NavProp = NativeStackNavigationProp<GoalsStackParamList, 'GoalForm'>;
type RoutePropT = RouteProp<GoalsStackParamList, 'GoalForm'>;

interface Props { navigation: NavProp; route: RoutePropT; }

export function GoalFormScreen({ navigation, route }: Props) {
  const realm = useRealm();
  const editId = route.params?.id;
  const savings = useQuery(SavingModel);

  const existing = editId
    ? realm.objectForPrimaryKey(GoalModel, new Realm.BSON.ObjectId(editId))
    : null;

  const [emoji, setEmoji] = useState(existing?.emoji ?? '🎯');
  const [name, setName] = useState(existing?.name ?? '');
  const [target, setTarget] = useState(existing?.target?.toString() ?? '');
  const [deadline, setDeadline] = useState(existing?.deadline ?? '');
  const [savingId, setSavingId] = useState(existing?.savingId ?? '');
  const [showSavingPicker, setShowSavingPicker] = useState(false);

  const selectedSaving = savings.find(s => s._id.toHexString() === savingId);

  const savingRef = useRef(false);

  const handleSave = () => {
    if (savingRef.current) return;
    if (!name.trim()) { Alert.alert('Error', 'Nama goal wajib diisi'); return; }
    const targetAmount = parseFloat(target.replace(/[^0-9.]/g, ''));
    if (!targetAmount) { Alert.alert('Error', 'Target amount harus diisi'); return; }
    if (!deadline) { Alert.alert('Error', 'Deadline harus diisi'); return; }
    if (!savingId) { Alert.alert('Error', 'Pilih tabungan untuk goal ini'); return; }

    savingRef.current = true;
    realm.write(() => {
      if (existing) {
        existing.emoji = emoji;
        existing.name = name;
        existing.target = targetAmount;
        existing.deadline = deadline;
        existing.savingId = savingId;
      } else {
        realm.create(GoalModel, { emoji, name, target: targetAmount, deadline, savingId });
      }
    });
    navigation.goBack();
  };

  const handleDelete = () => {
    if (!existing) return;
    Alert.alert('Hapus', `Hapus goal "${existing.name}"?`, [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: () => { realm.write(() => realm.delete(existing)); navigation.goBack(); } },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} color={COLORS.text} />
        </View>

        {/* Emoji Picker */}
        <Text style={styles.label}>Emoji</Text>
        <View style={styles.emojiGrid}>
          {EMOJIS.map(e => (
            <TouchableOpacity
              key={e}
              style={[styles.emojiOpt, emoji === e && styles.emojiOptActive]}
              onPress={() => setEmoji(e)}
            >
              <Text style={{ fontSize: 28 }}>{e}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Card padding={SPACING.lg} style={{ marginTop: SPACING.md }}>
          <Text style={styles.fieldLabel}>Nama Goal</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Misal: Beli Rumah"
            placeholderTextColor={COLORS.textMuted}
          />

          <CurrencyInput label="Target Amount" value={target} onChangeText={setTarget} placeholder="500.000.000" />

          <DateInput label="Deadline" value={deadline} onChange={setDeadline} />

          <Text style={styles.fieldLabel}>Tabungan (wajib)</Text>
          <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowSavingPicker(true)}>
            <Text style={selectedSaving ? styles.pickerValue : styles.pickerPlaceholder}>
              {selectedSaving ? `${selectedSaving.emoji} ${selectedSaving.name}` : 'Pilih tabungan...'}
            </Text>
            <Text style={styles.pickerArrow}>›</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: -SPACING.sm, marginBottom: SPACING.sm }}>
            Progress goal mengikuti saldo tabungan yang di-link
          </Text>
        </Card>

        <Button title={editId ? 'Simpan Perubahan' : 'Buat Goal'} onPress={handleSave} fullWidth style={{ marginTop: SPACING.xl }} />
        {editId && <Button title="Hapus Goal" onPress={handleDelete} variant="danger" fullWidth style={{ marginTop: SPACING.sm }} />}
      </ScrollView>
      </KeyboardAvoidingView>

      {/* Saving Picker Modal */}
      <Modal visible={showSavingPicker} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Pilih Tabungan</Text>
            {savings.length === 0 ? (
              <Text style={{ color: COLORS.textSecondary, textAlign: 'center', padding: SPACING.xl }}>
                Belum ada tabungan. Buat tabungan terlebih dahulu.
              </Text>
            ) : (
              savings.map(s => (
                <TouchableOpacity
                  key={s._id.toHexString()}
                  style={[styles.savingItem, s._id.toHexString() === savingId && styles.savingItemActive]}
                  onPress={() => { setSavingId(s._id.toHexString()); setShowSavingPicker(false); }}
                >
                  <Text style={{ fontSize: 24 }}>{s.emoji}</Text>
                  <View style={{ flex: 1, marginLeft: SPACING.md }}>
                    <Text style={styles.savingName}>{s.name}</Text>
                    <Text style={styles.savingBalance}>{formatCurrency(s.balance)}</Text>
                  </View>
                  {s._id.toHexString() === savingId && <Text style={{ color: COLORS.primary }}>✓</Text>}
                </TouchableOpacity>
              ))
            )}
            <Button title="Tutup" onPress={() => setShowSavingPicker(false)} variant="ghost" style={{ marginTop: SPACING.lg }} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.xl, marginLeft: -SPACING.sm },
  label: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginBottom: SPACING.sm, fontWeight: '500' },
  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  emojiOpt: { padding: SPACING.sm, borderRadius: RADIUS.md, borderWidth: 1, borderColor: 'transparent' },
  emojiOptActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '22' },
  fieldLabel: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginBottom: 4, fontWeight: '500' },
  input: { backgroundColor: COLORS.background, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, color: COLORS.text, fontSize: FONTS.md, marginBottom: SPACING.md },
  pickerBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, marginBottom: SPACING.md },
  pickerValue: { flex: 1, fontSize: FONTS.md, color: COLORS.text },
  pickerPlaceholder: { flex: 1, fontSize: FONTS.md, color: COLORS.textMuted },
  pickerArrow: { fontSize: FONTS.lg, color: COLORS.textMuted },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modal: { backgroundColor: COLORS.surface, borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, padding: SPACING.xl, maxHeight: '70%' },
  modalTitle: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.lg },
  savingItem: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderRadius: RADIUS.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  savingItemActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '11' },
  savingName: { fontSize: FONTS.md, fontWeight: '600', color: COLORS.text },
  savingBalance: { fontSize: FONTS.sm, color: COLORS.textSecondary },
});
