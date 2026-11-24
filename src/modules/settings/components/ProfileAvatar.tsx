import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, type ColorKey } from '../../../theme';

/** Warna latar avatar yang bisa dipilih. Disimpan sebagai key supaya ikut tema. */
export const AVATAR_COLORS: ColorKey[] = ['primary', 'income', 'savings', 'investment', 'debt', 'asset'];

export const AVATAR_EMOJIS = ['😊', '😎', '🤓', '🥰', '😺', '🐶', '🐼', '🦊', '🌸', '🌻', '⭐', '🚀'];

export function avatarColor(key: string | undefined): string {
  return COLORS[(AVATAR_COLORS as string[]).includes(key ?? '') ? (key as ColorKey) : 'primary'];
}

export function ProfileAvatar({
  name,
  emoji,
  color,
  size = 96,
}: {
  name?: string;
  emoji?: string;
  color?: string;
  size?: number;
}) {
  const c = avatarColor(color);
  const initial = name?.trim().charAt(0).toUpperCase();
  return (
    <View style={[styles.avatar, { width: size, height: size, backgroundColor: c + '22', borderColor: c }]}>
      {emoji ? (
        <Text style={{ fontSize: size * 0.48 }}>{emoji}</Text>
      ) : initial ? (
        <Text style={[styles.initial, { fontSize: size * 0.4, color: c }]}>{initial}</Text>
      ) : (
        <MaterialIcons name="person" size={size * 0.45} color={c} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { borderRadius: 999, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  initial: { fontWeight: '800' },
});

export const FINANCIAL_FOCUS = [
  'Dana darurat',
  'Lunasi utang',
  'Beli rumah',
  'Beli kendaraan',
  'Menikah',
  'Pendidikan',
  'Liburan',
  'Investasi',
  'Pensiun',
];

export const MAX_FOCUS = 3;
