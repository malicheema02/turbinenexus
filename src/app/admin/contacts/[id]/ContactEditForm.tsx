"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  jobTitle: string | null;
  notes: string | null;
  companyId: string | null;
}

export function ContactEditForm({ contact }: { contact: Contact }) {
  const router = useRouter();
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
  const [form, setForm] = useState({
    name: contact.name,
    email: contact.email,
    phone: contact.phone ?? "",
    jobTitle: contact.jobTitle ?? "",
    notes: contact.notes ?? "",
    companyId: contact.companyId ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/companies")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setCompanies(Array.isArray(data) ? data.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name })) : []))
      .catch(() => setCompanies([]));
  }, []);

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/contacts/${contact.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, companyId: form.companyId || null }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Save failed");
      }
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B3A5C]/30 focus:border-[#1B3A5C]";
  const labelClass = "block text-xs font-medium text-slate-500 mb-1";

  return (
    <form onSubmit={handleSave} className="space-y-3">
      {error && (
        <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Name *</label>
          <input required value={form.name} onChange={set("name")} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Email *</label>
          <input required type="email" value={form.email} onChange={set("email")} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input value={form.phone} onChange={set("phone")} className={inputClass} placeholder="+971 5X XXX XXXX" />
        </div>
        <div>
          <label className={labelClass}>Job Title</label>
          <input value={form.jobTitle} onChange={set("jobTitle")} className={inputClass} placeholder="e.g. Procurement Director" />
        </div>
      </div>
      <div>
        <label className={labelClass}>Company</label>
        <select value={form.companyId} onChange={set("companyId")} className={inputClass}>
          <option value="">— Unassigned —</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClass}>Notes</label>
        <textarea value={form.notes} onChange={set("notes")} rows={3} className={inputClass} placeholder="Internal notes…" />
      </div>
      <button
        type="submit"
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-[#1B3A5C] hover:bg-[#0F172A] disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? (<><Check className="w-4 h-4" /> Saved</>) : "Save Changes"}
      </button>
    </form>
  );
}
