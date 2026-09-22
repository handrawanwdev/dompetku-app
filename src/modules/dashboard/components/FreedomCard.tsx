import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Card, ProgressBar, Text } from "../../../components/common";
import { COLORS, FONTS, ICON_SIZES, SPACING } from "../../../theme";
import type { FinancialLevel, FinancialScoreResult } from "../../../utils/financialScore";

interface Props {
  score: FinancialScoreResult;
  level: FinancialLevel;
  nextLevel: FinancialLevel | null;
  scoreGap: number;
  onPress: () => void;
}

export function FreedomCard({ score, level, nextLevel, scoreGap, onPress }: Props) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <Card style={styles.card} padding={SPACING.xl}>
        <View style={styles.labelRow}>
          <MaterialIcons name="stars" size={ICON_SIZES.xs} color={COLORS.text} />
          <Text style={styles.label}>Financial Freedom</Text>
        </View>
        <View style={styles.levelRow}>
          <Text style={styles.levelText}>
            {level.icon} Level {level.level} — {level.name}
          </Text>
        </View>
        <View style={styles.scoreRow}>
          <Text style={styles.score}>{score.score}</Text>
          <Text style={styles.scoreMax}>/100</Text>
        </View>
        <ProgressBar
          progress={score.score}
          color={COLORS.primary}
          height={10}
          style={{ marginTop: SPACING.sm }}
        />
        {nextLevel ? (
          <Text style={styles.next}>
            Next: {nextLevel.icon} {nextLevel.name} — butuh +{scoreGap} skor
          </Text>
        ) : (
          <Text style={styles.next}>Level tertinggi tercapai 🎉</Text>
        )}
        <View style={styles.tapHintRow}>
          <Text style={styles.tapHint}>Tap untuk detail progress</Text>
          <MaterialIcons name="chevron-right" size={ICON_SIZES.xs} color={COLORS.textMuted} />
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: SPACING.sm, borderColor: COLORS.border },
  labelRow: { flexDirection: "row", alignItems: "center", gap: SPACING.xs, marginBottom: SPACING.sm },
  label: {
    fontSize: FONTS.sm,
    fontWeight: "700",
    color: COLORS.text,
  },
  levelRow: { marginBottom: SPACING.xs },
  levelText: { fontSize: FONTS.md, fontWeight: "600", color: COLORS.primary },
  scoreRow: { flexDirection: "row", alignItems: "flex-end" },
  score: { fontSize: FONTS.xxxl, fontWeight: "700", color: COLORS.text },
  scoreMax: {
    fontSize: FONTS.md,
    color: COLORS.textMuted,
    marginLeft: 2,
    marginBottom: 4,
  },
  next: { fontSize: FONTS.xs, color: COLORS.textSecondary, marginTop: SPACING.sm },
  tapHintRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: SPACING.md,
  },
  tapHint: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
  },
});
