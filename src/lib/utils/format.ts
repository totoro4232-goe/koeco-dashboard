export function formatYearMonth(yyyymm: string): string {
  return `${yyyymm.slice(0, 4)}년 ${yyyymm.slice(4)}월`;
}

export function formatDate(yyyymmdd: string): string {
  return `${yyyymmdd.slice(0, 4)}.${yyyymmdd.slice(4, 6)}.${yyyymmdd.slice(6)}`;
}

export function formatShortDate(dateStr: string): string {
  if (dateStr.length === 6) return `${dateStr.slice(2, 4)}.${dateStr.slice(4)}`;
  return `${dateStr.slice(2, 4)}.${dateStr.slice(4, 6)}.${dateStr.slice(6)}`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString('ko-KR');
}

export function formatSigned(n: number, digits = 2): string {
  return (n > 0 ? '+' : '') + n.toFixed(digits);
}
