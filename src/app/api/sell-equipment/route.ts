import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const listing = await prisma.equipmentListing.create({
      data: {
        companyName: body.companyName,
        contactName: body.contactName,
        contactEmail: body.contactEmail,
        contactPhone: body.contactPhone || null,
        equipmentType: body.equipmentType,
        manufacturer: body.manufacturer || null,
        model: body.model || null,
        ratedPowerMW: body.ratedPowerMW ? parseFloat(body.ratedPowerMW) : null,
        yearOfManufacture: body.yearOfManufacture ? parseInt(body.yearOfManufacture) : null,
        operatingHours: body.operatingHours ? parseInt(body.operatingHours) : null,
        condition: body.condition || null,
        location: body.location || null,
        description: body.description || null,
        askingPrice: body.askingPrice || null,
      },
    });
    return NextResponse.json({ success: true, id: listing.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to submit listing" }, { status: 500 });
  }
}
