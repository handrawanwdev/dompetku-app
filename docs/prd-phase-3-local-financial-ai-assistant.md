# PRD — Phase 3

# Local Financial AI Assistant — Dompetku

## Version

v1.0

---

# 1. Overview

Local Financial AI Assistant adalah sistem intelligence offline pada aplikasi Dompetku yang bertugas sebagai financial coach pribadi.

Fitur ini menggunakan pendekatan:

- Financial Analyzer
- Rule Based AI Engine
- Insight Generator
- Recommendation Engine

tanpa membutuhkan:

- backend AI
- external API
- cloud processing

Semua analisa dilakukan secara lokal menggunakan data finansial user.

---

# 2. Background

Dompetku sudah memiliki:

- transaksi
- income
- expense
- aset
- hutang
- investasi
- financial freedom score
- financial level

Namun user masih membutuhkan:

- pemahaman kondisi finansial
- alasan score berubah
- rekomendasi tindakan
- prioritas perbaikan

Local Financial AI Assistant mengubah data menjadi insight yang mudah dipahami.

---

# 3. Goals

## User Goals

User dapat:

- memahami kondisi finansialnya
- mengetahui masalah utama finansial
- mendapatkan rekomendasi personal
- mengetahui langkah berikutnya menuju financial freedom

## Product Goals

- meningkatkan engagement
- meningkatkan financial awareness
- membuat Dompetku menjadi financial coach

---

# 4. Scope

## Included

Phase 3 mencakup:

1. Financial Analyzer
2. Rule Based AI Engine
3. Financial Insight Generator
4. Recommendation Engine
5. Score Explanation
6. Smart Financial Suggestion

---

# 5. Non Goals

Tidak termasuk:

- ChatGPT seperti conversation
- LLM lokal
- Voice assistant
- Cloud AI
- Machine learning training

---

# 6. System Architecture

```
Financial Data

(Transaction)
(Asset)
(Debt)
(Investment)
(Score)

        |
        v

Financial Analyzer

        |
        v

Rule Engine

        |
        v

Insight Generator

        |
        v

Recommendation System

        |
        v

AI Financial Card
```

---

# 7. Financial Analyzer

## Description

Service yang mengubah data finansial user menjadi financial profile.

## Input

- monthly income
- monthly expense
- saving
- debt
- asset
- investment
- passive income
- financial score

## Output

```json
{
  "income": 10000000,
  "expense": 7000000,
  "savingRate": 30,
  "debtRatio": 20,
  "emergencyMonth": 4,
  "investmentRatio": 10,
  "score": 72,
  "level": "FLEXIBLE"
}
```

---

# 8. Rule Based AI Engine

## Description

Engine yang melakukan analisa menggunakan rule.

## Rule Category

## 8.1 Cashflow Rule

Condition:

```
saving_rate < 10%
```

Output:

```
Saving rate rendah
```

Recommendation:

```
Targetkan saving minimal 20%
```

---

## 8.2 Emergency Fund Rule

Condition:

```
emergency_month < 3
```

Output:

```
Dana darurat belum aman
```

Recommendation:

```
Prioritaskan membangun dana darurat
```

---

## 8.3 Debt Rule

Condition:

```
debt_ratio > 35%
```

Output:

```
Beban hutang tinggi
```

Recommendation:

```
Kurangi cicilan sebelum menambah investasi
```

---

## 8.4 Investment Rule

Condition:

```
investment_ratio == 0
```

Output:

```
Belum memiliki aset produktif
```

Recommendation:

```
Mulai investasi rutin
```

---

# 9. Insight Generator

## Description

Mengubah hasil rule menjadi informasi yang mudah dimengerti.

## Example

Input:

```
Emergency Fund = 1 bulan
```

Output:

```
🛡 Dana Darurat

Kondisi kamu masih berisiko.

Saat ini dana darurat cukup untuk 1 bulan.

Target minimum:
3-6 bulan biaya hidup.
```

---

# 10. Financial Score Explanation

## Description

Menjelaskan alasan score.

## Example

```
Financial Freedom Score

72/100


Kontributor positif:

✓ Cashflow sehat +25
✓ Hutang terkendali +15
✓ Investasi aktif +12


Penghambat:

⚠ Passive income rendah
⚠ Dana darurat belum maksimal
```

---

# 11. Recommendation Engine

## Description

Memberikan action plan berdasarkan kondisi user.

## Example

Problem:

```
Saving rate 8%
```

Recommendation:

```
Action Plan:

1.
Kurangi pengeluaran konsumtif

Target:
Rp500.000/bulan


2.
Naikkan saving rate menjadi 15%
```

---

# 12. AI Financial Card

## Dashboard Component

```
🤖 Dompetku AI


Financial Health

GOOD


Insight:

Cashflow kamu sehat.


Attention:

Dana darurat perlu ditingkatkan.


Next Action:

Tambah Rp1 juta/bulan ke dana darurat.
```

---

# 13. Smart Financial Suggestion

## Description

Memberikan target finansial otomatis.

Example:

Input:

```
Emergency fund:

5 juta

Target:

30 juta

Saving:

1 juta/bulan
```

Output:

```
Target tercapai:

25 bulan


Jika saving:

1.5 juta/bulan

Target tercapai:

17 bulan
```

---

# 14. Data Model

## financial_insights

```
id

user_id

type

category

title

description

priority

status

created_at
```

Category:

```
CASHFLOW
DEBT
INVESTMENT
EMERGENCY
FREEDOM
```

---

## financial_recommendations

```
id

user_id

category

recommendation

target_value

current_value

status

created_at
```

---

# 15. Service Architecture

```
src/

ai/

 ├── FinancialAdvisorService.ts

 ├── FinancialAnalyzer.ts

 ├── InsightGenerator.ts

 ├── RecommendationEngine.ts

 └── rules/

      ├── cashflow.rule.ts

      ├── debt.rule.ts

      ├── investment.rule.ts

      ├── emergency.rule.ts

      └── freedom.rule.ts
```

---

# 16. Main Flow

```
User Open Dashboard

        |

Load Financial Data

        |

Analyze Profile

        |

Run Rules

        |

Generate Insight

        |

Display AI Card

```

---

# 17. Performance Requirement

Target:

- analysis < 100ms
- offline capable
- no network request
- deterministic result

---

# 18. MVP Feature List

## Must Have

✅ Financial Analyzer

✅ Rule Engine

✅ Insight Generator

✅ Recommendation Engine

✅ Score Explanation

✅ Dashboard AI Card

---

# 19. Future Enhancement

## Phase 4

Possible:

- local LLM
- conversational assistant
- personalized financial planning
- prediction model

---

# 20. Definition of Done

Feature dianggap selesai jika:

✅ User mendapatkan financial insight otomatis

✅ Recommendation berdasarkan kondisi user

✅ Tidak membutuhkan internet

✅ Tidak membutuhkan backend AI

✅ Insight berubah mengikuti kondisi finansial user

✅ Terintegrasi dengan Financial Freedom Score

---
