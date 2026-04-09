import type { DataPoint, EcosRow } from '@/types';
import { getMonthlyDateRange, getDailyDateRange } from '@/lib/utils/date';
import type { Period, Currency } from '@/types';

const BASE = 'https://ecos.bok.or.kr/api/StatisticSearch';
const KEY = process.env.ECOS_API_KEY!;

const FX_CODE: Record<Currency, string> = {
  USD: '0000001',
  JPY: '0000002',
  EUR: '0000003',
};

async function fetchEcos(url: string): Promise<EcosRow[]> {
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`ECOS API 오류: ${res.status}`);
  const json = await res.json();
  const resultCode = json?.StatisticSearch?.RESULT?.CODE;
  const resultMsg = json?.StatisticSearch?.RESULT?.MESSAGE;
  if (resultCode && resultCode !== 'INFO-000') {
    throw new Error(`ECOS 오류(${resultCode}): ${resultMsg ?? '응답 오류'}`);
  }
  const rows = json?.StatisticSearch?.row;
  if (!rows || rows.length === 0) return [];
  return rows as EcosRow[];
}

function toPoints(rows: EcosRow[]): DataPoint[] {
  return rows
    .filter((r) => r.DATA_VALUE !== '')
    .map((r) => ({ date: r.TIME, value: parseFloat(r.DATA_VALUE) }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function getInterestRate(period: Period): Promise<DataPoint[]> {
  const { start, end } = getMonthlyDateRange(period);
  const url = `${BASE}/${KEY}/json/kr/1/300/722Y001/M/${start}/${end}/0101000`;
  const rows = await fetchEcos(url);
  const points = toPoints(rows);
  if (points.length > 0) return points;

  // 현재 시점에 최신 통계가 지연되는 경우를 대비해 더 넓은 기간으로 재조회
  const fallbackUrl = `${BASE}/${KEY}/json/kr/1/1200/722Y001/M/201001/${end}/0101000`;
  const fallbackRows = await fetchEcos(fallbackUrl);
  return toPoints(fallbackRows);
}

export async function getExchangeRate(currency: Currency, period: Period): Promise<DataPoint[]> {
  const { start, end } = getDailyDateRange(period);
  const code = FX_CODE[currency];
  const url = `${BASE}/${KEY}/json/kr/1/600/731Y001/D/${start}/${end}/${code}`;
  const rows = await fetchEcos(url);
  const points = toPoints(rows);
  if (points.length > 0) return points;

  // 일별 환율 데이터가 비어 있으면 과거 장기 범위로 한 번 더 조회
  const fallbackUrl = `${BASE}/${KEY}/json/kr/1/4000/731Y001/D/20180101/${end}/${code}`;
  const fallbackRows = await fetchEcos(fallbackUrl);
  return toPoints(fallbackRows);
}
