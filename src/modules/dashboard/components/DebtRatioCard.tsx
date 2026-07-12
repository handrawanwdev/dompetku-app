import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, ProgressBar, Text } from "../../../components/common";
import { COLORS, FONTS, SPACING } from "../../../theme";
import { formatCompact } from "../../../utils/currency";
import { SectionTitle } from "./SectionTitle";

interface Props {
  totalDebt: number;
  debtRatio: number;
  debtRatioLimit: number;
  monthlyInstallment: number;
}

export function DebtRatioCard({
  totalDebt,
  debtRatio,
  debtRatioLimit,
  monthlyInstallment,
}: Props) {
  if (totalDebt <= 0) return null;
  const overLimit = debtRatio > debtRatioLimit;

  return (
    <>
      <SectionTitle>📉 Rasio Hutang</SectionTitle>
      <Card padding={SPACING.lg}>
        <View style={styles.row}>
          <Text style={styles.value}>{debtRatio.toFixed(1)}%</Text>
          <Text
            style={[styles.status, { color: overLimit ? COLORS.danger : COLORS.success }]}
          >
            {overLimit ? "⚠️ Melebihi batas" : "✅ Aman"}
          </Text>
        </View>
        <ProgressBar
          progress={Math.min(debtRatio, 100)}
          color={overLimit ? COLORS.danger : COLORS.success}
          style={{ marginTop: SPACING.sm }}
        />
        <Text style={styles.hint}>
          Batas: {debtRatioLimit}% • Cicilan: {formatCompact(monthlyInstallment)}/bln
        </Text>
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  value: { fontSize: FONTS.xxl, fontWeight: "800", color: COLORS.text },
  status: { fontSize: FONTS.sm, fontWeight: "600" },
  hint: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: SPACING.xs },
});
