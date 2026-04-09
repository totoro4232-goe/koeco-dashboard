interface Row {
  date: string;
  value: string;
  change: string;
  direction: 'up' | 'down' | 'flat';
}
interface Props {
  title: string;
  columns: string[];
  rows: Row[];
}

export default function ChangeTable({ title, columns, rows }: Props) {
  const dirCls = { up: 'text-up', down: 'text-down', flat: 'text-gray-400' };
  return (
    <div className="bg-bg-secondary border border-border rounded-2xl p-6 mt-4">
      <p className="text-sm font-medium mb-4">{title}</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="border-b border-border text-gray-500 text-xs">
              {columns.map((c) => (
                <th key={c} className="text-left pb-3 pr-6">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-bg-tertiary transition-colors">
                <td className="py-3 pr-6 text-gray-400">{row.date}</td>
                <td className="py-3 pr-6">{row.value}</td>
                <td className={`py-3 ${dirCls[row.direction]}`}>{row.change}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
