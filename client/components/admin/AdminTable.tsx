import { ReactNode } from "react";

export function AdminTable({
  headers,
  children,
  empty,
}: {
  headers: string[];
  children: ReactNode;
  empty?: string;
}) {
  return (
    <div className="min-w-0 max-w-full overflow-x-auto border border-cu-stone/30 rounded-sm bg-white [-webkit-overflow-scrolling:touch]">
      <table className="w-full text-sm min-w-[36rem]">
        <thead>
          <tr className="bg-cu-warm-white border-b border-cu-stone/20">
            {headers.map((h) => (
              <th
                key={h}
                className="text-left px-4 py-3 font-montserrat font-semibold text-cu-black"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
      {!children && empty && (
        <p className="p-8 text-center text-cu-concrete text-sm">{empty}</p>
      )}
    </div>
  );
}
