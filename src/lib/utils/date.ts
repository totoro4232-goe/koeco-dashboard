export type Period = '6m' | '1y' | '3y';

export function getMonthlyDateRange(period: Period): { start: string; end: string } {
  const now = new Date();
  const end = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
  const start = new Date(now);
  if (period === '6m') start.setMonth(start.getMonth() - 6);
  else if (period === '1y') start.setFullYear(start.getFullYear() - 1);
  else start.setFullYear(start.getFullYear() - 3);
  const s = start;
  return {
    start: `${s.getFullYear()}${String(s.getMonth() + 1).padStart(2, '0')}`,
    end,
  };
}

export function getDailyDateRange(period: Period): { start: string; end: string } {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const fmt = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const start = new Date(now);
  if (period === '6m') start.setMonth(start.getMonth() - 6);
  else if (period === '1y') start.setFullYear(start.getFullYear() - 1);
  else start.setFullYear(start.getFullYear() - 3);
  return { start: fmt(start), end: fmt(now) };
}
