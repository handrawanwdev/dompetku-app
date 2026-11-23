import React, { useMemo, useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRealm, useQuery } from '@realm/react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Realm from 'realm';

import { COLORS, FONTS, ICON_SIZES, RADIUS, SPACING } from '../../../theme';
import { Text, Button, Input, CurrencyInput, BackButton } from '../../../components/common';
import { AccountModel } from '../../../models/AccountModel';
import {
  ACCOUNT_PRESETS,
  ACCOUNT_TYPES,
  deleteAccount,
  getAccountBalances,
  setAccountBalance,
  setMainAccount,
  type AccountType,
} from '../../../services/AccountService';
import { formatCurrency } from '../../../utils/currency';
import type { RootStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AccountForm'>;

/** Tambah / ubah kantong. Saldo diisi sesuai saldo aslinya di bank / aplikasi. */
export function AccountFormScreen({ navigation, route }: Props) {
  const { id, savings } = route.params ?? {};
  const realm = useRealm();
  const accounts = useQuery(AccountModel);
  const existing = useMemo(
    () => (id ? realm.objectForPrimaryKey(AccountModel, new Realm.BSON.ObjectId(id)) : null),
    [realm, id],
  );
  const currentBalance = useMemo(
    () => (id ? getAccountBalances(realm).get(id) ?? 0 : 0),
    [realm, id],
  );

  const [name, setName] = useState(existing?.name ?? '');
  const [type, setType] = useState<AccountType>((existing?.type as AccountType) ?? 'bank');
  const [balance, setBalance] = useState(existing ? String(Math.max(0, Math.round(currentBalance))) : '');
  const [isMain, setIsMain] = useState(existing ? existing.isMain : accounts.length === 0 && !savings);
  const [isSavings, setIsSavings] = useState(existing ? existing.isSavings : Boolean(savings));

  const usedNames = new Set(accounts.map((a) => a.name.toLowerCase()));
  const presets = ACCOUNT_PRESETS.filter((p) => !usedNames.has(p.name.toLowerCase()));

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('Nama kosong', 'Isi nama kantong dulu, misal BCA atau GoPay.');
      return;
    }
    const dup = accounts.some((a) => a.name.toLowerCase() === trimmed.toLowerCase() && (!existing || !a._id.equals(existing._id)));
    if (dup) {
      Alert.alert('Sudah ada', `Kantong "${trimmed}" sudah ada.`);
      return;
    }
    const target = parseFloat(balance || '0');

    realm.write(() => {
      let acc = existing;
      if (acc) {
        acc.name = trimmed;
        acc.type = type;
        acc.isSavings = isSavings;
      } else {
        acc = realm.create(AccountModel, { _id: new Realm.BSON.ObjectId(), name: trimmed, type, isMain: false, isSavings, createdAt: new Date() });
      }
      const accId = acc._id.toHexString();
      if (isMain) setMainAccount(realm, accId);
      else if (acc.isMain) acc.isMain = false;
      if (!existing || Math.abs(target - currentBalance) >= 1) setAccountBalance(realm, accId, target);
    });
    navigation.goBack();
  };

  const handleDelete = () => {
    if (!existing) return;
    Alert.alert(
      'Hapus kantong',
      `Hapus "${existing.name}"? Transaksinya tetap tersimpan, saldonya (${formatCurrency(currentBalance)}) jadi "belum masuk kantong".`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            realm.write(() => deleteAccount(realm, existing));
            navigation.pop(2);
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>{existing ? 'Ubah kantong' : 'Tambah kantong'}</Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {!existing && presets.length > 0 && (
            <View style={styles.group}>
              <Text style={styles.label}>Pilih cepat</Text>
              <View style={styles.wrap}>
                {presets.map((p) => {
                  const active = name === p.name;
                  return (
                    <TouchableOpacity
                      key={p.name}
                      onPress={() => {
                        setName(p.name);
                        setType(p.type);
                      }}
                      style={[styles.chip, active && styles.chipActive]}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{p.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          <Input label="Nama kantong" placeholder="Contoh: BCA, GoPay, Tunai" value={name} onChangeText={setName} maxLength={24} />

          <View style={styles.group}>
            <Text style={styles.label}>Jenis</Text>
            <View style={styles.typeRow}>
              {(Object.keys(ACCOUNT_TYPES) as AccountType[]).map((t) => {
                const m = ACCOUNT_TYPES[t];
                const active = type === t;
                return (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setType(t)}
                    style={[styles.typeOpt, active && { borderColor: m.color, backgroundColor: m.color + '1A' }]}
                    activeOpacity={0.7}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: active }}
                  >
                    <MaterialIcons name={m.icon} size={ICON_SIZES.md} color={m.color} />
                    <Text style={[styles.typeLabel, active && styles.chipLabelActive]}>{m.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <CurrencyInput label="Saldo sekarang" value={balance} onChangeText={setBalance} />
          <Text style={styles.hint}>
            {existing
              ? 'Ubah kalau beda dengan saldo di aplikasi bank / e-wallet. Selisihnya dicatat sebagai penyesuaian, bukan pemasukan.'
              : 'Samakan dengan saldo di aplikasi bank / e-wallet. Transaksi berikutnya otomatis menambah atau mengurangi saldo ini.'}
          </Text>

          <View style={styles.group}>
            <Text style={styles.label}>Dipakai untuk</Text>
            <View style={styles.typeRow}>
              {[
                { v: false, icon: 'account-balance-wallet' as const, label: 'Harian', sub: 'Belanja, bayar tagihan' },
                { v: true, icon: 'savings' as const, label: 'Tabungan', sub: 'Uang yang disimpan' },
              ].map((o) => {
                const active = isSavings === o.v;
                const color = o.v ? COLORS.saving : COLORS.primary;
                return (
                  <TouchableOpacity
                    key={o.label}
                    onPress={() => setIsSavings(o.v)}
                    style={[styles.purposeOpt, active && { borderColor: color, backgroundColor: color + '1A' }]}
                    activeOpacity={0.7}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: active }}
                  >
                    <MaterialIcons name={o.icon} size={ICON_SIZES.md} color={color} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.purposeLabel, active && styles.chipLabelActive]}>{o.label}</Text>
                      <Text style={styles.purposeSub}>{o.sub}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <TouchableOpacity
            style={styles.toggleRow}
            onPress={() => setIsMain(!isMain)}
            activeOpacity={0.7}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isMain }}
          >
            <MaterialIcons
              name={isMain ? 'check-box' : 'check-box-outline-blank'}
              size={ICON_SIZES.lg}
              color={isMain ? COLORS.primary : COLORS.textMuted}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleLabel}>Jadikan kantong utama</Text>
              <Text style={styles.toggleSub}>Otomatis terpilih saat mencatat uang masuk & keluar</Text>
            </View>
          </TouchableOpacity>

          <Button title={existing ? 'Simpan' : 'Tambah kantong'} onPress={handleSave} fullWidth style={{ marginTop: SPACING.lg }} />
          {existing && (
            <Button title="Hapus kantong" onPress={handleDelete} variant="danger" fullWidth style={{ marginTop: SPACING.md }} />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  title: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text },
  content: { padding: SPACING.xl, paddingTop: SPACING.sm, paddingBottom: SPACING.xxxl },
  group: { marginBottom: SPACING.md },
  label: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginBottom: SPACING.sm, fontWeight: '500' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  chip: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '1A' },
  chipLabel: { fontSize: FONTS.sm, color: COLORS.textSecondary, fontWeight: '500' },
  chipLabelActive: { color: COLORS.text, fontWeight: '700' },
  typeRow: { flexDirection: 'row', gap: SPACING.sm },
  typeOpt: {
    flex: 1,
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  purposeOpt: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  purposeLabel: { fontSize: FONTS.sm, color: COLORS.textSecondary, fontWeight: '600' },
  purposeSub: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 1 },
  typeLabel: { fontSize: FONTS.xs, color: COLORS.textSecondary, fontWeight: '600' },
  hint: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: -SPACING.sm, marginBottom: SPACING.lg, lineHeight: 18 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  toggleLabel: { fontSize: FONTS.md, fontWeight: '600', color: COLORS.text },
  toggleSub: { fontSize: FONTS.xs, color: COLORS.textSecondary, marginTop: 1 },
});
