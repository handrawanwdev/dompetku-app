import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS } from '../../theme';
import { logError } from '../../services/ErrorLogService';

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logError({
      source: 'render',
      message: error.message,
      stack: error.stack,
      componentStack: info.componentStack ?? undefined,
      isFatal: true,
    });
  }

  handleRestart = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <SafeAreaView style={styles.safe}>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.emoji}>⚠️</Text>
            <Text style={styles.title}>Aplikasi mengalami error</Text>
            <Text style={styles.desc}>{this.state.error.message}</Text>

            <TouchableOpacity style={styles.button} onPress={this.handleRestart}>
              <Text style={styles.buttonText}>Coba Lagi</Text>
            </TouchableOpacity>

            <Text style={styles.hint}>
              Detail error tersimpan. Buka Pengaturan → Diagnosis & Laporan Error untuk melihat atau membagikan laporan.
            </Text>
          </ScrollView>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
  emoji: { fontSize: 48, marginBottom: SPACING.md },
  title: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm, textAlign: 'center' },
  desc: { fontSize: FONTS.sm, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.xl },
  button: { backgroundColor: COLORS.primary, paddingVertical: SPACING.md, paddingHorizontal: SPACING.xl, borderRadius: RADIUS.md, marginBottom: SPACING.sm, minWidth: 220, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: FONTS.md, fontWeight: '600' },
  hint: { fontSize: FONTS.xs, color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.md, maxWidth: 260 },
});
