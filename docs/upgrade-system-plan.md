# Financial Freedom Level System — Implementation Plan

Derived from `docs/upgrade-system.md` (PRD). Task IDs reference the session task list.

## Phase 1 — MVP (must have)

1. **Score engine** — `src/utils/financialScore.ts`
   Pure functions for the 5 sub-scores (PRD §6):
   - Cashflow Health (saving rate) — 25%
   - Emergency Fund (coverage months) — 20%
   - Debt Health (debt ratio) — 20%
   - Investment Health — 20%
   - Passive Income ratio — 15%
   Weighted total = Financial Freedom Score. Inputs come from existing
   income/expense/debt/saving/investment Realm queries — no new schema needed here.

2. **Level system** — score → level lookup (PRD §4)
   10 levels, 0 Financial Chaos → 9 Legacy, with score ranges + name + icon.
   Helper: `getLevel(score)`, `getNextLevel(score)`, `scoreNeededForNext(score)`.
   Depends on: (1).

3. **FinancialScoreModel** — Realm schema (PRD §16 `financial_scores`)
   Fields: score, cashflow_score, emergency_score, debt_score, investment_score,
   passive_score, level, created_at. Recompute + snapshot on dashboard open
   (or daily), gives history for trend later.
   Depends on: (1), (2).

4. **Dashboard: Financial Freedom Card** (PRD §7)
   Level name + icon, score /100, progress bar, next level name, score gap.
   Placed on `DashboardScreen`.
   Depends on: (3).

5. **Level Progression detail view** (PRD §8)
   Current level, achieved checklist (e.g. emergency fund 3mo, cashflow positive),
   missing checklist (investment rutin, passive income) — derived from which
   sub-scores already cross their threshold vs not.
   Depends on: (4).

6. **Net Worth Tracker** (PRD §9)
   Net Worth = (savings + investment + physical asset) − total debt.
   Monthly snapshot history + growth chart + % change. Reuse the
   `GroupedBarChart` pattern already built for `ReportScreen`.

7. **Emergency Fund module** (PRD §10)
   Target vs current dana darurat, coverage in months vs monthly expense,
   status badge (SAFE/WARNING/DANGER). Needs a way to flag a saving pos as
   "dana darurat" (new field or convention) — decide before building.

8. **Debt Freedom progress module** (PRD §11)
   Total debt, paid so far, progress %, estimated freedom date from remaining
   months across active debts. Likely extends the existing kewajiban card on
   `DebtListScreen` rather than a new screen.

## Phase 2 — Nice to have

9. **FIRE Calculator** (PRD §12)
   FIRE Number = annual expense × 25. Show current progress % and remaining
   amount needed. New screen under Settings or Dashboard.

10. **Passive Income tracker** (PRD §13 + `passive_income` model)
    New Realm model: category (dividen/properti/bisnis/royalti/yield), amount,
    frequency. New module: list + form screens. Progress vs freedom target
    (passive income ≥ expense).

11. **Achievement system** (PRD §14 + `financial_milestones` model)
    Achievements: First Saving, Debt Killer, First Investor, Freedom Seeker
    (score > 80). Auto-unlock check triggered on relevant data changes;
    badge list UI.
    Depends on: (1).

12. **Financial Recommendation engine** (PRD §15)
    Rule-based tips from sub-scores (e.g. saving rate < 10% → suggest cutting
    consumptive expense + a concrete extra-saving target). Rendered as a card
    list on dashboard or its own section.
    Depends on: (1).

## Phase 3 — Advanced (not planned)

AI Financial Advisor, personalized financial plan, freedom-date prediction —
skipped. Not actionable without AI/backend infra; app is offline-first/local.

## Dependency graph

```
(1) Score engine
 ├─▶ (2) Level system
 │     └─▶ (3) FinancialScoreModel
 │           └─▶ (4) Dashboard card
 │                 └─▶ (5) Level progression view
 ├─▶ (11) Achievement system
 └─▶ (12) Recommendation engine

(6) Net Worth Tracker        — independent
(7) Emergency Fund module    — independent
(8) Debt Freedom module      — independent
(9) FIRE Calculator          — independent
(10) Passive Income tracker  — independent
```
