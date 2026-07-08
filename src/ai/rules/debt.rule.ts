import { FinancialProfile } from '../FinancialAnalyzer';
import { RuleResult } from '../types';

// PRD §8.3 — Debt Rule: debt_ratio > 35%.
export function evaluateDebtRule(profile: FinancialProfile): RuleResult | null {
  if (profile.debtRatio > 35) {
    return {
      category: 'DEBT',
      severity: profile.debtRatio > 50 ? 'critical' : 'warning',
      output: 'Beban hutang tinggi',
      recommendation: 'Kurangi cicilan sebelum menambah investasi',
    };
  }
  return null;
}
