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
import { MaterialIcons } from "@expo/vector-icons";
import dayjs from "dayjs";

import { COLORS, FONTS, ICON_SIZES, SPACING, RADIUS } from "../../../theme";
import {
  Card,
  Text,
  EmptyState,
  AmountDisplay,
  FAB,
} from "../../../components/common";
import { IncomeModel } from "../../../models/IncomeModel";
import { ExpenseModel } from "../../../models/ExpenseModel";
import { formatCurrency } from "../../../utils/currency";
import { formatDate } from "../../../utils/date";
import { useRootNavigation } from "../../../navigation/types";
import { KIND_META, SPEND_KINDS, isSpendKind, isKeptKind, type SpendKind } from "../../../utils/budget";
import { OPENING_CATEGORY, LOAN_CATEGORY, isLockedIncome } from "../../../utils/journal";


type ActiveTab = "income" | "expense";

// ─── Month Options ────────────────────────────────────────────────────────────

interface MonthOption {
  label: string;
  yearMonth: string;
}

function buildMonthOptions(): MonthOption[] {
  const monthStart = dayjs().startOf("month");
  return [0, 1, 2].map((offset) => {
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
  [OPENING_CATEGORY]: "🏦",
  [LOAN_CATEGORY]: "🤝",
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
  const meta = KIND_META[isSpendKind(item.kind) ? item.kind : "need"];
  const isSaving = isKeptKind(item.kind);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.itemContainer}
    >
      <View style={styles.itemLeft}>
        <View style={[styles.emojiContainer, { backgroundColor: meta.color + "1A" }]}>
          <MaterialIcons name={meta.icon} size={ICON_SIZES.lg} color={meta.color} />
        </View>
        <View style={styles.itemInfo}>
          <View style={styles.itemTopRow}>
            <Text style={styles.itemCategory}>{item.category}</Text>
            {item.source === "savings" && (
              <View style={[styles.sourceBadge, { backgroundColor: COLORS.saving + "1A" }]}>
                <Text style={[styles.sourceBadgeText, { color: COLORS.saving }] as TextStyle[]}>
                  dari tabungan
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.itemDate}>
            {meta.label} · {formatDate(item.date)}
          </Text>
          {item.note ? (
            <Text style={styles.itemNote} numberOfLines={1}>
              {item.note}
            </Text>
          ) : null}
        </View>
      </View>
      <Text style={[styles.itemAmount, { color: isSaving ? meta.color : COLORS.expense }]}>
        {isSaving ? "" : "- "}
        {formatCurrency(item.amount)}
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
      style={styles.categoryScroll}
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
            selected === ALL_CATEGORY && {
              color: activeColor,
              fontWeight: "700",
            },
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
            {cat.emoji ? <Text style={styles.categoryChipEmoji}>{cat.emoji}</Text> : null}
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
  const navigation = useRootNavigation();
  const [activeTab, setActiveTab] = useState<ActiveTab>("income");
  const monthOptions = useMemo(() => buildMonthOptions(), []);
  const [incomeMonth, setIncomeMonth] = useState(monthOptions[0].yearMonth);
  const [expenseMonth, setExpenseMonth] = useState(monthOptions[0].yearMonth);
  const [incomeCategory, setIncomeCategory] = useState(ALL_CATEGORY);
  const [expenseCategory, setExpenseCategory] = useState(ALL_CATEGORY);

  const allIncomes = useQuery(IncomeModel);
  const allExpenses = useQuery(ExpenseModel);

  const incomeCategories = useMemo(
    () =>
      Object.entries(INCOME_EMOJIS).map(([label, emoji]) => ({ label, emoji })),
    [],
  );
  const expenseCategories = useMemo(
    () => SPEND_KINDS.map((k) => ({ label: KIND_META[k].label, emoji: "" })),
    [],
  );
  const selectedKind: SpendKind | undefined = SPEND_KINDS.find(
    (k) => KIND_META[k].label === expenseCategory,
  );

  const filteredIncomes = useMemo(
    () =>
      (incomeCategory === ALL_CATEGORY
        ? allIncomes.filtered("date BEGINSWITH $0 AND isInternal == false", incomeMonth)
        : allIncomes.filtered(
            "date BEGINSWITH $0 AND isInternal == false AND category == $1",
            incomeMonth,
            incomeCategory,
          )
      ).sorted("date", true),
    [allIncomes, incomeMonth, incomeCategory],
  );
  const filteredExpenses = useMemo(
    () =>
      (selectedKind
        ? allExpenses.filtered(
            "date BEGINSWITH $0 AND isInternal == false AND kind == $1",
            expenseMonth,
            selectedKind,
          )
        : allExpenses.filtered("date BEGINSWITH $0 AND isInternal == false", expenseMonth)
      ).sorted("date", true),
    [allExpenses, expenseMonth, selectedKind],
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
        onPress={() => {
          // Saldo awal & pinjaman diubah dari sumbernya, bukan form pemasukan.
          if (isLockedIncome(item)) return;
          navigation.navigate("IncomeForm", { id: item._id.toHexString() });
        }}
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
          <View style={styles.tabLabelRow}>
            <MaterialIcons
              name="arrow-downward"
              size={ICON_SIZES.xs}
              color={activeTab === "income" ? COLORS.income : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === "income" && {
                  color: COLORS.income,
                  fontWeight: "700",
                },
              ]}
            >
              Pemasukan
            </Text>
          </View>
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
          <View style={styles.tabLabelRow}>
            <MaterialIcons
              name="arrow-upward"
              size={ICON_SIZES.xs}
              color={activeTab === "expense" ? COLORS.expense : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === "expense" && {
                  color: COLORS.expense,
                  fontWeight: "700",
                },
              ]}
            >
              Uang keluar
            </Text>
          </View>
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
              Total {activeTab === "income" ? "pemasukan" : "uang keluar"}{" "}
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
        <Text style={styles.categoryLabel}>{activeTab === "income" ? "Kategori" : "Jenis"}</Text>
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
                subtitle="Gajian atau dapat uang? Catat lewat tombol +."
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
                title="Belum ada uang keluar"
                subtitle="Catat kebutuhan, keinginan, atau tabungan lewat tombol +."
              />
            }
          />
        )}
      </View>

      {/* FAB */}
      <FAB
        color={accentColor}
        onPress={() =>
          activeTab === "income"
            ? navigation.navigate("IncomeForm", {})
            : navigation.navigate("ExpenseForm", { kind: selectedKind })
        }
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  body: { flex: 1, backgroundColor: COLORS.background },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  headerBadge: { alignItems: "flex-start" },
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
  tabLabelRow: { flexDirection: "row", alignItems: "center", gap: 4 },
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
  filterChipTextActive: { color: COLORS.onPrimary },

  categoryLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xs,
  },
  categoryScroll: { flexGrow: 0, flexShrink: 0 },
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
});
