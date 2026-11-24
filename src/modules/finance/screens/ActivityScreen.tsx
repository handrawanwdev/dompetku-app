import React, { useMemo, useState } from 'react';
import { View, FlatList, ScrollView, Modal, Pressable, TextInput, StyleSheet, StatusBar, TouchableOpacity, ListRenderItemInfo } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useQuery } from '@realm/react';
import dayjs from 'dayjs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { COLORS, FONTS, ICON_SIZES, RADIUS, SHADOWS, SPACING } from '../../../theme';
import { Text, BackButton } from '../../../components/common';
import { IncomeModel } from '../../../models/IncomeModel';
import { ExpenseModel } from '../../../models/ExpenseModel';
import { TransferModel } from '../../../models/TransferModel';
import { kindMeta } from '../../../utils/budget';
import { formatCurrency } from '../../../utils/currency';
import { formatDate } from '../../../utils/date';
import { isLockedIncome } from '../../../utils/journal';
import { accountLabel, accountTypeMeta } from '../../../services/AccountService';
import type { RootStackParamList } from '../../../navigation/types';
import { useAccounts } from '../useAccounts';

type Props = NativeStackScreenProps<RootStackParamList, 'Activity'>;

interface Row {
  key: string;
  date: string;
  createdAt: number;
  label: string;
  meta: string;
  /** Perubahan saldo total. 0 = uang cuma pindah (kantong / disisihkan ke tabungan). */
  delta: number;
  amount: number;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  open?: () => void;
  /** Kantong yang tersentuh (asal & tujuan), untuk filter kantong. */
  accounts: string[];
  /** Teks yang dicari: label + catatan + nama kantong. */
  search: string;
}

type TypeFilter = 'all' | 'in' | 'out' | 'move';
type PeriodFilter = 'all' | 'week' | 'this' | 'last' | 'year';
type Sheet = 'period' | 'account' | null;

const TYPES: { id: TypeFilter; label: string }[] = [
  { id: 'all', label: 'Semua' },
  { id: 'in', label: 'Masuk' },
  { id: 'out', label: 'Keluar' },
  { id: 'move', label: 'Pindah' },
];

const PERIODS: { id: PeriodFilter; label: string }[] = [
  { id: 'all', label: 'Semua waktu' },
  { id: 'week', label: '7 hari terakhir' },
  { id: 'this', label: 'Bulan ini' },
  { id: 'last', label: 'Bulan lalu' },
  { id: 'year', label: 'Tahun ini' },
];

/** Rentang tanggal [from, to] (YYYY-MM-DD) untuk periode. null = tanpa batas. */
function periodRange(p: PeriodFilter): [string, string] | null {
  const now = dayjs();
  const fmt = (d: dayjs.Dayjs) => d.format('YYYY-MM-DD');
  if (p === 'week') return [fmt(now.subtract(6, 'day')), fmt(now)];
  if (p === 'this') return [fmt(now.startOf('month')), fmt(now.endOf('month'))];
  if (p === 'last') {
    const m = now.subtract(1, 'month');
    return [fmt(m.startOf('month')), fmt(m.endOf('month'))];
  }
  if (p === 'year') return [fmt(now.startOf('year')), fmt(now.endOf('year'))];
  return null;
}

function rangeLabel(p: PeriodFilter): string {
  const r = periodRange(p);
  if (!r) return 'Sejak catatan pertama';
  const [a, b] = r.map((d) => dayjs(d));
  return a.isSame(b, 'year') ? `${a.format('D MMM')} – ${b.format('D MMM YYYY')}` : `${a.format('D MMM YYYY')} – ${b.format('D MMM YYYY')}`;
}

/** Pemicu pilihan (periode/kantong). Menonjol + bisa di-reset langsung kalau bukan bawaan. */
function DropdownPill({
  icon,
  label,
  active,
  onPress,
  onClear,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  active: boolean;
  onPress: () => void;
  onClear: () => void;
}) {
  const color = active ? COLORS.primary : COLORS.textSecondary;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.pill, active && styles.pillActive]}
      activeOpacity={0.7}
      accessibilityRole="button"
    >
      <MaterialIcons name={icon} size={ICON_SIZES.sm} color={color} />
      <Text style={[styles.pillText, active && styles.pillTextActive]} numberOfLines={1}>
        {label}
      </Text>
      {active ? (
        <TouchableOpacity onPress={onClear} hitSlop={10} accessibilityLabel={`Hapus filter ${label}`}>
          <MaterialIcons name="close" size={ICON_SIZES.sm} color={color} />
        </TouchableOpacity>
      ) : (
        <MaterialIcons name="expand-more" size={ICON_SIZES.sm} color={color} />
      )}
    </TouchableOpacity>
  );
}

interface SheetOption {
  id: string;
  label: string;
  sub?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  color?: string;
}

/** Bottom sheet pilihan tunggal. Pilih = langsung terapkan & tutup. */
function OptionSheet({
  visible,
  title,
  options,
  value,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  options: SheetOption[];
  value: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.overlay} onPress={onClose} accessibilityLabel="Tutup" />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + SPACING.lg }]}>
        <View style={styles.sheetHandle} />
        <Text style={styles.sheetTitle}>{title}</Text>
        <ScrollView style={styles.sheetList} bounces={false}>
        {options.map((o) => {
          const selected = o.id === value;
          return (
            <TouchableOpacity
              key={o.id}
              style={[styles.option, selected && styles.optionSelected]}
              onPress={() => {
                onSelect(o.id);
                onClose();
              }}
              activeOpacity={0.7}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
            >
              {o.icon && (
                <View style={[styles.optionIcon, { backgroundColor: (o.color ?? COLORS.primary) + '1A' }]}>
                  <MaterialIcons name={o.icon} size={ICON_SIZES.md} color={o.color ?? COLORS.primary} />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{o.label}</Text>
                {o.sub ? <Text style={styles.optionSub}>{o.sub}</Text> : null}
              </View>
              {selected && <MaterialIcons name="check" size={ICON_SIZES.lg} color={COLORS.primary} />}
            </TouchableOpacity>
          );
        })}
        </ScrollView>
      </View>
    </Modal>
  );
}

/**
 * Pengaruh satu uang keluar ke saldo total, sama dengan rumus AllocationService:
 * bisa dipakai berkurang kalau source cash, tabungan bertambah saat disisihkan
 * dan berkurang saat dibayar pakai tabungan.
 */
function expenseDelta(e: ExpenseModel): number {
  const spendable = e.source === 'cash' ? -e.amount : 0;
  const savings =
    (e.kind === 'saving' && e.source !== 'savings' ? e.amount : 0) + (e.source === 'savings' ? -e.amount : 0);
  return spendable + savings;
}

/** Jurnal semua aktivitas uang di semua kantong: masuk, keluar, pindah saldo, saldo awal, penyesuaian. */
export function ActivityScreen({ navigation }: Props) {
  const { byId, list: accountList } = useAccounts();
  const [query, setQuery] = useState('');
  const [type, setType] = useState<TypeFilter>('all');
  const [period, setPeriod] = useState<PeriodFilter>('all');
  const [account, setAccount] = useState('all');
  const [sheet, setSheet] = useState<Sheet>(null);
  const incomes = useQuery(IncomeModel);
  const expenses = useQuery(ExpenseModel);
  const transfers = useQuery(TransferModel);

  const rows = useMemo<Row[]>(() => {
    const name = (id: string) => (id ? (byId(id) ? accountLabel(byId(id)!.account) : 'kantong terhapus') : 'belum masuk kantong');
    const out: Row[] = [];

    for (const i of incomes) {
      out.push({
        key: 'i' + i._id.toHexString(),
        date: i.date,
        createdAt: i.createdAt.getTime(),
        label: i.category,
        meta: [name(i.accountId), formatDate(i.date), i.note].filter(Boolean).join(' · '),
        delta: i.allocationCash,
        amount: i.allocationCash,
        icon: i.isInternal ? 'tune' : 'south-west',
        color: i.isInternal ? COLORS.textSecondary : COLORS.income,
        open: isLockedIncome(i) ? undefined : () => navigation.navigate('IncomeForm', { id: i._id.toHexString() }),
        accounts: [i.accountId],
        search: [i.category, i.note, name(i.accountId)].join(' '),
      });
    }

    for (const e of expenses) {
      const m = kindMeta(e.kind);
      const kept = e.kind === 'saving' && e.source !== 'savings';
      const where = kept && e.toAccountId ? `${name(e.accountId)} → ${name(e.toAccountId)}` : name(e.accountId);
      out.push({
        key: 'e' + e._id.toHexString(),
        date: e.date,
        createdAt: e.createdAt.getTime(),
        label: e.category,
        meta: [e.isInternal ? '' : m.label, where, formatDate(e.date), e.note].filter(Boolean).join(' · '),
        delta: expenseDelta(e),
        amount: e.amount,
        icon: e.isInternal ? 'tune' : m.icon,
        color: e.isInternal ? COLORS.textSecondary : m.color,
        open: e.isInternal ? undefined : () => navigation.navigate('ExpenseForm', { id: e._id.toHexString() }),
        accounts: [e.accountId, e.toAccountId],
        search: [e.category, e.note, m.label, where].join(' '),
      });
    }

    for (const t of transfers) {
      const between = t.fromId !== '' && t.toId !== '';
      const label = between
        ? `${name(t.fromId)} → ${name(t.toId)}`
        : t.fromId === ''
          ? `${t.note || 'Saldo awal'} · ${name(t.toId)}`
          : `${t.note || 'Penyesuaian saldo'} · ${name(t.fromId)}`;
      out.push({
        key: 't' + t._id.toHexString(),
        date: t.date,
        createdAt: t.createdAt.getTime(),
        label,
        meta: [between ? 'Pindah saldo' : 'Rapikan kantong', formatDate(t.date), between ? t.note : ''].filter(Boolean).join(' · '),
        delta: 0,
        amount: t.amount,
        icon: between ? 'swap-horiz' : 'tune',
        color: between ? COLORS.primary : COLORS.textSecondary,
        open: between ? () => navigation.navigate('TransferForm', { id: t._id.toHexString() }) : undefined,
        accounts: [t.fromId, t.toId],
        search: [label, t.note].join(' '),
      });
    }

    return out.sort((a, b) => (a.date === b.date ? b.createdAt - a.createdAt : a.date < b.date ? 1 : -1));
  }, [incomes, expenses, transfers, byId, navigation]);

  const filtered = useMemo(() => {
    const range = periodRange(period);
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (range && (r.date < range[0] || r.date > range[1])) return false;
      if (account !== 'all' && !r.accounts.includes(account)) return false;
      if (type !== 'all') {
        // Pindah = saldo total tetap (pindah kantong / disisihkan ke tabungan).
        const t = r.delta > 0 ? 'in' : r.delta < 0 ? 'out' : 'move';
        if (t !== type) return false;
      }
      if (q && !r.search.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [rows, period, account, type, query]);

  const totals = useMemo(() => {
    let inSum = 0;
    let outSum = 0;
    for (const r of filtered) {
      if (r.delta > 0) inSum += r.delta;
      else outSum -= r.delta;
    }
    return { inSum, outSum };
  }, [filtered]);
  const isFiltered = type !== 'all' || period !== 'all' || account !== 'all' || query.trim() !== '';

  const periodOptions: SheetOption[] = PERIODS.map((p) => ({ id: p.id, label: p.label, sub: rangeLabel(p.id) }));
  const accountOptions: SheetOption[] = [
    { id: 'all', label: 'Semua kantong', icon: 'all-inclusive', color: COLORS.textSecondary },
    ...accountList.map((a) => {
      const m = accountTypeMeta(a.account.type);
      return { id: a.id, label: a.account.name, sub: [a.account.subName, `Saldo ${formatCurrency(a.balance)}`].filter(Boolean).join(' · '), icon: m.icon, color: m.color };
    }),
  ];
  const periodLabel = PERIODS.find((p) => p.id === period)?.label ?? 'Semua waktu';
  const accountPill = account === 'all' ? 'Semua kantong' : byId(account) ? accountLabel(byId(account)!.account) : 'Kantong';
  const reset = () => {
    setType('all');
    setPeriod('all');
    setAccount('all');
    setQuery('');
  };

  const renderItem = ({ item }: ListRenderItemInfo<Row>) => (
    <TouchableOpacity style={styles.item} onPress={item.open} disabled={!item.open} activeOpacity={0.7}>
      <View style={[styles.itemIcon, { backgroundColor: item.color + '1A' }]}>
        <MaterialIcons name={item.icon} size={ICON_SIZES.md} color={item.color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemLabel} numberOfLines={1}>{item.label}</Text>
        <Text style={styles.itemMeta} numberOfLines={2}>{item.meta}</Text>
      </View>
      <Text style={[styles.itemAmount, { color: item.delta > 0 ? COLORS.income : item.delta < 0 ? COLORS.text : COLORS.textMuted }]}>
        {item.delta > 0 ? '+ ' : item.delta < 0 ? '- ' : ''}
        {formatCurrency(item.amount)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Riwayat</Text>
      </View>
      <View style={styles.filters}>
        <View style={styles.search}>
          <MaterialIcons name="search" size={ICON_SIZES.md} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Cari kategori, catatan, kantong"
            placeholderTextColor={COLORS.textMuted}
            returnKeyType="search"
          />
          {query ? (
            <TouchableOpacity onPress={() => setQuery('')} hitSlop={8} accessibilityLabel="Hapus pencarian">
              <MaterialIcons name="cancel" size={ICON_SIZES.md} color={COLORS.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.segment} accessibilityRole="tablist">
          {TYPES.map((t) => {
            const active = type === t.id;
            return (
              <TouchableOpacity
                key={t.id}
                onPress={() => setType(t.id)}
                style={[styles.segmentItem, active && styles.segmentItemActive]}
                activeOpacity={0.7}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{t.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.pillRow}>
          <DropdownPill
            icon="date-range"
            label={periodLabel}
            active={period !== 'all'}
            onPress={() => setSheet('period')}
            onClear={() => setPeriod('all')}
          />
          {accountList.length > 0 && (
            <DropdownPill
              icon="account-balance-wallet"
              label={accountPill}
              active={account !== 'all'}
              onPress={() => setSheet('account')}
              onClear={() => setAccount('all')}
            />
          )}
        </View>

        {isFiltered && (
          <View style={styles.resultBar}>
            <View style={{ flex: 1 }}>
              <Text style={styles.resultCount}>{filtered.length} aktivitas</Text>
              <Text style={styles.resultSums}>
                <Text style={{ color: COLORS.income }}>+ {formatCurrency(totals.inSum)}</Text>
                {'  ·  '}
                <Text style={{ color: COLORS.expense }}>- {formatCurrency(totals.outSum)}</Text>
              </Text>
            </View>
            <TouchableOpacity onPress={reset} hitSlop={8} style={styles.resetBtn}>
              <MaterialIcons name="restart-alt" size={ICON_SIZES.sm} color={COLORS.primary} />
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(r) => r.key}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        initialNumToRender={20}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListHeaderComponent={
          isFiltered ? null : <Text style={styles.hint}>
            Semua uang masuk, keluar, dan pindah saldo di semua kantong. Nominal abu-abu = uang cuma pindah, saldo total tetap.
          </Text>
        }
        ListEmptyComponent={
          isFiltered ? (
            <View style={styles.emptyBox}>
              <MaterialIcons name="search-off" size={40} color={COLORS.textMuted} />
              <Text style={styles.empty}>Tidak ada aktivitas yang cocok.</Text>
              <TouchableOpacity onPress={reset} hitSlop={8}>
                <Text style={styles.resetText}>Reset filter</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.empty}>Belum ada aktivitas.</Text>
          )
        }
      />

      <OptionSheet
        visible={sheet === 'period'}
        title="Periode"
        options={periodOptions}
        value={period}
        onSelect={(id) => setPeriod(id as PeriodFilter)}
        onClose={() => setSheet(null)}
      />
      <OptionSheet
        visible={sheet === 'account'}
        title="Kantong"
        options={accountOptions}
        value={account}
        onSelect={setAccount}
        onClose={() => setSheet(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  title: { flex: 1, fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text },
  content: { padding: SPACING.lg, paddingTop: 0, paddingBottom: SPACING.xxxl },
  filters: { paddingBottom: SPACING.sm, gap: SPACING.sm },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginHorizontal: SPACING.lg,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: { flex: 1, fontSize: FONTS.md, color: COLORS.text, paddingVertical: SPACING.sm },
  segment: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    padding: 3,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.subtleBg,
  },
  segmentItem: { flex: 1, alignItems: 'center', paddingVertical: 7, borderRadius: RADIUS.sm },
  segmentItemActive: { backgroundColor: COLORS.surface, ...SHADOWS.sm },
  segmentText: { fontSize: FONTS.sm, fontWeight: '500', color: COLORS.textSecondary },
  segmentTextActive: { color: COLORS.text, fontWeight: '700' },
  pillRow: { flexDirection: 'row', gap: SPACING.sm, paddingHorizontal: SPACING.lg },
  pill: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pillActive: { backgroundColor: COLORS.primarySoft, borderColor: COLORS.primary },
  pillText: { flexShrink: 1, fontSize: FONTS.sm, fontWeight: '500', color: COLORS.textSecondary },
  pillTextActive: { color: COLORS.primary, fontWeight: '700' },
  resultBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resultCount: { fontSize: FONTS.sm, fontWeight: '700', color: COLORS.text },
  resultSums: { fontSize: FONTS.xs, fontWeight: '600', color: COLORS.textMuted, marginTop: 1 },
  resetBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  resetText: { fontSize: FONTS.sm, fontWeight: '600', color: COLORS.primary },
  emptyBox: { alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.xxl },
  overlay: { flex: 1, backgroundColor: COLORS.overlay },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  sheetList: { maxHeight: 440 },
  sheetTitle: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  optionSelected: { backgroundColor: COLORS.primarySoft },
  optionIcon: { width: 36, height: 36, borderRadius: RADIUS.round, alignItems: 'center', justifyContent: 'center' },
  optionLabel: { fontSize: FONTS.md, fontWeight: '500', color: COLORS.text },
  optionLabelSelected: { fontWeight: '700' },
  optionSub: { fontSize: FONTS.xs, color: COLORS.textSecondary, marginTop: 1 },
  hint: { fontSize: FONTS.xs, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemIcon: { width: 36, height: 36, borderRadius: RADIUS.round, alignItems: 'center', justifyContent: 'center' },
  itemLabel: { fontSize: FONTS.md, fontWeight: '600', color: COLORS.text },
  itemMeta: { fontSize: FONTS.xs, color: COLORS.textSecondary, marginTop: 2 },
  itemAmount: { fontSize: FONTS.md, fontWeight: '700' },
  empty: { fontSize: FONTS.sm, color: COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.xl },
});
