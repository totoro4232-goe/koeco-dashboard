import Link from 'next/link';
import type { SummaryCardProps } from '@/types';

export default function SummaryCard({
  tag,
  value,
  unit,
  change,
  changeLabel,
  updatedAt,
  href,
  error,
}: SummaryCardProps) {
  const dir = change > 0 ? 'up' : change < 0 ? 'down' : 'flat';
  const arrow = change > 0 ? '▲' : change < 0 ? '▼' : '─';
  const changeCls = {
    up: 'bg-up/10 text-up',
    down: 'bg-down/10 text-down',
    flat: 'bg-gray-500/10 text-gray-400',
  }[dir];

  return (
    <Link href={href} className="block group">
      <div
        className="relative bg-bg-secondary border border-border rounded-2xl p-6 overflow-hidden
                      transition-all duration-200 group-hover:-translate-y-1
                      group-hover:border-accent group-hover:shadow-[0_8px_30px_rgba(79,142,247,0.12)]
                      animate-fade-up"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.04] to-transparent pointer-events-none" />
        <span className="absolute right-5 top-5 text-border group-hover:text-accent transition-colors text-sm">↗</span>
        <p className="font-mono text-[11px] tracking-widest uppercase text-gray-500 mb-3">{tag}</p>
        <p className="font-mono text-[2.2rem] font-medium leading-none mb-2.5">
          {value}
          <span className="text-lg text-gray-400 ml-1">{unit}</span>
        </p>
        <span className={`inline-flex items-center gap-1 font-mono text-xs px-2.5 py-1 rounded-full ${changeCls}`}>
          {arrow} {changeLabel}
        </span>
        {updatedAt && <p className="mt-2 text-xs text-gray-500">기준: {updatedAt}</p>}
        {error && <p className="mt-2 font-mono text-[11px] text-down bg-down/10 rounded px-2 py-1">⚠ {error}</p>}
      </div>
    </Link>
  );
}
