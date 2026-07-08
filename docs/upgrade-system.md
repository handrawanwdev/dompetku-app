```markdown
# PRD — Financial Freedom Level System Upgrade

## Product: Dompetku

## Version: v1.0

---

# 1. Overview

Financial Freedom Level System merupakan fitur gamifikasi finansial pada aplikasi Dompetku yang bertujuan mengubah aplikasi dari sekadar pencatat keuangan menjadi financial coach pribadi.

Fitur ini membantu user memahami:

- kondisi finansial saat ini
- progress menuju kebebasan finansial
- kelemahan finansial
- langkah berikutnya yang harus dilakukan

User akan memiliki:

- Financial Freedom Score
- Financial Level
- Progress Roadmap
- Achievement
- Financial Recommendation

---

# 2. Problem Statement

Saat ini aplikasi pencatatan keuangan hanya menunjukkan:

- saldo
- transaksi
- aset
- hutang

Namun user tidak mengetahui:

- apakah kondisi finansial sudah sehat?
- apakah sudah dekat dengan financial freedom?
- apa yang harus diperbaiki?
- kapan bisa bebas finansial?

Dompetku membutuhkan sistem evaluasi finansial yang memberikan arah perjalanan.

---

# 3. Goals

## Business Goals

- meningkatkan engagement user
- meningkatkan retention aplikasi
- membuat Dompetku berbeda dari aplikasi finance tracker biasa

## User Goals

User dapat:

- mengetahui level finansial mereka
- mengetahui target berikutnya
- mendapatkan rekomendasi perbaikan
- melihat perkembangan kekayaan

---

# 4. Financial Freedom Level

## Level Definition

| Level | Name                  | Score |
| ----- | --------------------- | ----- |
| 0     | Financial Chaos       | 0-10  |
| 1     | Awareness             | 10-20 |
| 2     | Survivor              | 20-30 |
| 3     | Stable                | 30-45 |
| 4     | Secure                | 45-60 |
| 5     | Flexible              | 60-75 |
| 6     | Financial Independent | 75-85 |
| 7     | Financial Freedom     | 85-95 |
| 8     | Wealth Builder        | 95-99 |
| 9     | Legacy                | 100   |

---

# 5. Financial Freedom Score Engine

## Formula
```

Financial Freedom Score =

Cashflow Health 25%
Emergency Fund 20%
Debt Health 20%
Investment Health 20%
Passive Income 15%

```


---

# 6. Score Component


## 6.1 Cashflow Health

Input:

- total income
- total expense
- saving rate


Formula:


```

Saving Rate =
(Income - Expense) / Income

```


Score:

| Saving Rate | Score |
|-|-|
| <0% | 0 |
| 0-10% | 40 |
| 10-20% | 60 |
| 20-40% | 80 |
| >40% | 100 |


---

## 6.2 Emergency Fund Score


Input:

- Dana Darurat


Formula:

```

Coverage Month =
Emergency Fund / Monthly Expense

```


Score:

| Coverage | Score |
|-|-|
| <1 bulan | 20 |
| 1-3 bulan | 50 |
| 3-6 bulan | 75 |
| 6-12 bulan | 100 |


---

## 6.3 Debt Health


Input:

- total hutang
- cicilan
- income


Formula:


```

Debt Ratio =
Monthly Debt / Monthly Income

```


Score:


| Ratio | Score |
|-|-|
| >50% | 0 |
| 35-50% | 40 |
| 20-35% | 70 |
| <20% |100 |


---

## 6.4 Investment Health


Input:

- investasi aktif
- nilai investasi
- kontribusi investasi


Score:


| Kondisi | Score |
|-|-|
| Tidak investasi | 0 |
| Baru mulai | 40 |
| Investasi rutin |70 |
| Investasi >=20% income |100 |


---

## 6.5 Passive Income


Input:

- pendapatan pasif


Formula:


```

Passive Ratio

=
Passive Income / Expense

```


Score:


| Coverage | Score |
|-|-|
|0%|0|
|<25%|30|
|25-75%|60|
|>=100%|100|


---

# 7. Dashboard Upgrade


Tambahkan card:

## Financial Freedom Card


```

💎 Financial Freedom

Level 4 - Secure

Score

68 /100

████████░░░░

Next Level:

Flexible

Need:

+7 Score

```


---

# 8. Level Progression


User dapat melihat:


```

Current Level

🛡 Secure

Achievement:

✓ Emergency Fund 3 bulan
✓ Cashflow positif

Missing:

○ Investment rutin
○ Passive income

```


---

# 9. Net Worth Tracker


## Feature

Tracking perkembangan kekayaan bersih.


Formula:


```

Net Worth

=
Total Asset - Total Debt

```


Data source:

Asset:
- Tabungan
- Investasi
- Aset fisik


Debt:
- Hutang


Output:


```

Net Worth Growth

Jan
10 juta

Feb
15 juta

Mar
22 juta

+120%

```


---

# 10. Emergency Fund Module


## Feature


Tracking dana darurat.


Display:


```

🛡 Emergency Fund

Target

30 juta

Current

15 juta

Coverage

3 bulan

Status:

SAFE

```


---

# 11. Debt Freedom Module


## Feature


Membantu user bebas hutang.


Display:


```

💳 Debt Freedom

Total Debt

50 juta

Paid

30 juta

Progress

60%

Estimated Freedom:

Aug 2027

```


---

# 12. FIRE Calculator


## Feature


Menghitung target financial freedom.


Formula:


```

FIRE Number

=
Annual Expense x 25

```


Example:


```

Expense:

5 juta/bulan

Target:

1.5 Miliar

```


Output:


```

Current Progress

8%

Need:

1.38 Miliar

```


---

# 13. Passive Income Tracker


## Feature


Track income yang tidak berasal dari kerja aktif.


Kategori:

- Dividen
- Properti
- Bisnis
- Royalti
- Yield


Output:


```

Passive Income

Current:

2 juta/bulan

Freedom Target:

10 juta/bulan

Progress:

20%

```


---

# 14. Achievement System


## Achievement List


## Saving

```

🥉 First Saving

Menabung pertama kali

```


## Debt

```

🥇 Debt Killer

Melunasi hutang

```


## Investment

```

📈 First Investor

Investasi pertama

```


## Freedom

```

💎 Freedom Seeker

Score >80

```


---

# 15. Financial Recommendation Engine


System memberikan rekomendasi otomatis.


Example:


Jika:

```

Saving Rate <10%

```


Recommendation:


```

⚠️ Saving rate rendah

Kurangi pengeluaran konsumtif
Target:

Tambah saving Rp500.000/bulan

```


---

# 16. Data Model


## financial_scores


```

id
user_id

score

cashflow_score
emergency_score
debt_score
investment_score
passive_score

level

created_at

```


---

## financial_milestones


```

id

user_id

type

title

achieved_at

```


---

## passive_income


```

id

user_id

category

amount

frequency

created_at

```

---

# 17. MVP Scope

## Phase 1

Must Have:

- Financial Score
- Level System
- Dashboard Card
- Net Worth
- Emergency Fund Meter
- Debt Progress

---

## Phase 2

Nice To Have:

- FIRE Calculator
- Passive Income
- Achievement
- Recommendation Engine

---

## Phase 3

Advanced:

- AI Financial Advisor
- Personalized Financial Plan
- Prediction Freedom Date

---

# 18. Success Metrics

## User Engagement

- user membuka dashboard score >= 3x/minggu
- user membuat financial goal
- user meningkatkan score

## Financial Improvement

Target:

- saving rate meningkat
- hutang berkurang
- aset meningkat

---

# 19. Definition of Done

Feature selesai jika:

✅ Score dapat dihitung otomatis
✅ Level berubah otomatis
✅ Dashboard menampilkan progress
✅ User mendapat rekomendasi
✅ History score tersimpan
✅ Achievement berjalan otomatis

---

```
