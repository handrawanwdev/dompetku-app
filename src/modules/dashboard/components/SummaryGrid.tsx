import React from "react";
import { StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Card, Text } from "../../../components/common";
import { COLORS, FONTS, ICON_SIZES, RADIUS, SPACING } from "../../../theme";
import { formatCompact } from "../../../utils/currency";
import { SectionTitle } from "./SectionTitle";
import type { DashboardData } from "../hooks/useDashboardData";

type Summary = DashboardData["summary"];

function SummaryItem({
  label,
  value,
  color,
  icon,
  negative,
}: {
  label: string;
  value: number;
  color: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  negative?: boolean;
}) {
  return (
    <Card style={styles.item} padding={SPACING.md}>
      <View style={[styles.iconBadge, { backgroundColor: color + "18" }]}>
        <MaterialIcons name={icon} size={ICON_SIZES.sm} color={color} />
      </View>
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
      <SectionTitle icon="dashboard">Ringkasan Keuangan</SectionTitle>
      <View style={styles.grid}>
        <SummaryItem label="Kas" value={summary.cash} color={COLORS.income} icon="payments" />
        <SummaryItem
          label="Tabungan"
          value={summary.totalSavings}
          color={COLORS.savings}
          icon="savings"
        />
        <SummaryItem
          label="Investasi"
          value={summary.totalInvestment}
          color={COLORS.investment}
          icon="trending-up"
        />
        <SummaryItem
          label="Aset Fisik"
          value={summary.totalAssets}
          color={COLORS.asset}
          icon="home-work"
        />
        <SummaryItem
          label="Total Hutang"
          value={summary.totalDebt}
          color={COLORS.debt}
          icon="receipt-long"
          negative
        />
        <SummaryItem
          label="Cicilan/Bln"
          value={summary.monthlyInstallment}
          color={COLORS.debt}
          icon="event"
          negative
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm },
  item: { width: "31%", alignItems: "center" },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.round,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xs,
  },
  value: { fontSize: FONTS.md, fontWeight: "700" },
  label: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 2, textAlign: "center" },
});
