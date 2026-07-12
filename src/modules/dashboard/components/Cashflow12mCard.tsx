import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "../../../components/common";
import { FONTS, RADIUS, SPACING } from "../../../theme";
import { formatCompact } from "../../../utils/currency";
import { GroupedBarChart } from "../../../components/charts/GroupedBarChart";
import { SectionTitle } from "./SectionTitle";
import type { useCashflowChart } from "../../../hooks/useCashflowChart";

interface Props {
  data: ReturnType<typeof useCashflowChart>;
}

export function Cashflow12mCard({ data }: Props) {
  const totalInc = data.reduce((s, d) => s + d.income, 0);
  const totalExp = data.reduce((s, d) => s + d.expense, 0);
  const net = totalInc - totalExp;

  return (
    <>
      <SectionTitle>📊 Cashflow 1 Tahun</SectionTitle>
      <Card padding={SPACING.lg}>
        <View style={styles.grid}>
          <View style={[styles.box, { backgroundColor: "#d1fae5" }]}>
            <Text style={[styles.label, { color: "#065f46" }]}>Total Masuk</Text>
            <Text style={[styles.value, { color: "#065f46" }]}>
              {formatCompact(totalInc)}
            </Text>
            <Text style={[styles.sub, { color: "#065f46" }]}>
              avg {formatCompact(totalInc / 12)}/bln
            </Text>
          </View>
          <View style={[styles.box, { backgroundColor: "#fee2e2" }]}>
            <Text style={[styles.label, { color: "#991b1b" }]}>Total Keluar</Text>
            <Text style={[styles.value, { color: "#991b1b" }]}>
              {formatCompact(totalExp)}
            </Text>
            <Text style={[styles.sub, { color: "#991b1b" }]}>
              avg {formatCompact(totalExp / 12)}/bln
            </Text>
          </View>
          <View
            style={[styles.box, { backgroundColor: net >= 0 ? "#dbeafe" : "#fee2e2" }]}
          >
            <Text style={[styles.label, { color: net >= 0 ? "#1e40af" : "#991b1b" }]}>
              Net Cashflow
            </Text>
            <Text style={[styles.value, { color: net >= 0 ? "#1e40af" : "#991b1b" }]}>
              {net >= 0 ? "+" : ""}
              {formatCompact(net)}
            </Text>
          </View>
        </View>
        <GroupedBarChart data={data} height={170} />
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", gap: SPACING.sm, marginBottom: SPACING.sm },
  box: { flex: 1, borderRadius: RADIUS.md, padding: SPACING.sm },
  label: { fontSize: FONTS.xs, textTransform: "uppercase", marginBottom: 2 },
  value: { fontSize: FONTS.sm, fontWeight: "700" },
  sub: { fontSize: FONTS.xs, marginTop: 1 },
});
