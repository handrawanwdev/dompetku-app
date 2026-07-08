import { FinancialScoreInput } from '../utils/financialScore';
import { analyzeFinancialProfile, FinancialProfile } from './FinancialAnalyzer';
import { runAllRules } from './rules';
import { generateInsights, FinancialInsight } from './InsightGenerator';
import { generateRecommendations, RecommendationPlan } from './RecommendationEngine';

export type FinancialHealthLabel = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL';

// PRD §10 — Financial Score Explanation.
export interface ScoreContributor {
  label: string;
  /** Weighted contribution to the 0-100 score, e.g. +18 */
  points: number;
}

export interface ScoreExplanation {
  score: number;
  positives: ScoreContributor[];
  negatives: ScoreContributor[];
}

// PRD §13 — Smart Financial Suggestion (applied to the Emergency Fund gap).
export interface SmartSuggestion {
  label: string;
  currentMonthlyAmount: number;
  currentMonths: number;
  fasterMonthlyAmount: number;
  fasterMonths: number;
}

// PRD §12 — AI Financial Card (dashboard component).
export interface AIFinancialCard {
  healthLabel: FinancialHealthLabel;
  insightText: string;
  attentionText: string;
  nextActionText: string;
  profile: FinancialProfile;
  insights: FinancialInsight[];
  recommendations: RecommendationPlan[];
  scoreExplanation: ScoreExplanation;
  smartSuggestion: SmartSuggestion | null;
}

function getHealthLabel(score: number): FinancialHealthLabel {
  if (score >= 80) return 'EXCELLENT';
  if (score >= 60) return 'GOOD';
  if (score >= 40) return 'FAIR';
  if (score >= 20) return 'POOR';
  return 'CRITICAL';
}

const CONTRIBUTOR_LABELS: Record<string, { positive: string; negative: string; weight: number }> = {
  cashflowScore: { positive: 'Cashflow sehat', negative: 'Cashflow belum stabil', weight: 0.25 },
  emergencyScore: { positive: 'Dana darurat aman', negative: 'Dana darurat belum maksimal', weight: 0.2 },
  debtScore: { positive: 'Hutang terkendali', negative: 'Beban hutang tinggi', weight: 0.2 },
  investmentScore: { positive: 'Investasi aktif', negative: 'Investasi masih minim', weight: 0.2 },
  passiveScore: { positive: 'Passive income berjalan', negative: 'Passive income rendah', weight: 0.15 },
};

function buildScoreExplanation(profile: FinancialProfile): ScoreExplanation {
  const positives: ScoreContributor[] = [];
  const negatives: ScoreContributor[] = [];
  const d = profile.scoreDetail;

  const entries: Array<[number, keyof typeof CONTRIBUTOR_LABELS]> = [
    [d.cashflowScore, 'cashflowScore'],
    [d.emergencyScore, 'emergencyScore'],
    [d.debtScore, 'debtScore'],
    [d.investmentScore, 'investmentScore'],
    [d.passiveScore, 'passiveScore'],
  ];

  for (const [subscore, key] of entries) {
    const meta = CONTRIBUTOR_LABELS[key];
    const points = Math.round(subscore * meta.weight);
    if (subscore >= 60) positives.push({ label: meta.positive, points });
    else negatives.push({ label: meta.negative, points });
  }

  return { score: profile.score, positives, negatives };
}

/** "What if I saved faster?" — PRD §13 example applied to closing the Emergency Fund gap. */
function buildSmartSuggestion(
  emergencyFund: { current: number; target: number },
  monthlySavingPace: number,
): SmartSuggestion | null {
  const gap = emergencyFund.target - emergencyFund.current;
  if (gap <= 0 || monthlySavingPace <= 0) return null;

  const currentMonths = Math.ceil(gap / monthlySavingPace);
  const fasterMonthlyAmount = Math.round(monthlySavingPace * 1.5);
  const fasterMonths = Math.ceil(gap / fasterMonthlyAmount);

  return { label: 'Dana Darurat', currentMonthlyAmount: monthlySavingPace, currentMonths, fasterMonthlyAmount, fasterMonths };
}

/** Top-level orchestrator (PRD §16 Main Flow): analyze → run rules → generate insights → generate recommendations → AI card. Pure and synchronous — no network, no storage. */
export function buildFinancialAdvisorReport(
  input: FinancialScoreInput,
  emergencyFund: { current: number; target: number },
  monthlySavingPace: number,
): AIFinancialCard {
  const profile = analyzeFinancialProfile(input);
  const rules = runAllRules(profile);
  const insights = generateInsights(profile, rules);
  const recommendations = generateRecommendations(profile, rules);
  const scoreExplanation = buildScoreExplanation(profile);
  const smartSuggestion = buildSmartSuggestion(emergencyFund, monthlySavingPace);

  const healthLabel = getHealthLabel(profile.score);
  const positiveInsight = insights.find((i) => i.severity === 'info') ?? insights[0];
  const concern = insights.find((i) => i.severity !== 'info') ?? null;
  const topStep = recommendations[0]?.steps[0];

  return {
    healthLabel,
    insightText: positiveInsight
      ? `${positiveInsight.title}: ${positiveInsight.description.split('\n')[0]}`
      : 'Data belum cukup untuk dianalisa.',
    attentionText: concern
      ? `${concern.title}: ${concern.description.split('\n')[0]}`
      : 'Tidak ada perhatian khusus saat ini.',
    nextActionText: topStep
      ? `${topStep.action}${topStep.target ? ' — Target: ' + topStep.target : ''}`
      : 'Pertahankan kebiasaan finansial saat ini.',
    profile,
    insights,
    recommendations,
    scoreExplanation,
    smartSuggestion,
  };
}
