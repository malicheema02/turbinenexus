import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const updateSchema = z.object({
  title: z.string().min(3).optional(),
  manufacturer: z.string().min(1).optional(),
  equipmentType: z.string().optional(),
  model: z.string().optional(),
  ratedPowerMW: z.number().optional().nullable(),
  fuelType: z.string().optional().nullable(),
  frequency: z.string().optional().nullable(),
  yearOfManufacture: z.number().int().optional().nullable(),
  operatingHours: z.number().int().optional().nullable(),
  condition: z.string().optional(),
  location: z.string().optional().nullable(),
  description: z.string().min(10).optional(),
  keySpecs: z.string().optional(),
  images: z.string().optional(),
  status: z.enum(["Available", "UnderNegotiation", "Sold"]).optional(),
  featured: z.boolean().optional(),
  showPrice: z.boolean().optional(),
  price: z.number().optional().nullable(),
  priceCurrency: z.string().optional(),
  documentsAvailable: z.boolean().optional(),
  serialNumber: z.string().optional().nullable(),
  internalNotes: z.string().optional().nullable(),
  sellerFloorPrice: z.number().optional().nullable(),
  assetOwnerName: z.string().optional().nullable(),
  assetOwnerContact: z.string().optional().nullable(),
  documentUrl: z.string().optional().nullable(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const equipment = await prisma.equipment.findUnique({ where: { id: params.id } });
  if (!equipment) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(equipment);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }

    const equipment = await prisma.equipment.update({
      where: { id: params.id },
      data: parsed.data,
    });

    return NextResponse.json(equipment);
  } catch (err) {
    console.error("[PUT /api/admin/equipment/:id]", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await prisma.equipment.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/admin/equipment/:id]", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
