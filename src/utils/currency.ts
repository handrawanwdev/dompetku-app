export function formatCurrency(amount: number, currency = 'IDR'): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format Indonesia: koma desimal, tanpa ",0" (6jt, 6,2jt, 1,5M)
const oneDecimal = (v: number) => v.toFixed(1).replace(/\.0$/, '').replace('.', ',');

export function formatCompact(amount: number): string {
  if (Math.abs(amount) >= 1_000_000_000) {
    return `${oneDecimal(amount / 1_000_000_000)}M`;
  }
  if (Math.abs(amount) >= 1_000_000) {
    return `${oneDecimal(amount / 1_000_000)}jt`;
  }
  if (Math.abs(amount) >= 1_000) {
    return `${(amount / 1_000).toFixed(0)}rb`;
  }
  return amount.toString();
}

export function parseCurrency(value: string): number {
  return parseFloat(value.replace(/[^0-9.-]/g, '')) || 0;
}
