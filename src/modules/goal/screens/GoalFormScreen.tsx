import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet, StatusBar, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRealm, useObject } from '@realm/react';
import Realm from 'realm';

import { COLORS, FONTS, ICON_SIZES, RADIUS, SPACING } from '../../../theme';
import { Text, Button, Input, CurrencyInput, DateInput, BackButton } from '../../../components/common';
import { GoalModel } from '../../../models/GoalModel';
import { GOAL_ICONS, deleteGoal, syncGoalStatus } from '../../../services/GoalService';
import { today } from '../../../utils/date';
import { AccountPicker } from '../../finance/components/AccountPicker';
import type { GoalStackParamList } from '../types';

type Props = NativeStackScreenProps<GoalStackParamList, 'GoalForm'>;

const toNumber = (v: string) => parseFloat(v.replace(/[^0-9.]/g, '')) || 0;

export function GoalFormScreen({ navigation, route }: Props) {
  const { id } = route.params ?? {};
  const realm = useRealm();
  const key = useMemo(() => (id ? new Realm.BSON.ObjectId(id) : new Realm.BSON.ObjectId()), [id]);
  const existing = useObject(GoalModel, key);
  const isEdit = Boolean(id && existing);

  const [name, setName] = useState('');
  const [icon, setIcon] = useState<string>(GOAL_ICONS[0]);
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [accountId, setAccountId] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<{ name?: string; target?: string; deadline?: string }>({});

  useEffect(() => {
    if (!existing || !id) return;
    setName(existing.name);
    setIcon(existing.icon);
    setTarget(String(existing.target));
    setDeadline(existing.deadline);
    setAccountId(existing.accountId);
    setNote(existing.note);
  }, [existing, id]);

  const handleSave = () => {
    const next: typeof errors = {};
    if (!name.trim()) next.name = 'Isi nama dulu';
    if (toNumber(target) <= 0) next.target = 'Isi target dana';
    if (deadline && !isEdit && deadline <= today()) next.deadline = 'Pilih tanggal setelah hari ini';
    setErrors(next);
    if (Object.keys(next).length) return;

    realm.write(() => {
      const data = {
        name: name.trim(),
        icon,
        target: toNumber(target),
        deadline,
        accountId,
        note: note.trim(),
      };
      const goal = isEdit && existing ? Object.assign(existing, data) : realm.create(GoalModel, data);
      syncGoalStatus(realm, goal._id.toHexString());
    });
    navigation.goBack();
  };

  const handleDelete = () => {
    if (!existing) return;
    Alert.alert('Hapus goal', `Hapus "${existing.name}"? Setorannya tetap ada di riwayat dan uangnya tetap di tabungan.`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => {
          realm.write(() => deleteGoal(realm, existing));
          navigation.popToTop();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>{isEdit ? 'Ubah goal' : 'Goal baru'}</Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Input
            label="Nama"
            placeholder="Contoh: Dana darurat, Liburan Bali, DP rumah"
            value={name}
            onChangeText={setName}
            error={errors.name}
          />

          <Text style={styles.label}>Ikon</Text>
          <View style={styles.iconWrap}>
            {GOAL_ICONS.map((ic) => {
              const active = icon === ic;
              return (
                <TouchableOpacity
                  key={ic}
                  onPress={() => setIcon(ic)}
                  style={[styles.iconChip, active && styles.iconChipActive]}
                  activeOpacity={0.7}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={ic}
                >
                  <MaterialIcons name={ic} size={ICON_SIZES.lg} color={active ? COLORS.saving : COLORS.textMuted} />
                </TouchableOpacity>
              );
            })}
          </View>

          <CurrencyInput label="Target dana" value={target} onChangeText={setTarget} error={errors.target} />

          <DateInput label="Tenggat (opsional)" value={deadline} onChange={setDeadline} error={errors.deadline} />
          {deadline ? (
            <TouchableOpacity onPress={() => setDeadline('')} hitSlop={8} style={styles.clear}>
              <Text style={styles.clearText}>Tanpa tenggat</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.hint}>Isi supaya app menghitung setoran per bulan.</Text>
          )}

          <AccountPicker
            label="Kantong tabungan (opsional)"
            onlySavings
            value={accountId}
            onChange={setAccountId}
            noneLabel="Bebas"
          />
          <Text style={styles.hint}>Dipilih otomatis saat setor ke goal ini.</Text>

          <Input label="Catatan (opsional)" value={note} onChangeText={setNote} />

          <Button title={isEdit ? 'Simpan perubahan' : 'Simpan'} onPress={handleSave} fullWidth style={styles.saveBtn} />
          {isEdit && (
            <Button title="Hapus" onPress={handleDelete} variant="ghost" fullWidth textStyle={{ color: COLORS.danger }} />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  title: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text },
  content: { padding: SPACING.xl, paddingBottom: SPACING.xxxl },
  label: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginBottom: SPACING.sm, fontWeight: '500' },
  iconWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg },
  iconChip: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  iconChipActive: { borderColor: COLORS.saving, backgroundColor: COLORS.saving + '1A' },
  hint: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: -SPACING.sm, marginBottom: SPACING.md },
  clear: { alignSelf: 'flex-start', marginTop: -SPACING.sm, marginBottom: SPACING.md },
  clearText: { fontSize: FONTS.sm, fontWeight: '600', color: COLORS.primary },
  saveBtn: { marginTop: SPACING.lg, marginBottom: SPACING.sm },
});
