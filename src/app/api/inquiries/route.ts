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

async function generateOppNumber(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  // Count inquiries created today
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  const todayCount = await prisma.inquiry.count({
    where: {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  const sequence = String(todayCount + 1).padStart(3, "0");
  return `OPP${year}${month}${day}${sequence}`;
}

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

    // Auto-create or find Company + Contact (best-effort — never block the inquiry)
    let contactId: string | null = null;
    try {
      let company = await prisma.company.findFirst({
        where: { name: { equals: companyName } },
      });
      if (!company) {
        company = await prisma.company.create({ data: { name: companyName } });
      }

      let contact = await prisma.contact.findUnique({
        where: { email: contactEmail },
      });
      if (!contact) {
        contact = await prisma.contact.create({
          data: {
            name: contactName,
            email: contactEmail,
            phone: contactPhone ?? null,
            companyId: company.id,
          },
        });
      }
      contactId = contact.id;
    } catch (crmErr) {
      // CRM tables may not exist yet — inquiry still saves successfully
      console.warn("[POST /api/inquiries] CRM upsert skipped:", crmErr);
    }

    // Generate OPP number
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
        priority: "Medium",
      },
    });

    // Fire emails concurrently — do not fail the request if email fails
    const eqTitle = equipmentTitle ?? null;
    await Promise.allSettled([
      sendInquiryNotification({ companyName, contactName, contactEmail, contactPhone, message, equipmentTitle: eqTitle }),
      sendInquiryConfirmation({ companyName, contactName, contactEmail, message, equipmentTitle: eqTitle }),
    ]);

    return NextResponse.json({ success: true, id: inquiry.id, oppNumber }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/inquiries]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
