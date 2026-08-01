import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "../../../components/common";
import { COLORS, FONTS, SPACING } from "../../../theme";
import { formatCompact } from "../../../utils/currency";
import { GroupedBarChart } from "../../../components/charts/GroupedBarChart";
import { SectionTitle } from "./SectionTitle";
import type { useCashflowChart } from "../../../hooks/useCashflowChart";

interface Props {
  data: ReturnType<typeof useCashflowChart>;
}

export function Cashflow30dCard({ data }: Props) {
  // GroupedBarChart renders every label unconditionally — 30 of them would
  // overlap, so only keep every 5th day plus the last one.
  const sparse = data.map((d, i) => ({
    ...d,
    label: i % 5 === 0 || i === data.length - 1 ? d.label : "",
  }));

  return (
    <>
      <SectionTitle>💹 Cashflow 1 Bulan</SectionTitle>
      <Card padding={SPACING.lg}>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryText, { color: COLORS.income }]}>
            ⬆ Masuk: {formatCompact(data.reduce((s, d) => s + d.income, 0))}
          </Text>
          <Text style={[styles.summaryText, { color: COLORS.expense }]}>
            ⬇ Keluar: {formatCompact(data.reduce((s, d) => s + d.expense, 0))}
          </Text>
        </View>
        <GroupedBarChart data={sparse} height={140} />
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: SPACING.sm },
  summaryText: { fontSize: FONTS.sm, fontWeight: "600" },
});
