import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ContactsTable } from "./ContactsTable";

export const metadata: Metadata = { title: "Contacts — Turbine Nexus Admin" };

export default async function AdminContactsPage() {
  const contacts = await prisma.contact.findMany({
    include: {
      company: { select: { id: true, name: true } },
      inquiries: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const rows = contacts.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    jobTitle: c.jobTitle,
    inquiryCount: c.inquiries.length,
    company: c.company,
  }));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Contacts</h1>
          <p className="text-slate-500 text-sm mt-1">
            All contacts auto-created from inquiry submissions. {contacts.length} total.
          </p>
        </div>
      </div>
      <ContactsTable contacts={rows} />
    </div>
  );
}
