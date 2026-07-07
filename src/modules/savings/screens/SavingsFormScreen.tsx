import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Realm from 'realm';
import { useRealm } from '@realm/react';

import { SavingModel } from '../../../models';
import { COLORS, FONTS, SPACING, RADIUS } from '../../../theme';
import { parseCurrency } from '../../../utils/currency';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { BackButton } from '../../../components/common/BackButton';

import type { SavingsStackParamList } from './SavingsListScreen';

type Props = NativeStackScreenProps<SavingsStackParamList, 'SavingsForm'>;

const EMOJI_OPTIONS = ['💰', '🏠', '✈️', '💍', '🚗', '📚', '🏥', '🎯', '💎', '🌟'];

export function SavingsFormScreen({ navigation, route }: Props) {
  const realm = useRealm();
  const { id } = route.params ?? {};
  const isEdit = Boolean(id);

  const [emoji, setEmoji] = useState('💰');
  const [name, setName] = useState('');
  const [targetInput, setTargetInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const saving = realm.objectForPrimaryKey(SavingModel, new Realm.BSON.ObjectId(id));
      if (saving) {
        setEmoji(saving.emoji);
        setName(saving.name);
        setTargetInput(saving.target.toString());
      }
    }
  }, [id]);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Validasi', 'Nama tabungan harus diisi');
      return;
    }
    const target = parseCurrency(targetInput);
    if (!target || target <= 0) {
      Alert.alert('Validasi', 'Target tabungan harus lebih dari 0');
      return;
    }

    setLoading(true);
    try {
      if (isEdit && id) {
        const saving = realm.objectForPrimaryKey(SavingModel, new Realm.BSON.ObjectId(id));
        if (saving) {
          realm.write(() => {
            saving.emoji = emoji;
            saving.name = name.trim();
            saving.target = target;
          });
        }
      } else {
        realm.write(() => {
          realm.create(SavingModel, {
            _id: new Realm.BSON.ObjectId(),
            name: name.trim(),
            target,
            balance: 0,
            emoji,
            createdAt: new Date(),
          });
        });
      }
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Gagal menyimpan tabungan');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!id) return;
    Alert.alert('Hapus Tabungan', 'Yakin ingin menghapus tabungan ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => {
          try {
            const saving = realm.objectForPrimaryKey(
              SavingModel,
              new Realm.BSON.ObjectId(id),
            );
            if (saving) {
              realm.write(() => {
                realm.delete(saving);
              });
            }
            navigation.navigate('SavingsList');
          } catch {
            Alert.alert('Error', 'Gagal menghapus tabungan');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.topbar} />
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>
          {isEdit ? 'Edit Tabungan' : 'Tambah Tabungan'}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Emoji Picker */}
        <Text style={styles.label}>Pilih Emoji</Text>
        <View style={styles.emojiRow}>
          {EMOJI_OPTIONS.map(e => (
            <TouchableOpacity
              key={e}
              style={[styles.emojiBtn, emoji === e && styles.emojiBtnSelected]}
              onPress={() => setEmoji(e)}
              activeOpacity={0.7}
            >
              <Text style={styles.emojiOption}>{e}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Preview */}
        <View style={styles.preview}>
          <Text style={styles.previewEmoji}>{emoji}</Text>
          <Text style={styles.previewName} numberOfLines={1}>
            {name || 'Nama Tabungan'}
          </Text>
        </View>

        <Input
          label="Nama Tabungan"
          value={name}
          onChangeText={setName}
          placeholder="Contoh: Dana Darurat"
        />

        <Input
          label="Target Tabungan"
          value={targetInput}
          onChangeText={setTargetInput}
          placeholder="0"
          keyboardType="numeric"
          prefix="Rp"
        />

        <Button
          title={isEdit ? 'Simpan Perubahan' : 'Buat Tabungan'}
          onPress={handleSave}
          loading={loading}
          fullWidth
          style={styles.saveBtn}
        />

        {isEdit && (
          <Button
            title="Hapus Tabungan"
            onPress={handleDelete}
            variant="danger"
            fullWidth
            style={styles.deleteBtn}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.topbar,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.topbar,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  headerTitle: {
    flex: 1,
    fontSize: FONTS.lg,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 32,
  },
  scroll: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  label: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    fontWeight: '500',
  },
  emojiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  emojiBtn: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiBtnSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.card,
  },
  emojiOption: {
    fontSize: 24,
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  previewEmoji: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  previewName: {
    flex: 1,
    fontSize: FONTS.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  saveBtn: {
    marginTop: SPACING.lg,
  },
  deleteBtn: {
    marginTop: SPACING.md,
  },
});
