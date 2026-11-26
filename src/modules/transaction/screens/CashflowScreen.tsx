import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  SectionList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SectionListRenderItemInfo,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@realm/react";
import { MaterialIcons } from "@expo/vector-icons";
import dayjs from "dayjs";

import { COLORS, FONTS, ICON_SIZES, SPACING, RADIUS, SHADOWS } from "../../../theme";
import { Text, EmptyState, FAB, TxRow, DayHeader, groupByDate, type DaySection } from "../../../components/common";
import { IncomeModel } from "../../../models/IncomeModel";
import { ExpenseModel } from "../../../models/ExpenseModel";
import { CategoryModel } from "../../../models/CategoryModel";
import { AccountModel } from "../../../models/AccountModel";
import { formatCurrency } from "../../../utils/currency";
import { useRootNavigation } from "../../../navigation/types";
import { KIND_META, SPEND_KINDS, isSpendKind, isKeptKind, type SpendKind } from "../../../utils/budget";
import {
  OPENING_CATEGORY,
  LOAN_CATEGORY,
  EXCLUDE_NON_EARNED,
  isLockedIncome,
} from "../../../utils/journal";

type ActiveTab = "income" | "expense";

const ALL = "all";

// Emoji cadangan kalau kategori pemasukan tidak ada di daftar Kategori.
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

// Sama dengan Dashboard & kalender: hasil kerja/usaha dikurangi uang yang benar-benar terpakai.
const EARNED_FILTER = `date BEGINSWITH $0 AND isInternal == false AND ${EXCLUDE_NON_EARNED}`;
const SPENT_FILTER = 'date BEGINSWITH $0 AND isInternal == false AND kind != "saving" AND kind != "invest"';

// ─── Filter chips ─────────────────────────────────────────────────────────────

interface ChipOption {
  key: string;
  label: string;
  emoji?: string;
  color?: string;
}

function FilterChips({
  options,
  selected,
  accent,
  onSelect,
}: {
  options: ChipOption[];
  selected: string;
  accent: string;
  onSelect: (key: string) => void;
}) {
  const all: ChipOption[] = [{ key: ALL, label: "Semua" }, ...options];
  return (
    <ScrollView
      horizontal
      style={styles.chipScroll}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipRow}
    >
      {all.map((opt) => {
        const active = opt.key === selected;
        return (
          <TouchableOpacity
            key={opt.key}
            onPress={() => onSelect(opt.key)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[styles.chip, active && { backgroundColor: accent, borderColor: accent }]}
          >
            {opt.emoji ? <Text style={styles.chipEmoji}>{opt.emoji}</Text> : null}
            {!opt.emoji && opt.color ? (
              <View style={[styles.chipDot, { backgroundColor: active ? COLORS.onPrimary : opt.color }]} />
            ) : null}
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

type Item = { kind: "income"; data: IncomeModel } | { kind: "expense"; data: ExpenseModel };

type Section = DaySection<Item>;

export function CashflowScreen() {
  const navigation = useRootNavigation();
  const thisMonth = dayjs().startOf("month");
  const [activeTab, setActiveTab] = useState<ActiveTab>("expense");
  const [month, setMonth] = useState(thisMonth);
  const [incomeFilter, setIncomeFilter] = useState(ALL);
  const [expenseFilter, setExpenseFilter] = useState(ALL);

  const ym = month.format("YYYY-MM");
  const isCurrentMonth = month.isSame(thisMonth, "month");

  const allIncomes = useQuery(IncomeModel);
  const allExpenses = useQuery(ExpenseModel);
  const categories = useQuery(CategoryModel);
  const accounts = useQuery(AccountModel);
  const accountName = useMemo(() => {
    const map: Record<string, string> = {};
    for (const a of accounts) map[a._id.toHexString()] = a.name;
    return map;
  }, [accounts]);

  const incomeEmoji = useMemo(() => {
    const map: Record<string, string> = { ...INCOME_EMOJIS };
    for (const c of categories.filtered('type == "income"')) map[c.name] = c.emoji;
    return map;
  }, [categories]);

  const monthIncomes = useMemo(
    () => allIncomes.filtered("date BEGINSWITH $0 AND isInternal == false", ym).sorted([["date", true], ["createdAt", true]]),
    [allIncomes, ym],
  );
  const monthExpenses = useMemo(
    () => allExpenses.filtered("date BEGINSWITH $0 AND isInternal == false", ym).sorted([["date", true], ["createdAt", true]]),
    [allExpenses, ym],
  );

  const incomeTotal = useMemo(() => monthIncomes.reduce((s, i) => s + i.amount, 0), [monthIncomes]);
  const expenseTotal = useMemo(() => monthExpenses.reduce((s, e) => s + e.amount, 0), [monthExpenses]);
  const net = useMemo(
    () =>
      allIncomes.filtered(EARNED_FILTER, ym).reduce((s, i) => s + i.amount, 0) -
      allExpenses.filtered(SPENT_FILTER, ym).reduce((s, e) => s + e.amount, 0),
    [allIncomes, allExpenses, ym],
  );

  // Chip hanya untuk kategori/jenis yang ada di bulan ini, urut dari total terbesar.
  const incomeOptions = useMemo<ChipOption[]>(() => {
    const totals = new Map<string, number>();
    for (const i of monthIncomes) totals.set(i.category, (totals.get(i.category) ?? 0) + i.amount);
    return [...totals.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => ({ key: name, label: name, emoji: incomeEmoji[name] ?? "💰" }));
  }, [monthIncomes, incomeEmoji]);

  const expenseOptions = useMemo<ChipOption[]>(() => {
    const present = new Set<string>();
    for (const e of monthExpenses) present.add(isSpendKind(e.kind) ? e.kind : "need");
    return SPEND_KINDS.filter((k) => present.has(k)).map((k) => ({
      key: k,
      label: KIND_META[k].label,
      color: KIND_META[k].color,
    }));
  }, [monthExpenses]);

  const isIncome = activeTab === "income";
  const filter = isIncome ? incomeFilter : expenseFilter;
  const selectedKind = !isIncome && filter !== ALL ? (filter as SpendKind) : undefined;

  const items = useMemo<Item[]>(() => {
    if (isIncome) {
      const src = incomeFilter === ALL ? monthIncomes : monthIncomes.filtered("category == $0", incomeFilter);
      return src.map((data) => ({ kind: "income" as const, data }));
    }
    const src = expenseFilter === ALL ? monthExpenses : monthExpenses.filter((e) => (isSpendKind(e.kind) ? e.kind : "need") === expenseFilter);
    return src.map((data) => ({ kind: "expense" as const, data }));
  }, [isIncome, incomeFilter, expenseFilter, monthIncomes, monthExpenses]);

  const sections = useMemo(
    () => groupByDate(items, (i) => i.data.date, (i) => (i.kind === "income" ? i.data.amount : -i.data.amount)),
    [items],
  );
  const filteredTotal = useMemo(() => items.reduce((s, i) => s + i.data.amount, 0), [items]);

  const changeMonth = (m: dayjs.Dayjs) => {
    setMonth(m);
    setIncomeFilter(ALL);
    setExpenseFilter(ALL);
  };

  const accent = isIncome ? COLORS.income : COLORS.expense;

  const renderItem = useCallback(
    ({ item, index, section }: SectionListRenderItemInfo<Item, Section>) => {
      const first = index === 0;
      const last = index === section.data.length - 1;

      if (item.kind === "income") {
        const i = item.data;
        const isOpening = i.category === OPENING_CATEGORY;
        const isLoan = i.ref.startsWith("debt:");
        // Saldo awal & uang pinjaman diatur dari sumbernya, jadi ketuk = buka halaman sumbernya.
        let subtitle = i.note || undefined;
        let onPress: (() => void) | undefined = () => navigation.navigate("IncomeForm", { id: i._id.toHexString() });
        if (isOpening) {
          const acc = accountName[i.accountId];
          subtitle = acc ? `Uang yang sudah ada di ${acc}` : "Uang yang sudah ada";
          onPress = () => navigation.navigate("Tabs", { screen: "Wallet" });
        } else if (isLoan) {
          subtitle = i.note || "Uang dari pinjaman";
          onPress = () => navigation.navigate("Debts");
        } else if (isLockedIncome(i)) {
          onPress = undefined;
        }
        return (
          <TxRow
            first={first}
            last={last}
            iconBg={COLORS.income + "15"}
            icon={<Text style={styles.rowEmoji}>{incomeEmoji[i.category] ?? "💰"}</Text>}
            title={i.category}
            subtitle={subtitle}
            amount={`+${formatCurrency(i.amount)}`}
            amountColor={COLORS.income}
            onPress={onPress}
          />
        );
      }

      const e = item.data;
      const meta = KIND_META[isSpendKind(e.kind) ? e.kind : "need"];
      const kept = isKeptKind(e.kind);
      return (
        <TxRow
          first={first}
          last={last}
          iconBg={meta.color + "1A"}
          icon={<MaterialIcons name={meta.icon} size={ICON_SIZES.lg} color={meta.color} />}
          title={e.category}
          subtitle={e.note ? `${meta.label} · ${e.note}` : meta.label}
          badge={e.source === "savings" ? { label: "dari tabungan", color: COLORS.saving } : undefined}
          amount={`${kept ? "" : "−"}${formatCurrency(e.amount)}`}
          amountColor={kept ? meta.color : COLORS.expense}
          onPress={() => navigation.navigate("ExpenseForm", { id: e._id.toHexString() })}
        />
      );
    },
    [navigation, incomeEmoji, accountName],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: Section }) => <DayHeader date={section.date} total={section.total} />,
    [],
  );

  const keyExtractor = useCallback((item: Item) => item.data._id.toHexString(), []);

  const filterLabel = isIncome
    ? incomeFilter
    : selectedKind
      ? KIND_META[selectedKind].label
      : "";

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Navigasi bulan + selisih bulan itu */}
      <View style={styles.monthBar}>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => changeMonth(month.subtract(1, "month"))}
          accessibilityRole="button"
          accessibilityLabel="Bulan sebelumnya"
          hitSlop={8}
        >
          <MaterialIcons name="chevron-left" size={ICON_SIZES.xxl} color={COLORS.text} />
        </TouchableOpacity>

        <View style={styles.monthCenter}>
          <Text style={styles.monthTitle}>{month.format("MMMM YYYY")}</Text>
          <Text style={[styles.monthNet, { color: net >= 0 ? COLORS.income : COLORS.expense }]}>
            Selisih {net >= 0 ? "+" : "−"}
            {formatCurrency(Math.abs(net))}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.navBtn, isCurrentMonth && styles.navBtnDisabled]}
          onPress={() => changeMonth(month.add(1, "month"))}
          disabled={isCurrentMonth}
          accessibilityRole="button"
          accessibilityLabel="Bulan berikutnya"
          hitSlop={8}
        >
          <MaterialIcons name="chevron-right" size={ICON_SIZES.xxl} color={COLORS.text} />
        </TouchableOpacity>
      </View>
      {!isCurrentMonth && (
        <TouchableOpacity onPress={() => changeMonth(thisMonth)} style={styles.backToNow} hitSlop={6}>
          <Text style={styles.backToNowText}>Kembali ke bulan ini</Text>
        </TouchableOpacity>
      )}

      {/* Pemasukan / Uang keluar */}
      <View style={styles.segment}>
        {(["expense", "income"] as const).map((tab) => {
          const active = activeTab === tab;
          const color = tab === "income" ? COLORS.income : COLORS.expense;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.segItem, active && styles.segItemActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
            >
              <View style={styles.segLabelRow}>
                <MaterialIcons
                  name={tab === "income" ? "south-west" : "north-east"}
                  size={ICON_SIZES.xs}
                  color={active ? color : COLORS.textSecondary}
                />
                <Text style={[styles.segLabel, active && { color: COLORS.text }]}>
                  {tab === "income" ? "Pemasukan" : "Uang keluar"}
                </Text>
              </View>
              <Text style={[styles.segAmount, { color: active ? color : COLORS.textSecondary }]} numberOfLines={1}>
                {formatCurrency(tab === "income" ? incomeTotal : expenseTotal)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Filter kategori / jenis (hanya yang ada di bulan ini) */}
      {(isIncome ? incomeOptions : expenseOptions).length > 1 && (
        <FilterChips
          options={isIncome ? incomeOptions : expenseOptions}
          selected={filter}
          accent={accent}
          onSelect={isIncome ? setIncomeFilter : setExpenseFilter}
        />
      )}

      {filter !== ALL && (
        <View style={styles.filterInfo}>
          <Text style={styles.filterInfoText} numberOfLines={1}>
            {filterLabel} · {items.length} transaksi · {formatCurrency(filteredTotal)}
          </Text>
          <TouchableOpacity
            onPress={() => (isIncome ? setIncomeFilter(ALL) : setExpenseFilter(ALL))}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Hapus filter"
          >
            <MaterialIcons name="close" size={ICON_SIZES.sm} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      )}

      <SectionList
        key={activeTab}
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={keyExtractor}
        stickySectionHeadersEnabled={false}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          isIncome ? (
            <EmptyState
              emoji="💰"
              title={`Belum ada pemasukan di ${month.format("MMMM")}`}
              subtitle="Gajian atau dapat uang? Catat lewat tombol +."
            />
          ) : (
            <EmptyState
              emoji="💸"
              title={`Belum ada uang keluar di ${month.format("MMMM")}`}
              subtitle="Catat kebutuhan, keinginan, atau tabungan lewat tombol +."
            />
          )
        }
      />

      <FAB
        color={accent}
        onPress={() =>
          isIncome
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

  monthBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  navBtnDisabled: { opacity: 0.35 },
  monthCenter: { flex: 1, alignItems: "center" },
  monthTitle: { fontSize: FONTS.xl, fontWeight: "700", color: COLORS.text },
  monthNet: { fontSize: FONTS.sm, fontWeight: "600", marginTop: 2 },
  backToNow: { alignSelf: "center", marginTop: SPACING.xs },
  backToNowText: { fontSize: FONTS.sm, fontWeight: "600", color: COLORS.primary },

  segment: {
    flexDirection: "row",
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    padding: 4,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.subtleBg,
  },
  segItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  segItemActive: { backgroundColor: COLORS.card, ...SHADOWS.sm },
  segLabelRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  segLabel: { fontSize: FONTS.sm, fontWeight: "600", color: COLORS.textSecondary },
  segAmount: { fontSize: FONTS.lg, fontWeight: "800", marginTop: 2 },

  chipScroll: { flexGrow: 0, flexShrink: 0, marginTop: SPACING.md },
  chipRow: { paddingHorizontal: SPACING.lg, gap: SPACING.sm },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipEmoji: { fontSize: FONTS.sm },
  chipDot: { width: 8, height: 8, borderRadius: 4 },
  chipText: { fontSize: FONTS.sm, fontWeight: "600", color: COLORS.textSecondary },
  chipTextActive: { color: COLORS.onPrimary },

  filterInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
  },
  filterInfoText: { flex: 1, fontSize: FONTS.sm, color: COLORS.textSecondary },

  list: { flex: 1 },
  listContent: { paddingHorizontal: SPACING.lg, paddingBottom: 110, flexGrow: 1 },

  rowEmoji: { fontSize: 20 },
});
