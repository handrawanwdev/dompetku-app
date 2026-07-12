import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ListRenderItemInfo,
  TextStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@realm/react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";

import { COLORS, FONTS, SPACING, RADIUS } from "../../../theme";
import {
  Card,
  Text,
  EmptyState,
  AmountDisplay,
} from "../../../components/common";
import { IncomeModel } from "../../../models/IncomeModel";
import { ExpenseModel } from "../../../models/ExpenseModel";
import { formatCurrency } from "../../../utils/currency";
import { formatDate } from "../../../utils/date";
import { CashflowStackParamList } from "../types";

export type { CashflowStackParamList };

type NavProp = NativeStackNavigationProp<CashflowStackParamList>;

type ActiveTab = "income" | "expense";

// ─── Month Options ────────────────────────────────────────────────────────────

interface MonthOption {
  label: string;
  yearMonth: string;
}

function buildMonthOptions(): MonthOption[] {
  const monthStart = dayjs().startOf("month");
  return [0, 1, 2, 3].map((offset) => {
    const d = monthStart.subtract(offset, "month");
    return { label: d.format("MMM YYYY"), yearMonth: d.format("YYYY-MM") };
  });
}

// ─── Category Maps ────────────────────────────────────────────────────────────

const INCOME_EMOJIS: Record<string, string> = {
  Gaji: "💼",
  Freelance: "💻",
  Bonus: "🎁",
  Investasi: "📈",
  Bisnis: "🏪",
  Lainnya: "💰",
};

const EXPENSE_EMOJIS: Record<string, string> = {
  "Makan & Minum": "🍜",
  Transportasi: "🚗",
  Belanja: "🛍️",
  Tagihan: "📄",
  Kesehatan: "🏥",
  Hiburan: "🎬",
  Pendidikan: "📚",
  Rumah: "🏠",
  Komunikasi: "📱",
  Lainnya: "💸",
};

const SOURCE_LABELS: Record<string, string> = {
  cash: "Kas",
  savings: "Tabungan",
};
const SOURCE_COLORS: Record<string, string> = {
  cash: COLORS.warning,
  savings: COLORS.savings,
};

// ─── Income Item ──────────────────────────────────────────────────────────────

function IncomeItem({
  item,
  onPress,
}: {
  item: IncomeModel;
  onPress: () => void;
}) {
  const emoji = INCOME_EMOJIS[item.category] ?? "💰";
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.itemContainer}
    >
      <View style={styles.itemLeft}>
        <View
          style={[
            styles.emojiContainer,
            { backgroundColor: COLORS.income + "15" },
          ]}
        >
          <Text style={styles.emoji}>{emoji}</Text>
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemCategory}>{item.category}</Text>
          <Text style={styles.itemDate}>{formatDate(item.date)}</Text>
          {item.note ? (
            <Text style={styles.itemNote} numberOfLines={1}>
              {item.note}
            </Text>
          ) : null}
        </View>
      </View>
      <Text style={[styles.itemAmount, { color: COLORS.income }]}>
        + {formatCurrency(item.amount)}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Expense Item ─────────────────────────────────────────────────────────────

function ExpenseItem({
  item,
  onPress,
}: {
  item: ExpenseModel;
  onPress: () => void;
}) {
  const emoji = EXPENSE_EMOJIS[item.category] ?? "💸";
  const sourceBg = SOURCE_COLORS[item.source] ?? COLORS.textMuted;
  const sourceLabel = SOURCE_LABELS[item.source] ?? item.source;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.itemContainer}
    >
      <View style={styles.itemLeft}>
        <View
          style={[
            styles.emojiContainer,
            { backgroundColor: COLORS.expense + "15" },
          ]}
        >
          <Text style={styles.emoji}>{emoji}</Text>
        </View>
        <View style={styles.itemInfo}>
          <View style={styles.itemTopRow}>
            <Text style={styles.itemCategory}>{item.category}</Text>
            <View
              style={[styles.sourceBadge, { backgroundColor: sourceBg + "22" }]}
            >
              <Text
                style={
                  [styles.sourceBadgeText, { color: sourceBg }] as TextStyle[]
                }
              >
                {sourceLabel}
              </Text>
            </View>
          </View>
          <Text style={styles.itemDate}>{formatDate(item.date)}</Text>
          {item.note ? (
            <Text style={styles.itemNote} numberOfLines={1}>
              {item.note}
            </Text>
          ) : null}
        </View>
      </View>
      <Text style={[styles.itemAmount, { color: COLORS.expense }]}>
        - {formatCurrency(item.amount)}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Month Filter ─────────────────────────────────────────────────────────────

function MonthFilter({
  options,
  selected,
  activeColor,
  onSelect,
}: {
  options: MonthOption[];
  selected: string;
  activeColor: string;
  onSelect: (ym: string) => void;
}) {
  return (
    <View style={styles.filterRow}>
      {options.map((opt) => {
        const isActive = opt.yearMonth === selected;
        return (
          <TouchableOpacity
            key={opt.yearMonth}
            onPress={() => onSelect(opt.yearMonth)}
            style={[
              styles.filterChip,
              isActive && {
                backgroundColor: activeColor,
                borderColor: activeColor,
              },
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterChipText,
                isActive && styles.filterChipTextActive,
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── Category Filter ──────────────────────────────────────────────────────────

const ALL_CATEGORY = "all";

interface CategoryOption {
  label: string;
  emoji: string;
}

function CategoryFilter({
  categories,
  selected,
  activeColor,
  onSelect,
}: {
  categories: CategoryOption[];
  selected: string;
  activeColor: string;
  onSelect: (name: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoryRow}
    >
      <TouchableOpacity
        onPress={() => onSelect(ALL_CATEGORY)}
        style={[
          styles.categoryChip,
          selected === ALL_CATEGORY && {
            backgroundColor: activeColor + "1A",
            borderColor: activeColor,
          },
        ]}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.categoryChipText,
            selected === ALL_CATEGORY && { color: activeColor, fontWeight: "700" },
          ]}
        >
          Semua
        </Text>
      </TouchableOpacity>
      {categories.map((cat) => {
        const isActive = cat.label === selected;
        return (
          <TouchableOpacity
            key={cat.label}
            onPress={() => onSelect(cat.label)}
            style={[
              styles.categoryChip,
              isActive && {
                backgroundColor: activeColor + "1A",
                borderColor: activeColor,
              },
            ]}
            activeOpacity={0.7}
          >
            <Text style={styles.categoryChipEmoji}>{cat.emoji}</Text>
            <Text
              style={[
                styles.categoryChipText,
                isActive && { color: activeColor, fontWeight: "700" },
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function CashflowScreen() {
  const navigation = useNavigation<NavProp>();
  const [activeTab, setActiveTab] = useState<ActiveTab>("income");
  const monthOptions = useMemo(() => buildMonthOptions(), []);
  const [incomeMonth, setIncomeMonth] = useState(monthOptions[0].yearMonth);
  const [expenseMonth, setExpenseMonth] = useState(monthOptions[0].yearMonth);
  const [incomeCategory, setIncomeCategory] = useState(ALL_CATEGORY);
  const [expenseCategory, setExpenseCategory] = useState(ALL_CATEGORY);

  const allIncomes = useQuery(IncomeModel);
  const allExpenses = useQuery(ExpenseModel);

  const incomeCategories = useMemo(
    () => Object.entries(INCOME_EMOJIS).map(([label, emoji]) => ({ label, emoji })),
    [],
  );
  const expenseCategories = useMemo(
    () => Object.entries(EXPENSE_EMOJIS).map(([label, emoji]) => ({ label, emoji })),
    [],
  );

  const filteredIncomes = useMemo(
    () =>
      (incomeCategory === ALL_CATEGORY
        ? allIncomes.filtered("date BEGINSWITH $0", incomeMonth)
        : allIncomes.filtered(
            "date BEGINSWITH $0 AND category == $1",
            incomeMonth,
            incomeCategory,
          )
      ).sorted("date", true),
    [allIncomes, incomeMonth, incomeCategory],
  );
  const filteredExpenses = useMemo(
    () =>
      (expenseCategory === ALL_CATEGORY
        ? allExpenses.filtered("date BEGINSWITH $0", expenseMonth)
        : allExpenses.filtered(
            "date BEGINSWITH $0 AND category == $1",
            expenseMonth,
            expenseCategory,
          )
      ).sorted("date", true),
    [allExpenses, expenseMonth, expenseCategory],
  );

  const incomeTotal = useMemo(
    () => filteredIncomes.reduce((s, i) => s + i.amount, 0),
    [filteredIncomes],
  );
  const expenseTotal = useMemo(
    () => filteredExpenses.reduce((s, e) => s + e.amount, 0),
    [filteredExpenses],
  );

  const renderIncome = useCallback(
    ({ item }: ListRenderItemInfo<IncomeModel>) => (
      <IncomeItem
        item={item}
        onPress={() =>
          navigation.navigate("IncomeForm", { id: item._id.toHexString() })
        }
      />
    ),
    [navigation],
  );

  const renderExpense = useCallback(
    ({ item }: ListRenderItemInfo<ExpenseModel>) => (
      <ExpenseItem
        item={item}
        onPress={() =>
          navigation.navigate("ExpenseForm", { id: item._id.toHexString() })
        }
      />
    ),
    [navigation],
  );

  const incomeKey = useCallback(
    (item: IncomeModel) => item._id.toHexString(),
    [],
  );
  const expenseKey = useCallback(
    (item: ExpenseModel) => item._id.toHexString(),
    [],
  );

  const accentColor = activeTab === "income" ? COLORS.income : COLORS.expense;
  const selectedMonth = activeTab === "income" ? incomeMonth : expenseMonth;
  const currentMonthLabel = monthOptions.find(
    (m) => m.yearMonth === selectedMonth,
  )?.label;
  const currentTotal = activeTab === "income" ? incomeTotal : expenseTotal;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeLabel}>Bulan Ini</Text>
          <Text
            style={[
              styles.headerBadgeNet,
              {
                color:
                  incomeTotal - expenseTotal >= 0
                    ? COLORS.income
                    : COLORS.expense,
              },
            ]}
          >
            {incomeTotal - expenseTotal >= 0 ? "+" : ""}
            {formatCurrency(incomeTotal - expenseTotal)}
          </Text>
        </View>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === "income" && {
              backgroundColor: COLORS.income + "15",
              borderBottomColor: COLORS.income,
            },
          ]}
          onPress={() => setActiveTab("income")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === "income" && {
                color: COLORS.income,
                fontWeight: "700",
              },
            ]}
          >
            💵 Pemasukan
          </Text>
          <Text style={[styles.tabAmount, { color: COLORS.income }]}>
            {formatCurrency(incomeTotal)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === "expense" && {
              backgroundColor: COLORS.expense + "15",
              borderBottomColor: COLORS.expense,
            },
          ]}
          onPress={() => setActiveTab("expense")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === "expense" && {
                color: COLORS.expense,
                fontWeight: "700",
              },
            ]}
          >
            🛒 Pengeluaran
          </Text>
          <Text style={[styles.tabAmount, { color: COLORS.expense }]}>
            {formatCurrency(expenseTotal)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Body (light bg, no gaps exposing the dark root behind it) */}
      <View style={styles.body}>
        {/* Summary Card */}
        <View style={styles.summaryWrapper}>
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>
              Total {activeTab === "income" ? "Pemasukan" : "Pengeluaran"}{" "}
              {currentMonthLabel}
            </Text>
            <AmountDisplay
              amount={currentTotal}
              size="xl"
              style={{ color: accentColor }}
            />
            <Text style={styles.summaryCount}>
              {activeTab === "income"
                ? filteredIncomes.length
                : filteredExpenses.length}{" "}
              transaksi
            </Text>
          </Card>
        </View>

        {/* Month Filter */}
        {activeTab === "income" ? (
          <MonthFilter
            options={monthOptions}
            selected={incomeMonth}
            activeColor={COLORS.income}
            onSelect={setIncomeMonth}
          />
        ) : (
          <MonthFilter
            options={monthOptions}
            selected={expenseMonth}
            activeColor={COLORS.expense}
            onSelect={setExpenseMonth}
          />
        )}

        {/* Category Filter */}
        <Text style={styles.categoryLabel}>Kategori</Text>
        {activeTab === "income" ? (
          <CategoryFilter
            categories={incomeCategories}
            selected={incomeCategory}
            activeColor={COLORS.income}
            onSelect={setIncomeCategory}
          />
        ) : (
          <CategoryFilter
            categories={expenseCategories}
            selected={expenseCategory}
            activeColor={COLORS.expense}
            onSelect={setExpenseCategory}
          />
        )}

        {/* List */}
        {activeTab === "income" ? (
          <FlatList
            data={filteredIncomes as unknown as IncomeModel[]}
            renderItem={renderIncome}
            keyExtractor={incomeKey}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <EmptyState
                emoji="💰"
                title="Belum ada pemasukan"
                subtitle="Tap + untuk menambah pemasukan"
              />
            }
          />
        ) : (
          <FlatList
            data={filteredExpenses as unknown as ExpenseModel[]}
            renderItem={renderExpense}
            keyExtractor={expenseKey}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <EmptyState
                emoji="💸"
                title="Belum ada pengeluaran"
                subtitle="Tap + untuk mencatat pengeluaran"
              />
            }
          />
        )}
      </View>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: accentColor }]}
        onPress={() =>
          activeTab === "income"
            ? navigation.navigate("IncomeForm", {})
            : navigation.navigate("ExpenseForm", {})
        }
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  body: { flex: 1, backgroundColor: COLORS.background },

  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  headerBadge: { alignItems: "flex-end" },
  headerBadgeLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  headerBadgeNet: { fontSize: FONTS.lg, fontWeight: "700" },

  tabBar: {
    flexDirection: "row",
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xs,
    gap: SPACING.xs,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: SPACING.sm,
    borderTopLeftRadius: RADIUS.md,
    borderTopRightRadius: RADIUS.md,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  tabLabel: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  tabAmount: { fontSize: FONTS.xs, marginTop: 2 },

  summaryWrapper: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  summaryCard: { padding: SPACING.lg },
  summaryLabel: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  summaryCount: {
    fontSize: FONTS.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },

  filterRow: {
    flexDirection: "row",
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  filterChip: {
    paddingVertical: 5,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipText: {
    fontSize: FONTS.xs,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  filterChipTextActive: { color: "#FFFFFF" },

  categoryLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xs,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: SPACING.lg,
    paddingRight: 0,
    gap: 6,
    marginBottom: SPACING.md,
  },
  categoryChip: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    gap: 3,
    paddingVertical: 4,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.round,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryChipEmoji: { fontSize: 11 },
  categoryChipText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },

  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 100,
    flexGrow: 1,
    backgroundColor: COLORS.background,
  },

  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  emojiContainer: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  emoji: { fontSize: 20 },
  itemInfo: { flex: 1 },
  itemTopRow: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  itemCategory: { fontSize: FONTS.md, fontWeight: "600", color: COLORS.text },
  sourceBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  sourceBadgeText: { fontSize: FONTS.xs, fontWeight: "600" },
  itemDate: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: 2 },
  itemNote: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 2 },
  itemAmount: { fontSize: FONTS.md, fontWeight: "700", marginLeft: SPACING.sm },

  fab: {
    position: "absolute",
    bottom: SPACING.xxl,
    right: SPACING.xl,
    width: 56,
    height: 56,
    borderRadius: RADIUS.round,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabIcon: {
    fontSize: 28,
    color: "#FFFFFF",
    lineHeight: 32,
    fontWeight: "400",
  },
});
