import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

function requireAdmin() {
  // Must be called as: const session = await requireAdmin()
  return auth();
}

const equipmentSchema = z.object({
  title: z.string().min(3),
  manufacturer: z.string().min(1),
  equipmentType: z.string().min(1),
  model: z.string().min(1),
  ratedPowerMW: z.number().optional().nullable(),
  fuelType: z.string().optional().nullable(),
  frequency: z.string().optional().nullable(),
  yearOfManufacture: z.number().int().optional().nullable(),
  operatingHours: z.number().int().optional().nullable(),
  condition: z.string().min(1),
  location: z.string().optional().nullable(),
  description: z.string().min(10),
  keySpecs: z.string(),
  images: z.string(),
  status: z.enum(["Available", "UnderNegotiation", "Sold"]),
  featured: z.boolean().default(false),
  // Pricing (public)
  showPrice: z.boolean().default(false),
  price: z.number().optional().nullable(),
  priceCurrency: z.string().default("USD"),
  documentsAvailable: z.boolean().default(false),
  // Private fields
  serialNumber: z.string().optional().nullable(),
  internalNotes: z.string().optional().nullable(),
  sellerFloorPrice: z.number().optional().nullable(),
  assetOwnerName: z.string().optional().nullable(),
  assetOwnerContact: z.string().optional().nullable(),
  documentUrl: z.string().optional().nullable(),
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export async function GET(_req: NextRequest) {
  const session = await requireAdmin();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const equipment = await prisma.equipment.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(equipment);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = equipmentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
    }

    const baseSlug = slugify(parsed.data.title);
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.equipment.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const equipment = await prisma.equipment.create({
      data: { ...parsed.data, slug },
    });

    return NextResponse.json(equipment, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/equipment]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
