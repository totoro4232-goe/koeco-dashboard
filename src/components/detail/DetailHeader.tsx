import Link from 'next/link';

interface Props {
  title: string;
  back: string;
  relatedLabel?: string;
  relatedHref?: string;
}

export default function DetailHeader({ title, back, relatedLabel, relatedHref }: Props) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <Link
          href={back}
          className="font-mono text-xs text-gray-400 hover:text-white border border-border hover:border-accent rounded-lg px-3 py-1.5 transition-all"
        >
          ← 뒤로
        </Link>
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      {relatedLabel && relatedHref && (
        <Link href={relatedHref} className="font-mono text-xs text-accent hover:underline">
          {relatedLabel} →
        </Link>
      )}
    </div>
  );
}
