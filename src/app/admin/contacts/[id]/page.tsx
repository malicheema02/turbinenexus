import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Mail, Phone, Briefcase, Building2, ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/dateUtils";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata: Metadata = {
  title: "Contact Detail — Turbine Nexus Admin",
};

const STATUS_COLORS: Record<string, string> = {
  New: "bg-blue-100 text-blue-800",
  Contacted: "bg-yellow-100 text-yellow-800",
  MeetingScheduled: "bg-purple-100 text-purple-800",
  OfferMade: "bg-orange-100 text-orange-800",
  Closed: "bg-green-100 text-green-800",
  Lost: "bg-red-100 text-red-800",
};

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const contact = await prisma.contact.findUnique({
    where: { id },
    include: {
      company: true,
      inquiries: {
        include: { equipment: { select: { title: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!contact) notFound();

  return (
    <div className="p-8 max-w-5xl">
      {/* Back */}
      <Link
        href={contact.companyId ? `/admin/companies/${contact.companyId}` : "/admin/companies"}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#1B3A5C] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {contact.company ? contact.company.name : "Companies"}
      </Link>

      {/* Contact Info Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-[#1B3A5C] flex items-center justify-center shrink-0 text-white font-bold text-xl">
            {contact.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#0F172A]">{contact.name}</h1>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
              {contact.jobTitle && (
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" /> {contact.jobTitle}
                </span>
              )}
              {contact.company && (
                <Link
                  href={`/admin/companies/${contact.companyId}`}
                  className="flex items-center gap-1.5 hover:text-[#1B3A5C] transition-colors"
                >
                  <Building2 className="w-3.5 h-3.5" /> {contact.company.name}
                </Link>
              )}
            </div>
            <div className="flex flex-wrap gap-4 mt-3">
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-1.5 text-sm text-[#1B3A5C] hover:underline"
              >
                <Mail className="w-3.5 h-3.5" /> {contact.email}
              </a>
              {contact.phone && (
                <span className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Phone className="w-3.5 h-3.5" /> {contact.phone}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="text-center px-4 py-2 bg-[#F8FAFC] rounded-lg border border-slate-200">
              <div className="text-2xl font-bold text-[#F59E0B]">{contact.inquiries.length}</div>
              <div className="text-xs text-slate-400">Inquiries</div>
            </div>
            <DeleteButton
              apiPath={`/api/admin/contacts/${contact.id}`}
              confirmMessage={`Delete "${contact.name}"? Inquiry history will be preserved.`}
              redirectTo={contact.companyId ? `/admin/companies/${contact.companyId}` : "/admin/contacts"}
              label="Delete Contact"
            />
          </div>
        </div>
        {contact.notes && (
          <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-600">
            {contact.notes}
          </div>
        )}
      </div>

      {/* Inquiry History */}
      <div>
        <h2 className="text-lg font-bold text-[#0F172A] mb-4">
          Inquiry History ({contact.inquiries.length})
        </h2>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F8FAFC] border-b border-slate-200">
              <tr>
                {["OPP Number", "Equipment", "Status", "Date", ""].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contact.inquiries.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">
                    No inquiries yet.
                  </td>
                </tr>
              )}
              {contact.inquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-semibold text-[#1B3A5C] bg-[#1B3A5C]/10 px-2 py-1 rounded">
                      {inq.oppNumber ?? `#${inq.id.slice(0, 8)}`}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                    {inq.equipment?.title ?? (
                      <span className="text-slate-400 italic">
                        {inq.message.slice(0, 50)}…
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        STATUS_COLORS[inq.status] ?? "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {inq.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {formatDate(inq.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/inquiries/${inq.id}`}
                      className="inline-flex items-center gap-1 text-[#1B3A5C] hover:text-[#F59E0B] text-xs font-semibold transition-colors"
                    >
                      View <ChevronRight className="w-3.5 h-3.5" />
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
