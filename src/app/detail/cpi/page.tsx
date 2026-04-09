import { getCPI } from '@/lib/api/kosis';
import DetailHeader from '@/components/detail/DetailHeader';
import StatCard from '@/components/detail/StatCard';
import ChartWrapper from '@/components/charts/ChartWrapper';
import BarLineChart from '@/components/charts/BarLineChart';
import type { Period } from '@/types';

interface PageProps {
  searchParams: { period?: string };
}

export default async function CpiPage({ searchParams }: PageProps) {
  const period = (searchParams.period ?? '3y') as Period;
  const data = await getCPI(period).catch(() => []);
  const hasData = data.length > 0;

  const current = data.at(-1)?.value ?? 0;
  const high = hasData ? Math.max(...data.map((d) => d.value)) : 0;
  const low = hasData ? Math.min(...data.map((d) => d.value)) : 0;
  const avg = hasData ? parseFloat((data.reduce((s, d) => s + d.value, 0) / data.length).toFixed(2)) : 0;

  return (
    <div className="max-w-4xl mx-auto px-6 py-9">
      <DetailHeader title="소비자물가지수 상세" back="/" relatedLabel="기준금리도 함께 보기" relatedHref="/detail/interest-rate" />

      <div className="bg-bg-secondary border border-border rounded-2xl p-8 mb-6 text-center">
        <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-2">소비자물가지수 (CPI)</p>
        <p className="font-mono text-7xl font-medium text-white">
          {current}
          <span className="text-3xl text-gray-400 ml-2">p</span>
        </p>
        <p className="text-sm text-gray-500 mt-3">2020년 기준 = 100</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="최고" value={`${high}p`} />
        <StatCard label="최저" value={`${low}p`} />
        <StatCard label="평균" value={`${avg}p`} />
      </div>

      <ChartWrapper title="소비자물가지수 추이" sub="지수 / 월별">
        {hasData ? (
          <BarLineChart data={data} barColor="#4f8ef7" lineColor="#fbbf24" unit="p" height={300} />
        ) : (
          <p className="text-sm text-gray-400">선택한 기간의 데이터가 없어 차트를 표시할 수 없습니다.</p>
        )}
      </ChartWrapper>

      <details className="bg-bg-secondary border border-border rounded-xl mt-4 p-5 group">
        <summary className="cursor-pointer text-sm font-medium text-gray-300 flex justify-between items-center">
          소비자물가지수(CPI)란?
          <span className="font-mono text-gray-500 group-open:rotate-180 transition-transform">▾</span>
        </summary>
        <p className="mt-4 text-sm text-gray-400 leading-relaxed">
          소비자물가지수(CPI, Consumer Price Index)는 가계가 일상적으로 소비하는 상품과 서비스의 평균 가격 변동을 측정하는
          지표입니다. 통계청이 매월 발표하며, 2020년 평균을 100으로 기준 삼아 계산합니다. 한국은행은 중기 물가 안정 목표를
          소비자물가 상승률 2%로 설정하고 있습니다.
        </p>
      </details>
    </div>
  );
}
