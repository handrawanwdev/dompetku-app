import React from "react";
import { View, Text, ScrollView, StyleSheet, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@realm/react";

import { COLORS, FONTS, SPACING } from "../../../theme";
import { Card } from "../../../components/common/Card";
import { ProgressBar } from "../../../components/common/ProgressBar";
import { BackButton } from "../../../components/common/BackButton";
import { IncomeModel } from "../../../models/IncomeModel";
import { ExpenseModel } from "../../../models/ExpenseModel";
import { DebtModel } from "../../../models/DebtModel";
import { InvestmentModel } from "../../../models/InvestmentModel";
import { PassiveIncomeModel } from "../../../models/PassiveIncomeModel";
import { formatCurrency, formatCompact } from "../../../utils/currency";
import { startOfMonth, endOfMonth } from "../../../utils/date";
import { calcFireProgress, toMonthlyAmount } from "../../../utils/finance";
import { SettingsStackParamList } from "./SettingsMainScreen";

type NavProp = NativeStackNavigationProp<
  SettingsStackParamList,
  "FireCalculatorScreen"
>;

interface Props {
  navigation: NavProp;
}

function BreakdownRow({
  label,
  value,
  isTotal,
  isSubtract,
}: {
  label: string;
  value: number;
  isTotal?: boolean;
  isSubtract?: boolean;
}) {
  return (
    <View style={[styles.breakdownRow, isTotal && styles.breakdownRowTotal]}>
      <Text
        style={[styles.breakdownLabel, isTotal && styles.breakdownLabelTotal]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.breakdownValue,
          isTotal && styles.breakdownValueTotal,
          isSubtract && { color: COLORS.expense },
        ]}
      >
        {isSubtract ? "− " : ""}
        {formatCurrency(value)}
      </Text>
    </View>
  );
}

export function FireCalculatorScreen({ navigation }: Props) {
  const monthStart = startOfMonth();
  const monthEnd = endOfMonth();

  const incomes = useQuery(IncomeModel).filtered(
    "date >= $0 AND date <= $1",
    monthStart,
    monthEnd,
  );
  const expenses = useQuery(ExpenseModel).filtered(
    "date >= $0 AND date <= $1",
    monthStart,
    monthEnd,
  );
  const debts = useQuery(DebtModel).filtered("isActive == true");
  const investments = useQuery(InvestmentModel).filtered("sold == false");
  const passiveIncomes = useQuery(PassiveIncomeModel);

  const monthlyIncome = incomes.reduce((s, i) => s + i.amount, 0);
  const monthlyExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const totalInvestment = investments.reduce(
    (s, i) => s + i.currentPrice * i.quantity,
    0,
  );
  const totalDebt = debts.reduce(
    (s, d) => s + d.monthlyInstallment * d.remainingMonth,
    0,
  );
  const monthlyDebtInstallment = debts.reduce(
    (s, d) => s + d.monthlyInstallment,
    0,
  );
  const monthlyPassiveIncome = passiveIncomes.reduce(
    (s, p) => s + toMonthlyAmount(p.amount, p.frequency),
    0,
  );

  const currentAmount = Math.max(0, totalInvestment - totalDebt);
  const fire = calcFireProgress(
    monthlyExpense,
    currentAmount,
    monthlyPassiveIncome,
  );

  const monthlySavingPace = monthlyIncome - monthlyExpense;
  const monthsToFire =
    monthlySavingPace > 0 && fire.remaining > 0
      ? Math.ceil(fire.remaining / monthlySavingPace)
      : null;

  const targetPassiveMonthly = monthlyExpense + monthlyDebtInstallment;
  const targetPassiveYearly = targetPassiveMonthly * 12;
  const passiveGapMonthly = Math.max(
    0,
    targetPassiveMonthly - monthlyPassiveIncome,
  );
  const passiveProgressPct =
    targetPassiveMonthly > 0
      ? Math.min(100, (monthlyPassiveIncome / targetPassiveMonthly) * 100)
      : 0;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} color={COLORS.text} />
        </View>

        <Text style={styles.title}>🔥 FIRE Calculator</Text>
        <Text style={styles.subtitle}>
          FIRE = Financial Independence, Retire Early. Intinya: berapa total
          kekayaan yang kamu butuhkan supaya bisa hidup selamanya dari hasil
          investasi, tanpa harus kerja lagi.
        </Text>

        <Card padding={SPACING.lg} style={styles.explainerCard}>
          <Text style={styles.explainerTitle}>💡 Cara kerjanya</Text>
          <Text style={styles.explainerText}>
            Kalau kamu investasikan sejumlah dana besar, tiap tahun kamu bisa
            tarik sekitar <Text style={styles.bold}>4%</Text> dari dana itu buat
            biaya hidup — tanpa bikin dananya habis, karena sisanya terus tumbuh
            dari hasil investasi. Kalau kamu udah punya{" "}
            <Text style={styles.bold}>passive income</Text> (dividen, sewa,
            dll), portofolio cuma perlu nutup{" "}
            <Text style={styles.bold}>sisa</Text> kebutuhan yang belum ke-cover.
            Dana sebesar itu disebut{" "}
            <Text style={styles.bold}>FIRE Number</Text>.
          </Text>
        </Card>

        <Card padding={SPACING.xl} style={styles.card}>
          <Text style={styles.label}>FIRE Number Kamu</Text>
          <Text style={styles.fireNumber}>
            {formatCurrency(fire.fireNumber)}
          </Text>
          <Text style={styles.formula}>
            Total dana biar bisa berhenti kerja selamanya
          </Text>

          <View style={styles.divider} />

          <BreakdownRow
            label="Pengeluaran per tahun"
            value={fire.annualExpense}
          />
          <BreakdownRow
            label="− Passive income per tahun"
            value={fire.annualPassiveIncome}
            isSubtract
          />
          <BreakdownRow
            label="= Kebutuhan bersih per tahun"
            value={fire.netAnnualNeed}
            isTotal
          />
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>
              × 25 (aturan tarik 4%/tahun)
            </Text>
          </View>
          <BreakdownRow label="= FIRE Number" value={fire.fireNumber} isTotal />

          <Text style={styles.explainerHint}>
            Angka 25 datang dari "aturan 4%": kalau tiap tahun kamu cuma tarik
            maksimal 4% dari investasi, dananya secara matematis gak akan habis
            walau dipakai puluhan tahun. Makin gede passive income kamu, makin
            kecil FIRE Number yang dibutuhin dari portofolio.
          </Text>
        </Card>

        <Card padding={SPACING.xl} style={styles.card}>
          <Text style={styles.label}>Target Passive Income / Bulan</Text>
          <Text style={styles.fireNumber}>
            {formatCurrency(targetPassiveMonthly)}
          </Text>
          <Text style={styles.formula}>
            Biar pengeluaran & cicilan hutang tetap kebayar tanpa perlu kerja
            lagi
          </Text>

          <View style={styles.divider} />

          <BreakdownRow label="Pengeluaran per bulan" value={monthlyExpense} />
          <BreakdownRow
            label="+ Cicilan hutang per bulan"
            value={monthlyDebtInstallment}
          />
          <BreakdownRow
            label="= Target Passive Income / bulan"
            value={targetPassiveMonthly}
            isTotal
          />
          <BreakdownRow
            label="× 12 = Target Passive Income / tahun"
            value={targetPassiveYearly}
            isTotal
          />

          <View style={styles.divider} />
          <Text style={styles.breakdownSectionTitle}>
            Progress Passive Income Kamu
          </Text>
          <ProgressBar
            progress={passiveProgressPct}
            color={COLORS.investment}
            height={10}
            style={{ marginTop: SPACING.sm }}
          />
          <View style={styles.row}>
            <View>
              <Text style={styles.rowLabel}>Sekarang</Text>
              <Text style={[styles.rowValue, { color: COLORS.income }]}>
                {formatCurrency(monthlyPassiveIncome)}/bln
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.rowLabel}>Masih Kurang</Text>
              <Text style={[styles.rowValue, { color: COLORS.expense }]}>
                {formatCurrency(passiveGapMonthly)}/bln
              </Text>
            </View>
          </View>
        </Card>

        <Card padding={SPACING.xl} style={styles.card}>
          <Text style={styles.label}>Progress Kamu Sekarang</Text>
          <Text style={styles.progressPct}>{fire.progressPct.toFixed(1)}%</Text>
          <ProgressBar
            progress={fire.progressPct}
            color={COLORS.savings}
            height={10}
            style={{ marginTop: SPACING.sm }}
          />
          <Text style={styles.formula}>menuju FIRE Number kamu</Text>

          <View style={styles.divider} />
          <Text style={styles.breakdownSectionTitle}>
            Dari mana angka "terkumpul" ini?
          </Text>
          <Text style={styles.explainerHint}>
            Cuma aset produktif yang dihitung — Tabungan (gak bertumbuh, buat
            dana darurat) dan Aset Fisik (laptop, motor, dll) gak masuk karena
            gak bisa "ditarik 4%-nya" buat biaya hidup selamanya.
          </Text>
          <BreakdownRow
            label="📈 Investasi (nilai sekarang)"
            value={totalInvestment}
          />
          <BreakdownRow label="💳 Sisa Hutang" value={totalDebt} isSubtract />
          <BreakdownRow
            label="= Total Terkumpul"
            value={fire.currentAmount}
            isTotal
          />

          <View style={styles.row}>
            <View>
              <Text style={styles.rowLabel}>Terkumpul</Text>
              <Text style={[styles.rowValue, { color: COLORS.income }]}>
                {formatCurrency(fire.currentAmount)}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.rowLabel}>Masih Butuh</Text>
              <Text style={[styles.rowValue, { color: COLORS.expense }]}>
                {formatCurrency(fire.remaining)}
              </Text>
            </View>
          </View>
        </Card>

        <Card padding={SPACING.xl} style={styles.card}>
          <Text style={styles.label}>Estimasi Waktu Menuju FIRE</Text>
          {monthsToFire !== null ? (
            <>
              <Text style={styles.fireNumber}>
                ~{Math.floor(monthsToFire / 12)} th {monthsToFire % 12} bln lagi
              </Text>
              <Text style={styles.formula}>
                Dengan kamu nabung sekarang: {formatCompact(monthlySavingPace)}
                /bulan (pemasukan − pengeluaran bulan ini)
              </Text>
            </>
          ) : monthlySavingPace <= 0 ? (
            <Text style={styles.explainerText}>
              Pengeluaran bulan ini ≥ pemasukan, jadi belum ada sisa buat nabung
              ke arah FIRE. Benerin cashflow dulu (kurangi pengeluaran atau
              tambah pemasukan) baru estimasi waktu bisa dihitung.
            </Text>
          ) : (
            <Text style={styles.explainerText}>
              🎉 FIRE Number kamu sudah tercapai!
            </Text>
          )}
        </Card>

        {monthlyExpense === 0 && (
          <Text style={styles.hint}>
            Belum ada catatan pengeluaran bulan ini — perhitungan FIRE Number
            butuh data pengeluaran bulanan.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
    marginLeft: -SPACING.sm,
  },
  title: { fontSize: FONTS.xxl, fontWeight: "800", color: COLORS.text },
  subtitle: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    lineHeight: 20,
  },

  explainerCard: { marginTop: SPACING.lg, backgroundColor: COLORS.subtleBg },
  explainerTitle: {
    fontSize: FONTS.sm,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  explainerText: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  bold: { fontWeight: "700", color: COLORS.text },

  card: { marginTop: SPACING.md },
  label: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  fireNumber: {
    fontSize: FONTS.xxxl,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 4,
  },
  formula: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  progressPct: {
    fontSize: FONTS.xxxl,
    fontWeight: "800",
    color: COLORS.savings,
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.lg,
  },
  rowLabel: { fontSize: FONTS.xs, color: COLORS.textMuted },
  rowValue: { fontSize: FONTS.md, fontWeight: "700", marginTop: 2 },
  hint: {
    fontSize: FONTS.xs,
    color: COLORS.warning,
    marginTop: SPACING.md,
    textAlign: "center",
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  breakdownSectionTitle: {
    fontSize: FONTS.xs,
    fontWeight: "700",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: SPACING.xs,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  breakdownRowTotal: {
    marginTop: SPACING.xs,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  breakdownLabel: { fontSize: FONTS.sm, color: COLORS.textSecondary },
  breakdownLabelTotal: { fontWeight: "700", color: COLORS.text },
  breakdownValue: { fontSize: FONTS.sm, color: COLORS.text, fontWeight: "600" },
  breakdownValueTotal: {
    fontSize: FONTS.md,
    fontWeight: "800",
    color: COLORS.primary,
  },
  explainerHint: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.md,
    lineHeight: 18,
  },
});
