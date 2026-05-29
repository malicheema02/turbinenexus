import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, Edit, Eye, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/utils";

export default async function AdminInventoryPage() {
  const equipment = await prisma.equipment.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      manufacturer: true,
      equipmentType: true,
      model: true,
      ratedPowerMW: true,
      status: true,
      condition: true,
      featured: true,
      serialNumber: true,
      sellerFloorPrice: true,
      createdAt: true,
      _count: { select: { inquiries: true } },
    },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Inventory Management</h1>
          <p className="text-slate-500 mt-1">{equipment.length} assets in database</p>
        </div>
        <Button asChild variant="amber">
          <Link href="/admin/inventory/new">
            <Plus className="w-4 h-4 mr-2" />
            Add New Asset
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F8FAFC] border-b border-slate-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Asset</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Type / Power</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Serial No.
                  </span>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Floor Price
                  </span>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Inquiries</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {equipment.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-400">
                    No assets yet.{" "}
                    <Link href="/admin/inventory/new" className="text-[#1B3A5C] hover:underline font-medium">
                      Add your first asset →
                    </Link>
                  </td>
                </tr>
              ) : (
                equipment.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900 max-w-xs truncate">{item.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{item.manufacturer} · {item.model}</div>
                      {item.featured && (
                        <span className="inline-block mt-1 text-[10px] font-semibold bg-[#F59E0B]/20 text-[#D97706] px-1.5 py-0.5 rounded">
                          FEATURED
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-slate-700">{item.equipmentType}</div>
                      {item.ratedPowerMW && (
                        <div className="text-xs text-slate-500">{item.ratedPowerMW} MW</div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[item.status] ?? "bg-slate-100 text-slate-600"}`}>
                        {STATUS_LABELS[item.status] ?? item.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs text-slate-500 font-mono">
                        {item.serialNumber ?? <span className="text-slate-300">—</span>}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs text-slate-700 font-mono">
                        {item.sellerFloorPrice
                          ? `$${Number(item.sellerFloorPrice).toLocaleString()}`
                          : <span className="text-slate-300">—</span>}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-semibold text-[#1B3A5C]">
                        {item._count.inquiries}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/inventory/${item.slug}`} target="_blank">
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/inventory/${item.id}/edit`}>
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
