import React from "react";
import { StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Card, Text } from "../../../components/common";
import { COLORS, FONTS, ICON_SIZES, RADIUS, SPACING } from "../../../theme";
import { formatCompact, formatCurrency } from "../../../utils/currency";
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

  const allocated = SPEND_KINDS.reduce((s, k) => s + byKind[k], 0);
  const allocatedPct = hasIncome ? (allocated / income) * 100 : 0;
  const left = income - allocated;

  return (
    <>
      <SectionTitle icon="donut-large">Pembagian bulan ini</SectionTitle>
      <Card padding={SPACING.lg}>
        {hasIncome && (
          <View style={styles.overview}>
            <View style={styles.overviewHead}>
              <Text style={styles.overviewPct}>{allocatedPct.toFixed(0)}%</Text>
              <Text style={styles.overviewText} numberOfLines={1}>
                dari pemasukan {formatCompact(income)} sudah dibagi
              </Text>
            </View>
            {/* Satu bar bertumpuk: porsi tiap jenis, sisanya kosong */}
            <View style={styles.stack}>
              {SPEND_KINDS.map((k) => {
                const w = (byKind[k] / Math.max(income, allocated)) * 100;
                if (w <= 0) return null;
                return <View key={k} style={{ width: `${w}%`, backgroundColor: KIND_META[k].color }} />;
              })}
            </View>
            <Text style={[styles.overviewLeft, left < 0 && styles.captionWarn]}>
              {left >= 0
                ? `Belum dibagi ${formatCurrency(left)}`
                : `Lebih ${formatCurrency(-left)} dari pemasukan bulan ini`}
            </Text>
          </View>
        )}

        {SPEND_KINDS.map((k, idx) => {
          const m = KIND_META[k];
          const amount = byKind[k];
          const target = targets[k];
          const pct = hasIncome ? (amount / income) * 100 : 0;
          const over = hasIncome && !isKeptKind(k) && pct > target;
          const short = hasIncome && isKeptKind(k) && pct < target;

          return (
            <View key={k} style={idx > 0 && styles.rowGap}>
              <View style={styles.head}>
                <View style={[styles.icon, { backgroundColor: m.color + "1A" }]}>
                  <MaterialIcons name={m.icon} size={ICON_SIZES.sm} color={m.color} />
                </View>
                <Text style={styles.label}>{m.label}</Text>
                <Text style={[styles.amount, amount === 0 && styles.amountZero]}>{formatCurrency(amount)}</Text>
              </View>

              {hasIncome && (
                <View style={styles.body}>
                  <View style={styles.track}>
                    <View
                      style={[
                        styles.fill,
                        { width: `${Math.min(pct, 100)}%`, backgroundColor: over ? COLORS.expense : m.color },
                      ]}
                    />
                    <View style={[styles.marker, { left: `${Math.min(target, 100)}%` }]} />
                  </View>
                  <View style={styles.captionRow}>
                    <Text style={[styles.caption, over && styles.captionWarn]}>
                      {pct.toFixed(0)}% <Text style={styles.captionMuted}>/ target {target}%</Text>
                    </Text>
                    {over ? (
                      <Text style={[styles.caption, styles.captionWarn]}>Lewat target</Text>
                    ) : short ? (
                      <Text style={styles.captionMuted}>Belum sampai target</Text>
                    ) : null}
                  </View>
                </View>
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

const ICON = 28;

const styles = StyleSheet.create({
  overview: {
    paddingBottom: SPACING.lg,
    marginBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  overviewHead: { flexDirection: "row", alignItems: "baseline", gap: SPACING.xs },
  overviewPct: { fontSize: FONTS.xl, fontWeight: "800", color: COLORS.text },
  overviewText: { flex: 1, fontSize: FONTS.sm, color: COLORS.textSecondary },
  stack: {
    flexDirection: "row",
    height: 10,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.subtleBg,
    overflow: "hidden",
    marginTop: SPACING.sm,
    gap: 2,
  },
  overviewLeft: { fontSize: FONTS.xs, color: COLORS.textSecondary, marginTop: SPACING.xs },
  rowGap: { marginTop: SPACING.lg },
  head: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  icon: {
    width: ICON,
    height: ICON,
    borderRadius: RADIUS.round,
    alignItems: "center",
    justifyContent: "center",
  },
  label: { flex: 1, fontSize: FONTS.md, fontWeight: "600", color: COLORS.text },
  amount: { fontSize: FONTS.md, fontWeight: "700", color: COLORS.text },
  amountZero: { color: COLORS.textMuted, fontWeight: "600" },
  // Bar & keterangan sejajar dengan label (bukan ikon)
  body: { marginLeft: ICON + SPACING.sm },
  track: {
    height: 6,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.subtleBg,
    marginTop: SPACING.xs,
  },
  fill: { height: 6, borderRadius: RADIUS.round },
  marker: {
    position: "absolute",
    top: -3,
    width: 2,
    height: 12,
    marginLeft: -1,
    borderRadius: 1,
    backgroundColor: COLORS.textMuted,
  },
  captionRow: { flexDirection: "row", justifyContent: "space-between", marginTop: SPACING.xs },
  caption: { fontSize: FONTS.xs, fontWeight: "600", color: COLORS.text },
  captionMuted: { fontSize: FONTS.xs, fontWeight: "400", color: COLORS.textSecondary },
  captionWarn: { color: COLORS.dangerText, fontWeight: "700" },
  empty: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: SPACING.md },
});
