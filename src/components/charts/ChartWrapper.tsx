export default function ChartWrapper({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-bg-secondary border border-border rounded-2xl p-6 mb-4">
      <div className="flex items-center justify-between mb-5">
        <span className="text-sm font-medium">{title}</span>
        {sub && <span className="font-mono text-[11px] text-gray-500">{sub}</span>}
      </div>
      {children}
    </div>
  );
}
