import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, ProgressBar, Text } from "../../../components/common";
import { COLORS, FONTS, SPACING } from "../../../theme";
import { formatCompact } from "../../../utils/currency";
import { formatDate } from "../../../utils/date";
import { calcGoalProgress } from "../../../utils/finance";
import type { GoalModel } from "../../../models/GoalModel";
import type { SavingModel } from "../../../models/SavingModel";
import { SectionTitle } from "./SectionTitle";
import Realm from "realm";

interface Props {
  goals: Realm.Results<GoalModel>;
  savings: Realm.Results<SavingModel>;
}

export function GoalsSection({ goals, savings }: Props) {
  if (goals.length === 0) return null;

  return (
    <>
      <SectionTitle>🎯 Financial Goals</SectionTitle>
      {goals.slice(0, 3).map((goal) => {
        const linked = savings.find((s) => s._id.toHexString() === goal.savingId);
        const balance = linked?.balance ?? 0;
        const progress = calcGoalProgress(balance, goal.target);
        return (
          <Card
            key={goal._id.toHexString()}
            style={{ marginBottom: SPACING.sm }}
            padding={SPACING.lg}
          >
            <View style={styles.header}>
              <Text style={styles.emoji}>{goal.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{goal.name}</Text>
                <Text style={styles.date}>Target: {formatDate(goal.deadline)}</Text>
              </View>
              <Text style={styles.percent}>{progress.toFixed(0)}%</Text>
            </View>
            <ProgressBar
              progress={progress}
              color={COLORS.primary}
              style={{ marginTop: SPACING.sm }}
            />
            <View style={styles.amounts}>
              <Text style={styles.balance}>{formatCompact(balance)}</Text>
              <Text style={styles.target}>/ {formatCompact(goal.target)}</Text>
            </View>
          </Card>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  emoji: { fontSize: 24 },
  name: { fontSize: FONTS.md, fontWeight: "600", color: COLORS.text },
  date: { fontSize: FONTS.xs, color: COLORS.textSecondary },
  percent: { fontSize: FONTS.lg, fontWeight: "700", color: COLORS.primary },
  amounts: { flexDirection: "row", marginTop: SPACING.xs },
  balance: { fontSize: FONTS.sm, fontWeight: "600", color: COLORS.primary },
  target: { fontSize: FONTS.sm, color: COLORS.textMuted },
});
