"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const manufacturers = [
  "All",
  "General Electric",
  "Siemens",
  "Wärtsilä",
  "MAN Energy Solutions",
  "Rolls-Royce",
  "Solar Turbines",
];

const equipmentTypes = [
  { value: "", label: "All Types" },
  { value: "GasTurbine", label: "Gas Turbine" },
  { value: "SteamTurbine", label: "Steam Turbine" },
  { value: "GasEngine", label: "Gas Engine" },
  { value: "Generator", label: "Generator" },
];

const conditions = [
  { value: "", label: "Any Condition" },
  { value: "New / Unused", label: "New / Unused" },
  { value: "Zero-Hour Refurbished", label: "Zero-Hour Refurbished" },
  { value: "Surplus", label: "Surplus" },
  { value: "Used", label: "Used" },
  { value: "Excellent", label: "Excellent" },
  { value: "Good", label: "Good" },
  { value: "Fair", label: "Fair" },
];

const fuelTypes = [
  { value: "", label: "Any Fuel Type" },
  { value: "Natural Gas", label: "Natural Gas" },
  { value: "Diesel", label: "Diesel" },
  { value: "HFO", label: "HFO (Heavy Fuel Oil)" },
  { value: "Dual Fuel", label: "Dual Fuel" },
  { value: "Hydrogen-Ready", label: "Hydrogen-Ready" },
];

const frequencies = [
  { value: "", label: "Any Frequency" },
  { value: "50 Hz", label: "50 Hz" },
  { value: "60 Hz", label: "60 Hz" },
];

const statuses = [
  { value: "", label: "All Status" },
  { value: "Available", label: "Available" },
  { value: "UnderNegotiation", label: "Under Negotiation" },
];

export function EquipmentFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      startTransition(() => {
        router.push(`/inventory?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  const clearFilters = useCallback(() => {
    startTransition(() => {
      router.push("/inventory");
    });
  }, [router]);

  const hasFilters =
    searchParams.has("manufacturer") ||
    searchParams.has("type") ||
    searchParams.has("condition") ||
    searchParams.has("fuel") ||
    searchParams.has("frequency") ||
    searchParams.has("minMW") ||
    searchParams.has("maxMW") ||
    searchParams.has("status") ||
    searchParams.has("q");

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-[#1B3A5C] font-semibold">
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filter Assets</span>
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-500 transition-colors"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            placeholder="Search turbines, models…"
            defaultValue={searchParams.get("q") ?? ""}
            onChange={(e) => updateParam("q", e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A5C] focus:border-[#1B3A5C] bg-white"
          />
        </div>

        {/* Manufacturer */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Manufacturer
          </label>
          <select
            value={searchParams.get("manufacturer") ?? ""}
            onChange={(e) => updateParam("manufacturer", e.target.value)}
            className="w-full py-2.5 px-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A5C] bg-white"
          >
            <option value="">All Manufacturers</option>
            {manufacturers.slice(1).map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Equipment Type */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Equipment Type
          </label>
          <select
            value={searchParams.get("type") ?? ""}
            onChange={(e) => updateParam("type", e.target.value)}
            className="w-full py-2.5 px-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A5C] bg-white"
          >
            {equipmentTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Condition */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Condition
          </label>
          <select
            value={searchParams.get("condition") ?? ""}
            onChange={(e) => updateParam("condition", e.target.value)}
            className="w-full py-2.5 px-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A5C] bg-white"
          >
            {conditions.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Fuel Type
          </label>
          <select
            value={searchParams.get("fuel") ?? ""}
            onChange={(e) => updateParam("fuel", e.target.value)}
            className="w-full py-2.5 px-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A5C] bg-white"
          >
            {fuelTypes.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>

        {/* Frequency */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Frequency
          </label>
          <select
            value={searchParams.get("frequency") ?? ""}
            onChange={(e) => updateParam("frequency", e.target.value)}
            className="w-full py-2.5 px-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A5C] bg-white"
          >
            {frequencies.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>

        {/* Capacity (MW) range */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Capacity (MW)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              placeholder="Min"
              defaultValue={searchParams.get("minMW") ?? ""}
              onChange={(e) => updateParam("minMW", e.target.value)}
              className="w-full py-2.5 px-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A5C] bg-white"
            />
            <span className="text-slate-400 text-sm">–</span>
            <input
              type="number"
              min={0}
              placeholder="Max"
              defaultValue={searchParams.get("maxMW") ?? ""}
              onChange={(e) => updateParam("maxMW", e.target.value)}
              className="w-full py-2.5 px-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A5C] bg-white"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Availability
          </label>
          <select
            value={searchParams.get("status") ?? ""}
            onChange={(e) => updateParam("status", e.target.value)}
            className="w-full py-2.5 px-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A5C] bg-white"
          >
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {isPending && (
          <p className="text-xs text-center text-slate-400 animate-pulse">
            Updating results…
          </p>
        )}
      </div>
    </div>
  );
}
