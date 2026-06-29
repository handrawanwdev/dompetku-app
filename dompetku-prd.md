# Product Requirements Document (PRD)

# Dompetku Mobile

## React Native Edition

**Version:** 2.0

**Status:** Draft

**Platform:** Android & iOS

**Framework:** React Native (Expo + TypeScript)

---

# 1. Overview

Dompetku Mobile merupakan aplikasi manajemen keuangan pribadi berbasis React Native yang dibangun ulang dari aplikasi HTML + JavaScript menjadi aplikasi mobile dengan arsitektur modular, scalable, dan maintainable.

Aplikasi membantu pengguna mengelola seluruh aktivitas finansial dalam satu tempat, mulai dari pemasukan, pengeluaran, hutang, tabungan, investasi, aset hingga perencanaan keuangan.

---

# 2. Objectives

## Primary Objectives

- Mengelola pemasukan
- Mengelola pengeluaran
- Mengelola hutang
- Mengelola tabungan
- Mengelola investasi
- Mengelola aset fisik
- Mengelola financial goals

## Secondary Objectives

- Menampilkan kondisi keuangan secara real-time
- Membantu mencapai target keuangan
- Memberikan insight terhadap kondisi finansial
- Mendukung penggunaan secara offline

---

# 3. Product Goals

Aplikasi harus mampu menjadi:

- Personal Finance Manager
- Cashflow Tracker
- Debt Manager
- Savings Manager
- Investment Tracker
- Asset Tracker
- Financial Planner

---

# 4. Target Users

- Karyawan
- Freelancer
- UMKM
- Investor
- Pengguna yang ingin mengatur keuangan pribadi

---

# 5. Technology Stack

## Framework

- React Native
- Expo
- TypeScript

## Navigation

- React Navigation

## State Management

- Zustand

## Local Database

- SQLite

## Secure Storage

- MMKV

## Forms

- React Hook Form
- Zod Validation

## Charts

- react-native-svg
- Victory Native XL

## Date

- DayJS

---

# 6. Application Architecture

```
React Native App
        │
        ▼
Presentation Layer
        │
        ▼
Business Layer
        │
        ▼
Repository Layer
        │
        ▼
SQLite
        │
        ▼
JSON Backup
```

---

# 7. Project Structure

```
src/

├── app/
├── navigation/
├── theme/
├── constants/
├── hooks/
├── utils/

├── components/
│
├── modules/
│   ├── dashboard/
│   ├── income/
│   ├── expense/
│   ├── debt/
│   ├── savings/
│   ├── investment/
│   ├── assets/
│   ├── goals/
│   └── settings/
│
├── database/
├── repositories/
├── services/
├── storage/
├── store/
├── models/
└── types/
```

---

# 8. Main Navigation

```
Dashboard

Income

Expense

Debt

Assets

Settings
```

Assets

```
Savings

Investment

Physical Assets
```

Settings

```
Parameter

Category

Goals
```

---

# 9. Modules

---

## Dashboard Module

### Purpose

Menampilkan kondisi keuangan secara keseluruhan.

### Features

- Financial Summary
- Net Worth
- Cash Balance
- Debt Summary
- Savings Summary
- Investment Summary
- Asset Summary
- Financial Goals
- Reminder
- Today's Recommendation
- Cashflow Graph
- Monthly Overview
- Yearly Overview

---

## Income Module

### Features

- Add Income
- Edit Income
- Delete Income
- Income Category
- Notes
- Allocation

### Allocation

Income

↓

Debt

↓

Savings

↓

Cash

### Metrics

- Total Income
- Monthly Income
- Available Cash

---

## Expense Module

### Features

- Add Expense
- Edit Expense
- Delete Expense
- Category
- Notes

Source

- Cash
- Savings

### Metrics

- Total Expense
- Today's Expense
- Monthly Expense

---

## Debt Module

### Features

- Create Debt
- Edit Debt
- Delete Debt
- Payment History
- Remaining Installment
- Due Date
- Early Payment

### Dashboard

- Monthly Installment
- Remaining Debt
- Remaining Months
- Upcoming Payment
- Debt Ratio

---

## Savings Module

### Features

Create Saving Account

Examples

- Emergency Fund
- Vacation
- House
- Wedding
- Vehicle
- Education

Operations

- Deposit
- Withdraw
- Transfer
- Transaction History

Metrics

- Current Balance
- Target
- Progress
- Completion %

---

## Investment Module

Supported

- Stock
- Crypto
- Gold
- Mutual Fund
- Bond
- Property

Features

- Buy
- Sell
- Portfolio
- Allocation
- Profit Loss
- ROI

---

## Physical Asset Module

Supported

- Laptop
- Phone
- Vehicle
- House
- Electronics
- Furniture

Features

- Purchase Price
- Purchase Date
- Useful Life
- Residual Value
- Depreciation
- Current Estimated Value

---

## Financial Goals Module

Features

- Create Goal
- Deadline
- Target Amount
- Linked Savings
- Progress
- Estimated Completion

Examples

- Buy House
- Wedding
- Vacation
- New Laptop
- Emergency Fund

---

## Settings Module

### Parameters

- Debt Ratio Limit
- Working Days
- Holidays

### Categories

Income Categories

Expense Categories

### Backup

- Export JSON
- Import JSON
- Reset Data

---

# 10. Dashboard Widgets

## Financial Summary

- Cash
- Savings
- Investment
- Assets
- Debt
- Net Worth

---

## Cashflow

- Last 7 Days
- Last 30 Days
- Last 12 Months

---

## Reminder

- Upcoming Debt
- Due Date
- Goal Deadline

---

## Goals

- Progress
- Remaining Amount
- Estimated Finish

---

## Financial Suggestion

Automatically generated recommendation based on financial condition.

---

# 11. Data Models

## Income

```ts
interface Income {
  id: number;
  date: string;
  category: string;
  amount: number;
  note?: string;

  allocation: {
    debt: number;
    savings: number;
    cash: number;
  };
}
```

---

## Expense

```ts
interface Expense {
  id: number;
  date: string;
  category: string;
  amount: number;
  source: "cash" | "saving";
  note?: string;
}
```

---

## Debt

```ts
interface Debt {
  id: number;
  name: string;
  monthlyInstallment: number;
  remainingMonth: number;
  dueDate: number;
  lastPayment: string;
}
```

---

## Saving

```ts
interface Saving {
  id: number;

  name: string;

  target: number;

  balance: number;

  history: SavingHistory[];
}
```

---

## Investment

```ts
interface Investment {
  id: number;

  type: string;

  name: string;

  amount: number;

  quantity: number;

  currentValue: number;
}
```

---

## Physical Asset

```ts
interface PhysicalAsset {
  id: number;

  name: string;

  purchasePrice: number;

  residualValue: number;

  usefulLife: number;
}
```

---

## Goal

```ts
interface Goal {
  id: number;

  name: string;

  target: number;

  deadline: string;

  savingId: number;
}
```

---

# 12. Financial Calculations

## Cash

```
Cash

=

Income

-

Expense

-

Transfer
```

---

## Savings

```
Saving Balance

=

Deposit

-

Withdraw
```

---

## Net Worth

```
Cash

+

Savings

+

Investment

+

Assets

-

Debt
```

---

## Cashflow

```
Income

-

Expense
```

---

## Debt Ratio

```
Monthly Installment

/

Monthly Income
```

---

## Goal Progress

```
Saving Balance

/

Goal Target
```

---

# 13. Offline First

Semua data berjalan tanpa internet.

Storage

- SQLite
- MMKV

Backup

- JSON Export
- JSON Import

---

# 14. Performance Requirements

- Startup < 2 detik
- Navigation < 200 ms
- Offline First
- Smooth 60 FPS
- Lazy Loading
- Virtualized List
- Minimal Re-render

---

# 15. Future Roadmap

## Phase 2

- Multiple Wallet
- Multiple Currency
- Budget Planning
- Recurring Income
- Recurring Expense
- Notification
- Financial Calendar

## Phase 3

- Cloud Sync
- Authentication
- OCR Receipt
- AI Recommendation
- Bank Integration
- Crypto Exchange Integration
- Web Dashboard

---

# 16. Success Metrics

- Seluruh data tersimpan secara offline
- Backup & Restore berhasil 100%
- Perhitungan Net Worth akurat
- Dashboard diperbarui secara real-time
- Navigasi antar halaman < 200 ms
- Struktur kode modular dan mudah dikembangkan
- Mendukung penambahan fitur baru tanpa mengubah arsitektur utama
- Siap dikembangkan menjadi aplikasi cloud pada fase berikutnya
