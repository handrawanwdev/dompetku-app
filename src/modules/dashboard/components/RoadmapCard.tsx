import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, ProgressBar, Text } from "../../../components/common";
import { COLORS, FONTS, SPACING } from "../../../theme";
import { formatCompact } from "../../../utils/currency";
import type { RoadmapItem } from "../../../utils/finance";
import { SectionTitle } from "./SectionTitle";

export function RoadmapCard({ items }: { items: RoadmapItem[] }) {
  return (
    <>
      <SectionTitle>🗺️ Roadmap Bebas Hutang</SectionTitle>
      <Card padding={SPACING.lg}>
        {items.length === 0 ? (
          <Text style={styles.doneText}>🎉 Semua hutang lunas!</Text>
        ) : (
          items.map((item) => (
            <View key={item.id} style={styles.row}>
              <View style={[styles.step, { borderColor: item.color }]}>
                <Text style={[styles.stepText, { color: item.color }]}>{item.step}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, { color: item.color }]}>{item.name}</Text>
                <Text style={styles.sub}>
                  Sisa {item.remainingMonth} bln · {formatCompact(item.monthlyInstallment)}
                  /bln · Lunas: {item.payoffLabel}
                </Text>
                <Text style={styles.total}>
                  Total sisa: {formatCompact(item.totalRemaining)}
                </Text>
                <ProgressBar
                  progress={item.progressPct}
                  color={item.color}
                  height={5}
                  style={{ marginTop: 4 }}
                />
              </View>
            </View>
          ))
        )}
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  doneText: { fontSize: FONTS.sm, color: COLORS.income, textAlign: "center", padding: SPACING.md },
  row: { flexDirection: "row", gap: SPACING.sm, alignItems: "flex-start", marginBottom: SPACING.md },
  step: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  stepText: { fontSize: FONTS.xs, fontWeight: "700" },
  name: { fontSize: FONTS.sm, fontWeight: "700" },
  sub: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 2 },
  total: { fontSize: FONTS.xs, color: COLORS.savings, marginTop: 1 },
});
