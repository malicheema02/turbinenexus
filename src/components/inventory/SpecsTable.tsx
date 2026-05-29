import { parseJsonSafe } from "@/lib/utils";
import type { KeySpec } from "@/types";

interface SpecsTableProps {
  keySpecs: string;
  title?: string;
}

export function SpecsTable({ keySpecs, title = "Technical Specifications" }: SpecsTableProps) {
  const specs = parseJsonSafe<KeySpec[]>(keySpecs, []);

  if (!specs.length) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold text-[#0F172A] mb-3">{title}</h3>
      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            {specs.map((spec, i) => (
              <tr
                key={i}
                className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
              >
                <td className="py-3 px-4 font-medium text-slate-600 w-2/5 border-r border-slate-200">
                  {spec.key}
                </td>
                <td className="py-3 px-4 text-slate-900 font-semibold">{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
