import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "../../../components/common";
import { COLORS, FONTS, RADIUS, SPACING } from "../../../theme";
import { formatCompact, formatCurrency } from "../../../utils/currency";
import type { DashboardData } from "../hooks/useDashboardData";

type Summary = DashboardData["summary"];

interface Props {
  summary: Summary;
}

export function NetWorthCard({ summary }: Props) {
  return (
    <Card style={styles.card} padding={SPACING.xl}>
      <Text style={styles.label}>NET WORTH</Text>
      <Text
        style={[
          styles.amount,
          { color: summary.netWorth >= 0 ? COLORS.income : COLORS.expense },
        ]}
      >
        {formatCurrency(summary.netWorth)}
      </Text>

      <View style={styles.row}>
        <View style={styles.item}>
          <Text style={styles.itemLabel}>▲ Pemasukan</Text>
          <Text style={[styles.itemValue, { color: COLORS.income }]}>
            {formatCompact(summary.monthlyIncome)}
          </Text>
          {summary.incomeTrend !== 0 && (
            <Text
              style={[
                styles.trend,
                { color: summary.incomeTrend >= 0 ? COLORS.income : COLORS.expense },
              ]}
            >
              {summary.incomeTrend >= 0 ? "▲" : "▼"}{" "}
              {Math.abs(summary.incomeTrend).toFixed(0)}% vs bln lalu
            </Text>
          )}
        </View>
        <View style={styles.divider} />
        <View style={styles.item}>
          <Text style={styles.itemLabel}>▼ Pengeluaran</Text>
          <Text style={[styles.itemValue, { color: COLORS.expense }]}>
            {formatCompact(summary.monthlyExpense)}
          </Text>
          {summary.expenseTrend !== 0 && (
            <Text
              style={[
                styles.trend,
                {
                  color: summary.expenseTrend <= 0 ? COLORS.income : COLORS.expense,
                },
              ]}
            >
              {summary.expenseTrend >= 0 ? "▲" : "▼"}{" "}
              {Math.abs(summary.expenseTrend).toFixed(0)}% vs bln lalu
            </Text>
          )}
        </View>
      </View>

      {summary.monthlyIncome > 0 && (
        <View style={styles.barWrap}>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${summary.expenseRatio}%` as any,
                  backgroundColor:
                    summary.expenseRatio > 80 ? COLORS.expense : COLORS.income,
                },
              ]}
            />
          </View>
          <Text style={styles.barLabel}>
            {summary.expenseRatio.toFixed(0)}% income terpakai
          </Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: SPACING.sm, borderColor: COLORS.border },
  label: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  amount: { fontSize: 28, fontWeight: "800", marginBottom: SPACING.md },
  row: { flexDirection: "row", alignItems: "flex-start" },
  item: { flex: 1, alignItems: "center" },
  itemLabel: { fontSize: FONTS.xs, color: COLORS.textMuted },
  itemValue: { fontSize: FONTS.lg, fontWeight: "700", marginTop: 2 },
  trend: { fontSize: FONTS.xs, marginTop: 3, fontWeight: "500" },
  divider: { width: 1, height: 44, backgroundColor: COLORS.border, marginTop: 4 },
  barWrap: { marginTop: SPACING.md },
  barTrack: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.round,
    overflow: "hidden",
  },
  barFill: { height: 6, borderRadius: RADIUS.round },
  barLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
    textAlign: "right",
  },
});
