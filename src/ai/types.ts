// Shared types for the Local Financial AI Assistant (PRD §14).

export type RuleCategory = 'CASHFLOW' | 'DEBT' | 'INVESTMENT' | 'EMERGENCY' | 'FREEDOM';
export type RuleSeverity = 'info' | 'warning' | 'critical';

export interface RuleResult {
  category: RuleCategory;
  severity: RuleSeverity;
  /** Short label, e.g. "Saving rate rendah" (PRD §8 "Output") */
  output: string;
  /** Short action, e.g. "Targetkan saving minimal 20%" (PRD §8 "Recommendation") */
  recommendation: string;
}
