import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendInquiryNotification, sendInquiryConfirmation } from "@/lib/email";
import { upsertCompanyAndContact, generateOppNumber } from "@/lib/crm";
import { dispatchWebhook } from "@/lib/webhook";

const inquirySchema = z.object({
  companyName: z.string().min(2).max(200),
  contactName: z.string().min(2).max(200),
  contactEmail: z.string().email().max(200),
  contactPhone: z.string().max(50).optional(),
  message: z.string().min(10).max(5000),
  equipmentId: z.string().optional(),
  equipmentTitle: z.string().optional(),
  // Phase 5/6 lead classification
  inquiryType: z.enum(["Inquiry", "Meeting", "Wanted", "Offer"]).optional(),
  offerAmount: z.number().optional(),
  meetingTimezone: z.string().max(64).optional(),
  priority: z.enum(["Low", "Medium", "High"]).optional(),
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
      inquiryType = "Inquiry",
      offerAmount,
      meetingTimezone,
      priority = "Medium",
    } = parsed.data;

    // Verify equipmentId belongs to a real asset if provided
    let resolvedEquipmentId: string | null = null;
    if (equipmentId) {
      const eq = await prisma.equipment.findUnique({
        where: { id: equipmentId },
        select: { id: true },
      });
      resolvedEquipmentId = eq?.id ?? null;
    }

    // Auto-create or find Company + Contact (best-effort — never block the inquiry)
    const contactId = await upsertCompanyAndContact({
      companyName,
      contactName,
      contactEmail,
      contactPhone,
    });

    const oppNumber = await generateOppNumber();

    const inquiry = await prisma.inquiry.create({
      data: {
        oppNumber,
        companyName,
        contactName,
        contactEmail,
        contactPhone: contactPhone ?? null,
        message,
        equipmentId: resolvedEquipmentId,
        ...(contactId ? { contactId } : {}),
        status: "New",
        priority,
        inquiryType,
        ...(offerAmount !== undefined ? { offerAmount } : {}),
        ...(meetingTimezone ? { meetingTimezone } : {}),
      },
    });

    // Fire emails concurrently — do not fail the request if email fails
    const eqTitle = equipmentTitle ?? null;
    await Promise.allSettled([
      sendInquiryNotification({ companyName, contactName, contactEmail, contactPhone, message, equipmentTitle: eqTitle }),
      sendInquiryConfirmation({ companyName, contactName, contactEmail, message, equipmentTitle: eqTitle }),
    ]);

    // Dispatch automation webhook (fire-and-forget)
    await dispatchWebhook("inquiry.created", {
      oppNumber,
      inquiryType,
      companyName,
      contactName,
      contactEmail,
      contactPhone: contactPhone ?? null,
      message,
      equipmentId: resolvedEquipmentId,
      equipmentTitle: eqTitle,
      offerAmount: offerAmount ?? null,
      meetingTimezone: meetingTimezone ?? null,
      priority,
    });

    return NextResponse.json({ success: true, id: inquiry.id, oppNumber }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/inquiries]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
