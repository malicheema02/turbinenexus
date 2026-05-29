import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.companyName || !body.contactName || !body.contactEmail || !body.contactPhone) {
      return NextResponse.json(
        { error: "Company name, contact name, email, and phone are required." },
        { status: 400 }
      );
    }

    const listing = await prisma.equipmentListing.create({
      data: {
        companyName: body.companyName,
        contactName: body.contactName,
        contactEmail: body.contactEmail,
        contactPhone: body.contactPhone,
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

    // Auto-create/update Company + Contact in CRM
    try {
      let company = await prisma.company.findFirst({
        where: { name: { equals: body.companyName } },
      });
      if (!company) {
        company = await prisma.company.create({ data: { name: body.companyName } });
      }

      const existing = await prisma.contact.findUnique({ where: { email: body.contactEmail } });
      if (existing) {
        // Update phone if it was missing
        if (!existing.phone && body.contactPhone) {
          await prisma.contact.update({
            where: { id: existing.id },
            data: { phone: body.contactPhone },
          });
        }
      } else {
        await prisma.contact.create({
          data: {
            name: body.contactName,
            email: body.contactEmail,
            phone: body.contactPhone,
            companyId: company.id,
            jobTitle: "Equipment Owner",
          },
        });
      }
    } catch (crmErr) {
      console.warn("[sell-equipment] CRM upsert skipped:", crmErr);
    }

    return NextResponse.json({ success: true, id: listing.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to submit listing" }, { status: 500 });
  }
}
