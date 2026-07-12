import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "../../../components/common";
import { COLORS, FONTS, RADIUS, SPACING } from "../../../theme";
import { formatCompact } from "../../../utils/currency";
import type { FinancialProjection } from "../../../utils/finance";
import { SectionTitle } from "./SectionTitle";

function ProyeksiItem({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <View style={styles.item}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.sub} numberOfLines={1}>
        {sub}
      </Text>
    </View>
  );
}

export function ProjectionGrid({ projection }: { projection: FinancialProjection }) {
  return (
    <>
      <SectionTitle>🔮 Proyeksi Finansial</SectionTitle>
      <View style={styles.grid}>
        <ProyeksiItem
          label="Kas bersih saat ini"
          value={formatCompact(projection.cashNow)}
          sub="nyata dari transaksi"
          color={projection.cashNow >= 0 ? COLORS.income : COLORS.expense}
        />
        <ProyeksiItem
          label="Bebas hutang"
          value={
            projection.debtFreeMonths > 0
              ? `${projection.debtFreeMonths} bln lagi`
              : "Bebas 🎉"
          }
          sub={projection.debtFreeLabel}
          color={COLORS.savings}
        />
        <ProyeksiItem
          label="Total tabungan"
          value={formatCompact(projection.totalSavings)}
          sub="semua pos gabungan"
          color={COLORS.investment}
        />
        <ProyeksiItem
          label="Dana darurat (3×cicilan)"
          value={projection.emergencyFundLabel}
          sub={`${formatCompact(projection.emergencyFundTarget)} target`}
          color={COLORS.debt}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm },
  item: { width: "48%", backgroundColor: COLORS.subtleBg, borderRadius: RADIUS.md, padding: SPACING.sm },
  label: { fontSize: FONTS.xs, color: COLORS.textMuted, textTransform: "uppercase" },
  value: { fontSize: FONTS.md, fontWeight: "700", marginTop: 2 },
  sub: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 1 },
});
