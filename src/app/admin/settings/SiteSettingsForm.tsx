"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

type Setting = { id: string; key: string; value: string; label: string; group: string };

const GROUP_LABELS: Record<string, string> = {
  social: "Social Media Links",
  contact: "Contact Details",
  general: "General / Footer Content",
};

export function SiteSettingsForm({ byGroup }: { byGroup: Record<string, Setting[]> }) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.values(byGroup)
      .flat()
      .reduce<Record<string, string>>((a, s) => { a[s.key] = s.value; return a; }, {})
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {Object.entries(byGroup).map(([group, settings]) => (
        <div key={group} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-[#F8FAFC] px-6 py-4 border-b border-slate-200">
            <h2 className="font-semibold text-[#0F172A] text-sm uppercase tracking-wider">
              {GROUP_LABELS[group] ?? group}
            </h2>
          </div>
          <div className="p-6 space-y-5">
            {settings.map((s) => (
              <div key={s.key}>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {s.label}
                </label>
                <input
                  type="text"
                  value={values[s.key] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [s.key]: e.target.value }))}
                  placeholder={s.key.includes("url") ? "https://..." : s.key.includes("email") ? "email@example.com" : ""}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A5C] focus:border-transparent"
                />
                {s.key === "calendly_url" && (
                  <p className="text-xs text-slate-400 mt-1">Used for the "Arrange Teams Meeting" button on inventory cards.</p>
                )}
                {(s.key === "linkedin_url" || s.key === "telegram_url" || s.key === "wechat_id") && (
                  <p className="text-xs text-slate-400 mt-1">Paste the full URL or leave # to hide the icon.</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#1B3A5C] text-white rounded-lg text-sm font-semibold hover:bg-[#152E4A] transition-colors disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {saving ? "Saving…" : "Save All Settings"}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" /> Settings saved!
          </span>
        )}
      </div>
    </div>
  );
}
