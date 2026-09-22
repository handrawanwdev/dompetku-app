import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, ProgressBar, Text } from "../../../components/common";
import { COLORS, FONTS, SPACING } from "../../../theme";
import { formatCompact } from "../../../utils/currency";
import { formatDate } from "../../../utils/date";
import { SectionTitle } from "./SectionTitle";

interface Props {
  goal: {
    name: string;
    emoji: string;
    balance: number;
    target: number;
    deadline: string;
    progress: number;
  } | null;
}

export function GoalProgressCard({ goal }: Props) {
  if (!goal) return null;

  return (
    <>
      <SectionTitle icon="flag">Goal Terdekat</SectionTitle>
      <Card padding={SPACING.lg}>
        <View style={styles.row}>
          <Text style={styles.name}>{goal.emoji} {goal.name}</Text>
          <Text style={styles.progress}>{goal.progress.toFixed(0)}%</Text>
        </View>
        <ProgressBar progress={goal.progress} color={COLORS.savings} style={{ marginTop: SPACING.sm }} />
        <Text style={styles.hint}>
          {formatCompact(goal.balance)} / {formatCompact(goal.target)} • Target: {formatDate(goal.deadline)}
        </Text>
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { fontSize: FONTS.md, fontWeight: "700", color: COLORS.text },
  progress: { fontSize: FONTS.lg, fontWeight: "800", color: COLORS.savings },
  hint: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: SPACING.xs },
});
