import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "@/lib/dateUtils";

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Reviewed: "bg-blue-100 text-blue-800",
  Listed: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

export default async function AdminListingsPage() {
  const listings = await prisma.equipmentListing.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0F172A]">Equipment Listings</h1>
        <p className="text-slate-500 text-sm mt-1">
          Submissions from the &quot;Sell Your Equipment&quot; public form.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F8FAFC] border-b border-slate-200">
            <tr>
              {["Company", "Contact", "Equipment", "Manufacturer", "Power (MW)", "Condition", "Status", "Submitted"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {listings.length === 0 && (
              <tr><td colSpan={8} className="text-center py-12 text-slate-400">No listings yet.</td></tr>
            )}
            {listings.map((l) => (
              <tr key={l.id} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="px-4 py-3 font-medium text-[#0F172A]">{l.companyName}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-700">{l.contactName}</div>
                  <div className="text-xs text-slate-400">{l.contactEmail}</div>
                </td>
                <td className="px-4 py-3 text-slate-600">{l.equipmentType}</td>
                <td className="px-4 py-3 text-slate-600">{l.manufacturer || "—"}</td>
                <td className="px-4 py-3 text-slate-600">{l.ratedPowerMW ?? "—"}</td>
                <td className="px-4 py-3 text-slate-600">{l.condition || "—"}</td>
                <td className="px-4 py-3">
                  <StatusDropdown id={l.id} current={l.status} />
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">
                  {formatDistanceToNow(l.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusDropdown({ id, current }: { id: string; current: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[current] ?? "bg-slate-100 text-slate-700"}`}>
      {current}
    </span>
  );
}
