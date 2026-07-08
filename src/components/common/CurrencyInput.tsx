import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../theme';

interface CurrencyInputProps {
  label?: string;
  value: string; // raw digits only, e.g. "5000000"
  onChangeText: (rawDigits: string) => void;
  error?: string;
  placeholder?: string;
}

function formatThousands(rawDigits: string): string {
  if (!rawDigits) return '';
  return rawDigits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function CurrencyInput({ label, value, onChangeText, error, placeholder = '0' }: CurrencyInputProps) {
  const displayValue = formatThousands(value ?? '');

  const handleChange = (text: string) => {
    const raw = text.replace(/[^0-9]/g, '');
    onChangeText(raw);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputRow, error && styles.inputError]}>
        <Text style={styles.prefix}>Rp</Text>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          keyboardType="numeric"
          value={displayValue}
          onChangeText={handleChange}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.md },
  label: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
  },
  inputError: { borderColor: COLORS.danger },
  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: FONTS.md,
    color: COLORS.text,
  },
  prefix: {
    fontSize: FONTS.md,
    color: COLORS.textSecondary,
    marginRight: SPACING.xs,
  },
  errorText: { fontSize: FONTS.sm, color: COLORS.danger, marginTop: 4 },
});
