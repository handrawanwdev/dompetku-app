import { FinancialProfile } from '../FinancialAnalyzer';
import { RuleResult } from '../types';

// PRD §8.4 — Investment Rule: investment_ratio == 0.
export function evaluateInvestmentRule(profile: FinancialProfile): RuleResult | null {
  if (profile.investmentRatio <= 0) {
    return {
      category: 'INVESTMENT',
      severity: 'warning',
      output: 'Belum memiliki aset produktif',
      recommendation: 'Mulai investasi rutin',
    };
  }
  return null;
}
