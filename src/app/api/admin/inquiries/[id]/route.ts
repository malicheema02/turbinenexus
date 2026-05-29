import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const updateSchema = z.object({
  status: z.enum(["New", "Contacted", "MeetingScheduled", "OfferMade", "Closed", "Lost"]).optional(),
  priority: z.enum(["Low", "Medium", "High"]).optional(),
  assignedTo: z.string().optional().nullable(),
  communicationLog: z.string().optional().nullable(),
  internalNotes: z.string().optional().nullable(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const inquiry = await prisma.inquiry.findUnique({
    where: { id: params.id },
    include: {
      equipment: {
        select: { id: true, title: true, manufacturer: true, model: true, slug: true },
      },
    },
  });

  if (!inquiry) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(inquiry);
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

    const inquiry = await prisma.inquiry.update({
      where: { id: params.id },
      data: parsed.data,
      include: {
        equipment: {
          select: { id: true, title: true, manufacturer: true, model: true, slug: true },
        },
      },
    });

    return NextResponse.json(inquiry);
  } catch (err) {
    console.error("[PUT /api/admin/inquiries/:id]", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
