import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CompaniesTable } from "./CompaniesTable";

export const metadata: Metadata = { title: "Companies — Turbine Nexus Admin" };

export default async function AdminCompaniesPage() {
  const companies = await prisma.company.findMany({
    include: {
      contacts: {
        include: { inquiries: { select: { id: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const rows = companies.map((c) => ({
    id: c.id,
    name: c.name,
    country: c.country,
    industry: c.industry,
    contactCount: c.contacts.length,
    inquiryCount: c.contacts.reduce((sum, ct) => sum + ct.inquiries.length, 0),
  }));

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
      <CompaniesTable companies={rows} />
    </div>
  );
}
