import type { Metadata } from "next";
import Link from "next/link";
import {
  Search,
  ClipboardCheck,
  Handshake,
  Truck,
  Wrench,
  ArrowRight,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "How It Works — Turbine Nexus",
  description:
    "Discover Turbine Nexus's 5-step operational process for the relocation and redeployment of surplus power generation equipment, from asset identification to commissioning support.",
  openGraph: {
    title: "How Turbine Nexus Works — Our Operational Process",
    description:
      "A 5-step proven process for connecting surplus gas turbines and steam turbines with new projects globally.",
  },
};

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Asset Identification & Sourcing",
    summary: "We identify surplus equipment through our established global network.",
    details: [
      "Our sourcing network spans over 40 countries, encompassing utility operators, independent power producers (IPPs), national oil companies (NOCs), energy-focused private equity funds, and EPC contractors managing project closeouts.",
      "We maintain active relationships with asset management teams at major organisations, which provides us with early — and often exclusive — access to equipment before it reaches the open market.",
      "We actively seek out both scheduled decommissioning events and distressed or urgent disposal situations, allowing us to act swiftly on emerging opportunities.",
    ],
    deliverable: "Qualified asset profile with preliminary condition assessment",
  },
  {
    icon: ClipboardCheck,
    number: "02",
    title: "Technical Due Diligence & Inspection",
    summary: "Rigorous verification of asset condition, documentation, and operational history.",
    details: [
      "Every asset that enters the Turbine Nexus inventory undergoes a structured technical review process. This begins with documentation analysis — reviewing OEM service records, maintenance history, CMMS data, and available inspection reports.",
      "Where warranted, we commission independent borescope inspections, lube oil analysis, and vibration data review. For major assets, we engage OEM-certified technical consultants.",
      "We establish a verifiable operating hours and service cycle record, and cross-reference all available data to present an accurate, auditable picture of the asset's condition to prospective buyers.",
    ],
    deliverable: "Full technical data package — ready for buyer evaluation",
  },
  {
    icon: Handshake,
    number: "03",
    title: "Commercial Negotiation",
    summary: "Expert negotiation to structure transactions that work for both parties.",
    details: [
      "Commercial negotiation in the secondary power equipment market is a specialist skill. We bring expert knowledge of market pricing, comparable transactions, and the unique risk/value considerations relevant to used industrial assets.",
      "We manage the negotiation process on behalf of our clients, handling information flow, term sheets, and commercial structures designed to deliver certainty and speed for both buyer and seller.",
      "All commercial terms, pricing, and counterparty information are handled with strict confidentiality. Seller identities and floor pricing are never disclosed to the buyer side without explicit authorisation.",
    ],
    deliverable: "Executed heads of terms / letter of intent",
  },
  {
    icon: Truck,
    number: "04",
    title: "Logistics & Documentation",
    summary: "End-to-end management of export, shipping, and regulatory compliance.",
    details: [
      "We coordinate with specialist heavy-lift logistics providers for the dismantling, loading, and transportation of equipment — including abnormal load routing for road transport, project cargo sea freight, and airfreight for smaller components.",
      "Our team manages export documentation, certificates of origin, decommissioning records, and all relevant environmental and regulatory paperwork required by the destination jurisdiction.",
      "Where required, we engage specialist legal counsel for cross-border equipment transaction structures and sanctions compliance.",
    ],
    deliverable: "Cleared goods at destination port / logistics hub",
  },
  {
    icon: Wrench,
    number: "05",
    title: "Redeployment & Commissioning Support",
    summary: "Technical support for successful recommissioning at the new site.",
    details: [
      "The final stage of the Turbine Nexus process is ensuring the asset is successfully reinstated into service. We coordinate with OEM service partners and independent commissioning engineers to support the re-installation and recommissioning process.",
      "We can facilitate the sourcing of specific spare parts, consumables, and tooling required for recommissioning, drawing on our supply chain network.",
      "Our engagement does not end at equipment delivery — we remain available throughout the recommissioning phase to resolve technical queries and provide documentation support.",
    ],
    deliverable: "Asset operational at new site",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />

      <main className="pt-20">
        {/* Hero */}
        <section className="bg-[#0F172A] py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="text-[#F59E0B] text-sm font-semibold uppercase tracking-wider">
                Our Process
              </span>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-white mt-3 mb-6 leading-tight">
                From Surplus to Operational —{" "}
                <span className="text-[#F59E0B]">Every Step Managed.</span>
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed">
                Turbine Nexus brings a structured, five-stage approach to every asset transaction.
                Our process is designed to deliver certainty, transparency, and speed — from the
                moment an asset is identified to the moment it is back in service.
              </p>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────── */}
        {/* FLOWCHART PLACEHOLDER — INSERT DIAGRAM HERE */}
        {/* ─────────────────────────────────────────── */}
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border-2 border-dashed border-[#1B3A5C]/30 rounded-2xl p-12 text-center bg-[#F8FAFC]">
              <div className="w-14 h-14 bg-[#1B3A5C]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Info className="w-7 h-7 text-[#1B3A5C]" />
              </div>
              <h2 className="text-xl font-bold text-[#1B3A5C] mb-2">
                OPERATIONAL FLOWCHART — INSERT DIAGRAM HERE
              </h2>
              <p className="text-slate-500 text-sm max-w-lg mx-auto">
                This section is reserved for the detailed operational flowchart. To add your diagram:
              </p>
              <ol className="mt-4 text-left max-w-sm mx-auto space-y-2 text-sm text-slate-500">
                <li>1. Place your image file in <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[#1B3A5C]">/public/images/</code></li>
                <li>2. Replace this section in <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[#1B3A5C]">src/app/how-it-works/page.tsx</code></li>
                <li>3. Use <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[#1B3A5C]">&lt;Image src=&quot;/images/flowchart.png&quot; alt=&quot;...&quot; /&gt;</code></li>
              </ol>
              <div className="mt-6 h-32 bg-gradient-to-r from-[#1B3A5C]/5 via-[#1B3A5C]/10 to-[#1B3A5C]/5 rounded-xl flex items-center justify-center">
                <span className="text-[#1B3A5C]/40 font-semibold text-sm">[Diagram Placeholder]</span>
              </div>
            </div>
          </div>
        </section>
        {/* ─────────────────────────────────────────── */}

        {/* Steps */}
        <section className="py-20 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-[#0F172A]">
                The Five-Stage Process
              </h2>
              <p className="text-slate-500 mt-3">
                Each stage is managed by specialist professionals with direct experience in the secondary
                power generation market.
              </p>
            </div>

            <div className="space-y-8">
              {steps.map((step, i) => (
                <div
                  key={step.number}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                    {/* Step indicator */}
                    <div className="lg:col-span-1 bg-[#1B3A5C] p-6 flex flex-row lg:flex-col items-center justify-center gap-3">
                      <span className="text-[#F59E0B] font-extrabold text-2xl">{step.number}</span>
                      <step.icon className="w-6 h-6 text-slate-300" />
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-11 p-6 lg:p-8">
                      <h3 className="text-xl font-bold text-[#0F172A] mb-2">{step.title}</h3>
                      <p className="text-[#F59E0B] font-semibold text-sm mb-4">{step.summary}</p>

                      <div className="space-y-3 mb-6">
                        {step.details.map((detail, j) => (
                          <p key={j} className="text-slate-600 leading-relaxed text-sm">
                            {detail}
                          </p>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 text-sm bg-[#F8FAFC] rounded-lg px-4 py-3 border border-slate-200 w-fit">
                        <ArrowRight className="w-4 h-4 text-[#1B3A5C] shrink-0" />
                        <span className="font-semibold text-[#1B3A5C]">Deliverable:</span>
                        <span className="text-slate-600">{step.deliverable}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-[#1B3A5C]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start the Process?
            </h2>
            <p className="text-slate-300 text-lg mb-8">
              Whether you have an asset to sell or a project requirement to fill — get in touch
              with our team today.
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
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
