import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Users, Globe, Shield, FileText, Handshake, Eye, MessageSquare, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "How It Works — Turbine Nexus",
  description:
    "Discover how Turbine Nexus facilitates secondary market power generation asset transactions — from trader & buyer inquiry through to deal closure.",
  openGraph: {
    title: "How Turbine Nexus Works — Our Transaction Model",
    description:
      "Turbine Nexus connects surplus power generation assets with qualified buyers globally through a structured, confidential process.",
  },
};

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">

        {/* ── Hero ───────────────────────────────────────────────── */}
        <section className="bg-[#0F172A] py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="text-[#F59E0B] text-sm font-semibold uppercase tracking-wider">
                Our Process
              </span>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-white mt-3 mb-6 leading-tight">
                From Inquiry to Deal Closure —{" "}
                <span className="text-[#F59E0B]">Every Step Managed.</span>
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed">
                Turbine Nexus acts as the trusted commercial intermediary between equipment owners
                and end buyers. Whether you reach us through a trader or directly, our structured
                process protects all parties and ensures transactions close efficiently.
              </p>
            </div>
          </div>
        </section>

        {/* ── Flow Diagram ───────────────────────────────────────── */}
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-[#0F172A]">Transaction Flow Overview</h2>
              <p className="text-slate-500 mt-2 text-sm">
                Two entry paths — one structured outcome.
              </p>
            </div>
            <FlowDiagram />
          </div>
        </section>

        {/* ── Step 1: Inquiry Received ───────────────────────────── */}
        <section className="py-20 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <StepHeader number="01" title="Inquiry Received" icon={MessageSquare}
              summary="Every transaction begins with an inquiry — either through a trader/broker or directly from the end buyer." />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

              {/* Via Trader */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-lg bg-[#1B3A5C]/10 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-[#1B3A5C]" />
                  </div>
                  <h3 className="font-bold text-[#0F172A] text-lg">Path A — Via Trader / Broker</h3>
                </div>
                <ol className="space-y-4 text-sm text-slate-600">
                  <li className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#1B3A5C] text-white text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">1</span>
                    <p>TN receives the inquiry from the trader and shares <strong>high-level asset details</strong> only.</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#F59E0B] text-white text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">2a</span>
                    <div>
                      <p className="font-semibold text-[#0F172A] mb-1">If commission is secured by the buyer:</p>
                      <p>TN signs an <strong>NCNDA</strong> with the trader, then requests a formal introduction to the end buyer.</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-slate-400 text-white text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">2b</span>
                    <div>
                      <p className="font-semibold text-[#0F172A] mb-1">If commission is NOT secured by the buyer:</p>
                      <p>TN signs a <strong>Revenue Sharing Agreement</strong> with the trader, offering <span className="text-[#F59E0B] font-semibold">10%–25% commission</span> (subject to situation). Trader must introduce the end buyer within <strong>5 working days</strong>.</p>
                    </div>
                  </li>
                </ol>
              </div>

              {/* Direct from buyer */}
              <div className="bg-white rounded-2xl border-2 border-[#1B3A5C] shadow-sm p-7">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-[#F59E0B]" />
                  </div>
                  <h3 className="font-bold text-[#0F172A] text-lg">Path B — Direct from End Buyer</h3>
                  <span className="ml-auto text-xs bg-[#F59E0B] text-white font-semibold px-2 py-0.5 rounded-full">Preferred</span>
                </div>
                <ol className="space-y-4 text-sm text-slate-600">
                  <li className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#1B3A5C] text-white text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">1</span>
                    <p>TN signs a <strong>Memorandum of Understanding (MOU)</strong> directly with the end buyer to secure TN's commercial interest in the transaction.</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#1B3A5C] text-white text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">2</span>
                    <div>
                      <p className="font-semibold text-[#0F172A] mb-2">TN commission = <span className="text-[#F59E0B]">3% from the buyer</span>, paid in milestones:</p>
                      <div className="space-y-2">
                        {[
                          { pct: "30%", trigger: "On SPA (Sale & Purchase Agreement) execution" },
                          { pct: "20%", trigger: "When dismantling of the unit begins" },
                          { pct: "50%", trigger: "When unit is ready to load on trucks & dispatch" },
                        ].map((m) => (
                          <div key={m.pct} className="flex items-center gap-3 bg-[#F8FAFC] rounded-lg px-3 py-2 border border-slate-200">
                            <span className="font-extrabold text-[#1B3A5C] text-sm w-10 shrink-0">{m.pct}</span>
                            <span className="text-xs text-slate-600">{m.trigger}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* ── Steps 2–5 ──────────────────────────────────────────── */}
        <section className="py-10 pb-20 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

            <StepCard
              number="02"
              icon={Handshake}
              title="Buyer–Seller Introduction"
              deliverable="First formal meeting completed"
            >
              <p className="text-slate-600 text-sm leading-relaxed">
                Once the MOU is signed with the end buyer, Turbine Nexus arranges a formal meeting
                between the <strong>Equipment Owner</strong> and the <strong>Buyer</strong>. TN manages
                the introduction to ensure the right level of information is shared at the right time,
                maintaining confidentiality obligations to both parties.
              </p>
            </StepCard>

            <StepCard
              number="03"
              icon={Eye}
              title="Physical Inspection"
              deliverable="Inspection report issued to buyer"
            >
              <p className="text-slate-600 text-sm leading-relaxed">
                Turbine Nexus strongly encourages — and actively facilitates — a <strong>physical
                inspection</strong> of the equipment by the buyer or their appointed technical
                representative. We coordinate logistics, access, and any third-party inspection
                services required to give the buyer full technical confidence in the asset.
              </p>
            </StepCard>

            <StepCard
              number="04"
              icon={FileText}
              title="Commercial Negotiation"
              deliverable="Agreed heads of terms / Letter of Intent"
            >
              <p className="text-slate-600 text-sm leading-relaxed">
                TN facilitates the commercial negotiation between the Equipment Owner and the Buyer.
                We apply our expertise in secondary market pricing, comparable transactions, and
                deal structures to help both sides reach an agreement that reflects the true market
                value of the asset. Seller floor pricing and identity remain strictly confidential
                throughout.
              </p>
            </StepCard>

            <StepCard
              number="05"
              icon={CheckCircle2}
              title="Transaction Closure"
              deliverable="SPA executed — asset dispatched"
            >
              <p className="text-slate-600 text-sm leading-relaxed">
                With terms agreed, TN supports both parties through the final stages: SPA drafting
                and execution, dismantling coordination, export documentation, logistics, and
                final dispatch. Our involvement continues until the asset is confirmed ready for
                loading and all parties have fulfilled their contractual obligations.
              </p>
            </StepCard>

          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────────── */}
        <section className="py-20 bg-[#1B3A5C]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start the Process?</h2>
            <p className="text-slate-300 text-lg mb-8">
              Whether you have an asset to sell or a project requirement to fill — get in touch today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="amber" size="lg">
                <Link href="/inventory">Browse Available Assets <ArrowRight className="w-5 h-5 ml-1" /></Link>
              </Button>
              <Button asChild variant="white-outline" size="lg">
                <Link href="/sell-your-equipment">List Your Equipment</Link>
              </Button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────────── */

function StepHeader({ number, title, icon: Icon, summary }: {
  number: string; title: string; icon: React.ElementType; summary: string;
}) {
  return (
    <div className="flex items-start gap-5 mb-2">
      <div className="flex flex-col items-center gap-1 shrink-0">
        <span className="text-[#F59E0B] font-extrabold text-3xl leading-none">{number}</span>
        <div className="w-10 h-10 rounded-xl bg-[#1B3A5C] flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-[#0F172A]">{title}</h2>
        <p className="text-slate-500 mt-1 text-sm">{summary}</p>
      </div>
    </div>
  );
}

function StepCard({ number, icon: Icon, title, deliverable, children }: {
  number: string; icon: React.ElementType; title: string; deliverable: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-1 bg-[#1B3A5C] p-6 flex flex-row lg:flex-col items-center justify-center gap-3">
          <span className="text-[#F59E0B] font-extrabold text-2xl">{number}</span>
          <Icon className="w-5 h-5 text-slate-300" />
        </div>
        <div className="lg:col-span-11 p-6 lg:p-8">
          <h3 className="text-xl font-bold text-[#0F172A] mb-3">{title}</h3>
          {children}
          <div className="flex items-center gap-2 text-sm bg-[#F8FAFC] rounded-lg px-4 py-3 border border-slate-200 w-fit mt-5">
            <ArrowRight className="w-4 h-4 text-[#1B3A5C] shrink-0" />
            <span className="font-semibold text-[#1B3A5C]">Deliverable:</span>
            <span className="text-slate-600">{deliverable}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FlowDiagram() {
  // Layout constants
  const W = 1000, H = 780;
  // Column centres
  const cL = 180, cM = 500, cR = 820;
  // Row Y centres
  const r0 = 40, r1 = 130, r2 = 230, r3 = 330, r4 = 430, r5 = 540, r6 = 640, r7 = 730;
  const bw = 210, bh = 52, dw = 200, dh = 58;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-5xl mx-auto" style={{ minWidth: 700 }}
        aria-label="Turbine Nexus transaction flow diagram">
        <defs>
          <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#64748B" />
          </marker>
          <marker id="arr-amber" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#F59E0B" />
          </marker>
          <marker id="arr-blue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#1B3A5C" />
          </marker>
        </defs>

        {/* ══ ROW 0 — Entry points ══ */}
        <Rect x={cL - bw/2} y={r0 - bh/2} w={bw} h={bh} fill="#1B3A5C" label="Trader / Broker Inquiry" textColor="#fff" />
        <Rect x={cR - bw/2} y={r0 - bh/2} w={bw} h={bh} fill="#1B3A5C" label="Direct End Buyer Inquiry" textColor="#fff" />

        {/* ══ ROW 1 — Left: Commission decision | Right: Sign MOU ══ */}
        <Diamond x={cL - dw/2} y={r1 - dh/2} w={dw} h={dh} fill="#F59E0B" label="Commission secured?" textColor="#0F172A" />
        <Rect x={cR - bw/2} y={r1 - bh/2} w={bw} h={bh} fill="#0F172A" label="Sign MOU with End Buyer" textColor="#F59E0B" />

        {/* ══ ROW 2 — NCNDA vs Revenue Sharing | Right: 3% milestones ══ */}
        <Rect x={30} y={r2 - bh/2} w={165} h={bh} fill="#64748B" label="Sign NCNDA with Trader" textColor="#fff" small />
        <Rect x={210} y={r2 - bh/2} w={165} h={bh} fill="#64748B" label="Revenue Sharing Agmt (10–25%)" textColor="#fff" small />
        <Rect x={cR - bw/2} y={r2 - bh/2} w={bw} h={bh} fill="#0F172A" label="3% Commission Milestones Locked" textColor="#fff" small />

        {/* ══ ROW 3 — Trader introduces TN to End Buyer ══ */}
        <Rect x={cL - bw/2} y={r3 - bh/2} w={bw} h={bh} fill="#334155" label="Trader Introduces TN to End Buyer" textColor="#F59E0B" />

        {/* ══ ROW 4 — TN signs MOU (from trader path) ══ */}
        <Rect x={cL - bw/2} y={r4 - bh/2} w={bw} h={bh} fill="#0F172A" label="TN Signs MOU with End Buyer" textColor="#F59E0B" />

        {/* ══ ROW 5 — Converge: Buyer-Seller Introduction ══ */}
        <Rect x={cM - bw/2} y={r5 - bh/2} w={bw} h={bh} fill="#1B3A5C" label="Buyer–Seller Introduction" textColor="#fff" />

        {/* ══ ROW 6 — Physical Inspection ══ */}
        <Rect x={cM - bw/2} y={r6 - bh/2} w={bw} h={bh} fill="#1B3A5C" label="Physical Inspection" textColor="#fff" />

        {/* ══ ROW 7 — Commercial Negotiation | Deal Closed ══ */}
        <Rect x={cL - bw/2} y={r7 - bh/2} w={bw} h={bh} fill="#F59E0B" label="Commercial Negotiation" textColor="#0F172A" />
        <Rect x={cR - bw/2} y={r7 - bh/2} w={bw} h={bh} fill="#0F172A" label="Deal Closed — SPA Executed" textColor="#F59E0B" />

        {/* ══ ARROWS ══ */}
        {/* Entry → decisions */}
        <Arrow x1={cL} y1={r0+bh/2} x2={cL} y2={r1-dh/2} color="#64748B" />
        <Arrow x1={cR} y1={r0+bh/2} x2={cR} y2={r1-bh/2} color="#F59E0B" />

        {/* Commission diamond → NCNDA (left) */}
        <Arrow x1={cL-dw/2} y1={r1} x2={30+165} y2={r2-bh/2} color="#64748B" label="YES" labelX={90} labelY={r1+20} />
        {/* Commission diamond → Revenue Sharing (right) */}
        <Arrow x1={cL+dw/2} y1={r1} x2={210} y2={r2-bh/2} color="#64748B" label="NO" labelX={280} labelY={r1+20} />

        {/* Right path MOU → milestones */}
        <Arrow x1={cR} y1={r1+bh/2} x2={cR} y2={r2-bh/2} color="#F59E0B" />

        {/* NCNDA + Revenue Sharing → Trader Introduces */}
        <Arrow x1={112} y1={r2+bh/2} x2={cL-20} y2={r3-bh/2} color="#64748B" />
        <Arrow x1={292} y1={r2+bh/2} x2={cL+20} y2={r3-bh/2} color="#64748B" />

        {/* Trader Introduces → TN Signs MOU */}
        <Arrow x1={cL} y1={r3+bh/2} x2={cL} y2={r4-bh/2} color="#64748B" />

        {/* TN Signs MOU (left) → Buyer-Seller Intro */}
        <Arrow x1={cL+bw/2} y1={r4} x2={cM-bw/2} y2={r5} color="#64748B" />

        {/* Right milestones → Buyer-Seller Intro */}
        <Arrow x1={cR-bw/2} y1={r2+bh/2} x2={cM+bw/2} y2={r5-bh/2} color="#F59E0B" />

        {/* Centre flow */}
        <Arrow x1={cM} y1={r5+bh/2} x2={cM} y2={r6-bh/2} color="#1B3A5C" />
        <Arrow x1={cM-30} y1={r6+bh/2} x2={cL+bw/2} y2={r7-bh/2} color="#1B3A5C" />
        <Arrow x1={cM+30} y1={r6+bh/2} x2={cR-bw/2} y2={r7-bh/2} color="#1B3A5C" />

        {/* Commercial Negotiation → Deal Closed */}
        <line x1={cL+bw/2} y1={r7} x2={cR-bw/2} y2={r7} stroke="#F59E0B" strokeWidth="2" strokeDasharray="6 3" markerEnd="url(#arr-amber)" />
      </svg>
    </div>
  );
}

function Arrow({ x1, y1, x2, y2, color, label, labelX, labelY }: {
  x1: number; y1: number; x2: number; y2: number;
  color: string; label?: string; labelX?: number; labelY?: number;
}) {
  const id = color === "#F59E0B" ? "arr-amber" : color === "#1B3A5C" ? "arr-blue" : "arr";
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.5" markerEnd={`url(#${id})`} />
      {label && <text x={labelX} y={labelY} fontSize="10" fill={color} fontWeight="700" fontFamily="Inter, sans-serif">{label}</text>}
    </g>
  );
}

function Rect({ x, y, w, h, fill, label, textColor, small }: {
  x: number; y: number; w: number; h: number;
  fill: string; label: string; textColor: string; small?: boolean;
}) {
  const lines = label.length > 22 ? splitLabel(label) : [label];
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" fill={fill} />
      {lines.map((line, i) => (
        <text
          key={i}
          x={x + w / 2}
          y={y + h / 2 + (i - (lines.length - 1) / 2) * (small ? 13 : 16)}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={textColor}
          fontSize={small ? 11 : 13}
          fontWeight="600"
          fontFamily="Inter, sans-serif"
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function Diamond({ x, y, w, h, fill, label, textColor }: {
  x: number; y: number; w: number; h: number;
  fill: string; label: string; textColor: string;
}) {
  const cx = x + w / 2, cy = y + h / 2;
  const pts = `${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}`;
  return (
    <g>
      <polygon points={pts} fill={fill} />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
        fill={textColor} fontSize={11} fontWeight="700" fontFamily="Inter, sans-serif">
        {label}
      </text>
    </g>
  );
}

function splitLabel(label: string): string[] {
  const words = label.split(" ");
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}
