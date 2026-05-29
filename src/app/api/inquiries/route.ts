import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendInquiryNotification, sendInquiryConfirmation } from "@/lib/email";

const inquirySchema = z.object({
  companyName: z.string().min(2).max(200),
  contactName: z.string().min(2).max(200),
  contactEmail: z.string().email().max(200),
  contactPhone: z.string().max(50).optional(),
  message: z.string().min(10).max(5000),
  equipmentId: z.string().optional(),
  equipmentTitle: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = inquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      companyName,
      contactName,
      contactEmail,
      contactPhone,
      message,
      equipmentId,
      equipmentTitle,
    } = parsed.data;

    // Verify equipmentId belongs to a real, public asset if provided
    let resolvedEquipmentId: string | null = null;
    if (equipmentId) {
      const eq = await prisma.equipment.findUnique({
        where: { id: equipmentId },
        select: { id: true },
      });
      resolvedEquipmentId = eq?.id ?? null;
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        companyName,
        contactName,
        contactEmail,
        contactPhone: contactPhone ?? null,
        message,
        equipmentId: resolvedEquipmentId,
        status: "New",
        priority: "Medium",
      },
    });

    // Fire emails concurrently — do not fail the request if email fails
    const eqTitle = equipmentTitle ?? null;
    await Promise.allSettled([
      sendInquiryNotification({ companyName, contactName, contactEmail, contactPhone, message, equipmentTitle: eqTitle }),
      sendInquiryConfirmation({ companyName, contactName, contactEmail, message, equipmentTitle: eqTitle }),
    ]);

    return NextResponse.json({ success: true, id: inquiry.id }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/inquiries]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
