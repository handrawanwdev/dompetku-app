import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRealm, useQuery } from '@realm/react';
import { MaterialIcons } from '@expo/vector-icons';
import Realm from 'realm';

import { COLORS, FONTS, ICON_SIZES, SPACING, RADIUS } from '../../../theme';
import { Button } from '../../../components/common/Button';
import { CategoryModel } from '../../../models/CategoryModel';
import { ExpenseModel } from '../../../models/ExpenseModel';
import { KIND_META, SPEND_KINDS, isSpendKind, type SpendKind } from '../../../utils/budget';
import type { RootStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'CategoryForm'>;

const EMOJI_OPTIONS = ['📌', '🍜', '🚗', '💡', '📶', '🏠', '🏥', '📚', '🏦', '💳', '🤝', '☕', '🎬', '🛍️', '✈️', '🐷', '🆘', '🎁'];

export function CategoryFormScreen({ navigation, route }: Props) {
  const { type, id } = route.params;
  const realm = useRealm();
  const categories = useQuery(CategoryModel);
  const existing = useMemo(
    () => (id ? realm.objectForPrimaryKey(CategoryModel, new Realm.BSON.ObjectId(id)) : null),
    [realm, id],
  );
  const isExpense = type === 'expense';

  const [name, setName] = useState(existing?.name ?? '');
  const [emoji, setEmoji] = useState(existing?.emoji ?? '📌');
  const [kind, setKind] = useState<SpendKind>(existing && isSpendKind(existing.kind) ? existing.kind : 'need');

  useEffect(() => {
    navigation.setOptions({ headerTitle: existing ? 'Ubah kategori' : 'Tambah kategori' });
  }, [navigation, existing]);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('Nama kosong', 'Isi nama kategori dulu.');
      return;
    }
    const duplicate = categories.filtered('type == $0 AND name ==[c] $1', type, trimmed).some((c) => !existing || !c._id.equals(existing._id));
    if (duplicate) {
      Alert.alert('Sudah ada', `Kategori "${trimmed}" sudah ada.`);
      return;
    }

    realm.write(() => {
      if (existing) {
        const oldName = existing.name;
        existing.name = trimmed;
        existing.emoji = emoji;
        if (isExpense) {
          existing.kind = kind;
          // Transaksi lama ikut nama & jenis kategori yang baru.
          for (const e of realm.objects(ExpenseModel).filtered('category == $0 AND isInternal == false', oldName)) {
            e.category = trimmed;
            e.kind = kind;
          }
        }
      } else {
        realm.create(CategoryModel, { name: trimmed, type, emoji, kind: isExpense ? kind : '' });
      }
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.label}>Nama kategori</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder={isExpense ? 'Contoh: Internet, Bensin' : 'Contoh: Gaji, Jualan'}
            placeholderTextColor={COLORS.textMuted}
            autoFocus={!existing}
          />

          {isExpense && (
            <>
              <Text style={styles.label}>Jenis</Text>
              <View style={styles.kindGrid}>
                {SPEND_KINDS.map((k) => {
                  const m = KIND_META[k];
                  const active = kind === k;
                  return (
                    <TouchableOpacity
                      key={k}
                      onPress={() => setKind(k)}
                      style={[styles.kindOpt, active && { borderColor: m.color, backgroundColor: m.color + '1A' }]}
                      activeOpacity={0.7}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: active }}
                    >
                      <MaterialIcons name={m.icon} size={ICON_SIZES.md} color={m.color} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.kindLabel, active && styles.kindLabelActive]}>{m.label}</Text>
                        <Text style={styles.kindHint} numberOfLines={1}>{m.hint}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {existing && (
                <Text style={styles.note}>Transaksi lama di kategori ini ikut diperbarui.</Text>
              )}
            </>
          )}

          <Text style={styles.label}>Ikon</Text>
          <View style={styles.emojiRow}>
            {EMOJI_OPTIONS.map((e) => (
              <TouchableOpacity
                key={e}
                onPress={() => setEmoji(e)}
                style={[styles.emojiOpt, emoji === e && styles.emojiOptActive]}
              >
                <Text style={{ fontSize: 22 }}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Button title={existing ? 'Simpan' : 'Tambah'} onPress={handleSave} fullWidth style={styles.saveBtn} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  label: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginBottom: SPACING.sm, fontWeight: '500' },
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    color: COLORS.text,
    fontSize: FONTS.md,
    marginBottom: SPACING.lg,
  },
  kindGrid: { gap: SPACING.sm, marginBottom: SPACING.md },
  kindOpt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  kindLabel: { fontSize: FONTS.md, fontWeight: '600', color: COLORS.textSecondary },
  kindLabelActive: { color: COLORS.text, fontWeight: '700' },
  kindHint: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 1 },
  note: { fontSize: FONTS.xs, color: COLORS.textMuted, marginBottom: SPACING.lg },
  emojiRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm, marginBottom: SPACING.lg, flexWrap: 'wrap' },
  emojiOpt: { padding: SPACING.xs, borderRadius: RADIUS.md, borderWidth: 1, borderColor: 'transparent' },
  emojiOptActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '22' },
  saveBtn: { marginTop: SPACING.sm },
});
