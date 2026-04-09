import { getInterestRate } from '@/lib/api/ecos';
import DetailHeader from '@/components/detail/DetailHeader';
import StatCard from '@/components/detail/StatCard';
import ChangeTable from '@/components/detail/ChangeTable';
import ChartWrapper from '@/components/charts/ChartWrapper';
import LineChart from '@/components/charts/LineChart';
import type { Period } from '@/types';

interface PageProps {
  searchParams: { period?: string };
}

export default async function InterestRatePage({ searchParams }: PageProps) {
  const period = (searchParams.period ?? '3y') as Period;
  const data = await getInterestRate(period).catch(() => []);
  const hasData = data.length > 0;

  const current = data.at(-1)?.value ?? 0;
  const high = hasData ? Math.max(...data.map((d) => d.value)) : 0;
  const low = hasData ? Math.min(...data.map((d) => d.value)) : 0;
  const avg = hasData ? parseFloat((data.reduce((s, d) => s + d.value, 0) / data.length).toFixed(2)) : 0;

  const changes = data.filter((d, i) => i === 0 || d.value !== data[i - 1].value);

  return (
    <div className="max-w-4xl mx-auto px-6 py-9">
      <DetailHeader title="기준금리 상세" back="/" relatedLabel="환율도 함께 보기" relatedHref="/detail/exchange-rate" />

      <div className="bg-bg-secondary border border-border rounded-2xl p-8 mb-6 text-center">
        <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-2">현재 기준금리</p>
        <p className="font-mono text-7xl font-medium text-white">
          {current}
          <span className="text-3xl text-gray-400 ml-2">%</span>
        </p>
        <p className="text-sm text-gray-500 mt-3">한국은행 금융통화위원회 결정</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="최고" value={`${high}%`} />
        <StatCard label="최저" value={`${low}%`} />
        <StatCard label="평균" value={`${avg}%`} />
      </div>

      <ChartWrapper title="기준금리 장기 추이" sub="% / 월별">
        {hasData ? (
          <LineChart data={data} color="#4f8ef7" unit="%" height={280} />
        ) : (
          <p className="text-sm text-gray-400">선택한 기간의 데이터가 없어 차트를 표시할 수 없습니다.</p>
        )}
      </ChartWrapper>

      {hasData ? (
        <ChangeTable
          title="금리 변경 이력"
          columns={['날짜', '금리', '변동폭']}
          rows={changes
            .slice()
            .reverse()
            .map((d, i, arr) => {
              const prev = arr[i + 1]?.value;
              const diff = prev != null ? parseFloat((d.value - prev).toFixed(2)) : null;
              return {
                date: d.date,
                value: `${d.value}%`,
                change: diff != null ? `${diff > 0 ? '+' : ''}${diff}%p` : '-',
                direction: diff != null ? (diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat') : 'flat',
              };
            })}
        />
      ) : (
        <div className="bg-bg-secondary border border-border rounded-2xl p-6 mt-4 text-sm text-gray-400">
          변경 이력을 불러올 데이터가 없습니다.
        </div>
      )}

      <details className="bg-bg-secondary border border-border rounded-xl mt-4 p-5 group">
        <summary className="cursor-pointer text-sm font-medium text-gray-300 flex justify-between items-center">
          기준금리란 무엇인가요?
          <span className="font-mono text-gray-500 group-open:rotate-180 transition-transform">▾</span>
        </summary>
        <p className="mt-4 text-sm text-gray-400 leading-relaxed">
          기준금리는 한국은행이 금융기관과 거래할 때 기준이 되는 정책금리입니다. 금리를 올리면 시중 대출금리가 오르고
          소비·투자가 줄어 물가 상승을 억제하며, 금리를 내리면 반대로 경기를 부양하는 효과가 있습니다. 금융통화위원회는 연
          8회 회의를 열어 기준금리를 결정합니다.
        </p>
      </details>
    </div>
  );
}
