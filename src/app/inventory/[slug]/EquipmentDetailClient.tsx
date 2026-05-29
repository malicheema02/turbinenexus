"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarPlus, ExternalLink, Zap, Calendar, Clock, MapPin, HandCoins, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SpecsTable } from "@/components/inventory/SpecsTable";
import { InquiryModal } from "@/components/inventory/InquiryModal";
import { MeetingModal } from "@/components/inventory/MeetingModal";
import { MakeOfferModal } from "@/components/inventory/MakeOfferModal";
import { TearSheetButton } from "@/components/inventory/TearSheetButton";
import { parseJsonSafe, STATUS_LABELS } from "@/lib/utils";
import type { PublicEquipmentRow } from "@/lib/queries";

function formatPrice(price: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(price);
  } catch {
    return `${currency} ${price.toLocaleString()}`;
  }
}

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

export function EquipmentDetailClient({
  equipment,
  images,
}: {
  equipment: PublicEquipmentRow;
  images: string[];
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [meetingOpen, setMeetingOpen] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const isSold = equipment.status === "Sold";
  const showPrice = equipment.showPrice && equipment.price != null;
  const currency = equipment.priceCurrency ?? "USD";
  const parsedSpecs = parseJsonSafe<{ key: string; value: string }[]>(equipment.keySpecs, []);

  return (
    <>
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
                <div className="flex gap-2 p-3 border-t border-slate-100 flex-wrap">
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
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{equipment.description}</p>
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

              {/* Pricing */}
              <div className="mb-5 pb-5 border-b border-slate-100">
                {showPrice ? (
                  <>
                    <span className="text-xs text-slate-400 uppercase tracking-wide">List Price</span>
                    <div className="text-3xl font-extrabold text-[#1B3A5C]">{formatPrice(equipment.price as number, currency)}</div>
                  </>
                ) : (
                  <div className="text-lg font-semibold text-slate-500">Price on Request</div>
                )}
              </div>

              <div className="space-y-3">
                <Button variant="amber" className="w-full" size="lg"
                  onClick={() => setModalOpen(true)}
                  disabled={isSold}>
                  {showPrice ? "Get Quote / Inquire" : "Inquire About This Unit"}
                </Button>

                {showPrice && (
                  <Button variant="default" className="w-full" size="lg"
                    onClick={() => setOfferOpen(true)} disabled={isSold}>
                    <HandCoins className="w-4 h-4" /> Make an Offer
                  </Button>
                )}

                <Button variant="outline" className="w-full" size="lg"
                  onClick={() => setMeetingOpen(true)} disabled={isSold}>
                  <CalendarPlus className="w-4 h-4" /> Arrange Meeting
                </Button>

                {/* Executive tear-sheet — public fields only */}
                <TearSheetButton
                  equipment={{
                    title: equipment.title,
                    manufacturer: equipment.manufacturer,
                    model: equipment.model,
                    equipmentType: typeLabels[equipment.equipmentType] ?? equipment.equipmentType,
                    ratedPowerMW: equipment.ratedPowerMW,
                    fuelType: equipment.fuelType,
                    frequency: equipment.frequency,
                    yearOfManufacture: equipment.yearOfManufacture,
                    operatingHours: equipment.operatingHours,
                    condition: equipment.condition,
                    location: equipment.location,
                    description: equipment.description,
                    keySpecs: parsedSpecs,
                    price: equipment.price,
                    showPrice: equipment.showPrice,
                    priceCurrency: currency,
                  }}
                />

                <a href="mailto:sales@turbinenexus.com"
                  className="flex items-center justify-center gap-2 text-sm text-[#1B3A5C] hover:underline font-medium py-2">
                  <ExternalLink className="w-4 h-4" />
                  sales@turbinenexus.com
                </a>
              </div>

              {/* Document data room indicator */}
              {equipment.documentsAvailable && (
                <div className="mt-4 flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
                  <FileText className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Technical documents (borescope, maintenance logs) available upon NDA /{" "}
                    <button onClick={() => setModalOpen(true)} className="underline font-semibold">request</button>.
                  </span>
                </div>
              )}

              <div className="mt-4 p-3 bg-[#F8FAFC] rounded-xl border border-slate-200 text-xs text-slate-500 text-center">
                Condition: <span className="font-semibold text-slate-700">{equipment.condition}</span>
                {equipment.fuelType && (
                  <><span className="mx-2">·</span>Fuel: <span className="font-semibold text-slate-700">{equipment.fuelType}</span></>
                )}
                {equipment.frequency && (
                  <><span className="mx-2">·</span>Freq: <span className="font-semibold text-slate-700">{equipment.frequency}</span></>
                )}
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

      <InquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        equipmentId={equipment.id}
        equipmentTitle={equipment.title}
      />
      <MeetingModal
        isOpen={meetingOpen}
        onClose={() => setMeetingOpen(false)}
        equipmentId={equipment.id}
        equipmentTitle={equipment.title}
      />
      <MakeOfferModal
        isOpen={offerOpen}
        onClose={() => setOfferOpen(false)}
        equipmentId={equipment.id}
        equipmentTitle={equipment.title}
        listPrice={equipment.price}
        currency={currency}
      />
    </>
  );
}
