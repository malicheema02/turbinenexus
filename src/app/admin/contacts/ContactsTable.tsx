"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, Mail, Phone, ChevronRight, Trash2 } from "lucide-react";

type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  jobTitle: string | null;
  inquiryCount: number;
  company: { id: string; name: string } | null;
};

export function ContactsTable({ contacts: initial }: { contacts: Contact[] }) {
  const [contacts, setContacts] = useState(initial);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete contact "${name}"? Their inquiry history will be preserved.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setContacts((prev) => prev.filter((c) => c.id !== id));
        router.refresh();
      } else {
        alert("Failed to delete contact.");
      }
    } finally {
      setDeleting(null);
    }
  };

  if (contacts.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
        No contacts yet — created automatically when inquiries are submitted.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-[#F8FAFC] border-b border-slate-200">
          <tr>
            {["Name", "Email", "Phone", "Job Title", "Company", "Inquiries", ""].map((h) => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {contacts.map((c) => (
            <tr key={c.id} className="hover:bg-[#F8FAFC] transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#1B3A5C]/10 flex items-center justify-center shrink-0 font-bold text-[#1B3A5C] text-xs">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-[#0F172A]">{c.name}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 text-slate-600 hover:text-[#1B3A5C] transition-colors">
                  <Mail className="w-3.5 h-3.5 shrink-0" />{c.email}
                </a>
              </td>
              <td className="px-4 py-3 text-slate-500">
                {c.phone ? (
                  <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 shrink-0" />{c.phone}</span>
                ) : "—"}
              </td>
              <td className="px-4 py-3 text-slate-500">{c.jobTitle || "—"}</td>
              <td className="px-4 py-3">
                {c.company ? (
                  <Link href={`/admin/companies/${c.company.id}`} className="text-[#1B3A5C] hover:underline text-xs">{c.company.name}</Link>
                ) : <span className="text-slate-400">—</span>}
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${c.inquiryCount > 0 ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-500"}`}>
                  <Users className="w-3 h-3" />{c.inquiryCount}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => handleDelete(c.id, c.name)}
                    disabled={deleting === c.id}
                    className="text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    title="Delete contact"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Link href={`/admin/contacts/${c.id}`} className="inline-flex items-center gap-1 text-[#1B3A5C] hover:text-[#F59E0B] text-xs font-semibold transition-colors">
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
