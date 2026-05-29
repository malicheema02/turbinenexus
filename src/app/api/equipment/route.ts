import { NextRequest, NextResponse } from "next/server";
import { findPublicEquipment } from "@/lib/queries";

export const revalidate = 300;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const manufacturer = searchParams.get("manufacturer") ?? undefined;
  const equipmentType = searchParams.get("type") ?? undefined;
  const condition = searchParams.get("condition") ?? undefined;
  const status = searchParams.get("status") ?? undefined;
  const search = searchParams.get("q") ?? undefined;
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const pageSize = parseInt(searchParams.get("limit") ?? "12", 10);

  const result = await findPublicEquipment({
    manufacturer,
    equipmentType,
    condition,
    status,
    search,
    page: isNaN(page) ? 1 : page,
    pageSize: isNaN(pageSize) ? 12 : Math.min(pageSize, 50),
  });

  return NextResponse.json(result);
}
