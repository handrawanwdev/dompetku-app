import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "../../../components/common";
import { COLORS, FONTS, RADIUS, SPACING } from "../../../theme";
import type { FinancialSuggestionCard } from "../../../utils/finance";
import { SectionTitle } from "./SectionTitle";

export function SuggestionsCard({ items }: { items: FinancialSuggestionCard[] }) {
  return (
    <>
      <SectionTitle>💡 Saran Hari Ini</SectionTitle>
      <Card padding={SPACING.md}>
        {items.map((s, idx) => (
          <View
            key={idx}
            style={[
              styles.item,
              idx > 0 && {
                marginTop: SPACING.sm,
                borderTopWidth: 1,
                borderTopColor: COLORS.border,
                paddingTop: SPACING.sm,
              },
            ]}
          >
            <View style={[styles.icon, { backgroundColor: s.bg }]}>
              <Text style={{ fontSize: 16 }}>{s.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.text}>{s.text}</Text>
              <View style={[styles.tag, { backgroundColor: s.tagColor + "22" }]}>
                <Text style={[styles.tagText, { color: s.tagColor }]}>{s.tag}</Text>
              </View>
            </View>
          </View>
        ))}
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: "row", gap: SPACING.sm, alignItems: "flex-start" },
  icon: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  text: { fontSize: FONTS.sm, color: COLORS.text, lineHeight: 19 },
  tag: {
    alignSelf: "flex-start",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.round,
    marginTop: 3,
  },
  tagText: { fontSize: FONTS.xs, fontWeight: "700" },
});
