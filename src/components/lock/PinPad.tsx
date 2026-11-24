import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity, Vibration, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Text } from '../common/Text';
import { COLORS, FONTS, RADIUS, SPACING } from '../../theme';
import { PIN_LENGTH } from '../../services/AppLockService';

interface Props {
  title: string;
  subtitle?: string;
  /** Pesan merah di bawah titik PIN. Ganti nilainya = goyang + kosongkan isian. */
  error?: string;
  /** Naikkan angka ini untuk memicu goyang ulang walau pesannya sama. */
  errorKey?: number;
  disabled?: boolean;
  /** Dipanggil saat 6 digit terisi. */
  onComplete: (pin: string) => void;
  /** Tombol kiri bawah keypad (mis. sidik jari). */
  leftAction?: { icon: keyof typeof MaterialIcons.glyphMap; label: string; onPress: () => void };
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

/** Titik PIN + keypad angka sendiri (tanpa keyboard sistem, tanpa riwayat ketik). */
export function PinPad({ title, subtitle, error, errorKey, disabled, onComplete, leftAction }: Props) {
  const [pin, setPin] = useState('');
  const shake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!error) return;
    setPin('');
    Vibration.vibrate(120);
    Animated.sequence(
      [10, -10, 8, -8, 0].map((v) => Animated.timing(shake, { toValue: v, duration: 50, useNativeDriver: true })),
    ).start();
  }, [error, errorKey, shake]);

  const press = (d: string) => {
    if (disabled || pin.length >= PIN_LENGTH) return;
    const next = pin + d;
    setPin(next);
    if (next.length === PIN_LENGTH) {
      // Beri jeda singkat supaya titik terakhir sempat terlihat terisi.
      setTimeout(() => {
        onComplete(next);
        setPin('');
      }, 120);
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

      <Animated.View style={[styles.dots, { transform: [{ translateX: shake }] }]} accessibilityLabel={`${pin.length} dari ${PIN_LENGTH} angka`}>
        {Array.from({ length: PIN_LENGTH }, (_, i) => (
          <View key={i} style={[styles.dot, i < pin.length && styles.dotFilled, error && pin.length === 0 && styles.dotError]} />
        ))}
      </Animated.View>
      <Text style={styles.error}>{error ?? ' '}</Text>

      <View style={[styles.pad, disabled && styles.padDisabled]}>
        {KEYS.map((k) => (
          <Key key={k} label={k} onPress={() => press(k)} disabled={disabled} />
        ))}
        {leftAction ? (
          <TouchableOpacity
            style={styles.key}
            onPress={leftAction.onPress}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={leftAction.label}
          >
            <MaterialIcons name={leftAction.icon} size={30} color={COLORS.primary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.key} />
        )}
        <Key label="0" onPress={() => press('0')} disabled={disabled} />
        <TouchableOpacity
          style={styles.key}
          onPress={() => setPin((p) => p.slice(0, -1))}
          onLongPress={() => setPin('')}
          disabled={disabled || pin.length === 0}
          accessibilityRole="button"
          accessibilityLabel="Hapus angka"
        >
          <MaterialIcons name="backspace" size={26} color={pin.length ? COLORS.text : COLORS.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Key({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <TouchableOpacity
      style={[styles.key, styles.keyDigit]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.6}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={styles.keyText}>{label}</Text>
    </TouchableOpacity>
  );
}

const KEY = 72;

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', width: '100%' },
  title: { fontSize: FONTS.xl, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  subtitle: { fontSize: FONTS.sm, color: COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.xs, paddingHorizontal: SPACING.xl },
  dots: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.xl },
  dot: { width: 14, height: 14, borderRadius: RADIUS.round, borderWidth: 2, borderColor: COLORS.textMuted },
  dotFilled: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  dotError: { borderColor: COLORS.danger },
  error: { fontSize: FONTS.sm, color: COLORS.danger, marginTop: SPACING.md, minHeight: 18, textAlign: 'center' },
  pad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: KEY * 3 + SPACING.xl * 2 + 6,
    marginTop: SPACING.lg,
    gap: SPACING.md,
    columnGap: SPACING.xl,
  },
  padDisabled: { opacity: 0.4 },
  key: { width: KEY, height: KEY, borderRadius: KEY / 2, alignItems: 'center', justifyContent: 'center' },
  keyDigit: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  keyText: { fontSize: 28, fontWeight: '600', color: COLORS.text },
});
