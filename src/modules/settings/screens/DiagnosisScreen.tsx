import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { COLORS, FONTS, SPACING, RADIUS } from '../../../theme';
import { Card } from '../../../components/common/Card';
import {
  ErrorLogEntry,
  getErrorLogs,
  clearErrorLogs,
  buildReportText,
  getDeviceInfo,
} from '../../../services/ErrorLogService';

const SOURCE_LABEL: Record<ErrorLogEntry['source'], string> = {
  render: 'Tampilan (UI)',
  js: 'JavaScript',
  promise: 'Promise',
};

export function DiagnosisScreen() {
  const [logs, setLogs] = useState<ErrorLogEntry[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const device = getDeviceInfo();

  useFocusEffect(
    useCallback(() => {
      setLogs(getErrorLogs());
    }, []),
  );

  const handleShare = async (entry?: ErrorLogEntry) => {
    try {
      const text = buildReportText(entry);
      const filename = `dompetku_error_report_${Date.now()}.txt`;
      const file = new File(Paths.cache, filename);
      file.write(text);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri, { mimeType: 'text/plain' });
      } else {
        Alert.alert('Laporan Error', text);
      }
    } catch {
      Alert.alert('Error', 'Gagal membuat laporan error');
    }
  };

  const handleClear = () => {
    Alert.alert('Hapus Log Error', 'Semua log error akan dihapus. Lanjutkan?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => {
          clearErrorLogs();
          setLogs([]);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.header}>Diagnosis & Laporan Error</Text>

        <Text style={styles.sectionTitle}>Info Perangkat</Text>
        <Card>
          <Row label="Platform" value={`${device.platform} ${device.osVersion}`} />
          <Row label="Perangkat" value={device.deviceName} />
          <Row label="Versi App" value={device.appVersion} />
        </Card>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleShare()}>
            <Text style={styles.actionButtonText}>📤 Bagikan Semua Log</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.dangerButton]}
            onPress={handleClear}
          >
            <Text style={[styles.actionButtonText, styles.dangerButtonText]}>🗑️ Hapus Log</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Riwayat Error ({logs.length})</Text>
        {logs.length === 0 ? (
          <Card>
            <Text style={styles.emptyText}>Belum ada error tercatat. Aplikasi berjalan normal.</Text>
          </Card>
        ) : (
          logs.map((entry) => {
            const expanded = expandedId === entry.id;
            return (
              <Card key={entry.id} style={styles.logCard} padding={0}>
                <TouchableOpacity
                  style={styles.logHeader}
                  onPress={() => setExpandedId(expanded ? null : entry.id)}
                  activeOpacity={0.7}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.logMessage} numberOfLines={expanded ? undefined : 2}>
                      {entry.message}
                    </Text>
                    <Text style={styles.logMeta}>
                      {new Date(entry.timestamp).toLocaleString('id-ID')} · {SOURCE_LABEL[entry.source]}
                      {entry.isFatal ? ' · Fatal' : ''}
                    </Text>
                  </View>
                  <Text style={styles.logArrow}>{expanded ? '▲' : '▼'}</Text>
                </TouchableOpacity>

                {expanded && (
                  <View style={styles.logDetail}>
                    {entry.stack && (
                      <ScrollView horizontal>
                        <Text style={styles.logStack}>{entry.stack}</Text>
                      </ScrollView>
                    )}
                    <TouchableOpacity
                      style={styles.detailShareButton}
                      onPress={() => handleShare(entry)}
                    >
                      <Text style={styles.detailShareText}>📤 Bagikan Error Ini</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Card>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  header: { fontSize: FONTS.xl, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.lg },
  sectionTitle: { fontSize: FONTS.sm, color: COLORS.textMuted, marginBottom: SPACING.sm, marginTop: SPACING.lg, textTransform: 'uppercase', letterSpacing: 0.5 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.xs },
  rowLabel: { fontSize: FONTS.sm, color: COLORS.textSecondary },
  rowValue: { fontSize: FONTS.sm, color: COLORS.text, fontWeight: '600' },
  actionsRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.lg },
  actionButton: { flex: 1, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, paddingVertical: SPACING.md, alignItems: 'center' },
  actionButtonText: { fontSize: FONTS.sm, fontWeight: '600', color: COLORS.text },
  dangerButton: { borderColor: COLORS.danger },
  dangerButtonText: { color: COLORS.danger },
  emptyText: { fontSize: FONTS.sm, color: COLORS.textSecondary, textAlign: 'center', paddingVertical: SPACING.md },
  logCard: { marginBottom: SPACING.sm },
  logHeader: { flexDirection: 'row', alignItems: 'flex-start', padding: SPACING.lg, gap: SPACING.sm },
  logMessage: { fontSize: FONTS.sm, color: COLORS.text, fontWeight: '600' },
  logMeta: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: SPACING.xs },
  logArrow: { fontSize: FONTS.sm, color: COLORS.textMuted },
  logDetail: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg },
  logStack: { fontSize: FONTS.xs, color: COLORS.textSecondary, fontFamily: 'monospace' },
  detailShareButton: { marginTop: SPACING.md, alignSelf: 'flex-start' },
  detailShareText: { fontSize: FONTS.xs, color: COLORS.primary, fontWeight: '600' },
});
