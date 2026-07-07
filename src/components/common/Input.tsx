import React, { forwardRef } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  prefix?: string;
  suffix?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, containerStyle, prefix, suffix, style, ...props }, ref) => {
    return (
      <View style={[styles.container, containerStyle]}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={[styles.inputRow, error && styles.inputError]}>
          {prefix && <Text style={styles.prefix}>{prefix}</Text>}
          <TextInput
            ref={ref}
            style={[styles.input, style]}
            placeholderTextColor={COLORS.textMuted}
            {...props}
          />
          {suffix && <Text style={styles.suffix}>{suffix}</Text>}
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
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
  inputError: {
    borderColor: COLORS.danger,
  },
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
  suffix: {
    fontSize: FONTS.md,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  errorText: {
    fontSize: FONTS.sm,
    color: COLORS.danger,
    marginTop: 4,
  },
});
