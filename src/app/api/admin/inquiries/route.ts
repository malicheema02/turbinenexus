import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(_req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      equipment: {
        select: { id: true, title: true, manufacturer: true, model: true, slug: true },
      },
    },
  });

  return NextResponse.json(inquiries);
}
