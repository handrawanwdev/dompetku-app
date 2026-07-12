import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, ProgressBar, Text } from "../../../components/common";
import { COLORS, FONTS, RADIUS, SPACING } from "../../../theme";
import { formatCompact } from "../../../utils/currency";
import type { SavingModel } from "../../../models/SavingModel";
import type { EmergencyFundInfo } from "../../../utils/finance";
import { SectionTitle } from "./SectionTitle";

interface Props {
  saving: SavingModel | undefined;
  info: EmergencyFundInfo | null;
  onPress: () => void;
}

export function EmergencyFundCard({ saving, info, onPress }: Props) {
  return (
    <>
      <SectionTitle>🛡 Emergency Fund</SectionTitle>
      <Card style={styles.card} padding={SPACING.lg}>
        {info && saving ? (
          <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <View style={styles.row}>
              <View>
                <Text style={styles.label}>Target</Text>
                <Text style={styles.value}>{formatCompact(info.target)}</Text>
              </View>
              <View>
                <Text style={styles.label}>Current</Text>
                <Text style={styles.value}>{formatCompact(info.current)}</Text>
              </View>
              <View>
                <Text style={styles.label}>Coverage</Text>
                <Text style={styles.value}>
                  {info.coverageUnlimited
                    ? "Aman"
                    : `${info.coverageMonths.toFixed(1)} bln`}
                </Text>
              </View>
            </View>
            <ProgressBar
              progress={info.target > 0 ? (info.current / info.target) * 100 : 0}
              color={info.statusColor}
              height={8}
              style={{ marginTop: SPACING.md }}
            />
            <View style={[styles.statusBadge, { backgroundColor: info.statusBg }]}>
              <Text style={[styles.statusText, { color: info.statusColor }]}>
                {info.status}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.emptyBtn} onPress={onPress}>
            <Text style={styles.emptyBtnText}>
              Pilih pos tabungan sebagai dana darurat ›
            </Text>
          </TouchableOpacity>
        )}
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: SPACING.sm },
  row: { flexDirection: "row", justifyContent: "space-between" },
  label: { fontSize: FONTS.xs, color: COLORS.textMuted, marginBottom: 2 },
  value: { fontSize: FONTS.md, fontWeight: "700", color: COLORS.text },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: RADIUS.round,
    marginTop: SPACING.md,
  },
  statusText: { fontSize: FONTS.xs, fontWeight: "700" },
  emptyBtn: { paddingVertical: SPACING.md, alignItems: "center" },
  emptyBtnText: { fontSize: FONTS.sm, color: COLORS.primary, fontWeight: "600" },
});
