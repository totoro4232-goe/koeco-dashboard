interface Props {
  rateData: { current: number; prev: number };
  fxData: { current: number; prev: number };
  cpiData: { current: number };
}

export default function SummaryBanner({ rateData, fxData, cpiData }: Props) {
  const rateDir =
    rateData.current > rateData.prev ? '인상 기조' : rateData.current < rateData.prev ? '인하 기조' : '동결 유지';
  const fxDir = fxData.current > fxData.prev ? '상승 중' : '하락 중';

  return (
    <div className="bg-bg-secondary border border-border rounded-2xl p-5 mt-4 flex items-start gap-4">
      <span className="text-2xl flex-shrink-0">📊</span>
      <p className="text-sm leading-relaxed text-gray-400">
        현재 한국은행 기준금리는 <strong className="text-white">{rateData.current}%</strong>로{' '}
        <strong className="text-white">{rateDir}</strong>입니다. 원/달러 환율은{' '}
        <strong className="text-white">{fxData.current.toLocaleString()}원</strong>으로 최근{' '}
        <strong className="text-white">{fxDir}</strong>이며, 소비자물가지수는{' '}
        <strong className="text-white">{cpiData.current}p</strong>를 기록하고 있습니다.
      </p>
    </div>
  );
}
