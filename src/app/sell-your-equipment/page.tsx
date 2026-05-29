"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ShieldCheck, Globe, DollarSign, ArrowRight, Loader2 } from "lucide-react";

const EQUIPMENT_TYPES = ["Gas Turbine", "Steam Turbine", "Gas Engine", "Generator", "Transformer", "Other"];
const CONDITIONS = ["Excellent", "Good", "Fair", "For Parts / Spares"];

export default function SellYourEquipmentPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    companyName: "", contactName: "", contactEmail: "", contactPhone: "",
    equipmentType: "", manufacturer: "", model: "",
    yearOfManufacture: "", ratedPowerMW: "", operatingHours: "",
    condition: "", location: "", description: "", askingPrice: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/sell-equipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-20">

        {/* Hero */}
        <section className="bg-[#0F172A] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <span className="text-[#F59E0B] text-sm font-semibold uppercase tracking-wider">For Equipment Owners</span>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-white mt-3 mb-6 leading-tight">
                List Your Surplus Equipment —{" "}
                <span className="text-[#F59E0B]">Free of Charge.</span>
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed">
                Turbine Nexus connects surplus power generation equipment with qualified buyers
                globally. Submit your asset details and our team will be in touch within 24 hours.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: DollarSign, title: "No Listing Fees", desc: "Listing your equipment on Turbine Nexus costs nothing. We earn our commission only when a transaction closes." },
                { icon: Globe, title: "Global Buyer Network", desc: "Immediate exposure to our network of qualified buyers across 40+ countries — including IPPs, utilities, and EPC contractors." },
                { icon: ShieldCheck, title: "Confidential & Professional", desc: "Your asset details, pricing, and identity are handled with strict confidentiality. Nothing is shared without your explicit consent." },
              ].map((b) => (
                <div key={b.title} className="flex gap-4 p-5 rounded-xl border border-slate-200 bg-[#F8FAFC]">
                  <div className="w-10 h-10 rounded-lg bg-[#1B3A5C]/10 flex items-center justify-center shrink-0">
                    <b.icon className="w-5 h-5 text-[#1B3A5C]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0F172A] mb-1">{b.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="py-20 bg-[#F8FAFC]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {submitted ? (
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
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 lg:p-10">
                <h2 className="text-2xl font-bold text-[#0F172A] mb-1">Submit Your Asset</h2>
                <p className="text-slate-500 text-sm mb-8">All fields marked * are required. Asking price is optional and kept strictly confidential.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <fieldset>
                    <legend className="text-sm font-bold text-[#1B3A5C] uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 w-full">Contact Information</legend>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Company Name *"><Input required value={form.companyName} onChange={set("companyName")} placeholder="Your company" /></Field>
                      <Field label="Contact Name *"><Input required value={form.contactName} onChange={set("contactName")} placeholder="Your full name" /></Field>
                      <Field label="Email Address *"><Input required type="email" value={form.contactEmail} onChange={set("contactEmail")} placeholder="you@company.com" /></Field>
                      <Field label="Phone Number"><Input value={form.contactPhone} onChange={set("contactPhone")} placeholder="+1 234 567 8900" /></Field>
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend className="text-sm font-bold text-[#1B3A5C] uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 w-full">Equipment Details</legend>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Equipment Type *">
                        <select required value={form.equipmentType} onChange={set("equipmentType")}
                          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1B3A5C]/30">
                          <option value="">Select type…</option>
                          {EQUIPMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
                        </select>
                      </Field>
                      <Field label="Manufacturer"><Input value={form.manufacturer} onChange={set("manufacturer")} placeholder="GE, Siemens, Wärtsilä…" /></Field>
                      <Field label="Model"><Input value={form.model} onChange={set("model")} placeholder="e.g. LM6000, SGT-800" /></Field>
                      <Field label="Year of Manufacture"><Input type="number" value={form.yearOfManufacture} onChange={set("yearOfManufacture")} placeholder="e.g. 2008" /></Field>
                      <Field label="Rated Power (MW)"><Input type="number" step="0.1" value={form.ratedPowerMW} onChange={set("ratedPowerMW")} placeholder="e.g. 45" /></Field>
                      <Field label="Operating Hours"><Input type="number" value={form.operatingHours} onChange={set("operatingHours")} placeholder="e.g. 48000" /></Field>
                      <Field label="Condition">
                        <select value={form.condition} onChange={set("condition")}
                          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1B3A5C]/30">
                          <option value="">Select condition…</option>
                          {CONDITIONS.map((c) => <option key={c}>{c}</option>)}
                        </select>
                      </Field>
                      <Field label="Location (Country/Region)"><Input value={form.location} onChange={set("location")} placeholder="e.g. Germany, Middle East" /></Field>
                    </div>
                    <div className="mt-4">
                      <Field label="Description / Additional Details">
                        <Textarea value={form.description} onChange={set("description")} rows={4}
                          placeholder="Include any relevant details: service history, reason for sale, available documentation, etc." />
                      </Field>
                    </div>
                    <div className="mt-4">
                      <Field label="Asking Price (optional — kept strictly confidential)">
                        <Input value={form.askingPrice} onChange={set("askingPrice")} placeholder="e.g. USD 2,500,000 or negotiable" />
                      </Field>
                    </div>
                  </fieldset>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    By submitting this form you agree that Turbine Nexus may contact you regarding
                    this listing. Your details will not be shared with third parties without your consent.
                  </p>

                  <Button type="submit" variant="amber" size="lg" className="w-full" disabled={loading}>
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Submitting…</> : <>Submit Your Listing <ArrowRight className="w-4 h-4 ml-2" /></>}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
