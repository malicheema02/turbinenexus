import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Zap, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { parseJsonSafe, STATUS_LABELS } from "@/lib/utils";
import type { PublicEquipmentRow } from "@/lib/queries";

interface EquipmentCardProps {
  equipment: PublicEquipmentRow;
  onInquire?: (id: string, title: string) => void;
  teamsLink?: string;
  priority?: boolean;
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

export function EquipmentCard({ equipment, onInquire, teamsLink = "#", priority = false }: EquipmentCardProps) {
  const images = parseJsonSafe<string[]>(equipment.images, []);
  const firstImage = images[0];
  const detailUrl = `/inventory/${equipment.slug}`;

  return (
    <article className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col group">
      {/* Full-card clickable link — sits behind interactive elements */}
      <Link href={detailUrl} className="absolute inset-0 z-0" aria-label={`View details for ${equipment.title}`} />

      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-[#1B3A5C] to-[#0F172A] overflow-hidden">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={equipment.title}
            fill
            priority={priority}
            className="object-cover opacity-80 group-hover:opacity-95 transition-opacity"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="w-16 h-16 text-slate-600" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          <Badge variant={statusVariant[equipment.status] ?? "secondary"}>
            {STATUS_LABELS[equipment.status] ?? equipment.status}
          </Badge>
        </div>
        {equipment.featured && (
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="default" className="bg-[#F59E0B] text-white">
              Featured
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 relative z-10">
        <div className="mb-3">
          <span className="text-xs font-semibold text-[#1B3A5C] uppercase tracking-wider">
            {typeLabels[equipment.equipmentType] ?? equipment.equipmentType} · {equipment.manufacturer}
          </span>
          <h3 className="text-slate-900 font-bold text-lg leading-snug mt-1 line-clamp-2">
            {equipment.title}
          </h3>
          <p className="text-slate-500 text-sm mt-1">Model: {equipment.model}</p>
        </div>

        {/* Key specs strip */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {equipment.ratedPowerMW && (
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <Zap className="w-4 h-4 text-[#F59E0B]" />
              <span className="font-semibold">{equipment.ratedPowerMW} MW</span>
            </div>
          )}
          {equipment.yearOfManufacture && (
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <Calendar className="w-4 h-4 text-[#1B3A5C]" />
              <span>{equipment.yearOfManufacture}</span>
            </div>
          )}
          {equipment.operatingHours !== null && equipment.operatingHours !== undefined && (
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <Clock className="w-4 h-4 text-[#1B3A5C]" />
              <span>{equipment.operatingHours.toLocaleString()} hrs</span>
            </div>
          )}
          {equipment.location && (
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-[#1B3A5C]" />
              <span className="truncate">{equipment.location}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 mb-4">
          <span className="text-xs text-slate-500">Condition:</span>
          <span className="text-xs font-semibold text-slate-700">{equipment.condition}</span>
        </div>

        {/* CTAs */}
        <div className="mt-auto flex flex-col gap-2">
          {onInquire && (
            <Button
              variant="amber"
              className="w-full relative z-10"
              onClick={(e) => { e.preventDefault(); onInquire(equipment.id, equipment.title); }}
              disabled={equipment.status === "Sold"}
            >
              Inquire About This Unit
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 relative z-10" asChild>
              <Link href={detailUrl}>View Details</Link>
            </Button>
            {teamsLink !== "#" && (
              <Button variant="secondary" size="sm" className="flex-1 relative z-10" asChild>
                <a href={teamsLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                  Teams Meeting
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
