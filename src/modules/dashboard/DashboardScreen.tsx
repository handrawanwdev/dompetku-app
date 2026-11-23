import React from "react";
import { ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS, FONTS, SPACING } from "../../theme";
import { Text } from "../../components/common";
import { formatDate } from "../../utils/date";
import { useDashboardData } from "./hooks/useDashboardData";
import {
  NetWorthCard,
  DebtRatioCard,
  ObligationsCard,
  SummaryGrid,
  BudgetSplitCard,
  MainMenuCard,
  BirthdayCard,
  RemindersBell,
  RemindersModal,
  CashflowCalendarCard,
} from "./components";

export function DashboardScreen() {
  const d = useDashboardData();
  const reminderCount = d.urgentReminders.length + d.normalReminders.length;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.topbar}>
        <View>
          <Text style={styles.topbarSub}>{d.settings.displayName ? `Hai, ${d.settings.displayName}` : d.monthLabel}</Text>
          <Text style={styles.topbarDate}>{formatDate(d.now.toDate(), "DD MMM YYYY")}</Text>
        </View>
        <RemindersBell count={reminderCount} onPress={() => d.setShowReminders(true)} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Ucapan / pengingat ulang tahun (hanya muncul menjelang & di hari H) */}
        <BirthdayCard />

        {/* Net Worth + Income vs Expense bulan ini — angka paling dicari, paling atas */}
        <NetWorthCard summary={d.summary} />

        {/* Menu utama: pintasan ke halaman lain, bisa diatur */}
        <MainMenuCard />

        {/* Porsi tiap jenis uang keluar vs targetnya */}
        <BudgetSplitCard income={d.summary.monthlyIncome} byKind={d.summary.byKind} />

        {/* Cash / Savings / Investment / Debt — posisi keuangan sekilas */}
        <SummaryGrid summary={d.summary} />

        {/* Seberapa berat cicilan dibanding pemasukan */}
        <DebtRatioCard
          totalDebt={d.summary.totalDebt}
          debtRatio={d.summary.debtRatio}
          debtRatioLimit={d.settings.debtRatioLimit}
          monthlyInstallment={d.summary.monthlyInstallment}
          monthlyIncome={d.summary.monthlyIncome}
        />

        {/* Debt/Obligations detail + Upcoming payment */}
        <ObligationsCard
          urgent={d.urgentReminders}
          normal={d.normalReminders}
          onPress={() => d.setShowReminders(true)}
        />

        {/* Kalender masuk/keluar per hari, bulan berjalan */}
        <CashflowCalendarCard data={d.dailyTotals} />
      </ScrollView>

      <RemindersModal
        visible={d.showReminders}
        onClose={() => d.setShowReminders(false)}
        urgent={d.urgentReminders}
        normal={d.normalReminders}
        paid={d.paidReminders}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  topbar: {
    backgroundColor: COLORS.background,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  topbarSub: { fontSize: FONTS.md, fontWeight: "700", color: COLORS.text, marginTop: 1 },
  topbarDate: { fontSize: FONTS.xs, color: COLORS.textMuted },
  scroll: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxxl },
});
