import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const settings = await prisma.siteSettings.findMany();
  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  try {
    const body: Record<string, string> = await req.json();
    const updates = Object.entries(body).map(([key, value]) =>
      prisma.siteSettings.updateMany({ where: { key }, data: { value } })
    );
    await Promise.all(updates);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PATCH /api/admin/settings]", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
