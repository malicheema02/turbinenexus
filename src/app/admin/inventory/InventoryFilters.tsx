"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, X } from "lucide-react";

export function InventoryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(searchParams.get("name") ?? "");
  const [country, setCountry] = useState(searchParams.get("country") ?? "");
  const [owner, setOwner] = useState(searchParams.get("owner") ?? "");

  const apply = () => {
    const p = new URLSearchParams();
    if (name.trim()) p.set("name", name.trim());
    if (country.trim()) p.set("country", country.trim());
    if (owner.trim()) p.set("owner", owner.trim());
    startTransition(() => router.push(`/admin/inventory?${p.toString()}`));
  };

  const clear = () => {
    setName(""); setCountry(""); setOwner("");
    startTransition(() => router.push("/admin/inventory"));
  };

  const onKey = (e: React.KeyboardEvent) => { if (e.key === "Enter") apply(); };
  const hasFilters = name || country || owner;
  const inputClass = "px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B3A5C] focus:border-transparent w-44 placeholder:text-slate-400";

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide mr-1">Filter:</span>
      <input value={name} onChange={e => setName(e.target.value)} onKeyDown={onKey}
        placeholder="Unit name…" className={inputClass} />
      <input value={country} onChange={e => setCountry(e.target.value)} onKeyDown={onKey}
        placeholder="Country…" className={inputClass} />
      <input value={owner} onChange={e => setOwner(e.target.value)} onKeyDown={onKey}
        placeholder="Owner name…" className={inputClass} />
      <button onClick={apply} disabled={isPending}
        className="flex items-center gap-1.5 px-4 py-2 bg-[#1B3A5C] text-white text-sm font-semibold rounded-lg hover:bg-[#152E4A] transition-colors disabled:opacity-60">
        <Search className="w-3.5 h-3.5" />
        Search
      </button>
      {hasFilters && (
        <button onClick={clear}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg transition-colors">
          <X className="w-3.5 h-3.5" /> Clear
        </button>
      )}
      {isPending && <span className="text-xs text-slate-400">Filtering…</span>}
    </div>
  );
}
