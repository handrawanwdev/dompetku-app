import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Card, Text } from "../../../components/common";
import { COLORS, FONTS, ICON_SIZES, RADIUS, SPACING } from "../../../theme";
import { formatCurrency } from "../../../utils/currency";
import { useRootNavigation } from "../../../navigation/types";
import { SectionTitle } from "./SectionTitle";

interface Props {
  totalDebt: number;
  debtRatio: number;
  debtRatioLimit: number;
  monthlyInstallment: number;
  monthlyIncome: number;
}

type Tone = "aman" | "waspada" | "lewat";

const TONE = {
  aman: { label: "Aman", bg: COLORS.successBg, text: COLORS.successText, bar: COLORS.success },
  waspada: { label: "Hampir batas", bg: COLORS.warningBg, text: COLORS.warningText, bar: COLORS.warning },
  lewat: { label: "Terlalu berat", bg: COLORS.dangerBg, text: COLORS.dangerText, bar: COLORS.danger },
} as const;

/** Porsi cicilan bulanan dari pemasukan bulan ini, dibanding batas sehat. */
export function DebtRatioCard({
  totalDebt,
  debtRatio,
  debtRatioLimit,
  monthlyInstallment,
  monthlyIncome,
}: Props) {
  const nav = useRootNavigation();
  if (totalDebt <= 0) return null;

  const hasIncome = monthlyIncome > 0;
  const hasInstallment = monthlyInstallment > 0;
  const showRatio = hasIncome && hasInstallment;

  const tone: Tone =
    debtRatio > debtRatioLimit ? "lewat" : debtRatio >= debtRatioLimit * 0.8 ? "waspada" : "aman";
  const t = TONE[tone];
  // Selisih ke batas, dalam rupiah per bulan.
  const room = (monthlyIncome * debtRatioLimit) / 100 - monthlyInstallment;

  let advice: string;
  if (!hasInstallment) advice = "Belum ada cicilan tetap per bulan. Utangmu dibayar bebas.";
  else if (!hasIncome) advice = "Catat pemasukan bulan ini supaya kelihatan seberapa berat cicilanmu.";
  else if (tone === "lewat")
    advice = `Lewat ${formatCurrency(-room)}/bln dari batas. Sebaiknya jangan ambil cicilan baru dulu.`;
  else if (tone === "waspada")
    advice = `Hampir sampai batas. Ruang cicilan tinggal ${formatCurrency(room)}/bln.`;
  else advice = `Masih aman. Ruang cicilan masih ${formatCurrency(room)}/bln sebelum lewat batas.`;

  return (
    <>
      <SectionTitle icon="credit-card">Beban cicilan</SectionTitle>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => nav.navigate("Debts")}
        accessibilityRole="button"
        accessibilityHint="Buka daftar cicilan dan utang"
      >
        <Card padding={SPACING.lg}>
          <View style={styles.head}>
            <View style={{ flex: 1 }}>
              <Text style={styles.caption}>Cicilan per bulan</Text>
              <Text style={styles.amount}>{formatCurrency(monthlyInstallment)}</Text>
            </View>
            {showRatio && (
              <View style={[styles.badge, { backgroundColor: t.bg }]}>
                <Text style={[styles.badgeText, { color: t.text }]}>{t.label}</Text>
              </View>
            )}
          </View>

          {showRatio && (
            <>
              <Text style={styles.sentence}>
                Makan <Text style={styles.strong}>{debtRatio.toFixed(0)}%</Text> dari pemasukan bulan
                ini ({formatCurrency(monthlyIncome)})
              </Text>
              <View style={styles.track}>
                <View
                  style={[styles.fill, { width: `${Math.min(debtRatio, 100)}%`, backgroundColor: t.bar }]}
                />
                <View style={[styles.marker, { left: `${Math.min(debtRatioLimit, 100)}%` }]} />
              </View>
              <Text style={styles.caption}>Batas sehat {debtRatioLimit}% dari pemasukan</Text>
            </>
          )}

          <Text style={[styles.advice, showRatio && tone !== "aman" && { color: t.text }]}>{advice}</Text>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Sisa utang <Text style={styles.strong}>{formatCurrency(totalDebt)}</Text>
            </Text>
            <MaterialIcons name="chevron-right" size={ICON_SIZES.md} color={COLORS.textMuted} />
          </View>
        </Card>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  amount: { fontSize: FONTS.xl, fontWeight: "800", color: COLORS.text, marginTop: 2 },
  badge: { paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: RADIUS.round },
  badgeText: { fontSize: FONTS.xs, fontWeight: "700" },
  sentence: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: SPACING.md },
  strong: { fontWeight: "700", color: COLORS.text },
  track: {
    height: 8,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.subtleBg,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
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
  caption: { fontSize: FONTS.xs, color: COLORS.textSecondary },
  advice: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: SPACING.md, lineHeight: 20 },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerText: { fontSize: FONTS.sm, color: COLORS.textSecondary },
});
