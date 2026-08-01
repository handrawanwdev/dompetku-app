import React from "react";
import { ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS, FONTS, SPACING } from "../../theme";
import { Text } from "../../components/common";
import { formatDate } from "../../utils/date";
import { useDashboardData } from "./hooks/useDashboardData";
import {
  FreedomCard,
  AiCard,
  NetWorthCard,
  DebtRatioCard,
  RemindersBell,
  RemindersModal,
  NeracaCard,
  Cashflow30dCard,
  Cashflow12mCard,
  RoadmapCard,
  SuggestionsCard,
  LevelDetailModal,
  AiDetailModal,
} from "./components";

export function DashboardScreen() {
  const d = useDashboardData();
  const reminderCount = d.urgentReminders.length + d.normalReminders.length;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.topbar}>
        <View>
          <Text style={styles.topbarSub}>{d.monthLabel}</Text>
          <Text style={styles.topbarDate}>{formatDate(d.now.toDate(), "DD MMM YYYY")}</Text>
        </View>
        <RemindersBell count={reminderCount} onPress={() => d.setShowReminders(true)} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <FreedomCard
          score={d.financialScore}
          level={d.financialLevel}
          nextLevel={d.nextFinancialLevel}
          scoreGap={d.scoreGap}
          onPress={() => d.setShowLevelDetail(true)}
        />

        <AiCard report={d.aiReport} onPress={() => d.setShowAiDetail(true)} />

        <NetWorthCard summary={d.summary} />

        <DebtRatioCard
          totalDebt={d.summary.totalDebt}
          debtRatio={d.summary.debtRatio}
          debtRatioLimit={d.settings.debtRatioLimit}
          monthlyInstallment={d.summary.monthlyInstallment}
        />

        <RoadmapCard items={d.roadmap} />

        <SuggestionsCard items={d.suggestions} />

        <Cashflow30dCard data={d.cashflow30d} />
        <Cashflow12mCard data={d.cashflow12m} />

        <NeracaCard
          totalIncomeAllTime={d.neraca.totalIncomeAllTime}
          cash={d.summary.cash}
          totalSavings={d.summary.totalSavings}
          investmentCost={d.neraca.investmentCost}
          totalAssets={d.summary.totalAssets}
          totalAset={d.neraca.totalAset}
          totalDebt={d.summary.totalDebt}
          kekayaanBersih={d.neraca.kekayaanBersih}
        />
      </ScrollView>

      <LevelDetailModal
        visible={d.showLevelDetail}
        onClose={() => d.setShowLevelDetail(false)}
        level={d.financialLevel}
        checklist={d.levelChecklist}
      />

      <RemindersModal
        visible={d.showReminders}
        onClose={() => d.setShowReminders(false)}
        urgent={d.urgentReminders}
        normal={d.normalReminders}
        paid={d.paidReminders}
      />

      <AiDetailModal
        visible={d.showAiDetail}
        onClose={() => d.setShowAiDetail(false)}
        report={d.aiReport}
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
