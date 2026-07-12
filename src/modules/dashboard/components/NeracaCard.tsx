import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "../../../components/common";
import { COLORS, FONTS, RADIUS, SPACING } from "../../../theme";
import { formatCurrency } from "../../../utils/currency";
import { SectionTitle } from "./SectionTitle";

function NeracaRow({
  label,
  value,
  color,
  bold,
}: {
  label: string;
  value: number;
  color: string;
  bold?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, bold && { fontWeight: "700", color: COLORS.text }]}>
        {label}
      </Text>
      <Text style={[styles.value, { color }, bold && { fontWeight: "700" }]}>
        {formatCurrency(value)}
      </Text>
    </View>
  );
}

interface Props {
  totalIncomeAllTime: number;
  cash: number;
  totalSavings: number;
  investmentCost: number;
  totalAssets: number;
  totalAset: number;
  totalDebt: number;
  kekayaanBersih: number;
}

export function NeracaCard({
  totalIncomeAllTime,
  cash,
  totalSavings,
  investmentCost,
  totalAssets,
  totalAset,
  totalDebt,
  kekayaanBersih,
}: Props) {
  return (
    <>
      <SectionTitle>⚖️ Neraca Keuangan</SectionTitle>
      <Card padding={SPACING.lg}>
        <NeracaRow label="💰 Total Pendapatan" value={totalIncomeAllTime} color={COLORS.income} />
        <NeracaRow label="💵 Kas Bersih" value={cash} color={COLORS.savings} />
        <NeracaRow label="🏦 Total Tabungan" value={totalSavings} color={COLORS.investment} />
        <NeracaRow
          label="📈 Total Investasi (harga beli)"
          value={investmentCost}
          color={COLORS.asset}
        />
        <NeracaRow label="🖥️ Aset Fisik (nilai skrg)" value={totalAssets} color={COLORS.debt} />
        <View style={styles.divider} />
        <NeracaRow label="✅ Total Aset" value={totalAset} color={COLORS.income} bold />
        <NeracaRow label="💳 Total Sisa Hutang" value={-totalDebt} color={COLORS.expense} />
        <View style={[styles.kekayaanBox, { marginTop: SPACING.sm }]}>
          <Text style={styles.kekayaanLabel}>⚖️ Kekayaan Bersih</Text>
          <Text
            style={[
              styles.kekayaanValue,
              { color: kekayaanBersih >= 0 ? COLORS.income : COLORS.expense },
            ]}
          >
            {formatCurrency(kekayaanBersih)}
          </Text>
        </View>
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  label: { fontSize: FONTS.sm, color: COLORS.text },
  value: { fontSize: FONTS.sm, fontWeight: "600" },
  divider: { height: 2, backgroundColor: COLORS.border, marginVertical: SPACING.xs },
  kekayaanBox: {
    backgroundColor: COLORS.subtleBg,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  kekayaanLabel: { fontSize: FONTS.sm, fontWeight: "700", color: COLORS.text },
  kekayaanValue: { fontSize: FONTS.md, fontWeight: "700" },
});
