import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ChevronRight, Building2, Mail, Phone, Briefcase } from "lucide-react";
import { DeleteButton } from "@/components/admin/DeleteButton";

const STATUS_COLORS: Record<string, string> = {
  New: "bg-blue-100 text-blue-800",
  Contacted: "bg-yellow-100 text-yellow-800",
  MeetingScheduled: "bg-purple-100 text-purple-800",
  OfferMade: "bg-orange-100 text-orange-800",
  Closed: "bg-green-100 text-green-800",
  Lost: "bg-red-100 text-red-800",
};

export default async function CompanyDetailPage({ params }: { params: { id: string } }) {
  const company = await prisma.company.findUnique({
    where: { id: params.id },
    include: {
      contacts: {
        include: {
          inquiries: {
            include: { equipment: true },
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!company) notFound();

  const totalInquiries = company.contacts.reduce((sum, c) => sum + c.inquiries.length, 0);

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/admin/companies" className="hover:text-[#1B3A5C]">Companies</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#0F172A] font-medium">{company.name}</span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-[#1B3A5C] flex items-center justify-center shrink-0">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#0F172A]">{company.name}</h1>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
              {company.country && <span>🌍 {company.country}</span>}
              {company.industry && <span>🏭 {company.industry}</span>}
              {company.website && <a href={company.website} target="_blank" rel="noreferrer" className="text-[#1B3A5C] hover:underline">🔗 {company.website}</a>}
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="flex gap-4 text-center">
              <div className="px-4 py-2 bg-[#F8FAFC] rounded-lg border border-slate-200">
                <div className="text-xl font-bold text-[#1B3A5C]">{company.contacts.length}</div>
                <div className="text-xs text-slate-400">Contacts</div>
              </div>
              <div className="px-4 py-2 bg-[#F8FAFC] rounded-lg border border-slate-200">
                <div className="text-xl font-bold text-[#F59E0B]">{totalInquiries}</div>
                <div className="text-xs text-slate-400">Inquiries</div>
              </div>
            </div>
            <DeleteButton
              apiPath={`/api/admin/companies/${company.id}`}
              confirmMessage={`Delete "${company.name}"? Contacts will be unlinked but inquiry history is preserved.`}
              redirectTo="/admin/companies"
              label="Delete Company"
            />
          </div>
        </div>
        {company.notes && (
          <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-600">
            {company.notes}
          </div>
        )}
      </div>

      {/* Contacts */}
      <h2 className="text-lg font-bold text-[#0F172A] mb-4">Contacts at this Company</h2>
      <div className="space-y-4">
        {company.contacts.map((contact) => (
          <div key={contact.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 flex items-start justify-between gap-4 border-b border-slate-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1B3A5C]/10 flex items-center justify-center shrink-0 font-bold text-[#1B3A5C] text-sm">
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-[#0F172A]">{contact.name}</div>
                  {contact.jobTitle && <div className="text-xs text-slate-400 flex items-center gap-1"><Briefcase className="w-3 h-3" />{contact.jobTitle}</div>}
                  <div className="flex gap-3 mt-1">
                    {contact.email && <span className="text-xs text-slate-500 flex items-center gap-1"><Mail className="w-3 h-3" />{contact.email}</span>}
                    {contact.phone && <span className="text-xs text-slate-500 flex items-center gap-1"><Phone className="w-3 h-3" />{contact.phone}</span>}
                  </div>
                </div>
              </div>
              <Link href={`/admin/contacts/${contact.id}`}
                className="text-xs font-semibold text-[#1B3A5C] hover:text-[#F59E0B] flex items-center gap-1 transition-colors shrink-0">
                Full Profile <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {contact.inquiries.length > 0 && (
              <div className="px-5 pb-4 pt-3">
                <div className="text-xs text-slate-400 uppercase font-semibold mb-2">Recent Inquiries</div>
                <div className="space-y-1.5">
                  {contact.inquiries.slice(0, 3).map((inq) => (
                    <div key={inq.id} className="flex items-center gap-3 text-sm">
                      <span className="font-mono text-xs text-slate-400">{inq.oppNumber || inq.id.slice(0, 8)}</span>
                      <span className="text-slate-600 truncate flex-1">{inq.equipment?.title || inq.message.slice(0, 50)}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[inq.status] || "bg-slate-100 text-slate-600"}`}>{inq.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {company.contacts.length === 0 && (
          <div className="text-center py-10 text-slate-400 bg-white rounded-xl border border-slate-200">No contacts yet.</div>
        )}
      </div>
    </div>
  );
}
