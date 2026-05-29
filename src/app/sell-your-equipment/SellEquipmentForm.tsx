"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ArrowRight, Loader2, AlertCircle } from "lucide-react";

const EQUIPMENT_TYPES = ["Gas Turbine", "Steam Turbine", "Gas Engine", "Generator", "Transformer", "Other"];
const CONDITIONS = ["Excellent", "Good", "Fair", "For Parts / Spares"];

const COUNTRY_CODES = [
  { code: "+1",   flag: "🇺🇸", name: "USA / Canada" },
  { code: "+44",  flag: "🇬🇧", name: "United Kingdom" },
  { code: "+49",  flag: "🇩🇪", name: "Germany" },
  { code: "+33",  flag: "🇫🇷", name: "France" },
  { code: "+31",  flag: "🇳🇱", name: "Netherlands" },
  { code: "+39",  flag: "🇮🇹", name: "Italy" },
  { code: "+34",  flag: "🇪🇸", name: "Spain" },
  { code: "+48",  flag: "🇵🇱", name: "Poland" },
  { code: "+7",   flag: "🇷🇺", name: "Russia" },
  { code: "+86",  flag: "🇨🇳", name: "China" },
  { code: "+81",  flag: "🇯🇵", name: "Japan" },
  { code: "+82",  flag: "🇰🇷", name: "South Korea" },
  { code: "+91",  flag: "🇮🇳", name: "India" },
  { code: "+92",  flag: "🇵🇰", name: "Pakistan" },
  { code: "+880", flag: "🇧🇩", name: "Bangladesh" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+974", flag: "🇶🇦", name: "Qatar" },
  { code: "+965", flag: "🇰🇼", name: "Kuwait" },
  { code: "+968", flag: "🇴🇲", name: "Oman" },
  { code: "+973", flag: "🇧🇭", name: "Bahrain" },
  { code: "+20",  flag: "🇪🇬", name: "Egypt" },
  { code: "+234", flag: "🇳🇬", name: "Nigeria" },
  { code: "+27",  flag: "🇿🇦", name: "South Africa" },
  { code: "+254", flag: "🇰🇪", name: "Kenya" },
  { code: "+55",  flag: "🇧🇷", name: "Brazil" },
  { code: "+52",  flag: "🇲🇽", name: "Mexico" },
  { code: "+54",  flag: "🇦🇷", name: "Argentina" },
  { code: "+57",  flag: "🇨🇴", name: "Colombia" },
  { code: "+61",  flag: "🇦🇺", name: "Australia" },
  { code: "+64",  flag: "🇳🇿", name: "New Zealand" },
  { code: "+90",  flag: "🇹🇷", name: "Turkey" },
  { code: "+62",  flag: "🇮🇩", name: "Indonesia" },
  { code: "+60",  flag: "🇲🇾", name: "Malaysia" },
  { code: "+65",  flag: "🇸🇬", name: "Singapore" },
  { code: "+66",  flag: "🇹🇭", name: "Thailand" },
  { code: "+84",  flag: "🇻🇳", name: "Vietnam" },
  { code: "+63",  flag: "🇵🇭", name: "Philippines" },
  { code: "+380", flag: "🇺🇦", name: "Ukraine" },
  { code: "+30",  flag: "🇬🇷", name: "Greece" },
];

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function PhoneField({
  value, onChange, countryCode, onCountryCodeChange
}: {
  value: string;
  onChange: (v: string) => void;
  countryCode: string;
  onCountryCodeChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-2">
      <select
        value={countryCode}
        onChange={(e) => onCountryCodeChange(e.target.value)}
        className="w-36 border border-slate-200 rounded-lg px-2 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1B3A5C]/30 shrink-0"
        required
      >
        {COUNTRY_CODES.map((c) => (
          <option key={c.code + c.name} value={c.code}>
            {c.flag} {c.code}
          </option>
        ))}
      </select>
      <Input
        type="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="5XX XXX XXXX"
        required
        className="flex-1"
      />
    </div>
  );
}

export function SellEquipmentForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countryCode, setCountryCode] = useState("+971");
  const [form, setForm] = useState({
    companyName: "", contactName: "", contactEmail: "",
    phoneNumber: "",
    equipmentType: "", manufacturer: "", model: "",
    yearOfManufacture: "", ratedPowerMW: "", operatingHours: "",
    condition: "", location: "", description: "", askingPrice: "",
  });

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.phoneNumber.trim()) { setError("Phone number is required."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/sell-equipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          contactPhone: `${countryCode} ${form.phoneNumber}`,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Submission failed");
      }
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-9 h-9 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-[#0F172A] mb-3">Submission Received</h2>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">
          Thank you for submitting your asset details. Our team will review your listing
          and reach out within <strong>24 business hours</strong>.
        </p>
        <Button asChild variant="amber">
          <Link href="/inventory">Browse Available Inventory <ArrowRight className="w-4 h-4 ml-1" /></Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 lg:p-10">
      <h2 className="text-2xl font-bold text-[#0F172A] mb-1">Submit Your Asset</h2>
      <p className="text-slate-500 text-sm mb-8">
        Fields marked <span className="text-red-500">*</span> are required. Asking price is kept strictly confidential.
      </p>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-5">
          <AlertCircle className="w-4 h-4 shrink-0" />{error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset>
          <legend className="text-sm font-bold text-[#1B3A5C] uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 w-full">
            Contact Information
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Company Name" required>
              <Input required value={form.companyName} onChange={set("companyName")} placeholder="Your company" />
            </Field>
            <Field label="Contact Name" required>
              <Input required value={form.contactName} onChange={set("contactName")} placeholder="Your full name" />
            </Field>
            <Field label="Email Address" required>
              <Input required type="email" value={form.contactEmail} onChange={set("contactEmail")} placeholder="you@company.com" />
            </Field>
            <Field label="Phone Number" required>
              <PhoneField
                value={form.phoneNumber}
                onChange={(v) => setForm((f) => ({ ...f, phoneNumber: v }))}
                countryCode={countryCode}
                onCountryCodeChange={setCountryCode}
              />
            </Field>
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-bold text-[#1B3A5C] uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 w-full">
            Equipment Details
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Equipment Type" required>
              <select required value={form.equipmentType} onChange={set("equipmentType")}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1B3A5C]/30">
                <option value="">Select type…</option>
                {EQUIPMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Manufacturer">
              <Input value={form.manufacturer} onChange={set("manufacturer")} placeholder="GE, Siemens, Wärtsilä…" />
            </Field>
            <Field label="Model">
              <Input value={form.model} onChange={set("model")} placeholder="e.g. LM6000, SGT-800" />
            </Field>
            <Field label="Year of Manufacture">
              <Input type="number" value={form.yearOfManufacture} onChange={set("yearOfManufacture")} placeholder="e.g. 2008" />
            </Field>
            <Field label="Rated Power (MW)">
              <Input type="number" step="0.1" value={form.ratedPowerMW} onChange={set("ratedPowerMW")} placeholder="e.g. 45" />
            </Field>
            <Field label="Operating Hours">
              <Input type="number" value={form.operatingHours} onChange={set("operatingHours")} placeholder="e.g. 48000" />
            </Field>
            <Field label="Condition">
              <select value={form.condition} onChange={set("condition")}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1B3A5C]/30">
                <option value="">Select condition…</option>
                {CONDITIONS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Location (Country/Region)">
              <Input value={form.location} onChange={set("location")} placeholder="e.g. Germany, Middle East" />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Description / Additional Details">
              <Textarea value={form.description} onChange={set("description")} rows={4}
                placeholder="Service history, reason for sale, available documentation, etc." />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Asking Price (optional — kept strictly confidential)">
              <Input value={form.askingPrice} onChange={set("askingPrice")} placeholder="e.g. USD 2,500,000 or negotiable" />
            </Field>
          </div>
        </fieldset>

        <p className="text-xs text-slate-400 leading-relaxed">
          By submitting this form you agree that Turbine Nexus may contact you regarding this listing.
          Your details will not be shared with third parties without your consent.
        </p>

        <Button type="submit" variant="amber" size="lg" className="w-full" disabled={loading}>
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Submitting…</>
            : <>Submit Your Listing <ArrowRight className="w-4 h-4 ml-2" /></>}
        </Button>
      </form>
    </div>
  );
}
