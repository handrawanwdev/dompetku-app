import { FinancialProfile } from './FinancialAnalyzer';
import { RuleCategory, RuleResult, RuleSeverity } from './types';

// PRD §9 — turns rule results into easy-to-understand insight text.
export interface FinancialInsight {
  category: RuleCategory;
  icon: string;
  title: string;
  /** Multi-line, \n-separated description */
  description: string;
  severity: RuleSeverity;
}

const ICON: Record<RuleCategory, string> = {
  CASHFLOW: '💰',
  EMERGENCY: '🛡',
  DEBT: '📋',
  INVESTMENT: '📈',
  FREEDOM: '🕊️',
};

const TITLE: Record<RuleCategory, string> = {
  CASHFLOW: 'Cashflow',
  EMERGENCY: 'Dana Darurat',
  DEBT: 'Beban Hutang',
  INVESTMENT: 'Investasi',
  FREEDOM: 'Financial Freedom',
};

/** One insight per category, always — tone/severity follows whether the matching rule triggered. */
export function generateInsights(profile: FinancialProfile, rules: RuleResult[]): FinancialInsight[] {
  const byCategory = new Map(rules.map((r) => [r.category, r]));

  const cashflow = byCategory.get('CASHFLOW');
  const emergency = byCategory.get('EMERGENCY');
  const debt = byCategory.get('DEBT');
  const investment = byCategory.get('INVESTMENT');
  const freedom = byCategory.get('FREEDOM');

  return [
    {
      category: 'CASHFLOW',
      icon: ICON.CASHFLOW,
      title: TITLE.CASHFLOW,
      severity: cashflow?.severity ?? 'info',
      description: cashflow
        ? `Saving rate kamu saat ini ${profile.savingRate}%. Ini tergolong rendah dan berisiko.\n\nTarget minimum: 20% dari income.`
        : `Saving rate kamu saat ini ${profile.savingRate}%. Cashflow kamu sehat.`,
    },
    {
      category: 'EMERGENCY',
      icon: ICON.EMERGENCY,
      title: TITLE.EMERGENCY,
      severity: emergency?.severity ?? 'info',
      description: emergency
        ? `Kondisi kamu masih berisiko.\n\nSaat ini dana darurat cukup untuk ${profile.emergencyMonth} bulan.\n\nTarget minimum:\n3-6 bulan biaya hidup.`
        : `Dana darurat kamu sudah cukup untuk ${profile.emergencyMonth} bulan pengeluaran. Aman.`,
    },
    {
      category: 'DEBT',
      icon: ICON.DEBT,
      title: TITLE.DEBT,
      severity: debt?.severity ?? 'info',
      description: debt
        ? `Rasio cicilan hutang kamu ${profile.debtRatio}% dari pendapatan bulanan, melebihi batas aman 35%.\n\nPrioritaskan pelunasan sebelum menambah kewajiban baru.`
        : `Rasio cicilan hutang kamu ${profile.debtRatio}% dari pendapatan, masih dalam batas aman.`,
    },
    {
      category: 'INVESTMENT',
      icon: ICON.INVESTMENT,
      title: TITLE.INVESTMENT,
      severity: investment?.severity ?? 'info',
      description: investment
        ? `Kamu belum memiliki aset produktif / instrumen investasi aktif.\n\nMulai alokasikan sebagian income untuk investasi rutin bulanan.`
        : `Alokasi investasi kamu ${profile.investmentRatio}% dari pendapatan tahunan. Terus konsisten.`,
    },
    {
      category: 'FREEDOM',
      icon: ICON.FREEDOM,
      title: TITLE.FREEDOM,
      severity: freedom?.severity ?? 'info',
      description: freedom
        ? `Financial Freedom Score kamu ${profile.score}/100 (Level ${profile.level}). ${freedom.output}.`
        : `Financial Freedom Score kamu ${profile.score}/100 (Level ${profile.level}). Terus jaga konsistensi.`,
    },
  ];
}
