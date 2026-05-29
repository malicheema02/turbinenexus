"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Users, ChevronRight, Trash2 } from "lucide-react";

type Company = {
  id: string;
  name: string;
  country: string | null;
  industry: string | null;
  contactCount: number;
  inquiryCount: number;
};

export function CompaniesTable({ companies: initial }: { companies: Company[] }) {
  const [companies, setCompanies] = useState(initial);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This will unlink its contacts but keep their inquiry history.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/companies/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCompanies((prev) => prev.filter((c) => c.id !== id));
        router.refresh();
      } else {
        alert("Failed to delete company.");
      }
    } finally {
      setDeleting(null);
    }
  };

  if (companies.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
        No companies yet — created automatically when inquiries are submitted.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-[#F8FAFC] border-b border-slate-200">
          <tr>
            {["Company", "Country", "Industry", "Contacts", "Total Inquiries", ""].map((h) => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {companies.map((c) => (
            <tr key={c.id} className="hover:bg-[#F8FAFC] transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#1B3A5C]/10 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4 text-[#1B3A5C]" />
                  </div>
                  <span className="font-semibold text-[#0F172A]">{c.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-slate-600">{c.country || "—"}</td>
              <td className="px-4 py-3 text-slate-600">{c.industry || "—"}</td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-1 text-slate-600">
                  <Users className="w-3.5 h-3.5" />{c.contactCount}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${c.inquiryCount > 0 ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-500"}`}>
                  {c.inquiryCount}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => handleDelete(c.id, c.name)}
                    disabled={deleting === c.id}
                    className="text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    title="Delete company"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Link
                    href={`/admin/companies/${c.id}`}
                    className="inline-flex items-center gap-1 text-[#1B3A5C] hover:text-[#F59E0B] text-xs font-semibold transition-colors"
                  >
                    View <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
