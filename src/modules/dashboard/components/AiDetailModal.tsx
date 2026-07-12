import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "../../../components/common";
import { COLORS, FONTS, RADIUS, SPACING } from "../../../theme";
import { formatCompact } from "../../../utils/currency";
import type { AIFinancialCard } from "../../../ai/FinancialAdvisorService";

interface Props {
  visible: boolean;
  onClose: () => void;
  report: AIFinancialCard;
}

export function AiDetailModal({ visible, onClose, report }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>
            ✨ Asisten Finansial — Analisa Lengkap
          </Text>
          <Text style={styles.subtitle}>
            Financial Health: {report.healthLabel} · Score{" "}
            {report.profile.score}/100
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Kenapa Score Kamu Segini?</Text>
            {report.scoreExplanation.positives.map((c) => (
              <View key={c.label} style={styles.checklistRow}>
                <Text style={[styles.checklistIcon, { color: COLORS.income }]}>
                  ✓
                </Text>
                <Text style={styles.checklistLabel}>
                  {c.label}{" "}
                  <Text style={{ color: COLORS.income, fontWeight: "700" }}>
                    +{c.points}
                  </Text>
                </Text>
              </View>
            ))}
            {report.scoreExplanation.negatives.map((c) => (
              <View key={c.label} style={styles.checklistRow}>
                <Text style={[styles.checklistIcon, { color: COLORS.warning }]}>
                  ⚠
                </Text>
                <Text style={styles.checklistLabel}>
                  {c.label}{" "}
                  <Text style={{ color: COLORS.textMuted }}>
                    ({c.points} poin)
                  </Text>
                </Text>
              </View>
            ))}

            <Text style={styles.sectionTitle}>Insight</Text>
            {report.insights.map((insight) => (
              <View key={insight.category} style={styles.insightCard}>
                <Text style={styles.insightTitle}>
                  {insight.icon} {insight.title}
                </Text>
                <Text style={styles.insightDesc}>{insight.description}</Text>
              </View>
            ))}

            {report.recommendations.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Action Plan</Text>
                {report.recommendations.map((plan) => (
                  <View key={plan.category} style={styles.insightCard}>
                    <Text style={styles.insightTitle}>{plan.problem}</Text>
                    {plan.steps.map((step) => (
                      <Text key={step.order} style={styles.insightDesc}>
                        {step.order}. {step.action}
                        {step.target ? ` — Target: ${step.target}` : ""}
                      </Text>
                    ))}
                  </View>
                ))}
              </>
            )}

            {report.smartSuggestion && (
              <>
                <Text style={styles.sectionTitle}>
                  Simulasi: {report.smartSuggestion.label}
                </Text>
                <View style={styles.insightCard}>
                  <Text style={styles.insightDesc}>
                    Dengan kamu sekarang (
                    {formatCompact(report.smartSuggestion.currentMonthlyAmount)}
                    /bulan) → target tercapai{" "}
                    {report.smartSuggestion.currentMonths} bulan lagi.
                  </Text>
                  <Text style={styles.insightDesc}>
                    Kalau naikkan ke{" "}
                    {formatCompact(report.smartSuggestion.fasterMonthlyAmount)}
                    /bulan → target tercapai{" "}
                    {report.smartSuggestion.fasterMonths} bulan lagi.
                  </Text>
                </View>
              </>
            )}
          </ScrollView>

          <TouchableOpacity style={styles.close} onPress={onClose}>
            <Text style={styles.closeText}>Tutup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
    maxHeight: "85%",
  },
  title: { fontSize: FONTS.xl, fontWeight: "700", color: COLORS.text },
  subtitle: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.md,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xs,
  },
  checklistRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.sm,
  },
  checklistIcon: { fontSize: FONTS.lg, fontWeight: "700", width: 28 },
  checklistLabel: { fontSize: FONTS.md, color: COLORS.textSecondary },
  insightCard: {
    backgroundColor: COLORS.subtleBg,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  insightTitle: {
    fontSize: FONTS.sm,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  insightDesc: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    lineHeight: 19,
    marginTop: 2,
  },
  close: {
    marginTop: SPACING.lg,
    paddingVertical: SPACING.md,
    alignItems: "center",
    backgroundColor: COLORS.subtleBg,
    borderRadius: RADIUS.md,
  },
  closeText: { fontSize: FONTS.md, fontWeight: "600", color: COLORS.text },
});
