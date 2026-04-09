import { getExchangeRate } from '@/lib/api/ecos';
import DetailHeader from '@/components/detail/DetailHeader';
import StatCard from '@/components/detail/StatCard';
import ChartWrapper from '@/components/charts/ChartWrapper';
import LineChart from '@/components/charts/LineChart';
import type { Period, Currency } from '@/types';
import { formatNumber } from '@/lib/utils/format';

interface PageProps {
  searchParams: { period?: string; currency?: string };
}

const CURRENCIES: { code: Currency; label: string; color: string }[] = [
  { code: 'USD', label: '원/달러', color: '#4f8ef7' },
  { code: 'JPY', label: '원/100엔', color: '#fbbf24' },
  { code: 'EUR', label: '원/유로', color: '#34d399' },
];

export default async function ExchangeRatePage({ searchParams }: PageProps) {
  const period = (searchParams.period ?? '1y') as Period;
  const currency = (searchParams.currency ?? 'USD') as Currency;
  const data = await getExchangeRate(currency, period).catch(() => []);
  const hasData = data.length > 0;
  const cfg = CURRENCIES.find((c) => c.code === currency)!;

  const current = data.at(-1)?.value ?? 0;
  const prev = data.at(-2)?.value ?? 0;
  const change = parseFloat((current - prev).toFixed(2));
  const high = hasData ? Math.max(...data.map((d) => d.value)) : 0;
  const low = hasData ? Math.min(...data.map((d) => d.value)) : 0;
  const avg = hasData ? parseFloat((data.reduce((s, d) => s + d.value, 0) / data.length).toFixed(2)) : 0;

  return (
    <div className="max-w-4xl mx-auto px-6 py-9">
      <DetailHeader title="환율 상세" back="/" relatedLabel="물가도 함께 보기" relatedHref="/detail/cpi" />

      <div className="flex gap-2 mb-6">
        {CURRENCIES.map((c) => (
          <a
            key={c.code}
            href={`/detail/exchange-rate?currency=${c.code}&period=${period}`}
            className={`font-mono text-xs px-4 py-2 rounded-full border transition-all ${
              currency === c.code
                ? 'bg-accent border-accent text-white'
                : 'border-border text-gray-400 hover:border-accent hover:text-white'
            }`}
          >
            {c.code}
          </a>
        ))}
      </div>

      <div className="bg-bg-secondary border border-border rounded-2xl p-8 mb-6 text-center">
        <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-2">{cfg.label}</p>
        <p className="font-mono text-7xl font-medium text-white">
          {formatNumber(current)}
          <span className="text-3xl text-gray-400 ml-2">원</span>
        </p>
        <p className={`text-sm mt-3 font-mono ${change > 0 ? 'text-up' : change < 0 ? 'text-down' : 'text-gray-400'}`}>
          {change > 0 ? '▲' : change < 0 ? '▼' : '─'} {Math.abs(change)}원 전일 대비
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="최고" value={`${formatNumber(high)}원`} />
        <StatCard label="최저" value={`${formatNumber(low)}원`} />
        <StatCard label="평균" value={`${formatNumber(avg)}원`} />
      </div>

      <ChartWrapper title={`${cfg.label} 추이`} sub="원 / 일별 (5일 간격 샘플링)">
        {hasData ? (
          <LineChart data={data.filter((_, i) => i % 5 === 0)} color={cfg.color} unit="원" height={280} />
        ) : (
          <p className="text-sm text-gray-400">선택한 기간의 데이터가 없어 차트를 표시할 수 없습니다.</p>
        )}
      </ChartWrapper>

      <details className="bg-bg-secondary border border-border rounded-xl mt-4 p-5 group">
        <summary className="cursor-pointer text-sm font-medium text-gray-300 flex justify-between items-center">
          환율이 오르면 어떤 영향이 있나요?
          <span className="font-mono text-gray-500 group-open:rotate-180 transition-transform">▾</span>
        </summary>
        <p className="mt-4 text-sm text-gray-400 leading-relaxed">
          원/달러 환율이 오르면(원화 약세) 수출기업은 유리하지만, 수입 물가가 올라 소비자 부담이 커집니다.
          해외여행·직구 비용이 증가하고, 달러 부채가 있는 기업의 이자 부담도 늘어납니다. 반대로 환율이 내리면 수입 물가가
          안정되지만 수출 경쟁력이 약해질 수 있습니다.
        </p>
      </details>
    </div>
  );
}
