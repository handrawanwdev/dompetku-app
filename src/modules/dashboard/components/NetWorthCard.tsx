import React from "react";
import { StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "../../../components/common";
import { COLORS, FONTS, ICON_SIZES, RADIUS, SHADOWS, SPACING } from "../../../theme";
import { formatCompact, formatCurrency } from "../../../utils/currency";
import type { DashboardData } from "../hooks/useDashboardData";

type Summary = DashboardData["summary"];

interface Props {
  summary: Summary;
}

function Trend({ value, goodWhenUp }: { value: number; goodWhenUp: boolean }) {
  if (value === 0) return null;
  const up = value >= 0;
  const good = up === goodWhenUp;
  return (
    <View style={styles.trendRow}>
      <MaterialIcons
        name={up ? "arrow-upward" : "arrow-downward"}
        size={ICON_SIZES.xs}
        color={good ? COLORS.incomeLight : COLORS.expenseLight}
      />
      <Text style={[styles.trend, { color: good ? COLORS.incomeLight : COLORS.expenseLight }]}>
        {Math.abs(value).toFixed(0)}% vs bln lalu
      </Text>
    </View>
  );
}

export function NetWorthCard({ summary }: Props) {
  const ratio = Math.min(summary.expenseRatio, 100);
  // Rincian supaya angka kekayaan bersih (bisa minus) langsung terbaca asalnya.
  const gross = summary.netWorth + summary.totalDebt;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Kekayaan bersih</Text>
      <Text style={styles.amount} numberOfLines={1}>
        {formatCurrency(summary.netWorth)}
      </Text>
      {summary.totalDebt > 0 ? (
        <Text style={styles.breakdown} numberOfLines={1}>
          Harta {formatCompact(gross)}  −  utang {formatCompact(summary.totalDebt)}
        </Text>
      ) : null}

      <View style={styles.row}>
        <View style={styles.pill}>
          <View style={styles.pillHead}>
            <MaterialIcons name="south-west" size={ICON_SIZES.xs} color={COLORS.heroMuted} />
            <Text style={styles.pillLabel}>Uang masuk</Text>
          </View>
          <Text style={styles.pillValue}>{formatCompact(summary.monthlyIncome)}</Text>
          <Trend value={summary.incomeTrend} goodWhenUp />
          {summary.openingBalance > 0 && (
            <Text style={styles.pillNote} numberOfLines={1}>
              + saldo awal {formatCompact(summary.openingBalance)}
            </Text>
          )}
          {summary.loanIn > 0 && (
            <Text style={styles.pillNote} numberOfLines={1}>
              + pinjaman {formatCompact(summary.loanIn)}
            </Text>
          )}
        </View>
        <View style={styles.pill}>
          <View style={styles.pillHead}>
            <MaterialIcons name="north-east" size={ICON_SIZES.xs} color={COLORS.heroMuted} />
            <Text style={styles.pillLabel}>Uang keluar</Text>
          </View>
          <Text style={styles.pillValue}>{formatCompact(summary.monthlyExpense)}</Text>
          <Trend value={summary.expenseTrend} goodWhenUp={false} />
        </View>
      </View>

      {summary.monthlyIncome > 0 && (
        <View style={styles.barWrap}>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${ratio}%`,
                  backgroundColor: summary.expenseRatio > 80 ? COLORS.expenseLight : COLORS.heroText,
                },
              ]}
            />
          </View>
          <Text style={styles.barLabel}>
            {summary.expenseRatio.toFixed(0)}% pemasukan bulan ini sudah terpakai
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.sm,
    ...SHADOWS.lg,
  },
  label: { fontSize: FONTS.sm, color: COLORS.heroMuted, fontWeight: "600" },
  amount: {
    fontSize: FONTS.xxxl,
    fontWeight: "800",
    color: COLORS.heroText,
    marginTop: SPACING.xs,
    letterSpacing: -0.5,
  },
  breakdown: { fontSize: FONTS.sm, color: COLORS.heroMuted, marginTop: 2 },
  row: { flexDirection: "row", gap: SPACING.sm, marginTop: SPACING.lg },
  pill: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  pillHead: { flexDirection: "row", alignItems: "center", gap: 4 },
  pillLabel: { fontSize: FONTS.xs, color: COLORS.heroMuted, fontWeight: "600" },
  pillValue: { fontSize: FONTS.lg, fontWeight: "700", color: COLORS.heroText, marginTop: 4 },
  pillNote: { fontSize: FONTS.xs, color: COLORS.heroMuted, marginTop: 2 },
  trendRow: { flexDirection: "row", alignItems: "center", gap: 2, marginTop: 4 },
  trend: { fontSize: FONTS.xs, fontWeight: "600" },
  barWrap: { marginTop: SPACING.lg },
  barTrack: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: RADIUS.round,
    overflow: "hidden",
  },
  barFill: { height: 8, borderRadius: RADIUS.round },
  barLabel: { fontSize: FONTS.xs, color: COLORS.heroMuted, marginTop: SPACING.sm },
});
