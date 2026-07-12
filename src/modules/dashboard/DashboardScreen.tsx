import React from "react";
import { ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS, FONTS, SPACING } from "../../theme";
import { Text } from "../../components/common";
import { formatDate } from "../../utils/date";
import { useDashboardData } from "./hooks/useDashboardData";
import {
  SectionTitle,
  FreedomCard,
  HealthBadges,
  AiCard,
  NetWorthCard,
  NetWorthTrackerCard,
  EmergencyFundCard,
  QuickActions,
  SummaryGrid,
  TopExpensesCard,
  DebtRatioCard,
  GoalsSection,
  RemindersSection,
  NeracaCard,
  Cashflow7dCard,
  Cashflow12mCard,
  RoadmapCard,
  ProjectionGrid,
  SuggestionsCard,
  LevelDetailModal,
  EmergencyPickerModal,
  AiDetailModal,
} from "./components";

export function DashboardScreen() {
  const d = useDashboardData();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.topbar}>
        <Text style={styles.topbarSub}>{d.monthLabel}</Text>
        <Text style={styles.topbarDate}>{formatDate(d.now.toDate(), "DD MMM YYYY")}</Text>
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

        <HealthBadges
          savingsRatePct={d.summary.savingsRate}
          cashflow={d.summary.cashflow}
          totalSavings={d.summary.totalSavings}
        />

        <AiCard report={d.aiReport} onPress={() => d.setShowAiDetail(true)} />

        <NetWorthCard summary={d.summary} />

        <NetWorthTrackerCard series={d.netWorthSeries} growthPct={d.netWorthGrowthPct} />

        <EmergencyFundCard
          saving={d.emergencyFundSaving}
          info={d.emergencyFundInfo}
          onPress={() => d.setShowEmergencyPicker(true)}
        />

        <SectionTitle>⚡ Aksi Cepat</SectionTitle>
        <QuickActions />

        <SummaryGrid summary={d.summary} />

        <TopExpensesCard
          categories={d.topExpenseCategories}
          monthlyExpense={d.summary.monthlyExpense}
        />

        <DebtRatioCard
          totalDebt={d.summary.totalDebt}
          debtRatio={d.summary.debtRatio}
          debtRatioLimit={d.settings.debtRatioLimit}
          monthlyInstallment={d.summary.monthlyInstallment}
        />

        <GoalsSection goals={d.goals} savings={d.savings} />

        <RemindersSection
          urgent={d.urgentReminders}
          normal={d.normalReminders}
          paid={d.paidReminders}
        />

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

        <Cashflow7dCard data={d.cashflow7d} />
        <Cashflow12mCard data={d.cashflow12m} />

        <RoadmapCard items={d.roadmap} />

        <ProjectionGrid projection={d.projection} />

        <SuggestionsCard items={d.suggestions} />
      </ScrollView>

      <LevelDetailModal
        visible={d.showLevelDetail}
        onClose={() => d.setShowLevelDetail(false)}
        level={d.financialLevel}
        checklist={d.levelChecklist}
      />

      <EmergencyPickerModal
        visible={d.showEmergencyPicker}
        onClose={() => d.setShowEmergencyPicker(false)}
        savings={d.savings}
        selectedId={d.settings.emergencyFundSavingId}
        onSelect={(id) => {
          d.updateSettings({ emergencyFundSavingId: id });
          d.setShowEmergencyPicker(false);
        }}
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
