import { auth } from "@/lib/auth";
import { getEquipmentStats } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { Package, MessageSquare, CheckCircle, Clock, TrendingUp, AlertCircle } from "lucide-react";
import Link from "next/link";
import { INQUIRY_STATUS_LABELS, INQUIRY_STATUS_COLORS, STATUS_LABELS, STATUS_COLORS } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const session = await auth();
  const stats = await getEquipmentStats();

  const recentInquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    include: {
      equipment: {
        select: { title: true, slug: true },
      },
    },
  });

  const recentEquipment = await prisma.equipment.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      slug: true,
      title: true,
      manufacturer: true,
      status: true,
      ratedPowerMW: true,
      createdAt: true,
    },
  });

  const newInquiries = stats.inquiries.byStatus?.New ?? 0;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0F172A]">Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Welcome back, {session?.user?.name ?? "Admin"}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {[
          {
            label: "Total Assets",
            value: stats.equipment.total,
            sub: `${stats.equipment.available} available`,
            icon: Package,
            color: "bg-[#1B3A5C]",
          },
          {
            label: "Total Inquiries",
            value: stats.inquiries.total,
            sub: `${newInquiries} new`,
            icon: MessageSquare,
            color: "bg-[#F59E0B]",
          },
          {
            label: "Under Negotiation",
            value: stats.equipment.underNegotiation,
            sub: "Active deals",
            icon: TrendingUp,
            color: "bg-purple-600",
          },
          {
            label: "Assets Sold",
            value: stats.equipment.sold,
            sub: "Completed transactions",
            icon: CheckCircle,
            color: "bg-emerald-600",
          },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-[#0F172A] mb-1">{card.value}</div>
            <div className="text-sm font-medium text-slate-700">{card.label}</div>
            <div className="text-xs text-slate-400 mt-0.5">{card.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Inquiries */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-[#0F172A]">Recent Inquiries</h2>
            <Link href="/admin/inquiries" className="text-xs text-[#1B3A5C] hover:underline font-medium">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentInquiries.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">No inquiries yet</div>
            ) : (
              recentInquiries.map((inquiry) => (
                <Link
                  key={inquiry.id}
                  href={`/admin/inquiries/${inquiry.id}`}
                  className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-[#1B3A5C]/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <MessageSquare className="w-4 h-4 text-[#1B3A5C]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm text-slate-900 truncate">
                        {inquiry.companyName}
                      </p>
                      <span
                        className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${INQUIRY_STATUS_COLORS[inquiry.status] ?? "bg-slate-100 text-slate-600"}`}
                      >
                        {INQUIRY_STATUS_LABELS[inquiry.status] ?? inquiry.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {inquiry.contactName} · {inquiry.equipment?.title ?? "General inquiry"}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(inquiry.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Inventory */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-[#0F172A]">Recent Inventory</h2>
            <Link href="/admin/inventory" className="text-xs text-[#1B3A5C] hover:underline font-medium">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentEquipment.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">No assets yet</div>
            ) : (
              recentEquipment.map((item) => (
                <Link
                  key={item.id}
                  href={`/admin/inventory/${item.id}/edit`}
                  className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-[#F59E0B]/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Package className="w-4 h-4 text-[#F59E0B]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm text-slate-900 truncate">{item.title}</p>
                      <span
                        className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[item.status] ?? "bg-slate-100 text-slate-600"}`}
                      >
                        {STATUS_LABELS[item.status] ?? item.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.manufacturer}
                      {item.ratedPowerMW ? ` · ${item.ratedPowerMW} MW` : ""}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Added{" "}
                      {new Date(item.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
