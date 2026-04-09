import { getInterestRate, getExchangeRate } from '@/lib/api/ecos';
import { getCPI } from '@/lib/api/kosis';
import SummaryCard from '@/components/dashboard/SummaryCard';
import PeriodFilter from '@/components/dashboard/PeriodFilter';
import SummaryBanner from '@/components/dashboard/SummaryBanner';
import ChartWrapper from '@/components/charts/ChartWrapper';
import LineChart from '@/components/charts/LineChart';
import BarLineChart from '@/components/charts/BarLineChart';
import type { Period } from '@/types';
import { formatSigned, formatNumber } from '@/lib/utils/format';

interface PageProps {
  searchParams: { period?: string };
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const period = (searchParams.period ?? '1y') as Period;

  const [rateResult, fxResult, cpiResult] = await Promise.allSettled([
    getInterestRate(period),
    getExchangeRate('USD', period),
    getCPI(period),
  ]);

  const rateData = rateResult.status === 'fulfilled' ? rateResult.value : [];
  const fxData = fxResult.status === 'fulfilled' ? fxResult.value : [];
  const cpiData = cpiResult.status === 'fulfilled' ? cpiResult.value : [];
  const rateHasData = rateData.length > 0;
  const fxHasData = fxData.length > 0;
  const cpiHasData = cpiData.length > 0;

  const rateCurrent = rateData.at(-1)?.value ?? 0;
  const ratePrev = rateData.at(-2)?.value ?? 0;
  const rateChange = parseFloat((rateCurrent - ratePrev).toFixed(2));

  const fxCurrent = fxData.at(-1)?.value ?? 0;
  const fxPrev = fxData.at(-2)?.value ?? 0;
  const fxChange = parseFloat((fxCurrent - fxPrev).toFixed(2));
  const fxChangeRate = fxPrev ? parseFloat(((fxChange / fxPrev) * 100).toFixed(2)) : 0;

  const cpiCurrent = cpiData.at(-1)?.value ?? 0;
  const cpiPrev = cpiData.at(-2)?.value ?? 0;
  const cpiChange = parseFloat((cpiCurrent - cpiPrev).toFixed(2));

  return (
    <div className="max-w-6xl mx-auto px-6 py-9">
      <PeriodFilter current={period} />

      <p className="font-mono text-[11px] tracking-widest uppercase text-gray-500 mb-4">핵심 지표 현황</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <SummaryCard
          tag="기준금리 · BOK"
          value={rateHasData ? rateCurrent.toString() : '-'}
          unit="%"
          change={rateChange}
          changeLabel={`${formatSigned(rateChange)}%p 전월 대비`}
          updatedAt={rateData.at(-1)?.date ?? ''}
          href="/detail/interest-rate"
          error={
            rateResult.status === 'rejected'
              ? String(rateResult.reason)
              : !rateHasData
                ? '해당 기간의 데이터가 없습니다.'
                : null
          }
        />
        <SummaryCard
          tag="원/달러 환율 · BOK"
          value={fxHasData ? formatNumber(fxCurrent) : '-'}
          unit="원"
          change={fxChange}
          changeLabel={`${formatSigned(fxChange)}원 (${formatSigned(fxChangeRate)}%) 전일 대비`}
          updatedAt={fxData.at(-1)?.date ?? ''}
          href="/detail/exchange-rate"
          error={
            fxResult.status === 'rejected'
              ? String(fxResult.reason)
              : !fxHasData
                ? '해당 기간의 데이터가 없습니다.'
                : null
          }
        />
        <SummaryCard
          tag="소비자물가지수 · KOSIS"
          value={cpiHasData ? cpiCurrent.toString() : '-'}
          unit="p"
          change={cpiChange}
          changeLabel={`${formatSigned(cpiChange)}p 전월 대비`}
          updatedAt={cpiData.at(-1)?.date ?? ''}
          href="/detail/cpi"
          error={
            cpiResult.status === 'rejected'
              ? String(cpiResult.reason)
              : !cpiHasData
                ? '해당 기간의 데이터가 없습니다.'
                : null
          }
        />
      </div>

      <p className="font-mono text-[11px] tracking-widest uppercase text-gray-500 mb-4">추이 차트</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ChartWrapper title="기준금리 추이" sub="% / 월별">
          <LineChart data={rateData} color="#4f8ef7" unit="%" />
        </ChartWrapper>
        <ChartWrapper title="원/달러 환율 추이" sub="원 / 일별">
          <LineChart data={fxData} color="#34d399" unit="원" />
        </ChartWrapper>
      </div>
      <ChartWrapper title="소비자물가지수 (CPI) 추이" sub="지수 / 월별">
        <BarLineChart data={cpiData} barColor="#4f8ef7" lineColor="#fbbf24" unit="p" />
      </ChartWrapper>

      <SummaryBanner
        rateData={{ current: rateCurrent, prev: ratePrev }}
        fxData={{ current: fxCurrent, prev: fxPrev }}
        cpiData={{ current: cpiCurrent }}
      />
    </div>
  );
}
