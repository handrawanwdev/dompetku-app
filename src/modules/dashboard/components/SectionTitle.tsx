import React from "react";
import { StyleSheet } from "react-native";
import { Text } from "../../../components/common";
import { COLORS, FONTS, SPACING } from "../../../theme";

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: FONTS.xs,
    fontWeight: "700",
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
});
