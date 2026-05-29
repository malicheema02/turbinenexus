import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Building2, Users, ChevronRight } from "lucide-react";

export default async function AdminCompaniesPage() {
  const companies = await prisma.company.findMany({
    include: {
      contacts: {
        include: { inquiries: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Companies</h1>
          <p className="text-slate-500 text-sm mt-1">
            Auto-created from inquiry submissions. {companies.length} total.
          </p>
        </div>
      </div>

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
            {companies.length === 0 && (
              <tr><td colSpan={6} className="text-center py-12 text-slate-400">No companies yet — they are created automatically when inquiries are submitted.</td></tr>
            )}
            {companies.map((c) => {
              const totalInquiries = c.contacts.reduce((sum, ct) => sum + ct.inquiries.length, 0);
              return (
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
                      <Users className="w-3.5 h-3.5" />{c.contacts.length}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${totalInquiries > 0 ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-500"}`}>
                      {totalInquiries}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/companies/${c.id}`} className="inline-flex items-center gap-1 text-[#1B3A5C] hover:text-[#F59E0B] text-xs font-semibold transition-colors">
                      View <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
