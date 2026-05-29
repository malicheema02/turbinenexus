"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Zap,
  Calendar,
  Users,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SpecsTable } from "@/components/inventory/SpecsTable";
import { InquiryModal } from "@/components/inventory/InquiryModal";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { parseJsonSafe, STATUS_LABELS } from "@/lib/utils";
import type { PublicEquipmentRow } from "@/lib/queries";

const statusVariant: Record<string, "success" | "warning" | "secondary"> = {
  Available: "success",
  UnderNegotiation: "warning",
  Sold: "secondary",
};

const typeLabels: Record<string, string> = {
  GasTurbine: "Gas Turbine",
  SteamTurbine: "Steam Turbine",
  GasEngine: "Gas Engine",
  Generator: "Generator",
  Other: "Equipment",
};

export default function EquipmentDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [equipment, setEquipment] = useState<PublicEquipmentRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/equipment/${slug}`);
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        setEquipment(data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-20 min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#1B3A5C]/20 border-t-[#1B3A5C] rounded-full animate-spin" />
        </div>
        <Footer />
      </>
    );
  }

  if (notFound || !equipment) {
    return (
      <>
        <Navbar />
        <div className="pt-20 min-h-screen bg-[#F8FAFC] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Asset Not Found</h1>
            <p className="text-slate-500 mb-6">This listing may no longer be available.</p>
            <Button asChild variant="default">
              <Link href="/inventory">← Back to Inventory</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const images = parseJsonSafe<string[]>(equipment.images, []);

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: equipment.title,
    description: equipment.description,
    brand: {
      "@type": "Brand",
      name: equipment.manufacturer,
    },
    category: typeLabels[equipment.equipmentType] ?? equipment.equipmentType,
    ...(images[0] ? { image: images[0] } : {}),
    offers: {
      "@type": "Offer",
      availability:
        equipment.status === "Available"
          ? "https://schema.org/InStock"
          : equipment.status === "Sold"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/LimitedAvailability",
      priceCurrency: "USD",
      seller: {
        "@type": "Organization",
        name: "Turbine Nexus",
      },
    },
  };

  return (
    <>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left: Images + Specs */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="relative h-80 bg-gradient-to-br from-[#1B3A5C] to-[#0F172A]">
                  {images[activeImage] ? (
                    <Image
                      src={images[activeImage]}
                      alt={`${equipment.title} — image ${activeImage + 1}`}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Zap className="w-20 h-20 text-slate-600" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge variant={statusVariant[equipment.status] ?? "secondary"}>
                      {STATUS_LABELS[equipment.status] ?? equipment.status}
                    </Badge>
                  </div>
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2 p-3 border-t border-slate-100">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          i === activeImage ? "border-[#1B3A5C]" : "border-slate-200 hover:border-slate-400"
                        }`}
                      >
                        <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#0F172A] mb-4">Asset Overview</h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {equipment.description}
                </p>
              </div>

              {/* Technical Specifications */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <SpecsTable keySpecs={equipment.keySpecs} />
              </div>
            </div>

            {/* Right: Summary + CTAs */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
                <span className="text-xs font-semibold text-[#1B3A5C] uppercase tracking-wider">
                  {typeLabels[equipment.equipmentType] ?? equipment.equipmentType} · {equipment.manufacturer}
                </span>
                <h1 className="text-2xl font-extrabold text-[#0F172A] mt-2 mb-4 leading-tight">
                  {equipment.title}
                </h1>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {equipment.ratedPowerMW && (
                    <div className="bg-[#F8FAFC] rounded-xl p-3 text-center border border-slate-200">
                      <Zap className="w-5 h-5 text-[#F59E0B] mx-auto mb-1" />
                      <div className="font-bold text-[#0F172A] text-lg">{equipment.ratedPowerMW} MW</div>
                      <div className="text-xs text-slate-500">Rated Power</div>
                    </div>
                  )}
                  {equipment.yearOfManufacture && (
                    <div className="bg-[#F8FAFC] rounded-xl p-3 text-center border border-slate-200">
                      <Calendar className="w-5 h-5 text-[#1B3A5C] mx-auto mb-1" />
                      <div className="font-bold text-[#0F172A] text-lg">{equipment.yearOfManufacture}</div>
                      <div className="text-xs text-slate-500">Year Built</div>
                    </div>
                  )}
                  {equipment.operatingHours !== null && (
                    <div className="bg-[#F8FAFC] rounded-xl p-3 text-center border border-slate-200">
                      <Clock className="w-5 h-5 text-[#1B3A5C] mx-auto mb-1" />
                      <div className="font-bold text-[#0F172A] text-lg">{equipment.operatingHours?.toLocaleString()}</div>
                      <div className="text-xs text-slate-500">Operating Hrs</div>
                    </div>
                  )}
                  {equipment.location && (
                    <div className="bg-[#F8FAFC] rounded-xl p-3 text-center border border-slate-200">
                      <MapPin className="w-5 h-5 text-[#1B3A5C] mx-auto mb-1" />
                      <div className="font-bold text-[#0F172A] text-sm">{equipment.location}</div>
                      <div className="text-xs text-slate-500">Location</div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Button
                    variant="amber"
                    className="w-full"
                    size="lg"
                    onClick={() => setModalOpen(true)}
                    disabled={equipment.status === "Sold"}
                  >
                    Inquire About This Unit
                  </Button>
                  <Button variant="outline" className="w-full" size="lg" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                      <Users className="w-4 h-4" />
                      Arrange Teams Meeting
                    </a>
                  </Button>
                  <a
                    href="mailto:sales@TurbineNexus.com"
                    className="flex items-center justify-center gap-2 text-sm text-[#1B3A5C] hover:underline font-medium py-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    sales@TurbineNexus.com
                  </a>
                </div>

                <div className="mt-4 p-3 bg-[#F8FAFC] rounded-xl border border-slate-200 text-xs text-slate-500 text-center">
                  Condition: <span className="font-semibold text-slate-700">{equipment.condition}</span>
                  <span className="mx-2">·</span>
                  {equipment.fuelType && <>Fuel: <span className="font-semibold text-slate-700">{equipment.fuelType}</span></>}
                </div>
              </div>

              <Button asChild variant="ghost" className="w-full">
                <Link href="/inventory" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Inventory
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <InquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        equipmentId={equipment.id}
        equipmentTitle={equipment.title}
      />
    </>
  );
}
