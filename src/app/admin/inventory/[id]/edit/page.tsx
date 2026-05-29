import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EquipmentForm } from "@/components/admin/EquipmentForm";
import { parseJsonSafe } from "@/lib/utils";

interface Props {
  params: { id: string };
}

export default async function EditEquipmentPage({ params }: Props) {
  const equipment = await prisma.equipment.findUnique({
    where: { id: params.id },
  });

  if (!equipment) notFound();

  const images = parseJsonSafe<string[]>(equipment.images, []);
  const keySpecs = parseJsonSafe<{ key: string; value: string }[]>(equipment.keySpecs, []);

  const defaultValues = {
    title: equipment.title,
    manufacturer: equipment.manufacturer,
    equipmentType: equipment.equipmentType as "GasTurbine" | "SteamTurbine" | "GasEngine" | "Generator" | "Other",
    model: equipment.model,
    ratedPowerMW: equipment.ratedPowerMW ?? undefined,
    fuelType: equipment.fuelType ?? undefined,
    frequency: equipment.frequency ?? undefined,
    yearOfManufacture: equipment.yearOfManufacture ?? undefined,
    operatingHours: equipment.operatingHours ?? undefined,
    condition: equipment.condition,
    location: equipment.location ?? undefined,
    description: equipment.description,
    status: equipment.status as "Available" | "UnderNegotiation" | "Sold",
    featured: equipment.featured,
    showPrice: equipment.showPrice,
    price: equipment.price ?? undefined,
    priceCurrency: equipment.priceCurrency ?? "USD",
    documentsAvailable: equipment.documentsAvailable,
    images: images.map((url) => ({ url })),
    keySpecs,
    serialNumber: equipment.serialNumber ?? undefined,
    internalNotes: equipment.internalNotes ?? undefined,
    sellerFloorPrice: equipment.sellerFloorPrice ?? undefined,
    assetOwnerName: equipment.assetOwnerName ?? undefined,
    assetOwnerContact: equipment.assetOwnerContact ?? undefined,
    documentUrl: equipment.documentUrl ?? undefined,
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0F172A]">Edit Asset</h1>
        <p className="text-slate-500 mt-1 truncate">{equipment.title}</p>
      </div>
      <EquipmentForm mode="edit" equipmentId={equipment.id} defaultValues={defaultValues} />
    </div>
  );
}
