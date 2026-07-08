import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQuery } from "@realm/react";

import { SavingModel } from "../../../models";
import { COLORS, FONTS, SPACING, RADIUS } from "../../../theme";
import { formatCurrency } from "../../../utils/currency";
import { calcGoalProgress } from "../../../utils/finance";
import { ProgressBar } from "../../../components/common/ProgressBar";
import { EmptyState } from "../../../components/common/EmptyState";

export type SavingsStackParamList = {
  SavingsList: undefined;
  SavingsForm: { id?: string };
  SavingsDetail: { id: string };
};

type Props = NativeStackScreenProps<SavingsStackParamList, "SavingsList">;

export function SavingsListScreen({ navigation }: Props) {
  const savings = useQuery(SavingModel);
  const totalBalance = savings.reduce((sum, s) => sum + s.balance, 0);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <FlatList
        style={styles.body}
        data={[...savings]}
        keyExtractor={(item) => item._id.toHexString()}
        contentContainerStyle={[
          styles.list,
          savings.length === 0 && styles.listEmpty,
        ]}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Tabungan</Text>
              <Text style={styles.summaryAmount}>
                {formatCurrency(totalBalance)}
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            emoji="💰"
            title="Belum ada tabungan"
            subtitle="Tap tombol + untuk menambah tabungan baru"
          />
        }
        renderItem={({ item }) => {
          const progress = calcGoalProgress(item.balance, item.target);
          const isComplete = progress >= 100;
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate("SavingsDetail", {
                  id: item._id.toHexString(),
                })
              }
              activeOpacity={0.75}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.emoji}>{item.emoji}</Text>
                <View style={styles.cardTitleRow}>
                  <Text style={styles.cardName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text
                    style={[
                      styles.percentage,
                      isComplete && styles.percentageDone,
                    ]}
                  >
                    {progress.toFixed(1)}%
                  </Text>
                </View>
              </View>

              <ProgressBar
                progress={progress}
                color={isComplete ? COLORS.income : COLORS.savings}
                height={6}
                style={styles.progressBar}
              />

              <View style={styles.amountRow}>
                <Text style={styles.balance}>
                  {formatCurrency(item.balance)}
                </Text>
                <Text style={styles.target}>
                  / {formatCurrency(item.target)}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("SavingsForm", {})}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  body: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.background,
    marginHorizontal: -SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  summaryCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryLabel: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  summaryAmount: {
    fontSize: FONTS.xxl,
    fontWeight: "700",
    color: COLORS.savings,
  },
  list: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 100,
  },
  listEmpty: {
    flex: 1,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  emoji: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  cardTitleRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardName: {
    flex: 1,
    fontSize: FONTS.lg,
    fontWeight: "600",
    color: COLORS.text,
  },
  percentage: {
    fontSize: FONTS.md,
    fontWeight: "600",
    color: COLORS.savings,
    marginLeft: SPACING.sm,
  },
  percentageDone: {
    color: COLORS.income,
  },
  progressBar: {
    marginBottom: SPACING.sm,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  balance: {
    fontSize: FONTS.md,
    fontWeight: "600",
    color: COLORS.text,
  },
  target: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  fab: {
    position: "absolute",
    bottom: SPACING.xxl,
    right: SPACING.xxl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabText: {
    fontSize: 28,
    fontWeight: "400",
    color: "#FFFFFF",
    lineHeight: 32,
  },
});
