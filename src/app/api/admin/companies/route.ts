import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      include: {
        contacts: {
          include: { inquiries: { select: { id: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const data = companies.map((c) => ({
      id: c.id,
      name: c.name,
      industry: c.industry,
      country: c.country,
      website: c.website,
      contactCount: c.contacts.length,
      inquiryCount: c.contacts.reduce((sum, ct) => sum + ct.inquiries.length, 0),
      createdAt: c.createdAt,
    }));

    return NextResponse.json(data);
  } catch (err) {
    console.error("[GET /api/admin/companies]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
