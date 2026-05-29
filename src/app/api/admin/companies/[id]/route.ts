import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        contacts: {
          include: {
            inquiries: {
              include: { equipment: { select: { title: true } } },
              orderBy: { createdAt: "desc" },
            },
          },
          orderBy: { name: "asc" },
        },
      },
    });

    if (!company) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(company);
  } catch (err) {
    console.error("[GET /api/admin/companies/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json() as {
      name?: string;
      industry?: string;
      country?: string;
      website?: string;
      notes?: string;
    };

    const company = await prisma.company.update({
      where: { id },
      data: {
        name: body.name,
        industry: body.industry ?? null,
        country: body.country ?? null,
        website: body.website ?? null,
        notes: body.notes ?? null,
      },
    });

    return NextResponse.json(company);
  } catch (err) {
    console.error("[PATCH /api/admin/companies/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
