export function calcDepreciation(
  purchasePrice: number,
  residualValue: number,
  usefulLife: number,
  purchaseDate: string
): number {
  const yearsOwned = (Date.now() - new Date(purchaseDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
  const annualDepreciation = (purchasePrice - residualValue) / usefulLife;
  const totalDepreciation = Math.min(annualDepreciation * yearsOwned, purchasePrice - residualValue);
  return Math.max(purchasePrice - totalDepreciation, residualValue);
}

export function calcROI(buyPrice: number, currentValue: number, quantity: number): number {
  const invested = buyPrice * quantity;
  const current = currentValue * quantity;
  if (invested === 0) return 0;
  return ((current - invested) / invested) * 100;
}

export function calcProfitLoss(buyPrice: number, currentPrice: number, quantity: number): number {
  return (currentPrice - buyPrice) * quantity;
}

export function calcGoalProgress(current: number, target: number): number {
  if (target === 0) return 0;
  return Math.min((current / target) * 100, 100);
}

export function calcDebtRatio(monthlyInstallment: number, monthlyIncome: number): number {
  if (monthlyIncome === 0) return 0;
  return (monthlyInstallment / monthlyIncome) * 100;
}

export function generateFinancialSuggestion(params: {
  debtRatio: number;
  debtRatioLimit: number;
  cashflow: number;
  netWorth: number;
  totalSavings: number;
  monthlyIncome: number;
}): string {
  const { debtRatio, debtRatioLimit, cashflow, totalSavings, monthlyIncome } = params;

  if (debtRatio > debtRatioLimit) {
    return `Rasio hutang kamu ${debtRatio.toFixed(0)}% melebihi batas ${debtRatioLimit}%. Pertimbangkan untuk melunasi hutang lebih cepat.`;
  }
  if (cashflow < 0) {
    return 'Pengeluaran melebihi pemasukan bulan ini. Coba kurangi pengeluaran tidak penting.';
  }
  if (totalSavings < monthlyIncome * 3) {
    return 'Dana darurat kamu masih kurang dari 3x gaji. Prioritaskan menabung untuk dana darurat.';
  }
  return 'Kondisi keuangan kamu baik! Pertahankan pola pengeluaran saat ini.';
}
