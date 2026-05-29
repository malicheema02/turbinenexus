import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle,
  Globe,
  Shield,
  Zap,
  BarChart3,
  Award,
  Users,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EquipmentCard } from "@/components/inventory/EquipmentCard";
import { findFeaturedEquipment } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Turbine Nexus — Surplus Power Generation Equipment Specialists",
  description:
    "Global marketplace for surplus gas turbines, steam turbines, and power generation assets. GE, Siemens, Wärtsilä. Trusted B2B specialists in secondary power equipment.",
  openGraph: {
    title: "Turbine Nexus — Surplus Power Generation Equipment Specialists",
    description:
      "Connect with vetted surplus gas turbines, steam turbines, and power generation assets. 40+ countries served.",
  },
};

const stats = [
  { value: "500+ MW", label: "Capacity Brokered" },
  { value: "40+", label: "Countries Served" },
  { value: "15+", label: "Years Combined Expertise" },
  { value: "$2B+", label: "Asset Value Managed" },
];

const valueProps = [
  {
    icon: Shield,
    title: "Vetted Assets",
    description:
      "Every asset undergoes rigorous technical due diligence. We verify condition reports, service histories, and operational data before listing.",
  },
  {
    icon: Globe,
    title: "Global Network",
    description:
      "Our established relationships span 40+ countries — connecting motivated sellers with strategic buyers across every major power market.",
  },
  {
    icon: CheckCircle,
    title: "End-to-End Support",
    description:
      "From initial sourcing through commercial negotiation, logistics, export documentation, and commissioning support — we handle the complexity.",
  },
];

const manufacturers = [
  { name: "General Electric", abbr: "GE" },
  { name: "Siemens Energy", abbr: "SE" },
  { name: "Wärtsilä", abbr: "WÄ" },
  { name: "MAN Energy Solutions", abbr: "MAN" },
  { name: "Rolls-Royce", abbr: "RR" },
  { name: "Solar Turbines", abbr: "SOL" },
];

const processSteps = [
  { step: "01", title: "Asset Sourcing", desc: "We identify surplus equipment through our global network of utilities, IPPs, and EPC contractors." },
  { step: "02", title: "Due Diligence", desc: "Technical inspection, documentation review, and condition assessment by our engineering specialists." },
  { step: "03", title: "Negotiation", desc: "Expert commercial negotiation to achieve the optimal transaction structure for both parties." },
  { step: "04", title: "Redeployment", desc: "End-to-end logistics, export/import permits, and commissioning support at the destination site." },
];

export default async function HomePage() {
  const featuredEquipment = await findFeaturedEquipment(3).catch(() => []);

  return (
    <>
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center bg-[#0F172A] overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #1B3A5C 0%, transparent 50%),
                               radial-gradient(circle at 75% 75%, #1B3A5C 0%, transparent 50%)`,
            }} />
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 pt-40">
            <div className="max-w-4xl">
              <Badge variant="outline" className="border-[#F59E0B]/50 text-[#F59E0B] bg-[#F59E0B]/10 mb-6 inline-flex">
                <Zap className="w-3.5 h-3.5 mr-1.5" />
                Global Power Asset Specialists
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                Surplus Power Generation Assets —{" "}
                <span className="text-[#F59E0B]">Relocated &amp; Redeployed Globally</span>
              </h1>

              <p className="text-xl text-slate-300 leading-relaxed mb-10 max-w-2xl">
                Turbine Nexus connects motivated sellers and strategic buyers of high-value gas turbines,
                steam turbines, and industrial power generation equipment. Confidential. Efficient. Global.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="amber" size="xl">
                  <Link href="/inventory">
                    Browse Inventory
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </Link>
                </Button>
                <Button asChild variant="white-outline" size="xl">
                  <Link href="/contact">Contact Our Team</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-slate-500 rounded-full flex items-start justify-center pt-2">
              <div className="w-1.5 h-3 bg-slate-400 rounded-full" />
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-[#1B3A5C]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl lg:text-4xl font-extrabold text-[#F59E0B] mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-300 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Inventory */}
        {featuredEquipment.length > 0 && (
          <section className="py-20 bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                <div>
                  <span className="text-[#F59E0B] text-sm font-semibold uppercase tracking-wider">
                    Current Stock
                  </span>
                  <h2 className="text-3xl font-bold text-[#0F172A] mt-1">
                    Featured Inventory
                  </h2>
                  <p className="text-slate-500 mt-2 max-w-lg">
                    Handpicked surplus assets — vetted, documented, and ready for redeployment.
                  </p>
                </div>
                <Button asChild variant="outline">
                  <Link href="/inventory" className="flex items-center gap-2">
                    View All Assets
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredEquipment.map((item) => (
                  <EquipmentCard key={item.id} equipment={item} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Value Proposition */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-[#F59E0B] text-sm font-semibold uppercase tracking-wider">
                Why Turbine Nexus
              </span>
              <h2 className="text-3xl font-bold text-[#0F172A] mt-2">
                The Strategic Advantage in Secondary Power Markets
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {valueProps.map((prop) => (
                <div
                  key={prop.title}
                  className="text-center p-8 rounded-2xl border border-slate-200 hover:border-[#1B3A5C]/30 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="w-14 h-14 bg-[#1B3A5C]/10 rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:bg-[#1B3A5C] transition-colors">
                    <prop.icon className="w-7 h-7 text-[#1B3A5C] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0F172A] mb-3">{prop.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">{prop.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works (preview) */}
        <section className="py-20 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-[#F59E0B] text-sm font-semibold uppercase tracking-wider">
                Our Process
              </span>
              <h2 className="text-3xl font-bold text-[#0F172A] mt-2">
                From Surplus to Operational in 4 Steps
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step, i) => (
                <div key={step.step} className="relative">
                  {i < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-[#1B3A5C]/30 to-transparent z-0" />
                  )}
                  <div className="relative bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="text-4xl font-extrabold text-[#1B3A5C]/10 mb-3">{step.step}</div>
                    <h3 className="font-bold text-[#0F172A] mb-2">{step.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Button asChild variant="outline">
                <Link href="/how-it-works">
                  Learn More About Our Process
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-16 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs text-slate-400 uppercase tracking-widest font-semibold mb-8">
              Specialists in assets from leading OEMs
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-12">
              {manufacturers.map((mfr) => (
                <div
                  key={mfr.name}
                  className="flex items-center gap-2 text-slate-400 hover:text-[#1B3A5C] transition-colors group"
                >
                  <div className="w-10 h-10 bg-slate-100 group-hover:bg-[#1B3A5C]/10 rounded-lg flex items-center justify-center font-bold text-xs transition-colors">
                    {mfr.abbr}
                  </div>
                  <span className="font-semibold text-sm">{mfr.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust / Testimonial section */}
        <section className="py-20 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Award,
                  title: "Independently Verified",
                  body: "All technical data and condition reports are sourced directly from asset owners and verified against OEM documentation.",
                },
                {
                  icon: Users,
                  title: "Executive-Level Relationships",
                  body: "We operate at the decision-maker level — engaging directly with asset directors, CFOs, and energy procurement heads.",
                },
                {
                  icon: BarChart3,
                  title: "Confidentiality Assured",
                  body: "Seller identities, floor prices, and commercial terms are kept strictly confidential throughout every transaction.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 p-6 bg-white rounded-2xl border border-slate-200">
                  <div className="w-12 h-12 bg-[#1B3A5C]/10 rounded-xl flex items-center justify-center shrink-0">
                    <item.icon className="w-6 h-6 text-[#1B3A5C]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0F172A] mb-2">{item.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-20 bg-[#0F172A] relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: "radial-gradient(circle at 50% 50%, #1B3A5C 0%, transparent 70%)",
            }} />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Ready to Redeploy? Let&apos;s Talk.
            </h2>
            <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
              Whether you have surplus equipment to sell or need a specific asset for your next project —
              our team operates globally, with discretion and speed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="amber" size="lg">
                <Link href="/inventory">
                  Browse Available Assets
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Link>
              </Button>
              <Button asChild variant="white-outline" size="lg">
                <Link href="/contact">Contact Our Team</Link>
              </Button>
            </div>
            <p className="text-slate-400 text-sm mt-6">
              Or email us directly:{" "}
              <a
                href="mailto:sales@TurbineNexus.com"
                className="text-[#F59E0B] hover:text-[#D97706] font-semibold transition-colors"
              >
                sales@TurbineNexus.com
              </a>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
