"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Phone, Mail, MapPin, Zap, Clock } from "lucide-react";

const STATUS_OPTIONS = ["Pending", "Reviewed", "Listed", "Rejected"];

const STATUS_COLORS: Record<string, string> = {
  Pending:  "bg-yellow-100 text-yellow-800 border-yellow-200",
  Reviewed: "bg-blue-100 text-blue-800 border-blue-200",
  Listed:   "bg-green-100 text-green-800 border-green-200",
  Rejected: "bg-red-100 text-red-800 border-red-200",
};

type Listing = {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string | null;
  equipmentType: string;
  manufacturer: string | null;
  model: string | null;
  ratedPowerMW: number | null;
  yearOfManufacture: number | null;
  operatingHours: number | null;
  condition: string | null;
  location: string | null;
  description: string | null;
  askingPrice: string | null;
  status: string;
  adminNotes: string | null;
  createdAtStr: string;
};

export function ListingsTable({ listings: initial }: { listings: Listing[] }) {
  const [listings, setListings] = useState(initial);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const updateStatus = async (id: string, status: string) => {
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
      }
    } finally {
      setSavingId(null);
    }
  };

  if (listings.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
        No listings yet — submissions appear here when equipment owners use the public form.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-[#F8FAFC] border-b border-slate-200">
          <tr>
            {["Company", "Contact", "Equipment", "Details", "Status", "Submitted", ""].map((h) => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {listings.map((l) => (
            <>
              <tr key={l.id} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="px-4 py-3 font-semibold text-[#0F172A]">{l.companyName}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-700">{l.contactName}</div>
                  <a href={`mailto:${l.contactEmail}`} className="text-xs text-[#1B3A5C] hover:underline">{l.contactEmail}</a>
                  {l.contactPhone && (
                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <Phone className="w-3 h-3" />{l.contactPhone}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-700">{l.equipmentType}</div>
                  {l.manufacturer && <div className="text-xs text-slate-400">{l.manufacturer}{l.model ? ` — ${l.model}` : ""}</div>}
                </td>
                <td className="px-4 py-3 text-xs text-slate-500 space-y-0.5">
                  {l.ratedPowerMW && <div className="flex items-center gap-1"><Zap className="w-3 h-3 text-[#F59E0B]" />{l.ratedPowerMW} MW</div>}
                  {l.operatingHours && <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{l.operatingHours.toLocaleString()} hrs</div>}
                  {l.location && <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{l.location}</div>}
                  {l.condition && <div className="text-slate-400">{l.condition}</div>}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={l.status}
                    onChange={(e) => updateStatus(l.id, e.target.value)}
                    disabled={savingId === l.id}
                    className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1B3A5C]/30 ${STATUS_COLORS[l.status] ?? "bg-slate-100 text-slate-700 border-slate-200"}`}
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{l.createdAtStr}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setExpanded(expanded === l.id ? null : l.id)}
                    className="flex items-center gap-1 text-xs text-[#1B3A5C] hover:text-[#F59E0B] font-semibold transition-colors"
                  >
                    {expanded === l.id ? <><ChevronUp className="w-3.5 h-3.5" />Hide</> : <><ChevronDown className="w-3.5 h-3.5" />Details</>}
                  </button>
                </td>
              </tr>

              {/* Expanded detail row */}
              {expanded === l.id && (
                <tr key={l.id + "-detail"} className="bg-[#F8FAFC]">
                  <td colSpan={7} className="px-6 py-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {l.description && (
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Description</p>
                          <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{l.description}</p>
                        </div>
                      )}
                      {l.askingPrice && (
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Asking Price (Confidential)</p>
                          <p className="text-sm font-semibold text-[#1B3A5C]">{l.askingPrice}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Full Contact</p>
                        <div className="space-y-1 text-sm text-slate-700">
                          <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#1B3A5C]" /><a href={`mailto:${l.contactEmail}`} className="hover:underline text-[#1B3A5C]">{l.contactEmail}</a></div>
                          {l.contactPhone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#1B3A5C]" />{l.contactPhone}</div>}
                        </div>
                      </div>
                      {l.yearOfManufacture && (
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Year of Manufacture</p>
                          <p className="text-sm text-slate-700">{l.yearOfManufacture}</p>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
