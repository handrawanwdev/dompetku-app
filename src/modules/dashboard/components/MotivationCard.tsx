import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Card, Text } from "../../../components/common";
import { COLORS, FONTS, ICON_SIZES, RADIUS, SPACING } from "../../../theme";
import { getScheduledMotivation } from "../../../utils/motivation";
import { QUOTE_CATEGORY_LABEL, type QuoteCategory } from "../../../data/motivationQuotes";
import type { FinancialScoreResult } from "../../../utils/financialScore";

interface Props {
  score: FinancialScoreResult;
}

const CATEGORY_ICON: Record<QuoteCategory, { name: keyof typeof MaterialIcons.glyphMap; color: string }> = {
  money_mindset: { name: "psychology", color: COLORS.primary },
  debt_freedom: { name: "link-off", color: COLORS.debt },
  budgeting: { name: "pie-chart", color: COLORS.warning },
  saving: { name: "savings", color: COLORS.savings },
  investment: { name: "trending-up", color: COLORS.investment },
  goal_achievement: { name: "flag", color: COLORS.income },
  daily_discipline: { name: "repeat", color: COLORS.secondary },
};

// QUOTE_CATEGORY_LABEL is "<emoji> <text>" (for push-notification titles, which
// can't render vector icons) — strip the emoji here since the card renders its
// own icon badge instead.
function categoryTitle(category: QuoteCategory): string {
  return QUOTE_CATEGORY_LABEL[category].replace(/^\S+\s+/, "");
}

/**
 * Shows the system-picked motivational quote for the current fixed slot
 * (pagi/siang/sore/malam) — same category + quote everywhere (dashboard,
 * push notification) until the next slot starts. Deliberately not
 * user-changeable: see getScheduledMotivation for why.
 */
export function MotivationCard({ score }: Props) {
  const motivation = useMemo(() => getScheduledMotivation(score), [score]);
  const icon = CATEGORY_ICON[motivation.category];

  return (
    <Card style={styles.card} padding={SPACING.xl}>
      <View style={styles.header}>
        <View style={[styles.iconBadge, { backgroundColor: icon.color + "18" }]}>
          <MaterialIcons name={icon.name} size={ICON_SIZES.sm} color={icon.color} />
        </View>
        <Text style={styles.title}>{categoryTitle(motivation.category)}</Text>
      </View>
      <Text style={styles.quote}>"{motivation.quote}"</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: SPACING.sm, borderColor: COLORS.border },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.round,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: FONTS.md, fontWeight: "700", color: COLORS.text },
  quote: {
    fontSize: FONTS.md,
    fontWeight: "600",
    color: COLORS.text,
    lineHeight: 22,
    fontStyle: "italic",
  },
});
