import React, { useCallback, useEffect, useState } from 'react';
import { AppState, Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

import { Text } from '../../components/common';
import { COLORS, FONTS, ICON_SIZES, RADIUS, SPACING } from '../../theme';

/** Muncul hanya kalau izin notifikasi HP ditolak. */
export function NotifPermissionBanner() {
  const [granted, setGranted] = useState(true);

  const check = useCallback(() => {
    Notifications.getPermissionsAsync()
      .then((p) => setGranted(p.granted))
      .catch(() => {});
  }, []);

  useFocusEffect(check);
  // Balik dari pengaturan HP tidak memicu fokus ulang layar.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => s === 'active' && check());
    return () => sub.remove();
  }, [check]);

  if (granted) return null;

  return (
    <View style={styles.box}>
      <MaterialIcons name="notifications-off" size={ICON_SIZES.md} color={COLORS.warningText} />
      <Text style={styles.text}>Notifikasi Dompetku dimatikan di HP, jadi pengingat tidak akan muncul.</Text>
      <TouchableOpacity onPress={() => Linking.openSettings()} hitSlop={8}>
        <Text style={styles.link}>Buka pengaturan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    backgroundColor: COLORS.warningBg,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  text: { flex: 1, minWidth: 180, fontSize: FONTS.sm, color: COLORS.warningText, lineHeight: 18 },
  link: { fontSize: FONTS.sm, fontWeight: '700', color: COLORS.primary },
});
