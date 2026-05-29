"use client";

import { useState } from "react";
import { Zap, ArrowRight, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MW_OPTIONS = ["< 10 MW", "10–50 MW", "50–100 MW", "100–250 MW", "250+ MW"];
const FUEL_OPTIONS = ["Natural Gas", "Diesel", "HFO", "Dual Fuel", "Hydrogen-Ready", "Any"];

export function NeedCapacityWidget() {
  const [requiredMW, setRequiredMW] = useState(MW_OPTIONS[1]);
  const [fuelType, setFuelType] = useState(FUEL_OPTIONS[0]);
  const [expanded, setExpanded] = useState(false);
  const [form, setForm] = useState({ companyName: "", contactName: "", contactEmail: "", contactPhone: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.companyName || !form.contactName || !form.contactEmail) {
      setError("Please provide your company, name, and email.");
      return;
    }
    setStatus("submitting");
    const message =
      `CAPACITY REQUIREMENT (Wanted).\n` +
      `Required capacity: ${requiredMW}.\n` +
      `Preferred fuel type: ${fuelType}.`;
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          message,
          inquiryType: "Wanted",
          priority: "High",
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Submission failed");
      }
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 text-center">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-[#0F172A] mb-1">Requirement Received</h3>
        <p className="text-slate-500 text-sm">
          Our sourcing team will match your requirement ({requiredMW}, {fuelType}) and respond as a priority.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-9 h-9 rounded-lg bg-[#F59E0B]/15 flex items-center justify-center">
          <Zap className="w-5 h-5 text-[#F59E0B]" />
        </div>
        <h3 className="text-xl font-bold text-[#0F172A]">Need Capacity Fast?</h3>
      </div>
      <p className="text-slate-500 text-sm mb-5">
        Tell us what you need — data centers, IPPs, and industrials get priority sourcing.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Required Capacity</label>
            <select
              value={requiredMW}
              onChange={(e) => setRequiredMW(e.target.value)}
              className="w-full py-2.5 px-3 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B3A5C]"
            >
              {MW_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Fuel Type</label>
            <select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
              className="w-full py-2.5 px-3 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B3A5C]"
            >
              {FUEL_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>

        {expanded && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <Input placeholder="Company *" value={form.companyName} onChange={set("companyName")} />
            <Input placeholder="Your name *" value={form.contactName} onChange={set("contactName")} />
            <Input type="email" placeholder="Email *" value={form.contactEmail} onChange={set("contactEmail")} />
            <Input type="tel" placeholder="Phone" value={form.contactPhone} onChange={set("contactPhone")} />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />{error}
          </div>
        )}

        {!expanded ? (
          <Button type="button" variant="amber" className="w-full" onClick={() => setExpanded(true)}>
            Submit Requirement <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button type="submit" variant="amber" className="w-full" disabled={status === "submitting"}>
            {status === "submitting" ? <><Loader2 className="w-4 h-4 animate-spin mr-1" />Submitting…</> : <>Send Priority Requirement <ArrowRight className="w-4 h-4 ml-1" /></>}
          </Button>
        )}
      </form>
    </div>
  );
}
