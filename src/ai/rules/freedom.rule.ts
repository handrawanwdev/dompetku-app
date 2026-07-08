import { FinancialProfile } from '../FinancialAnalyzer';
import { RuleResult } from '../types';

/** Overall Financial Freedom trajectory rule — complements the four PRD §8 rules with a whole-picture check. */
export function evaluateFreedomRule(profile: FinancialProfile): RuleResult | null {
  if (profile.score < 30) {
    return {
      category: 'FREEDOM',
      severity: 'critical',
      output: 'Masih jauh dari Financial Freedom',
      recommendation: 'Fokus perbaiki cashflow dan dana darurat terlebih dahulu',
    };
  }
  if (profile.score < 60) {
    return {
      category: 'FREEDOM',
      severity: 'warning',
      output: 'Progress menuju Financial Freedom masih bertahap',
      recommendation: 'Konsisten perbaiki sub-skor yang paling lemah tiap bulan',
    };
  }
  return null;
}
