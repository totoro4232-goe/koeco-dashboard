import type { CmaDataPoint } from '@/types';
import { getDailyDateRange } from '@/lib/utils/date';
import type { Period } from '@/types';

const KEY = process.env.KOSIS_API_KEY!;
let lastSuccessfulCmaHistory: CmaDataPoint[] = [];

export async function getCmaData(period: Period): Promise<CmaDataPoint[]> {
  const { start, end } = getDailyDateRange(period);
  const baseParams = {
    serviceKey: KEY,
    resultType: 'json',
    numOfRows: '300',
    pageNo: '1',
  };

  // 공공데이터포털의 실제 동작 경로 우선 사용 (/service 경로는 404 케이스 존재)
  const endpointBases = [
    'https://apis.data.go.kr/1160100/GetFinaStatInfoService_V2/getCmaInfInqire',
    'https://apis.data.go.kr/1160100/GetFinaStatInfoService/getCmaInfInqire',
  ];

  let items: any = null;
  let lastError = '';

  // 오늘 데이터가 없을 수 있어 최근 10일(영업일 포함)까지 역순 재시도
  const dateCandidates: string[] = [end];
  const endDate = new Date(
    Number(end.slice(0, 4)),
    Number(end.slice(4, 6)) - 1,
    Number(end.slice(6, 8)),
  );
  for (let i = 1; i <= 10; i += 1) {
    const d = new Date(endDate);
    d.setDate(d.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    dateCandidates.push(`${y}${m}${day}`);
  }

  outer: for (const base of endpointBases) {
    for (const basDd of dateCandidates) {
      const params = new URLSearchParams({ ...baseParams, basDd });
      const url = `${base}?${params}`;
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (!res.ok) {
        const bodyText = await res.text().catch(() => '');
        if (!lastError) {
          lastError = `FSC API 오류: ${res.status}${bodyText ? ` (${bodyText.slice(0, 80)})` : ''}`;
        }
        continue;
      }

      const json = await res.json();
      const resultMsg = json?.response?.header?.resultMsg;
      const resultCode = json?.response?.header?.resultCode;
      if (resultCode && resultCode !== '00') {
        if (!lastError) lastError = `FSC API 오류: ${resultMsg ?? resultCode}`;
        continue;
      }

      items = json?.response?.body?.items?.item;
      if (items) break outer;
    }
  }

  // 배포 환경/권한 상태에 따라 CMA API가 간헐 실패할 수 있어 빈 배열로 안전 폴백
  if (!items) return [];

  const arr = Array.isArray(items) ? items : [items];
  const parsed = arr
    .filter((r: any) => r.basDd && r.cmaBlce && r.basDd >= start && r.basDd <= end)
    .map((r: any) => ({
      date: r.basDd,
      balance: parseFloat(String(r.cmaBlce).replace(/,/g, '')),
      change: parseFloat(String(r.dyyInvstNtrSm ?? '0').replace(/,/g, '')),
    }))
    .sort((a: CmaDataPoint, b: CmaDataPoint) => a.date.localeCompare(b.date));

  if (parsed.length > 0) {
    lastSuccessfulCmaHistory = parsed;
    return parsed;
  }

  // 이번 호출에서 데이터가 비어도 직전 성공 수집분이 있으면 유지
  return lastSuccessfulCmaHistory;
}
