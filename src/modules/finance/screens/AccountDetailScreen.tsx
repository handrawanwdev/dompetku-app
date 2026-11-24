import React, { useMemo } from 'react';
import { View, FlatList, StyleSheet, StatusBar, TouchableOpacity, ListRenderItemInfo } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useQuery } from '@realm/react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { COLORS, FONTS, ICON_SIZES, RADIUS, SPACING, SHADOWS } from '../../../theme';
import { Text, BackButton } from '../../../components/common';
import { IncomeModel } from '../../../models/IncomeModel';
import { ExpenseModel } from '../../../models/ExpenseModel';
import { TransferModel } from '../../../models/TransferModel';
import { accountLabel, accountTypeMeta } from '../../../services/AccountService';
import { isLockedIncome } from '../../../utils/journal';
import { kindMeta } from '../../../utils/budget';
import { formatCurrency } from '../../../utils/currency';
import { formatDate } from '../../../utils/date';
import type { RootStackParamList } from '../../../navigation/types';
import { useAccounts } from '../useAccounts';

type Props = NativeStackScreenProps<RootStackParamList, 'AccountDetail'>;

interface Row {
  key: string;
  date: string;
  createdAt: number;
  label: string;
  meta: string;
  /** Perubahan saldo kantong ini. 0 = cuma ditandai (sisihkan ke tabungan). */
  delta: number;
  amount: number;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  open?: () => void;
}

/** Saldo satu kantong + semua transaksi yang lewat kantong ini. */
export function AccountDetailScreen({ navigation, route }: Props) {
  const { id } = route.params;
  const { byId } = useAccounts();
  const info = byId(id);

  const incomes = useQuery(IncomeModel, (c) => c.filtered('accountId == $0', id), [id]);
  const expenses = useQuery(ExpenseModel, (c) => c.filtered('accountId == $0', id), [id]);
  const savedHere = useQuery(ExpenseModel, (c) => c.filtered('toAccountId == $0 AND accountId != $0', id), [id]);
  const transfers = useQuery(TransferModel, (c) => c.filtered('fromId == $0 OR toId == $0', id), [id]);

  const rows = useMemo<Row[]>(() => {
    const out: Row[] = [];
    for (const i of incomes) {
      out.push({
        key: 'i' + i._id.toHexString(),
        date: i.date,
        createdAt: i.createdAt.getTime(),
        label: i.category,
        meta: [formatDate(i.date), i.note].filter(Boolean).join(' · '),
        delta: i.allocationCash,
        amount: i.allocationCash,
        icon: i.isInternal ? 'tune' : 'south-west',
        color: i.isInternal ? COLORS.textSecondary : COLORS.income,
        open: isLockedIncome(i) ? undefined : () => navigation.navigate('IncomeForm', { id: i._id.toHexString() }),
      });
    }
    const name = (aid: string) => (aid ? (byId(aid) ? accountLabel(byId(aid)!.account) : 'kantong terhapus') : 'saldo lain');
    for (const e of [...expenses, ...savedHere]) {
      const m = kindMeta(e.kind);
      const kept = e.kind === 'saving' && e.source !== 'savings';
      const incoming = kept && e.toAccountId === id;
      const movedOut = kept && !incoming && e.toAccountId !== '';
      const where = incoming ? `dari ${name(e.accountId)}` : movedOut ? `ke ${name(e.toAccountId)}` : kept ? 'uang tetap di sini' : '';
      out.push({
        key: 'e' + e._id.toHexString(),
        date: e.date,
        createdAt: e.createdAt.getTime(),
        label: e.category,
        meta: [e.isInternal ? '' : m.label, formatDate(e.date), where, e.note].filter(Boolean).join(' · '),
        delta: incoming ? e.amount : kept && !movedOut ? 0 : -e.amount,
        amount: e.amount,
        icon: e.isInternal ? 'tune' : m.icon,
        color: e.isInternal ? COLORS.textSecondary : m.color,
        open: e.isInternal ? undefined : () => navigation.navigate('ExpenseForm', { id: e._id.toHexString() }),
      });
    }
    for (const t of transfers) {
      const incoming = t.toId === id;
      const otherId = incoming ? t.fromId : t.toId;
      const other = otherId ? (byId(otherId) ? accountLabel(byId(otherId)!.account) : 'kantong terhapus') : null;
      out.push({
        key: 't' + t._id.toHexString(),
        date: t.date,
        createdAt: t.createdAt.getTime(),
        label: other ? (incoming ? `Dari ${other}` : `Ke ${other}`) : t.note || 'Penyesuaian saldo',
        meta: [other ? 'Pindah saldo' : '', formatDate(t.date), other ? t.note : ''].filter(Boolean).join(' · '),
        delta: incoming ? t.amount : -t.amount,
        amount: t.amount,
        icon: other ? 'swap-horiz' : 'tune',
        color: other ? COLORS.primary : COLORS.textSecondary,
        open: other ? () => navigation.navigate('TransferForm', { id: t._id.toHexString() }) : undefined,
      });
    }
    return out.sort((a, b) => (a.date === b.date ? b.createdAt - a.createdAt : a.date < b.date ? 1 : -1));
  }, [incomes, expenses, savedHere, transfers, id, byId, navigation]);

  if (!info) {
    // Kantong baru saja dihapus.
    return <SafeAreaView style={styles.safe} />;
  }

  const m = accountTypeMeta(info.account.type);

  const renderItem = ({ item }: ListRenderItemInfo<Row>) => (
    <TouchableOpacity style={styles.item} onPress={item.open} disabled={!item.open} activeOpacity={0.7}>
      <View style={[styles.itemIcon, { backgroundColor: item.color + '1A' }]}>
        <MaterialIcons name={item.icon} size={ICON_SIZES.md} color={item.color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemLabel} numberOfLines={1}>{item.label}</Text>
        <Text style={styles.itemMeta} numberOfLines={1}>{item.meta}</Text>
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
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>{info.account.name}</Text>
          {info.account.subName ? (
            <Text style={styles.titleSub} numberOfLines={1}>{info.account.subName}</Text>
          ) : null}
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('AccountForm', { id })}
          hitSlop={8}
          accessibilityLabel="Ubah kantong"
        >
          <MaterialIcons name="edit" size={ICON_SIZES.lg} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={rows}
        keyExtractor={(r) => r.key}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.hero}>
              <View style={styles.heroHead}>
                <View style={[styles.itemIcon, { backgroundColor: (info.account.isSavings ? COLORS.saving : m.color) + '1A' }]}>
                  <MaterialIcons
                    name={info.account.isSavings ? 'lock' : m.icon}
                    size={ICON_SIZES.md}
                    color={info.account.isSavings ? COLORS.saving : m.color}
                  />
                </View>
                <Text style={styles.heroType}>{[m.label, info.account.isSavings ? 'Tabungan' : 'Sehari-hari', info.account.isMain ? 'Kantong utama' : '']
                  .filter(Boolean)
                  .join(' · ')}</Text>
              </View>
              <Text style={styles.heroLabel}>Saldo</Text>
              <Text style={[styles.heroAmount, info.balance < 0 && { color: COLORS.dangerText }]} numberOfLines={1}>
                {formatCurrency(info.balance)}
              </Text>
              {info.balance < 0 && (
                <Text style={styles.warn}>Saldonya minus, mungkin ada catatan yang kelewat. Ketuk ikon pensil untuk menyamakan dengan saldo aslinya.</Text>
              )}
              <View style={styles.actions}>
                <Action icon="swap-horiz" label="Pindah saldo" onPress={() => navigation.navigate('TransferForm', { fromId: id })} />
                <Action icon="tune" label="Samakan saldo" onPress={() => navigation.navigate('AccountForm', { id })} />
              </View>
            </View>
            <Text style={styles.section}>Riwayat</Text>
          </>
        }
        ListEmptyComponent={<Text style={styles.empty}>Belum ada catatan di kantong ini.</Text>}
      />
    </SafeAreaView>
  );
}

function Action({ icon, label, onPress }: { icon: keyof typeof MaterialIcons.glyphMap; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.action} onPress={onPress} activeOpacity={0.7}>
      <MaterialIcons name={icon} size={ICON_SIZES.md} color={COLORS.primary} />
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  title: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text },
  titleSub: { fontSize: FONTS.xs, color: COLORS.textSecondary },
  content: { padding: SPACING.lg, paddingTop: 0, paddingBottom: SPACING.xxxl },
  hero: { backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: SPACING.xl, ...SHADOWS.sm },
  heroHead: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  heroType: { fontSize: FONTS.sm, color: COLORS.textSecondary, fontWeight: '600' },
  heroLabel: { fontSize: FONTS.sm, color: COLORS.textSecondary },
  heroAmount: { fontSize: FONTS.xxl, fontWeight: '800', color: COLORS.text, marginTop: SPACING.xs },
  warn: { fontSize: FONTS.xs, color: COLORS.dangerText, marginTop: SPACING.sm },
  actions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.lg },
  action: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primarySoft,
  },
  actionLabel: { fontSize: FONTS.sm, fontWeight: '700', color: COLORS.primary },
  section: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text, marginTop: SPACING.xl, marginBottom: SPACING.sm },
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
