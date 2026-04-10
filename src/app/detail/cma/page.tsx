import { getCmaData } from '@/lib/api/fsc';
import DetailHeader from '@/components/detail/DetailHeader';
import StatCard from '@/components/detail/StatCard';
import ChartWrapper from '@/components/charts/ChartWrapper';
import LineChart from '@/components/charts/LineChart';
import type { Period } from '@/types';
import { formatNumber } from '@/lib/utils/format';

interface PageProps {
  searchParams: { period?: string };
}

export default async function CmaPage({ searchParams }: PageProps) {
  const period = (searchParams.period ?? '1y') as Period;
  const data = await getCmaData(period).catch(() => []);
  const hasData = data.length > 0;

  const current = data.at(-1)?.balance ?? 0;
  const high = hasData ? Math.max(...data.map((d) => d.balance)) : 0;
  const low = hasData ? Math.min(...data.map((d) => d.balance)) : 0;
  const avg = hasData ? parseFloat((data.reduce((s, d) => s + d.balance, 0) / data.length).toFixed(2)) : 0;

  const chartData = data.map((d) => ({ date: d.date, value: d.balance }));

  return (
    <div className="max-w-4xl mx-auto px-6 py-9">
      <DetailHeader title="CMA 잔고 상세" back="/" relatedLabel="기준금리도 함께 보기" relatedHref="/detail/interest-rate" />
      <div
        className={`mb-4 rounded-xl border px-4 py-3 text-sm font-mono ${
          hasData ? 'border-up/30 bg-up/10 text-up' : 'border-amber/30 bg-amber/10 text-amber'
        }`}
      >
        {hasData ? '상태: 정상 수집' : '상태: API 응답 지연 (최근 데이터 수집 대기)'}
      </div>

      <div className="bg-bg-secondary border border-border rounded-2xl p-8 mb-6 text-center">
        <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-2">CMA 잔고</p>
        <p className="font-mono text-7xl font-medium text-white">
          {formatNumber(current)}
          <span className="text-3xl text-gray-400 ml-2">억원</span>
        </p>
        <p className="text-sm text-gray-500 mt-3">금융투자협회 종합통계 기준</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="최고" value={`${formatNumber(high)}억원`} />
        <StatCard label="최저" value={`${formatNumber(low)}억원`} />
        <StatCard label="평균" value={`${formatNumber(avg)}억원`} />
      </div>

      <ChartWrapper title="CMA 잔고 추이" sub="억원 / 일별">
        {hasData ? (
          <LineChart data={chartData} color="#34d399" unit="억원" height={280} />
        ) : (
          <p className="text-sm text-gray-400">선택한 기간의 데이터가 없어 차트를 표시할 수 없습니다.</p>
        )}
      </ChartWrapper>

      <details className="bg-bg-secondary border border-border rounded-xl mt-4 p-5 group">
        <summary className="cursor-pointer text-sm font-medium text-gray-300 flex justify-between items-center">
          CMA(종합자산관리계좌)란?
          <span className="font-mono text-gray-500 group-open:rotate-180 transition-transform">▾</span>
        </summary>
        <p className="mt-4 text-sm text-gray-400 leading-relaxed">
          CMA는 증권사가 고객 예탁금을 단기 금융상품에 투자해 수익을 돌려주는 계좌입니다. 금리가 오를수록 CMA 잔고가
          늘어나는 경향이 있어 기준금리와 밀접하게 연관됩니다. 잔고 증가는 시중 유동성이 안전자산으로 이동하는 신호로
          해석됩니다.
        </p>
      </details>
    </div>
  );
}
