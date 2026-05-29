import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "@/lib/dateUtils";
import { ListingsTable } from "./ListingsTable";

export const metadata: Metadata = { title: "Equipment Listings — Turbine Nexus Admin" };

export default async function AdminListingsPage() {
  const listings = await prisma.equipmentListing.findMany({
    orderBy: { createdAt: "desc" },
  });

  const rows = listings.map((l) => ({ ...l, createdAtStr: formatDistanceToNow(l.createdAt) }));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0F172A]">Equipment Listings</h1>
        <p className="text-slate-500 text-sm mt-1">
          Submissions from the &quot;Sell Your Equipment&quot; public form. {listings.length} total.
        </p>
      </div>
      <ListingsTable listings={rows} />
    </div>
  );
}
