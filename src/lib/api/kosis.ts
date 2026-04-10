import type { DataPoint, KosisRow } from '@/types';
import { getMonthlyDateRange } from '@/lib/utils/date';
import type { Period } from '@/types';

const KEY = process.env.KOSIS_API_KEY!;
const ECOS_KEY = process.env.ECOS_API_KEY!;

interface EcosCpiRow {
  TIME: string;
  DATA_VALUE: string;
}

export async function getCPI(period: Period): Promise<DataPoint[]> {
  const { start, end } = getMonthlyDateRange(period);
  const params = new URLSearchParams({
    method: 'getList',
    apiKey: KEY,
    itmId: 'T10',
    objL1: 'ALL',
    objL2: '',
    format: 'json',
    jsonVD: 'Y',
    prdSe: 'M',
    startPrdDe: start,
    endPrdDe: end,
    orgId: '101',
    tblId: 'DT_1J20004',
  });

  const urls = [
    `https://kosis.kr/openapi/statisticsData.do?${params}`,
    `https://kosis.kr/openapi/statisticsParameterData.do?${params}`,
    `https://kosis.kr/openapi/Param/statisticsParameterData.do?${params}`,
    `https://kosis.kr/openapi/Param/statisticsParamData.do?${params}`,
  ];

  let lastError: string | null = null;
  let detailedError: string | null = null;

  for (const url of urls) {
    try {
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (!res.ok) {
        if (!detailedError) lastError = `KOSIS API 오류: ${res.status}`;
        continue;
      }

      const raw = await res.json();
      const rows: KosisRow[] = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.result)
          ? (raw.result as KosisRow[])
          : [];

      if (rows.length === 0) {
        const errMsg = raw?.errMsg || raw?.err || raw?.message || raw?.msg;
        if (errMsg) detailedError = `KOSIS: ${String(errMsg)}`;
        continue;
      }

      return rows
        .filter((r) => r.PRD_DE && r.DT)
        .map((r) => ({ date: r.PRD_DE, value: parseFloat(r.DT) }))
        .sort((a, b) => a.date.localeCompare(b.date));
    } catch (e) {
      // Vercel 등에서 kosis.kr 연결이 끊기면 fetch가 throw → ECOS 대체까지 가지 못함
      lastError = e instanceof Error ? e.message : String(e);
      continue;
    }
  }

  // KOSIS 실패 시 ECOS CPI(901Y009, 총지수=0)로 자동 대체
  try {
    const ecosUrl = `https://ecos.bok.or.kr/api/StatisticSearch/${ECOS_KEY}/json/kr/1/500/901Y009/M/${start}/${end}/0`;
    const ecosRes = await fetch(ecosUrl, { next: { revalidate: 3600 } });
    if (ecosRes.ok) {
      const ecosJson = await ecosRes.json();
      const ecosRows: EcosCpiRow[] = ecosJson?.StatisticSearch?.row ?? [];
      if (Array.isArray(ecosRows) && ecosRows.length > 0) {
        return ecosRows
          .filter((r) => r.TIME && r.DATA_VALUE !== '')
          .map((r) => ({ date: r.TIME, value: parseFloat(r.DATA_VALUE) }))
          .sort((a, b) => a.date.localeCompare(b.date));
      }
    }
  } catch (e) {
    lastError = e instanceof Error ? e.message : String(e);
  }

  throw new Error(detailedError ?? lastError ?? 'KOSIS/ECOS: 데이터가 없습니다.');
}
