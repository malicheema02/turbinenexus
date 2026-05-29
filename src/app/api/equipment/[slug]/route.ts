import { NextRequest, NextResponse } from "next/server";
import { findPublicEquipmentBySlug } from "@/lib/queries";

export const revalidate = 3600;

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const equipment = await findPublicEquipmentBySlug(params.slug);

  if (!equipment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(equipment);
}
