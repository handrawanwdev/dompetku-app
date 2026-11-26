import React from 'react';
import { View, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRealm } from '@realm/react';

import { COLORS, FONTS, ICON_SIZES, SPACING, RADIUS, SHADOWS } from '../../../theme';
import { Text, Button } from '../../../components/common';
import { accountTypeMeta, addAdjustment } from '../../../services/AccountService';
import { formatCurrency } from '../../../utils/currency';
import { useRootNavigation } from '../../../navigation/types';
import { useAccounts } from '../useAccounts';

/** Tab Dompet: saldo total dan di kantong mana saja uangnya (BCA, Blu, GoPay, tunai…). */
export function WalletScreen() {
  const nav = useRootNavigation();
  const realm = useRealm();
  const { list, totals, unassigned } = useAccounts();
  const hasAccounts = list.length > 0;
  const showUnassigned = hasAccounts && Math.abs(unassigned) >= 1;

  const daily = list.filter((a) => !a.account.isSavings);
  const saved = list.filter((a) => a.account.isSavings);
  const sum = (xs: typeof list) => xs.reduce((s, a) => s + a.balance, 0);
  // Tabungan yang ditandai lewat Sisihkan tapi uangnya masih di kantong harian.
  // Dihitung di grup Tabungan (bukan Sehari-hari) supaya sama dengan Dashboard.
  const marked = totals.markedSavings;
  const showMarked = hasAccounts && Math.abs(marked) >= 1;
  // Total grup = angka Bisa dipakai & Tabungan di Dashboard (getBalances).
  const dailyTotal = totals.spendable;
  const savedTotal = totals.savings;
  const groups = [
    { key: 'daily', title: 'Sehari-hari', icon: 'account-balance-wallet' as const, color: COLORS.primary, items: daily, total: dailyTotal },
    { key: 'savings', title: 'Tabungan', icon: 'lock' as const, color: COLORS.saving, items: saved, total: savedTotal },
  ].filter((g) => g.items.length > 0 || g.key === 'savings' || showUnassigned || showMarked);

  const renderPocket = (a: (typeof list)[number], i: number) => {
    const m = accountTypeMeta(a.account.type);
    return (
      <TouchableOpacity
        key={a.id}
        style={[styles.row, i > 0 && styles.rowBorder]}
        onPress={() => nav.navigate('AccountDetail', { id: a.id })}
        activeOpacity={0.7}
      >
        <View style={[styles.icon, { backgroundColor: m.color + '1A' }]}>
          <MaterialIcons name={m.icon} size={ICON_SIZES.md} color={m.color} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>{a.account.name}</Text>
            {a.account.isMain && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Utama</Text>
              </View>
            )}
          </View>
          <Text style={styles.meta} numberOfLines={1}>
            {a.account.subName || m.label}
          </Text>
        </View>
        <Text style={[styles.amount, a.balance < 0 && { color: COLORS.dangerText }]}>{formatCurrency(a.balance)}</Text>
        <MaterialIcons name="chevron-right" size={ICON_SIZES.md} color={COLORS.textMuted} />
      </TouchableOpacity>
    );
  };

  const fixUnassigned = () => {
    if (unassigned > 0) {
      Alert.alert(
        'Belum masuk kantong',
        `Ada ${formatCurrency(unassigned)} yang tercatat tapi belum jelas di kantong mana.\n\nKalau uangnya ada, buka kantongnya lalu Samakan saldo. Kalau sudah terpakai tanpa dicatat, hapus selisihnya.`,
        [
          { text: 'Nanti', style: 'cancel' },
          { text: 'Sudah terpakai', style: 'destructive', onPress: () => realm.write(() => addAdjustment(realm, '', -unassigned)) },
        ],
      );
    } else {
      Alert.alert(
        'Selisih saldo',
        `Saldo di kantong ${formatCurrency(-unassigned)} lebih besar dari yang tercatat, biasanya karena ada uang keluar yang dicatat tanpa kantong.\n\nSamakan supaya saldo total ikut saldo kantong?`,
        [
          { text: 'Nanti', style: 'cancel' },
          { text: 'Samakan', onPress: () => realm.write(() => addAdjustment(realm, '', -unassigned)) },
        ],
      );
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Dompet</Text>
          <TouchableOpacity
            style={styles.historyBtn}
            onPress={() => nav.navigate('Activity')}
            hitSlop={8}
            activeOpacity={0.7}
            accessibilityLabel="Riwayat semua aktivitas"
          >
            <MaterialIcons name="history" size={ICON_SIZES.md} color={COLORS.primary} />
            <Text style={styles.historyLabel}>Riwayat</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroLabel}>Saldo total</Text>
          <Text style={styles.heroAmount} numberOfLines={1}>
            {formatCurrency(totals.total)}
          </Text>
          {hasAccounts && (
            <>
              {/* Porsi sehari-hari vs tabungan, sama dengan total grup di bawah */}
              {dailyTotal > 0 && savedTotal > 0 && (
                <View style={styles.split}>
                  <View style={[styles.splitPart, { flex: dailyTotal, backgroundColor: COLORS.heroText }]} />
                  <View style={[styles.splitPart, { flex: savedTotal, backgroundColor: COLORS.incomeLight }]} />
                </View>
              )}
              <View style={styles.legend}>
                <Legend color={COLORS.heroText} label="Sehari-hari" value={dailyTotal} />
                <Legend color={COLORS.incomeLight} label="Tabungan" value={savedTotal} />
              </View>
              <View style={styles.actions}>
                <HeroAction icon="swap-horiz" label="Pindah saldo" onPress={() => nav.navigate('TransferForm', {})} disabled={list.length < 2} />
                <HeroAction icon="add" label="Tambah kantong" onPress={() => nav.navigate('AccountForm', {})} />
              </View>
            </>
          )}
        </View>

        {hasAccounts ? (
          <>
            {groups.map((g) => (
              <View key={g.key}>
                <View style={styles.sectionHead}>
                  <MaterialIcons name={g.icon} size={ICON_SIZES.sm} color={g.color} />
                  <Text style={styles.section}>{g.title}</Text>
                  <Text style={styles.sectionTotal}>{formatCurrency(g.total)}</Text>
                </View>
                <View style={styles.list}>
                  {g.items.map((a, i) => renderPocket(a, i))}
                  {g.key === 'daily' && showUnassigned && (
                    <TouchableOpacity style={[styles.row, g.items.length > 0 && styles.rowBorder]} onPress={fixUnassigned} activeOpacity={0.7}>
                      <View style={[styles.icon, { backgroundColor: COLORS.warningBg }]}>
                        <MaterialIcons name="help-outline" size={ICON_SIZES.md} color={COLORS.warningText} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.name}>{unassigned > 0 ? 'Belum masuk kantong' : 'Selisih saldo'}</Text>
                        <Text style={styles.meta}>Ketuk untuk merapikan</Text>
                      </View>
                      <Text style={[styles.amount, { color: COLORS.warningText }]}>{formatCurrency(unassigned)}</Text>
                    </TouchableOpacity>
                  )}
                  {showMarked && (
                    <View style={[styles.row, (g.items.length > 0 || (g.key === 'daily' && showUnassigned)) && styles.rowBorder]}>
                      <View style={[styles.icon, { backgroundColor: COLORS.saving + '1A' }]}>
                        <MaterialIcons name="bookmark-border" size={ICON_SIZES.md} color={COLORS.saving} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.name}>{g.key === 'daily' ? 'Sudah disisihkan' : 'Disisihkan di kantong harian'}</Text>
                        <Text style={styles.meta}>
                          {g.key === 'daily' ? 'Dihitung sebagai tabungan, bukan bisa dipakai' : 'Uangnya masih di kantong sehari-hari'}
                        </Text>
                      </View>
                      <Text style={[styles.amount, { color: COLORS.textMuted }]}>
                        {g.key === 'daily' ? '−' : ''}
                        {formatCurrency(marked)}
                      </Text>
                    </View>
                  )}
                  {g.key === 'savings' && g.items.length === 0 && (
                    <TouchableOpacity style={[styles.row, showMarked && styles.rowBorder]} onPress={() => nav.navigate('AccountForm', { savings: true })} activeOpacity={0.7}>
                      <View style={[styles.icon, { backgroundColor: COLORS.saving + '1A' }]}>
                        <MaterialIcons name="add" size={ICON_SIZES.md} color={COLORS.saving} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.name}>Tambah kantong tabungan</Text>
                        <Text style={styles.meta}>Contoh Blu atau Jago, tempat menyimpan uang yang disisihkan</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
                {g.key === 'savings' && g.items.length > 0 && (
                  <Text style={styles.footnote}>
                    Saat Sisihkan ke Tabungan, pilih kantong tabungan supaya uangnya ikut pindah ke sana.
                  </Text>
                )}
              </View>
            ))}
          </>
        ) : (
          <View style={styles.empty}>
            <MaterialIcons name="account-balance-wallet" size={40} color={COLORS.primary} />
            <Text style={styles.emptyTitle}>Uangmu ada di mana saja?</Text>
            <Text style={styles.emptyText}>
              Tambahkan rekening dan e-wallet kamu, misal BCA, Blu, GoPay, atau tunai. Isi saldonya sekali, selanjutnya ikut berubah tiap kamu mencatat uang masuk & keluar.
            </Text>
            <Button title="Tambah kantong pertama" onPress={() => nav.navigate('AccountForm', {})} fullWidth style={{ marginTop: SPACING.lg }} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Legend({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <View style={styles.legendItem}>
      <View style={styles.legendHead}>
        <View style={[styles.legendDot, { backgroundColor: color }]} />
        <Text style={styles.legendLabel}>{label}</Text>
      </View>
      <Text style={styles.legendValue} numberOfLines={1}>{formatCurrency(value)}</Text>
    </View>
  );
}

function HeroAction({
  icon,
  label,
  onPress,
  disabled,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.action, disabled && { opacity: 0.4 }]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <MaterialIcons name={icon} size={ICON_SIZES.md} color={COLORS.heroText} />
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.md },
  title: { fontSize: FONTS.xxl, fontWeight: '800', color: COLORS.text },
  historyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.primarySoft,
  },
  historyLabel: { fontSize: FONTS.sm, fontWeight: '700', color: COLORS.primary },
  hero: { backgroundColor: COLORS.primaryDark, borderRadius: RADIUS.xl, padding: SPACING.xl, ...SHADOWS.lg },
  heroLabel: { fontSize: FONTS.sm, color: COLORS.heroMuted, fontWeight: '600' },
  heroAmount: { fontSize: FONTS.xxxl, fontWeight: '800', color: COLORS.heroText, marginTop: SPACING.xs, letterSpacing: -0.5 },
  split: { flexDirection: 'row', height: 8, gap: 3, marginTop: SPACING.lg },
  splitPart: { height: 8, minWidth: 8, borderRadius: RADIUS.round },
  legend: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.md },
  legendItem: { flex: 1 },
  legendHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: FONTS.xs, color: COLORS.heroMuted, fontWeight: '600' },
  legendValue: { fontSize: FONTS.md, color: COLORS.heroText, fontWeight: '700', marginTop: 2 },
  actions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.lg },
  action: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  actionLabel: { fontSize: FONTS.sm, fontWeight: '700', color: COLORS.heroText },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginTop: SPACING.xl, marginBottom: SPACING.sm },
  section: { flex: 1, fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text },
  sectionTotal: { fontSize: FONTS.md, fontWeight: '700', color: COLORS.textSecondary },
  list: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingLeft: SPACING.lg,
    paddingRight: SPACING.sm,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: SPACING.md, minHeight: 64 },
  rowBorder: { borderTopWidth: 1, borderTopColor: COLORS.subtleBg },
  icon: { width: 40, height: 40, borderRadius: RADIUS.round, alignItems: 'center', justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  name: { fontSize: FONTS.md, fontWeight: '700', color: COLORS.text, flexShrink: 1 },
  badge: { backgroundColor: COLORS.primarySoft, borderRadius: RADIUS.round, paddingHorizontal: 6, paddingVertical: 1 },
  badgeText: { fontSize: FONTS.xs, fontWeight: '700', color: COLORS.primary },
  meta: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: 2 },
  amount: { fontSize: FONTS.md, fontWeight: '700', color: COLORS.text },
  footnote: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: SPACING.md, lineHeight: 18 },
  empty: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    padding: SPACING.xl,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyTitle: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text, marginTop: SPACING.md },
  emptyText: { fontSize: FONTS.sm, color: COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.sm, lineHeight: 20 },
});
