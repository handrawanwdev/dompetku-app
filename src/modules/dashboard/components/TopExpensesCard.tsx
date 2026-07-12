import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "../../../components/common";
import { COLORS, FONTS, RADIUS, SPACING } from "../../../theme";
import { formatCompact } from "../../../utils/currency";
import { SectionTitle } from "./SectionTitle";

interface Props {
  categories: Array<[string, number]>;
  monthlyExpense: number;
}

export function TopExpensesCard({ categories, monthlyExpense }: Props) {
  if (categories.length === 0) return null;

  return (
    <>
      <SectionTitle>🧾 Pengeluaran Terbesar Bulan Ini</SectionTitle>
      <Card padding={SPACING.md}>
        {categories.map(([cat, amount], idx) => {
          const pct = monthlyExpense > 0 ? (amount / monthlyExpense) * 100 : 0;
          return (
            <View key={cat} style={[styles.row, idx > 0 && { marginTop: SPACING.sm }]}>
              <View style={styles.info}>
                <Text style={styles.rank}>#{idx + 1}</Text>
                <Text style={styles.name}>{cat}</Text>
              </View>
              <View style={styles.barWrap}>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${pct}%` as any }]} />
                </View>
              </View>
              <View style={styles.amountWrap}>
                <Text style={styles.amount}>{formatCompact(amount)}</Text>
                <Text style={styles.pct}>{pct.toFixed(0)}%</Text>
              </View>
            </View>
          );
        })}
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  info: { flexDirection: "row", alignItems: "center", gap: SPACING.xs, width: 110 },
  rank: { fontSize: FONTS.xs, color: COLORS.textMuted, width: 18 },
  name: { fontSize: FONTS.sm, color: COLORS.text, fontWeight: "500", flex: 1 },
  barWrap: { flex: 1 },
  barTrack: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.round,
    overflow: "hidden",
  },
  barFill: { height: 6, backgroundColor: COLORS.expense, borderRadius: RADIUS.round },
  amountWrap: { alignItems: "flex-end", width: 60 },
  amount: { fontSize: FONTS.xs, fontWeight: "600", color: COLORS.text },
  pct: { fontSize: FONTS.xs, color: COLORS.textMuted },
});
