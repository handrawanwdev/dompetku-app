import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Text } from "../../../components/common";
import { COLORS, FONTS, SPACING } from "../../../theme";
import { SectionTitle } from "./SectionTitle";
import type { FinancialInsight } from "../../../ai/InsightGenerator";

const SEVERITY_COLOR: Record<FinancialInsight["severity"], string> = {
  info: COLORS.success,
  warning: COLORS.warning,
  critical: COLORS.danger,
};

interface Props {
  insights: FinancialInsight[];
  onPress: () => void;
}

/**
 * Compact 1–3 item glance list — tap through to AiDetailModal for the full
 * narrative. No health-score badge here on purpose: it'd just restate
 * FreedomCard's Level in different words (both come from the exact same
 * computeFinancialScore() call) — FreedomCard already owns that signal.
 */
export function FinancialInsightsCard({ insights, onPress }: Props) {
  if (insights.length === 0) return null;
  const top = insights.slice(0, 3);

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <SectionTitle icon="lightbulb">Financial Insights</SectionTitle>
      <Card padding={SPACING.md}>
        {top.map((insight, idx) => (
          <View
            key={idx}
            style={[
              styles.row,
              idx > 0 && styles.rowBorder,
            ]}
          >
            <View style={[styles.bar, { backgroundColor: SEVERITY_COLOR[insight.severity] }]} />
            <Text style={styles.icon}>{insight.icon}</Text>
            <Text style={styles.title} numberOfLines={1}>{insight.title}</Text>
          </View>
        ))}
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", paddingVertical: SPACING.sm, gap: SPACING.sm },
  rowBorder: { borderTopWidth: 1, borderTopColor: COLORS.border },
  bar: { width: 3, height: 20, borderRadius: 2 },
  icon: { fontSize: 16 },
  title: { flex: 1, fontSize: FONTS.sm, fontWeight: "600", color: COLORS.text },
});
