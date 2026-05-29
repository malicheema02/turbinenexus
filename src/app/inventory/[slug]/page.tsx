import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PUBLIC_EQUIPMENT_SELECT } from "@/lib/queries";
import { parseJsonSafe } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EquipmentDetailClient } from "./EquipmentDetailClient";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const equipment = await prisma.equipment.findUnique({
    where: { slug: params.slug },
    select: { title: true, description: true, manufacturer: true, ratedPowerMW: true },
  });
  if (!equipment) return { title: "Asset Not Found — Turbine Nexus" };
  return {
    title: `${equipment.title} — Turbine Nexus`,
    description: `${equipment.manufacturer} ${equipment.title}${equipment.ratedPowerMW ? ` — ${equipment.ratedPowerMW}MW` : ""}. ${equipment.description.slice(0, 140)}`,
  };
}

export default async function EquipmentDetailPage({ params }: Props) {
  const equipment = await prisma.equipment.findUnique({
    where: { slug: params.slug },
    select: PUBLIC_EQUIPMENT_SELECT,
  });

  if (!equipment) notFound();

  const images = parseJsonSafe<string[]>(equipment.images, []);

  const typeLabels: Record<string, string> = {
    GasTurbine: "Gas Turbine", SteamTurbine: "Steam Turbine",
    GasEngine: "Gas Engine", Generator: "Generator", Other: "Equipment",
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: equipment.title,
    description: equipment.description,
    brand: { "@type": "Brand", name: equipment.manufacturer },
    category: typeLabels[equipment.equipmentType] ?? equipment.equipmentType,
    ...(images[0] ? { image: images[0] } : {}),
    offers: {
      "@type": "Offer",
      availability: equipment.status === "Available"
        ? "https://schema.org/InStock"
        : equipment.status === "Sold"
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/LimitedAvailability",
      priceCurrency: "USD",
      seller: { "@type": "Organization", name: "Turbine Nexus" },
    },
  };

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="pt-20 bg-[#F8FAFC] min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-sm text-slate-500">
              <Link href="/" className="hover:text-[#1B3A5C]">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/inventory" className="hover:text-[#1B3A5C]">Inventory</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-900 font-medium truncate max-w-xs">{equipment.title}</span>
            </nav>
          </div>
        </div>
        <EquipmentDetailClient equipment={equipment} images={images} />
      </main>
      <Footer />
    </>
  );
}
