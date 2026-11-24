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
}: {
  label: string;
  value: number;
  color: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}) {
  return (
    <Card style={styles.item} padding={SPACING.md}>
      <View style={[styles.iconBadge, { backgroundColor: color + "1A" }]}>
        <MaterialIcons name={icon} size={ICON_SIZES.sm} color={color} />
      </View>
      <View style={styles.texts}>
        <Text style={[styles.value, { color }]} numberOfLines={1}>
          {formatCompact(value)}
        </Text>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </Card>
  );
}

export function SummaryGrid({ summary }: { summary: Summary }) {
  // Investasi tampil kalau ada nilainya. Utang & cicilan ada di kartu Beban cicilan.
  const items: React.ComponentProps<typeof SummaryItem>[] = [
    { label: "Bisa dipakai", value: summary.cash, color: COLORS.primary, icon: "account-balance-wallet" },
    { label: "Tabungan", value: summary.totalSavings, color: COLORS.saving, icon: "lock" },
    ...(summary.totalInvestment > 0
      ? [{ label: "Investasi", value: summary.totalInvestment, color: COLORS.investment, icon: "trending-up" as const }]
      : []),
    { label: "Aset", value: summary.totalAssets, color: COLORS.asset, icon: "diamond" },
    { label: "Pemasukan rutin/bln", value: summary.recurringIncome, color: COLORS.income, icon: "event-repeat" },
  ];
  const basis = items.length === 4 ? "47%" : "30%";

  return (
    <>
      <SectionTitle>Ringkasan</SectionTitle>
      <View style={styles.grid}>
        {items.map((item) => (
          <View key={item.label} style={{ flexBasis: basis, flexGrow: 1 }}>
            <SummaryItem {...item} />
          </View>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm },
  item: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  texts: { flex: 1 },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.round,
    alignItems: "center",
    justifyContent: "center",
  },
  value: { fontSize: FONTS.lg, fontWeight: "700" },
  label: { fontSize: FONTS.xs, color: COLORS.textSecondary, marginTop: 2 },
});
