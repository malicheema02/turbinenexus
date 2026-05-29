import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const listing = await prisma.equipmentListing.update({
      where: { id: params.id },
      data: {
        ...(body.status ? { status: body.status } : {}),
        ...(body.adminNotes !== undefined ? { adminNotes: body.adminNotes } : {}),
      },
    });
    return NextResponse.json(listing);
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
