import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRealm } from '@realm/react';

import { COLORS, FONTS, SPACING, RADIUS } from '../../../theme';
import { Button } from '../../../components/common/Button';
import { CategoryModel } from '../../../models/CategoryModel';
import type { SettingsStackParamList } from './SettingsMainScreen';

type Props = NativeStackScreenProps<SettingsStackParamList, 'CategoryForm'>;

const EMOJI_OPTIONS = ['📌', '💡', '🎯', '⭐', '🔥', '💎', '🎪', '🏆'];

export function CategoryFormScreen({ navigation, route }: Props) {
  const { type } = route.params;
  const realm = useRealm();
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('📌');

  const handleAdd = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Nama kategori tidak boleh kosong');
      return;
    }
    realm.write(() => {
      realm.create(CategoryModel, {
        name: name.trim(),
        type,
        emoji,
      });
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.label}>Emoji</Text>
          <View style={styles.emojiRow}>
            {EMOJI_OPTIONS.map(e => (
              <TouchableOpacity
                key={e}
                onPress={() => setEmoji(e)}
                style={[styles.emojiOpt, emoji === e && styles.emojiOptActive]}
              >
                <Text style={{ fontSize: 22 }}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Nama Kategori</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Nama kategori..."
            placeholderTextColor={COLORS.textMuted}
            autoFocus
          />

          <Button title="Tambah" onPress={handleAdd} fullWidth style={styles.saveBtn} />
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
  emojiRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg, flexWrap: 'wrap' },
  emojiOpt: { padding: SPACING.xs, borderRadius: RADIUS.md, borderWidth: 1, borderColor: 'transparent' },
  emojiOptActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '22' },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    color: COLORS.text,
    fontSize: FONTS.md,
    marginBottom: SPACING.lg,
  },
  saveBtn: { marginTop: SPACING.sm },
});
