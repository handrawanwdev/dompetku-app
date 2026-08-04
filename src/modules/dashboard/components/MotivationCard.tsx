import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "../../../components/common";
import { COLORS, FONTS, SPACING } from "../../../theme";
import { getScheduledMotivation } from "../../../utils/motivation";
import { QUOTE_CATEGORY_LABEL } from "../../../data/motivationQuotes";
import type { FinancialScoreResult } from "../../../utils/financialScore";

interface Props {
  score: FinancialScoreResult;
}

/**
 * Shows the system-picked motivational quote for the current 6-hour window
 * — same category + quote everywhere (dashboard, push notification) until
 * the window rolls over. Deliberately not user-changeable: see
 * getScheduledMotivation for why.
 */
export function MotivationCard({ score }: Props) {
  const motivation = useMemo(() => getScheduledMotivation(score), [score]);

  return (
    <Card style={styles.card} padding={SPACING.xl}>
      <View style={styles.header}>
        <Text style={styles.title}>🔥 {QUOTE_CATEGORY_LABEL[motivation.category]}</Text>
      </View>
      <Text style={styles.quote}>"{motivation.quote}"</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: SPACING.sm, borderColor: COLORS.border },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
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
