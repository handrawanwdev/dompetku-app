import { FinancialProfile } from '../FinancialAnalyzer';
import { RuleResult } from '../types';

// PRD §8.1 — Cashflow Rule: saving_rate < 10%.
export function evaluateCashflowRule(profile: FinancialProfile): RuleResult | null {
  if (profile.savingRate < 10) {
    return {
      category: 'CASHFLOW',
      severity: profile.savingRate < 0 ? 'critical' : 'warning',
      output: 'Saving rate rendah',
      recommendation: 'Targetkan saving minimal 20%',
    };
  }
  return null;
}
