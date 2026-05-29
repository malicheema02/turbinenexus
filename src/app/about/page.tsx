import type { Metadata } from "next";
import { Shield, Target, Globe, Users, Award, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getSettingsMap } from "@/lib/settings";

export const metadata: Metadata = {
  title: "About Us — Turbine Nexus",
  description:
    "Turbine Nexus was founded on two years of intense high-value commercial procurement in the secondary power market, rapidly scaling into a trusted global operation. Learn our story.",
  openGraph: {
    title: "About Turbine Nexus — Our Story & Mission",
    description:
      "Learn how Turbine Nexus became a trusted global specialist in surplus power generation equipment relocation and redeployment.",
  },
};

const milestones = [
  {
    year: "Year 1",
    title: "Intensive Market Entry",
    description:
      "Turbine Nexus was established by a team with deep roots in commercial procurement and industrial equipment sales. The founding year was defined by relentless deal-making — sourcing, qualifying, and transacting on complex high-value assets in some of the world's most demanding energy markets. We processed our first $100M in asset pipeline within the first twelve months.",
  },
  {
    year: "Year 2",
    title: "Network Consolidation",
    description:
      "Having demonstrated consistent execution, we deepened exclusive relationships with major utility asset management teams, independent power producers (IPPs), and multinational EPC contractors. Our confidential approach and speed-to-execution earned us repeat mandates across Europe, the Middle East, and Southeast Asia.",
  },
  {
    year: "Year 3",
    title: "Global Platform Established",
    description:
      "By our third year of operations, Turbine Nexus had brokered more than 500MW of capacity and represented over $2 billion in asset value. Our platform — combining a proprietary global buyer network with in-house technical capabilities — became the defining competitive advantage that separates us from traditional equipment dealers.",
  },
  {
    year: "Today",
    title: "Trusted Global Operation",
    description:
      "Turbine Nexus is now a recognised name across 40+ countries for the confidential, efficient, and professionally executed relocation of surplus power generation assets. We serve utility operators, private equity energy funds, national grid authorities, and project developers who demand discretion and results.",
  },
];

const values = [
  {
    icon: Shield,
    title: "Integrity First",
    description:
      "In a market built on trust, we never compromise. Every piece of data we provide — from operating hours to condition assessments — is verified and accurate. Our reputation is our most valuable asset.",
  },
  {
    icon: Target,
    title: "Precision Execution",
    description:
      "We operate with the discipline of an investment bank and the agility of a specialist boutique. Deals are structured for speed and certainty, minimising the friction and delays that cost both parties time and money.",
  },
  {
    icon: Shield,
    title: "Strict Confidentiality",
    description:
      "Seller identities, commercial terms, and floor pricing are never disclosed to third parties. Our discretion is non-negotiable and is contractually protected in every engagement.",
  },
];

export default async function AboutPage() {
  const settings = await getSettingsMap();
  const aboutStats = [
    { icon: Globe, value: settings.get("about_stat_countries")?.trim() || "40+", label: "Countries" },
    { icon: TrendingUp, value: settings.get("about_stat_value")?.trim() || "$800M+", label: "Assets Managed" },
    { icon: Award, value: settings.get("about_stat_mw")?.trim() || "500+ MW", label: "Capacity Brokered" },
    { icon: Users, value: settings.get("about_stat_clients")?.trim() || "20+", label: "Clients Served" },
  ];
  return (
    <>
      <Navbar />

      <main className="pt-20">
        {/* Hero */}
        <section className="bg-[#0F172A] py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="text-[#F59E0B] text-sm font-semibold uppercase tracking-wider">
                Our Story
              </span>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-white mt-3 mb-6 leading-tight">
                Built on Commercial Expertise. <br />
                <span className="text-[#F59E0B]">Scaled on Trust.</span>
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed">
                Turbine Nexus was not built in a boardroom. It was built in the field — in power
                plant control rooms, on overnight flights to asset inspections, in negotiations that
                stretched across time zones. We are operators, not observers.
              </p>
            </div>
          </div>
        </section>

        {/* Origin Story */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-[#F59E0B] text-sm font-semibold uppercase tracking-wider">
                  The Foundation
                </span>
                <h2 className="text-3xl font-bold text-[#0F172A] mt-3 mb-6">
                  Two Years of Intense Market Learning
                </h2>
                <div className="space-y-4 text-slate-600 leading-relaxed">
                  <p>
                    Turbine Nexus was founded on a straightforward but powerful insight: the secondary
                    market for industrial power generation equipment was fragmented, opaque, and
                    chronically under-served by professionals who truly understood both the technical
                    and commercial dimensions of these assets.
                  </p>
                  <p>
                    Our founders spent two intensive years embedded in the commercial procurement
                    operations of major energy companies, negotiating the acquisition and disposal of
                    high-value generation assets across emerging and established markets. During this
                    period, we closed transactions involving gas turbines, steam turbines, combined
                    cycle blocks, and industrial power packages from every major OEM — including
                    General Electric, Siemens, and Wärtsilä.
                  </p>
                  <p>
                    We saw first-hand the inefficiency, the information asymmetry, and the enormous
                    value that a well-connected, technically literate intermediary could unlock. Turbine
                    Nexus is the product of that insight.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {aboutStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200 text-center"
                  >
                    <div className="w-10 h-10 bg-[#1B3A5C]/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <stat.icon className="w-5 h-5 text-[#1B3A5C]" />
                    </div>
                    <div className="text-2xl font-extrabold text-[#1B3A5C]">{stat.value}</div>
                    <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 bg-[#1B3A5C]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-xl text-slate-200 leading-relaxed mb-4">
              To extend the productive lifecycle of critical power generation infrastructure by
              connecting the world&apos;s surplus assets with the projects and markets that need them most.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Every turbine we redeploy is a turbine that does not become scrap metal. Every megawatt
              we reactivate is capacity that does not need to be newly manufactured. We believe that
              the circular economy of industrial power equipment is not only commercially compelling —
              it is strategically essential for global energy security.
            </p>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-[#F59E0B] text-sm font-semibold uppercase tracking-wider">
                Our Journey
              </span>
              <h2 className="text-3xl font-bold text-[#0F172A] mt-2">
                From Concept to Global Operation
              </h2>
            </div>

            <div className="relative">
              <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-[#1B3A5C]/20 -translate-x-1/2" />

              <div className="space-y-10">
                {milestones.map((milestone, i) => (
                  <div
                    key={milestone.year}
                    className={`relative flex flex-col lg:flex-row gap-8 ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
                  >
                    <div className="lg:w-1/2 pl-12 lg:pl-0 lg:pr-12">
                      <div
                        className={`bg-white rounded-2xl p-6 border border-slate-200 shadow-sm ${i % 2 === 0 ? "lg:text-right" : ""}`}
                      >
                        <span className="inline-block text-[#F59E0B] font-bold text-sm bg-[#F59E0B]/10 px-3 py-1 rounded-full mb-3">
                          {milestone.year}
                        </span>
                        <h3 className="text-xl font-bold text-[#0F172A] mb-3">{milestone.title}</h3>
                        <p className="text-slate-500 leading-relaxed text-sm">{milestone.description}</p>
                      </div>
                    </div>

                    {/* Centre dot */}
                    <div className="absolute left-4 lg:left-1/2 top-6 w-4 h-4 bg-[#1B3A5C] rounded-full border-4 border-white shadow -translate-x-1/2" />

                    <div className="hidden lg:block lg:w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-[#F59E0B] text-sm font-semibold uppercase tracking-wider">
                How We Operate
              </span>
              <h2 className="text-3xl font-bold text-[#0F172A] mt-2">Our Core Values</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value) => (
                <div key={value.title} className="p-8 rounded-2xl border border-slate-200 hover:border-[#1B3A5C]/30 hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 bg-[#1B3A5C]/10 rounded-xl flex items-center justify-center mb-5">
                    <value.icon className="w-6 h-6 text-[#1B3A5C]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0F172A] mb-3">{value.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
