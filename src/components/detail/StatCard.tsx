export default function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-4 text-center">
      <p className="font-mono text-[11px] uppercase tracking-widest text-gray-500 mb-2">{label}</p>
      <p className="font-mono text-xl font-medium">{value}</p>
    </div>
  );
}
