import React from "react";
import { StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Card, Text } from "../../../components/common";
import { COLORS, FONTS, ICON_SIZES, RADIUS, SPACING } from "../../../theme";
import { formatCurrency } from "../../../utils/currency";
import { KIND_META, SPEND_KINDS, isKeptKind, type SpendKind } from "../../../utils/budget";
import { useSettingsStore } from "../../../store/settingsStore";
import { SectionTitle } from "./SectionTitle";

interface Props {
  income: number;
  byKind: Record<SpendKind, number>;
}

export function BudgetSplitCard({ income, byKind }: Props) {
  const hasIncome = income > 0;
  const targets = useSettingsStore((s) => s.settings.kindTargets);

  return (
    <>
      <SectionTitle icon="donut-large">Pembagian bulan ini</SectionTitle>
      <Card padding={SPACING.lg}>
        {SPEND_KINDS.map((k, idx) => {
          const m = KIND_META[k];
          const amount = byKind[k];
          const target = targets[k];
          const pct = hasIncome ? (amount / income) * 100 : 0;
          const over = hasIncome && !isKeptKind(k) && pct > target;
          const short = hasIncome && isKeptKind(k) && pct < target;

          return (
            <View key={k} style={[styles.row, idx > 0 && styles.rowGap]}>
              <View style={styles.head}>
                <View style={[styles.icon, { backgroundColor: m.color + "1A" }]}>
                  <MaterialIcons name={m.icon} size={ICON_SIZES.sm} color={m.color} />
                </View>
                <Text style={styles.label}>{m.label}</Text>
                <Text style={styles.amount}>{formatCurrency(amount)}</Text>
              </View>

              {hasIncome && (
                <>
                  <View style={styles.track}>
                    <View
                      style={[
                        styles.fill,
                        { width: `${Math.min(pct, 100)}%`, backgroundColor: over ? COLORS.expense : m.color },
                      ]}
                    />
                    <View style={[styles.marker, { left: `${target}%` }]} />
                  </View>
                  <Text style={[styles.caption, over && styles.captionWarn]}>
                    {pct.toFixed(0)}% dari pemasukan · target {target}%
                    {over ? " · lewat target" : short ? " · belum sampai target" : ""}
                  </Text>
                </>
              )}
            </View>
          );
        })}

        {!hasIncome && (
          <Text style={styles.empty}>Catat pemasukan bulan ini supaya persentasenya muncul.</Text>
        )}
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  row: {},
  rowGap: { marginTop: SPACING.lg },
  head: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  icon: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.round,
    alignItems: "center",
    justifyContent: "center",
  },
  label: { flex: 1, fontSize: FONTS.md, fontWeight: "600", color: COLORS.text },
  amount: { fontSize: FONTS.md, fontWeight: "700", color: COLORS.text },
  track: {
    height: 8,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.subtleBg,
    marginTop: SPACING.sm,
    overflow: "visible",
  },
  fill: { height: 8, borderRadius: RADIUS.round },
  marker: {
    position: "absolute",
    top: -3,
    width: 2,
    height: 14,
    marginLeft: -1,
    borderRadius: 1,
    backgroundColor: COLORS.textMuted,
  },
  caption: { fontSize: FONTS.xs, color: COLORS.textSecondary, marginTop: SPACING.xs },
  captionWarn: { color: COLORS.dangerText, fontWeight: "600" },
  empty: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: SPACING.md },
});
