import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@realm/react';

import { COLORS, FONTS, SPACING, RADIUS } from '../../../theme';
import { Card } from '../../../components/common/Card';
import { BackButton } from '../../../components/common/BackButton';
import { FinancialMilestoneModel } from '../../../models/FinancialMilestoneModel';
import { ACHIEVEMENT_DEFS, AchievementType } from '../../../utils/achievements';
import { formatDate } from '../../../utils/date';
import { SettingsStackParamList } from './SettingsMainScreen';

type NavProp = NativeStackNavigationProp<SettingsStackParamList, 'AchievementsScreen'>;

interface Props { navigation: NavProp; }

export function AchievementsScreen({ navigation }: Props) {
  const milestones = useQuery(FinancialMilestoneModel);
  const achievedMap = new Map<AchievementType, Date>(
    milestones.map((m) => [m.type as AchievementType, m.achievedAt]),
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} color={COLORS.text} />
        </View>

        <Text style={styles.title}>🏆 Achievements</Text>
        <Text style={styles.subtitle}>
          {achievedMap.size} / {ACHIEVEMENT_DEFS.length} badge terbuka
        </Text>

        {ACHIEVEMENT_DEFS.map((def) => {
          const achievedAt = achievedMap.get(def.type);
          const isUnlocked = !!achievedAt;
          return (
            <Card key={def.type} padding={SPACING.lg} style={isUnlocked ? styles.badgeCard : { ...styles.badgeCard, ...styles.badgeCardLocked }}>
              <Text style={[styles.badgeIcon, !isUnlocked && styles.badgeIconLocked]}>{isUnlocked ? def.icon : '🔒'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.badgeTitle, !isUnlocked && styles.badgeTitleLocked]}>{def.title}</Text>
                <Text style={styles.badgeDesc}>{def.description}</Text>
                {isUnlocked && <Text style={styles.badgeDate}>Diraih {formatDate(achievedAt!)}</Text>}
              </View>
            </Card>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md, marginLeft: -SPACING.sm },
  title: { fontSize: FONTS.xxl, fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: SPACING.xs, marginBottom: SPACING.lg },
  badgeCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.primary + '40' },
  badgeCardLocked: { borderColor: COLORS.border, opacity: 0.6 },
  badgeIcon: { fontSize: 36 },
  badgeIconLocked: { opacity: 0.5 },
  badgeTitle: { fontSize: FONTS.md, fontWeight: '700', color: COLORS.text },
  badgeTitleLocked: { color: COLORS.textMuted },
  badgeDesc: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: 2 },
  badgeDate: { fontSize: FONTS.xs, color: COLORS.income, marginTop: 4, fontWeight: '600' },
});
