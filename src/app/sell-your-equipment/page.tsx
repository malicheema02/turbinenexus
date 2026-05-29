import type { Metadata } from "next";
import { DollarSign, Globe, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SellEquipmentForm } from "./SellEquipmentForm";

export const metadata: Metadata = {
  title: "Sell Your Equipment — Turbine Nexus",
  description: "List your surplus gas turbines, steam turbines, and power generation equipment with Turbine Nexus — free of charge. Global buyer network, confidential process.",
};

const BENEFITS = [
  { icon: DollarSign, title: "No Listing Fees", desc: "Listing your equipment on Turbine Nexus costs nothing. We earn our commission only when a transaction closes." },
  { icon: Globe, title: "Global Buyer Network", desc: "Immediate exposure to our network of qualified buyers across 40+ countries — including IPPs, utilities, and EPC contractors." },
  { icon: ShieldCheck, title: "Confidential & Professional", desc: "Your asset details, pricing, and identity are handled with strict confidentiality. Nothing is shared without your explicit consent." },
];

export default function SellYourEquipmentPage() {
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
              {BENEFITS.map((b) => (
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
            <SellEquipmentForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
