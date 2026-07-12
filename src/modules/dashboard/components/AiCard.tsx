import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Text } from "../../../components/common";
import { COLORS, FONTS, RADIUS, SPACING } from "../../../theme";
import type { AIFinancialCard } from "../../../ai/FinancialAdvisorService";

export function healthColor(label: string): string {
  if (label === "EXCELLENT" || label === "GOOD") return COLORS.income;
  if (label === "FAIR") return COLORS.warning;
  return COLORS.expense;
}

interface Props {
  report: AIFinancialCard;
  onPress: () => void;
}

export function AiCard({ report, onPress }: Props) {
  const color = healthColor(report.healthLabel);
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <Card style={styles.card} padding={SPACING.xl}>
        <View style={styles.header}>
          <Text style={styles.title}>✨ Asisten Finansial</Text>
          <View style={[styles.healthBadge, { backgroundColor: color + "22" }]}>
            <Text style={[styles.healthBadgeText, { color }]}>
              {report.healthLabel}
            </Text>
          </View>
        </View>

        <Text style={styles.rowLabel}>Insight</Text>
        <Text style={styles.rowText}>{report.insightText}</Text>

        <Text style={styles.rowLabel}>Attention</Text>
        <Text style={styles.rowText}>{report.attentionText}</Text>

        <Text style={styles.rowLabel}>Next Action</Text>
        <Text style={styles.rowText}>{report.nextActionText}</Text>

        <Text style={styles.tapHint}>Tap untuk detail selengkapnya ›</Text>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: SPACING.sm, borderColor: COLORS.border },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  title: { fontSize: FONTS.lg, fontWeight: "700", color: COLORS.text },
  healthBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.round,
  },
  healthBadgeText: { fontSize: FONTS.xs, fontWeight: "800", letterSpacing: 0.5 },
  rowLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginTop: SPACING.sm,
  },
  rowText: { fontSize: FONTS.sm, color: COLORS.text, marginTop: 2, lineHeight: 19 },
  tapHint: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.md,
    textAlign: "right",
  },
});
