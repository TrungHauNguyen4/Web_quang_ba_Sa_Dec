import { ReactNode } from "react";

interface AdminTableProps {
  columns: string[];
  children: ReactNode;
}

export function AdminTable({ columns, children }: AdminTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-stone-50/50 text-stone-500 text-xs uppercase tracking-wider">
            {columns.map((col, idx) => (
              <th key={idx} className={`p-4 font-semibold ${idx === columns.length - 1 ? 'text-right' : ''}`}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100 text-sm">
          {children}
        </tbody>
      </table>
    </div>
  );
}

export function AdminTableRow({ children }: { children: ReactNode }) {
  return (
    <tr className="hover:bg-stone-50/30 transition-colors">
      {children}
    </tr>
  );
}

export function AdminTableCell({ children, isRight = false }: { children: ReactNode, isRight?: boolean }) {
  return (
    <td className={`p-4 ${isRight ? 'text-right' : ''}`}>
      {children}
    </td>
  );
}
