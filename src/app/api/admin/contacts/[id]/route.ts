import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional().nullable(),
  jobTitle: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  companyId: z.string().optional().nullable(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const parsed = patchSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
    }

    const data = { ...parsed.data };
    // Normalize email to lowercase to preserve dedup invariants
    if (data.email) data.email = data.email.toLowerCase().trim();

    // Guard against email collisions with a different contact
    if (data.email) {
      const clash = await prisma.contact.findFirst({
        where: { email: data.email, NOT: { id } },
        select: { id: true },
      });
      if (clash) {
        return NextResponse.json({ error: "Another contact already uses that email." }, { status: 409 });
      }
    }

    const contact = await prisma.contact.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.email !== undefined ? { email: data.email } : {}),
        ...(data.phone !== undefined ? { phone: data.phone || null } : {}),
        ...(data.jobTitle !== undefined ? { jobTitle: data.jobTitle || null } : {}),
        ...(data.notes !== undefined ? { notes: data.notes || null } : {}),
        ...(data.companyId !== undefined ? { companyId: data.companyId || null } : {}),
      },
    });
    return NextResponse.json(contact);
  } catch (err) {
    console.error("[PATCH /api/admin/contacts/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

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

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Nullify contactId on inquiries so they are preserved
    await prisma.inquiry.updateMany({ where: { contactId: id }, data: { contactId: null } });
    await prisma.contact.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/admin/contacts/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
