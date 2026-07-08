import { FinancialProfile } from './FinancialAnalyzer';
import { RuleCategory, RuleResult } from './types';

// PRD §11 — action plans derived from triggered rules.
export interface RecommendationStep {
  order: number;
  action: string;
  target?: string;
}

export interface RecommendationPlan {
  category: RuleCategory;
  problem: string;
  steps: RecommendationStep[];
}

/** Only produces a plan for categories whose rule actually triggered — no plan needed when things are healthy. */
export function generateRecommendations(profile: FinancialProfile, rules: RuleResult[]): RecommendationPlan[] {
  const plans: RecommendationPlan[] = [];

  for (const rule of rules) {
    switch (rule.category) {
      case 'CASHFLOW':
        plans.push({
          category: 'CASHFLOW',
          problem: `Saving rate ${profile.savingRate}%`,
          steps: [
            { order: 1, action: 'Kurangi pengeluaran konsumtif', target: 'Rp500.000/bulan' },
            { order: 2, action: 'Naikkan saving rate menjadi 20%' },
          ],
        });
        break;
      case 'EMERGENCY':
        plans.push({
          category: 'EMERGENCY',
          problem: `Dana darurat ${profile.emergencyMonth} bulan`,
          steps: [
            { order: 1, action: 'Sisihkan dana darurat rutin tiap bulan', target: '3-6 bulan biaya hidup' },
            { order: 2, action: 'Tunda instrumen investasi berisiko sampai dana darurat aman' },
          ],
        });
        break;
      case 'DEBT':
        plans.push({
          category: 'DEBT',
          problem: `Rasio cicilan hutang ${profile.debtRatio}%`,
          steps: [
            { order: 1, action: 'Percepat pelunasan hutang dengan bunga tertinggi', target: 'Rasio <35%' },
            { order: 2, action: 'Tunda penambahan hutang baru' },
          ],
        });
        break;
      case 'INVESTMENT':
        plans.push({
          category: 'INVESTMENT',
          problem: 'Belum ada investasi aktif',
          steps: [
            { order: 1, action: 'Mulai investasi rutin bulanan (reksadana/saham/emas)', target: 'Minimal 10% income' },
          ],
        });
        break;
      case 'FREEDOM':
        plans.push({
          category: 'FREEDOM',
          problem: rule.output,
          steps: [{ order: 1, action: rule.recommendation }],
        });
        break;
    }
  }

  return plans;
}
