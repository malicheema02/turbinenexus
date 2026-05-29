import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { DEFAULT_SETTINGS } from "@/lib/defaultSettings";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Backfill missing keys so new CMS fields always appear without a re-seed
  const existing = await prisma.siteSettings.findMany({ select: { key: true } });
  const existingKeys = new Set(existing.map((s) => s.key));
  const missing = DEFAULT_SETTINGS.filter((d) => !existingKeys.has(d.key));
  if (missing.length > 0) {
    await prisma.siteSettings.createMany({ data: missing });
  }

  const settings = await prisma.siteSettings.findMany({
    select: { id: true, key: true, value: true, label: true, group: true },
    orderBy: { key: "asc" },
  });
  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
