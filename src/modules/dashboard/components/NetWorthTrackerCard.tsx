import React from "react";
import { StyleSheet } from "react-native";
import { Card, Text } from "../../../components/common";
import { COLORS, FONTS, SPACING } from "../../../theme";
import { GroupedBarChart } from "../../../components/charts/GroupedBarChart";
import type { NetWorthPoint } from "../../../utils/finance";
import { SectionTitle } from "./SectionTitle";

interface Props {
  series: NetWorthPoint[];
  growthPct: number;
}

export function NetWorthTrackerCard({ series, growthPct }: Props) {
  return (
    <>
      <SectionTitle>📈 Net Worth Growth</SectionTitle>
      <Card style={styles.card} padding={SPACING.lg}>
        {series.length >= 2 ? (
          <>
            <GroupedBarChart
              data={series.map((p) => ({
                label: p.label,
                income: Math.max(p.netWorth, 0),
                expense: Math.max(-p.netWorth, 0),
              }))}
              height={160}
              incomeColor={COLORS.investment}
              expenseColor={COLORS.expense}
            />
            <Text
              style={[
                styles.growthText,
                { color: growthPct >= 0 ? COLORS.income : COLORS.expense },
              ]}
            >
              {growthPct >= 0 ? "▲" : "▼"} {Math.abs(growthPct).toFixed(0)}% sejak{" "}
              {series[0].label}
            </Text>
          </>
        ) : (
          <Text style={styles.empty}>
            Riwayat net worth akan terkumpul seiring waktu pemakaian aplikasi.
          </Text>
        )}
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: SPACING.sm },
  growthText: {
    fontSize: FONTS.sm,
    fontWeight: "700",
    textAlign: "center",
    marginTop: SPACING.sm,
  },
  empty: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    textAlign: "center",
    paddingVertical: SPACING.lg,
  },
});
