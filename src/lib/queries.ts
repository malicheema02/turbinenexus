import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

// SECURITY: This select object is the ONLY permitted way to fetch Equipment
// for public-facing pages and APIs. It intentionally excludes all 5 private fields:
// serialNumber, internalNotes, sellerFloorPrice, assetOwnerName, assetOwnerContact.
// Never use prisma.equipment.findMany() without this select on public paths.
export const PUBLIC_EQUIPMENT_SELECT = {
  id: true,
  slug: true,
  title: true,
  manufacturer: true,
  equipmentType: true,
  model: true,
  ratedPowerMW: true,
  fuelType: true,
  yearOfManufacture: true,
  operatingHours: true,
  condition: true,
  location: true,
  description: true,
  keySpecs: true,
  images: true,
  status: true,
  featured: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type PublicEquipmentRow = Prisma.EquipmentGetPayload<{
  select: typeof PUBLIC_EQUIPMENT_SELECT;
}>;

export interface EquipmentFilters {
  manufacturer?: string;
  equipmentType?: string;
  condition?: string;
  status?: string;
  minPowerMW?: number;
  maxPowerMW?: number;
  search?: string;
  featured?: boolean;
  page?: number;
  pageSize?: number;
}

export async function findPublicEquipment(filters: EquipmentFilters = {}) {
  const {
    manufacturer,
    equipmentType,
    condition,
    status,
    minPowerMW,
    maxPowerMW,
    search,
    featured,
    page = 1,
    pageSize = 12,
  } = filters;

  const where: Prisma.EquipmentWhereInput = {};

  if (manufacturer) where.manufacturer = { contains: manufacturer };
  if (equipmentType) where.equipmentType = equipmentType;
  if (condition) where.condition = condition;
  if (status) where.status = status;
  if (featured !== undefined) where.featured = featured;
  if (minPowerMW !== undefined || maxPowerMW !== undefined) {
    where.ratedPowerMW = {};
    if (minPowerMW !== undefined) where.ratedPowerMW.gte = minPowerMW;
    if (maxPowerMW !== undefined) where.ratedPowerMW.lte = maxPowerMW;
  }
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { manufacturer: { contains: search } },
      { model: { contains: search } },
      { description: { contains: search } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.equipment.findMany({
      where,
      select: PUBLIC_EQUIPMENT_SELECT,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.equipment.count({ where }),
  ]);

  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function findPublicEquipmentBySlug(slug: string) {
  return prisma.equipment.findUnique({
    where: { slug },
    select: PUBLIC_EQUIPMENT_SELECT,
  });
}

export async function findFeaturedEquipment(limit = 3) {
  return prisma.equipment.findMany({
    where: { featured: true, status: "Available" },
    select: PUBLIC_EQUIPMENT_SELECT,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getEquipmentStats() {
  const [total, available, underNegotiation, sold, inquiryCount] = await Promise.all([
    prisma.equipment.count(),
    prisma.equipment.count({ where: { status: "Available" } }),
    prisma.equipment.count({ where: { status: "UnderNegotiation" } }),
    prisma.equipment.count({ where: { status: "Sold" } }),
    prisma.inquiry.count(),
  ]);

  const inquiriesByStatus = await prisma.inquiry.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  return {
    equipment: { total, available, underNegotiation, sold },
    inquiries: {
      total: inquiryCount,
      byStatus: Object.fromEntries(
        inquiriesByStatus.map((r) => [r.status, r._count.status])
      ) as Record<string, number>,
    },
  };
}
