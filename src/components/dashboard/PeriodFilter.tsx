import Link from 'next/link';
import type { Period } from '@/types';

const OPTIONS: { value: Period; label: string }[] = [
  { value: '6m', label: '6개월' },
  { value: '1y', label: '1년' },
  { value: '3y', label: '3년' },
];

export default function PeriodFilter({ current }: { current: Period }) {
  return (
    <div className="flex gap-2 mb-8">
      {OPTIONS.map((o) => (
        <Link
          key={o.value}
          href={`/?period=${o.value}`}
          className={`font-mono text-xs px-4 py-1.5 rounded-full border transition-all ${
            current === o.value
              ? 'bg-accent border-accent text-white'
              : 'border-border text-gray-400 hover:border-accent hover:text-accent'
          }`}
        >
          {o.label}
        </Link>
      ))}
    </div>
  );
}
