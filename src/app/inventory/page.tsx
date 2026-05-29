import type { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EquipmentFilters } from "@/components/inventory/EquipmentFilters";
import { InventoryGrid } from "@/components/inventory/InventoryGrid";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Available Inventory — Gas Turbines, Steam Turbines | Turbine Nexus",
  description:
    "Browse Turbine Nexus's current inventory of surplus gas turbines, steam turbines, and power generation equipment from GE, Siemens, Wärtsilä and more. Fully vetted, globally available.",
  openGraph: {
    title: "Available Inventory — Turbine Nexus",
    description:
      "Surplus gas turbines, steam turbines, and industrial generators. Vetted assets from GE, Siemens, Wärtsilä, MAN. Inquire for pricing.",
  },
};

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

function getParam(params: Record<string, string | string[] | undefined>, key: string): string | undefined {
  const val = params[key];
  if (Array.isArray(val)) return val[0];
  return val;
}

export default function InventoryPage({ searchParams }: PageProps) {
  const minMW = getParam(searchParams, "minMW");
  const maxMW = getParam(searchParams, "maxMW");
  const filters = {
    manufacturer: getParam(searchParams, "manufacturer"),
    equipmentType: getParam(searchParams, "type"),
    condition: getParam(searchParams, "condition"),
    fuelType: getParam(searchParams, "fuel"),
    frequency: getParam(searchParams, "frequency"),
    status: getParam(searchParams, "status"),
    minPowerMW: minMW ? parseFloat(minMW) : undefined,
    maxPowerMW: maxMW ? parseFloat(maxMW) : undefined,
    search: getParam(searchParams, "q"),
    page: parseInt(getParam(searchParams, "page") ?? "1", 10),
  };

  return (
    <>
      <Navbar />

      <main className="pt-20">
        {/* Hero */}
        <section className="bg-[#0F172A] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-[#F59E0B] text-sm font-semibold uppercase tracking-wider">
              Secondary Market
            </span>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white mt-3 mb-3">
              Available Inventory
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl">
              Vetted surplus gas turbines, steam turbines, and industrial power generation equipment.
              All assets are fully documented with verified operating histories.
            </p>
          </div>
        </section>

        <section className="py-12 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Filters sidebar */}
              <aside className="lg:col-span-1">
                <div className="sticky top-24">
                  <Suspense fallback={<div className="h-80 bg-white rounded-2xl border border-slate-200 animate-pulse" />}>
                    <EquipmentFilters />
                  </Suspense>
                </div>
              </aside>

              {/* Results */}
              <div className="lg:col-span-3">
                <Suspense
                  fallback={
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-80 bg-white rounded-2xl border border-slate-200 animate-pulse" />
                      ))}
                    </div>
                  }
                >
                  <InventoryGrid filters={filters} />
                </Suspense>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
