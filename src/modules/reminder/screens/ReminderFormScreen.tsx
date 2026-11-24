import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet, StatusBar, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRealm, useObject, useQuery } from '@realm/react';
import Realm from 'realm';
import dayjs from 'dayjs';

import { COLORS, FONTS, RADIUS, SPACING } from '../../../theme';
import { Text, Button, Input, CurrencyInput, DateInput, BackButton } from '../../../components/common';
import { ReminderModel, type ReminderRepeat } from '../../../models/ReminderModel';
import { CategoryModel } from '../../../models/CategoryModel';
import { REPEAT_OPTIONS, isRepeat } from '../../../utils/reminder';
import { today } from '../../../utils/date';
import type { ReminderStackParamList } from '../types';

type Props = NativeStackScreenProps<ReminderStackParamList, 'ReminderForm'>;

const toNumber = (v: string) => parseFloat(v.replace(/[^0-9.]/g, '')) || 0;

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
      activeOpacity={0.7}
      accessibilityRole="radio"
      accessibilityState={{ selected: active }}
    >
      <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

export function ReminderFormScreen({ navigation, route }: Props) {
  const { id } = route.params ?? {};
  const realm = useRealm();
  const key = useMemo(() => (id ? new Realm.BSON.ObjectId(id) : new Realm.BSON.ObjectId()), [id]);
  const existing = useObject(ReminderModel, key);
  const isEdit = Boolean(id && existing);
  const categories = useQuery(CategoryModel, (c) => c.filtered('type == "expense"').sorted('createdAt'), []);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [repeat, setRepeat] = useState<ReminderRepeat>('monthly');
  const [dueDate, setDueDate] = useState(today());
  const [errors, setErrors] = useState<{ title?: string; dueDate?: string }>({});

  useEffect(() => {
    if (!existing || !id) return;
    setTitle(existing.title);
    setAmount(existing.amount > 0 ? String(existing.amount) : '');
    setCategoryName(existing.categoryName);
    setRepeat(isRepeat(existing.repeat) ? existing.repeat : 'monthly');
    setDueDate(existing.dueDate);
  }, [existing, id]);

  const dueHint = useMemo(() => {
    const d = dayjs(dueDate);
    if (repeat === 'monthly') return `Diingatkan tiap tanggal ${d.date()}, mulai ${d.format('MMMM YYYY')}.`;
    if (repeat === 'yearly') return `Diingatkan tiap ${d.format('D MMMM')}, mulai ${d.format('YYYY')}.`;
    return `Diingatkan sekali untuk ${d.format('D MMMM YYYY')}.`;
  }, [dueDate, repeat]);

  const handleSave = () => {
    const next: typeof errors = {};
    if (!title.trim()) next.title = 'Isi nama tagihan dulu';
    if (!dueDate) next.dueDate = 'Pilih tanggal jatuh tempo';
    setErrors(next);
    if (Object.keys(next).length) return;

    realm.write(() => {
      const data = { title: title.trim(), amount: toNumber(amount), categoryName, repeat, dueDate };
      if (isEdit && existing) {
        // Format periode beda antar jenis ulang, jadi status bayar dimulai lagi.
        if (existing.repeat !== repeat) existing.lastDonePeriod = '';
        Object.assign(existing, data);
      } else {
        realm.create(ReminderModel, data);
      }
    });
    navigation.goBack();
  };

  const handleDelete = () => {
    if (!existing) return;
    Alert.alert('Hapus pengingat', `Hapus "${existing.title}"? Catatan pembayarannya tetap ada di riwayat.`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => {
          realm.write(() => realm.delete(existing));
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>{isEdit ? 'Ubah pengingat' : 'Pengingat baru'}</Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Input
            label="Nama tagihan"
            placeholder="Contoh: Listrik PLN, BPJS, Netflix"
            value={title}
            onChangeText={setTitle}
            error={errors.title}
          />

          <CurrencyInput label="Nominal (opsional)" value={amount} onChangeText={setAmount} />
          <Text style={styles.hint}>Kosongkan kalau nominalnya berubah-ubah.</Text>

          <Text style={styles.label}>Ulangi</Text>
          <View style={styles.chipWrap}>
            {REPEAT_OPTIONS.map((o) => (
              <Chip key={o.value} label={o.label} active={repeat === o.value} onPress={() => setRepeat(o.value)} />
            ))}
          </View>

          <DateInput
            label={repeat === 'once' ? 'Tanggal jatuh tempo' : 'Jatuh tempo pertama'}
            value={dueDate}
            onChange={setDueDate}
            error={errors.dueDate}
          />
          <Text style={styles.hint}>{dueHint} Notifikasi muncul 3 hari sebelumnya dan di hari H jam 09.00.</Text>

          <Text style={styles.label}>Kategori saat dicatat (opsional)</Text>
          <View style={styles.chipWrap}>
            <Chip label="Pilih nanti" active={!categoryName} onPress={() => setCategoryName('')} />
            {categories.map((c) => (
              <Chip
                key={c._id.toHexString()}
                label={`${c.emoji} ${c.name}`}
                active={categoryName === c.name}
                onPress={() => setCategoryName(c.name)}
              />
            ))}
          </View>

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
  hint: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: -SPACING.sm, marginBottom: SPACING.lg },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  chipActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primarySoft },
  chipLabel: { fontSize: FONTS.sm, color: COLORS.textSecondary, fontWeight: '500' },
  chipLabelActive: { color: COLORS.primary, fontWeight: '700' },
  saveBtn: { marginTop: SPACING.lg, marginBottom: SPACING.sm },
});
