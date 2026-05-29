import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.NEXTAUTH_URL ?? "https://turbinenexus.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/inventory`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  let assetPages: MetadataRoute.Sitemap = [];
  try {
    const assets = await prisma.equipment.findMany({
      where: { status: { not: "Sold" } },
      select: { slug: true, updatedAt: true },
    });

    assetPages = assets.map((a) => ({
      url: `${BASE_URL}/inventory/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // DB unavailable during build — skip dynamic pages
  }

  return [...staticPages, ...assetPages];
}
