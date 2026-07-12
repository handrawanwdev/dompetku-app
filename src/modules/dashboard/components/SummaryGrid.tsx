import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "../../../components/common";
import { COLORS, FONTS, SPACING } from "../../../theme";
import { formatCompact } from "../../../utils/currency";
import { SectionTitle } from "./SectionTitle";
import type { DashboardData } from "../hooks/useDashboardData";

type Summary = DashboardData["summary"];

function SummaryItem({
  label,
  value,
  color,
  emoji,
  negative,
}: {
  label: string;
  value: number;
  color: string;
  emoji: string;
  negative?: boolean;
}) {
  return (
    <Card style={styles.item} padding={SPACING.md}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.value, { color }]}>
        {negative ? "-" : ""}
        {formatCompact(value)}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </Card>
  );
}

export function SummaryGrid({ summary }: { summary: Summary }) {
  return (
    <>
      <SectionTitle>📋 Ringkasan Keuangan</SectionTitle>
      <View style={styles.grid}>
        <SummaryItem label="Kas" value={summary.cash} color={COLORS.income} emoji="💵" />
        <SummaryItem
          label="Tabungan"
          value={summary.totalSavings}
          color={COLORS.savings}
          emoji="🏦"
        />
        <SummaryItem
          label="Investasi"
          value={summary.totalInvestment}
          color={COLORS.investment}
          emoji="📈"
        />
        <SummaryItem
          label="Aset Fisik"
          value={summary.totalAssets}
          color={COLORS.asset}
          emoji="🏠"
        />
        <SummaryItem
          label="Total Hutang"
          value={summary.totalDebt}
          color={COLORS.debt}
          emoji="📋"
          negative
        />
        <SummaryItem
          label="Cicilan/Bln"
          value={summary.monthlyInstallment}
          color={COLORS.debt}
          emoji="📅"
          negative
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm },
  item: { width: "31%", alignItems: "center" },
  emoji: { fontSize: 20, marginBottom: SPACING.xs },
  value: { fontSize: FONTS.md, fontWeight: "700" },
  label: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 2, textAlign: "center" },
});
