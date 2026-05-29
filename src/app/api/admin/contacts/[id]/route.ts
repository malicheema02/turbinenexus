import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contact = await prisma.contact.findUnique({
      where: { id },
      include: {
        company: true,
        inquiries: {
          include: { equipment: { select: { title: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!contact) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(contact);
  } catch (err) {
    console.error("[GET /api/admin/contacts/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
