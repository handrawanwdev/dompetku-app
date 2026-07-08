export type AchievementType = 'first_saving' | 'debt_killer' | 'first_investor' | 'freedom_seeker';

export interface AchievementDef {
  type: AchievementType;
  icon: string;
  title: string;
  description: string;
}

// PRD §14 — achievement catalogue.
export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  { type: 'first_saving', icon: '🥉', title: 'First Saving', description: 'Menabung pertama kali' },
  { type: 'debt_killer', icon: '🥇', title: 'Debt Killer', description: 'Melunasi hutang' },
  { type: 'first_investor', icon: '📈', title: 'First Investor', description: 'Investasi pertama' },
  { type: 'freedom_seeker', icon: '💎', title: 'Freedom Seeker', description: 'Financial Freedom Score di atas 80' },
];
