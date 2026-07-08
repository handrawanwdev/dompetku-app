import { FinancialProfile } from '../FinancialAnalyzer';
import { RuleResult } from '../types';

// PRD §8.2 — Emergency Fund Rule: emergency_month < 3.
export function evaluateEmergencyRule(profile: FinancialProfile): RuleResult | null {
  if (profile.emergencyMonth < 3) {
    return {
      category: 'EMERGENCY',
      severity: profile.emergencyMonth < 1 ? 'critical' : 'warning',
      output: 'Dana darurat belum aman',
      recommendation: 'Prioritaskan membangun dana darurat',
    };
  }
  return null;
}
