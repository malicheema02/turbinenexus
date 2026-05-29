import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXTAUTH_URL ?? "https://turbinenexus.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/inventory", "/inventory/", "/about", "/how-it-works", "/contact"],
        disallow: ["/admin/", "/api/admin/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
