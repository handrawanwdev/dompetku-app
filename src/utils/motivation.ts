import type { FinancialScoreResult } from './financialScore';
import { getQuotesForCategory, type QuoteCategory } from '../data/motivationQuotes';

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

/** Index of the current 6-hour window since epoch — same value for everyone within that window. */
export function getSixHourBucket(now: Date = new Date()): number {
  return Math.floor(now.getTime() / SIX_HOURS_MS);
}

/** Deterministic PRNG (mulberry32) seeded from the bucket index, so the same window always reproduces the same picks. */
function seededRandom(seed: number): () => number {
  let t = seed;
  return function () {
    t |= 0;
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Picks which quote category best matches the user's current financial
 * state, so the notification feels targeted instead of random noise:
 * - Struggling broadly (worst sub-score very low) → reinforce money mindset
 *   half the time, the specific weak area the other half.
 * - One dimension clearly weak → motivate that exact dimension (e.g. high
 *   debt load → debt freedom, thin emergency fund → saving).
 * - Everything healthy → maintenance categories (daily discipline / goal
 *   achievement) to keep good habits going instead of nagging about a
 *   problem that doesn't exist.
 */
export function pickMotivationCategory(
  score: FinancialScoreResult,
  random: () => number = Math.random,
): QuoteCategory {
  const dimensions: Array<{ value: number; category: QuoteCategory }> = [
    { value: score.debtScore, category: 'debt_freedom' },
    { value: score.cashflowScore, category: 'budgeting' },
    { value: score.emergencyScore, category: 'saving' },
    { value: score.investmentScore, category: 'investment' },
    { value: score.passiveScore, category: 'goal_achievement' },
  ];

  const worst = dimensions.reduce((min, d) => (d.value < min.value ? d : min), dimensions[0]);

  if (worst.value < 40) {
    return random() < 0.5 ? 'money_mindset' : worst.category;
  }
  if (worst.value < 70) {
    return worst.category;
  }
  return random() < 0.5 ? 'daily_discipline' : 'goal_achievement';
}

export interface ScheduledMotivation {
  category: QuoteCategory;
  quote: string;
  /** The 6-hour window this pick belongs to — unchanged until the next window starts. */
  bucket: number;
}

/**
 * The single system-chosen category + quote for the current 6-hour window.
 * Deterministic: calling this repeatedly within the same window (dashboard
 * re-renders, the background notification check, app relaunches) always
 * returns the exact same result — it only changes once the window rolls
 * over. Not user-changeable by design.
 */
export function getScheduledMotivation(
  score: FinancialScoreResult,
  now: Date = new Date(),
): ScheduledMotivation {
  const bucket = getSixHourBucket(now);
  const rng = seededRandom(bucket);
  const category = pickMotivationCategory(score, rng);
  const quotes = getQuotesForCategory(category);
  const quote = quotes[Math.floor(rng() * quotes.length)];
  return { category, quote, bucket };
}
