import { FinancialProfile } from '../FinancialAnalyzer';
import { RuleResult } from '../types';
import { evaluateCashflowRule } from './cashflow.rule';
import { evaluateEmergencyRule } from './emergency.rule';
import { evaluateDebtRule } from './debt.rule';
import { evaluateInvestmentRule } from './investment.rule';
import { evaluateFreedomRule } from './freedom.rule';

const RULES = [
  evaluateCashflowRule,
  evaluateEmergencyRule,
  evaluateDebtRule,
  evaluateInvestmentRule,
  evaluateFreedomRule,
];

/** Runs every rule against the profile and returns only the ones that triggered. */
export function runAllRules(profile: FinancialProfile): RuleResult[] {
  return RULES.map((rule) => rule(profile)).filter((r): r is RuleResult => r !== null);
}
