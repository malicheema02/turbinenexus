"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";

interface Company {
  id: string;
  name: string;
  industry: string | null;
  country: string | null;
  website: string | null;
  notes: string | null;
}

export function CompanyEditForm({ company }: { company: Company }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: company.name,
    industry: company.industry ?? "",
    country: company.country ?? "",
    website: company.website ?? "",
    notes: company.notes ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/companies/${company.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Save failed");
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
        <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      <div>
        <label className={labelClass}>Company Name *</label>
        <input required value={form.name} onChange={set("name")} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Industry</label>
        <input
          value={form.industry}
          onChange={set("industry")}
          className={inputClass}
          placeholder="e.g. Power Generation"
        />
      </div>
      <div>
        <label className={labelClass}>Country</label>
        <input
          value={form.country}
          onChange={set("country")}
          className={inputClass}
          placeholder="e.g. United States"
        />
      </div>
      <div>
        <label className={labelClass}>Website</label>
        <input
          value={form.website}
          onChange={set("website")}
          className={inputClass}
          placeholder="https://..."
        />
      </div>
      <div>
        <label className={labelClass}>Notes</label>
        <textarea
          value={form.notes}
          onChange={set("notes")}
          rows={3}
          className={inputClass}
          placeholder="Internal notes…"
        />
      </div>
      <button
        type="submit"
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-[#1B3A5C] hover:bg-[#0F172A] disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
      >
        {saving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : saved ? (
          <>
            <Check className="w-4 h-4" /> Saved
          </>
        ) : (
          "Save Changes"
        )}
      </button>
    </form>
  );
}
