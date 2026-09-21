import type { FinancialScoreResult } from './financialScore';
import { getQuotesForCategory, type QuoteCategory } from '../data/motivationQuotes';

export type MotivationSlot = 'pagi' | 'siang' | 'sore' | 'malam';

/** Which of the 4 fixed slots `now` falls into — pagi 07–11, siang 12–16, sore 17–20, malam 21–06. */
export function getMotivationSlot(now: Date = new Date()): MotivationSlot {
  const hour = now.getHours();
  if (hour >= 7 && hour < 12) return 'pagi';
  if (hour >= 12 && hour < 17) return 'siang';
  if (hour >= 17 && hour < 21) return 'sore';
  return 'malam';
}

/** Stable per-day-per-slot key, e.g. "2026-09-21-sore" — same slot on the same day always resolves the same way. */
export function getMotivationBucketKey(now: Date = new Date()): string {
  const day = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  return `${day}-${getMotivationSlot(now)}`;
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (Math.imul(31, hash) + value.charCodeAt(i)) | 0;
  }
  return hash;
}

/** Deterministic PRNG (mulberry32) seeded from the bucket key, so the same slot always reproduces the same pick. */
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

function worstScore(score: FinancialScoreResult): number {
  return Math.min(
    score.debtScore,
    score.cashflowScore,
    score.emergencyScore,
    score.investmentScore,
    score.passiveScore,
  );
}

/**
 * Picks which of the current slot's two candidate categories best matches
 * the user's financial state, so the notification feels targeted:
 * - Pagi: struggling broadly → money mindset, otherwise goal achievement.
 * - Siang: weak cashflow → budgeting, otherwise daily discipline.
 * - Sore: whichever of the emergency fund / debt load is weaker.
 * - Malam: struggling broadly → daily discipline, otherwise goal achievement.
 */
export function pickMotivationCategory(score: FinancialScoreResult, slot: MotivationSlot): QuoteCategory {
  switch (slot) {
    case 'pagi':
      return worstScore(score) < 40 ? 'money_mindset' : 'goal_achievement';
    case 'siang':
      return score.cashflowScore < 70 ? 'budgeting' : 'daily_discipline';
    case 'sore':
      return score.emergencyScore <= score.debtScore ? 'saving' : 'debt_freedom';
    case 'malam':
      return worstScore(score) < 70 ? 'daily_discipline' : 'goal_achievement';
  }
}

export interface ScheduledMotivation {
  category: QuoteCategory;
  quote: string;
  slot: MotivationSlot;
  /** The per-day-per-slot key this pick belongs to — unchanged until the next slot starts. */
  bucketKey: string;
}

/**
 * The single system-chosen category + quote for the current fixed slot
 * (07:00/12:00/17:00/21:00). Deterministic: calling this repeatedly within
 * the same slot (dashboard re-renders, the background notification check,
 * app relaunches) always returns the exact same result — it only changes
 * once the next slot starts. Not user-changeable by design.
 */
export function getScheduledMotivation(
  score: FinancialScoreResult,
  now: Date = new Date(),
): ScheduledMotivation {
  const slot = getMotivationSlot(now);
  const bucketKey = getMotivationBucketKey(now);
  const rng = seededRandom(hashString(bucketKey));
  const category = pickMotivationCategory(score, slot);
  const quotes = getQuotesForCategory(category);
  const quote = quotes[Math.floor(rng() * quotes.length)];
  return { category, quote, slot, bucketKey };
}
