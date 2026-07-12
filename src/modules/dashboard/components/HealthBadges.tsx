import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "../../../components/common";
import { COLORS, FONTS, RADIUS, SPACING } from "../../../theme";
import { formatCompact } from "../../../utils/currency";

interface Props {
  savingsRatePct: number;
  cashflow: number;
  totalSavings: number;
}

function Badge({
  emoji,
  value,
  label,
  color,
}: {
  emoji: string;
  value: string;
  label: string;
  color: string;
}) {
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: color + "18", borderColor: color + "40" },
      ]}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

export function HealthBadges({ savingsRatePct, cashflow, totalSavings }: Props) {
  const cashflowColor = cashflow >= 0 ? COLORS.income : COLORS.expense;
  return (
    <View style={styles.row}>
      <Badge
        emoji="💰"
        value={`${savingsRatePct.toFixed(0)}%`}
        label="Tingkat Nabung"
        color={COLORS.income}
      />
      <Badge
        emoji={cashflow >= 0 ? "✅" : "⚠️"}
        value={`${cashflow >= 0 ? "+" : ""}${formatCompact(cashflow)}`}
        label="Cashflow Bln Ini"
        color={cashflowColor}
      />
      <Badge
        emoji="🏦"
        value={formatCompact(totalSavings)}
        label="Total Tabungan"
        color={COLORS.savings}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: SPACING.sm, marginBottom: SPACING.sm },
  badge: {
    flex: 1,
    alignItems: "center",
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  emoji: { fontSize: 16, marginBottom: 4 },
  value: { fontSize: FONTS.md, fontWeight: "800" },
  label: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    marginTop: 2,
    textAlign: "center",
  },
});
