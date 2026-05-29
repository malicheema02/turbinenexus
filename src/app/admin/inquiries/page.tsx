import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MessageSquare, Clock, Building2, Mail } from "lucide-react";
import { INQUIRY_STATUS_LABELS, INQUIRY_STATUS_COLORS, PRIORITY_COLORS } from "@/lib/utils";

const PIPELINE_COLUMNS = [
  { key: "New", label: "New", color: "border-blue-400" },
  { key: "Contacted", label: "Contacted", color: "border-purple-400" },
  { key: "MeetingScheduled", label: "Meeting Scheduled", color: "border-yellow-400" },
  { key: "OfferMade", label: "Offer Made", color: "border-orange-400" },
  { key: "Closed", label: "Closed / Won", color: "border-green-400" },
  { key: "Lost", label: "Lost", color: "border-red-300" },
];

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      equipment: {
        select: { title: true, slug: true },
      },
    },
  });

  const grouped = PIPELINE_COLUMNS.reduce(
    (acc, col) => {
      acc[col.key] = inquiries.filter((i) => i.status === col.key);
      return acc;
    },
    {} as Record<string, typeof inquiries>
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Inquiry Pipeline</h1>
          <p className="text-slate-500 mt-1">{inquiries.length} total inquiries</p>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {PIPELINE_COLUMNS.map((col) => {
            const colInquiries = grouped[col.key] ?? [];
            return (
              <div key={col.key} className="w-72 flex-shrink-0">
                {/* Column header */}
                <div className={`flex items-center justify-between mb-3 pb-2 border-b-2 ${col.color}`}>
                  <h3 className="font-semibold text-sm text-slate-800">{col.label}</h3>
                  <span className="text-xs bg-slate-100 text-slate-600 rounded-full px-2 py-0.5 font-semibold">
                    {colInquiries.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3">
                  {colInquiries.length === 0 && (
                    <div className="rounded-xl border-2 border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
                      No inquiries
                    </div>
                  )}
                  {colInquiries.map((inquiry) => (
                    <Link
                      key={inquiry.id}
                      href={`/admin/inquiries/${inquiry.id}`}
                      className="block bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-[#1B3A5C]/30 transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="font-semibold text-sm text-slate-900 leading-tight line-clamp-2">
                          {inquiry.companyName}
                        </span>
                        <span
                          className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded ${PRIORITY_COLORS[inquiry.priority] ?? ""}`}
                        >
                          {inquiry.priority}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Building2 className="w-3 h-3 shrink-0" />
                          <span className="truncate">{inquiry.contactName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Mail className="w-3 h-3 shrink-0" />
                          <span className="truncate">{inquiry.contactEmail}</span>
                        </div>
                        {inquiry.equipment && (
                          <div className="flex items-center gap-1.5 text-xs text-[#1B3A5C] font-medium">
                            <MessageSquare className="w-3 h-3 shrink-0" />
                            <span className="truncate">{inquiry.equipment.title}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Clock className="w-3 h-3 shrink-0" />
                          <span>
                            {new Date(inquiry.createdAt).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Table view below */}
      <div className="mt-10 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-[#0F172A]">All Inquiries — Tabular View</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F8FAFC] border-b border-slate-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Company</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Asset</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Priority</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-semibold text-slate-900">{inquiry.companyName}</td>
                  <td className="px-4 py-3">
                    <div>{inquiry.contactName}</div>
                    <div className="text-xs text-slate-400">{inquiry.contactEmail}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                    {inquiry.equipment?.title ?? <span className="text-slate-300">General inquiry</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${INQUIRY_STATUS_COLORS[inquiry.status] ?? ""}`}>
                      {INQUIRY_STATUS_LABELS[inquiry.status] ?? inquiry.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${PRIORITY_COLORS[inquiry.priority] ?? ""}`}>
                      {inquiry.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {new Date(inquiry.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/admin/inquiries/${inquiry.id}`}
                      className="text-xs text-[#1B3A5C] hover:underline font-medium"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
