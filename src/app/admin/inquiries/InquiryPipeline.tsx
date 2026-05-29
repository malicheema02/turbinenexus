"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  LayoutGrid, List, Building2, Mail, MessageSquare, Clock,
  Search, X, ChevronUp, ChevronDown, TrendingUp, AlertCircle,
  CheckCircle2, Inbox,
} from "lucide-react";
import { INQUIRY_STATUS_LABELS, INQUIRY_STATUS_COLORS, PRIORITY_COLORS } from "@/lib/utils";

const PIPELINE_COLUMNS = [
  { key: "New",              label: "New",              color: "border-blue-400",   bg: "bg-blue-50" },
  { key: "Contacted",        label: "Contacted",        color: "border-purple-400", bg: "bg-purple-50" },
  { key: "MeetingScheduled", label: "Meeting Scheduled",color: "border-yellow-400", bg: "bg-yellow-50" },
  { key: "OfferReceived",    label: "Offer Received",   color: "border-amber-400",  bg: "bg-amber-50" },
  { key: "CounterOfferSent", label: "Counter-Offer",    color: "border-orange-400", bg: "bg-orange-50" },
  { key: "UnderNDA",         label: "Under NDA",        color: "border-indigo-400", bg: "bg-indigo-50" },
  { key: "OfferMade",        label: "Offer Made",       color: "border-orange-500", bg: "bg-orange-50" },
  { key: "Closed",           label: "Closed / Won",     color: "border-green-400",  bg: "bg-green-50" },
  { key: "Lost",             label: "Lost",             color: "border-red-300",    bg: "bg-red-50" },
];

export interface SerializedInquiry {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string | null;
  status: string;
  priority: string;
  inquiryType?: string | null;
  offerAmount?: number | null;
  oppNumber?: string | null;
  createdAt: string;
  equipment: { title: string; slug: string } | null;
}

type SortKey = "createdAt" | "priority" | "status" | "companyName";
type SortDir = "asc" | "desc";

const PRIORITY_WEIGHT: Record<string, number> = { High: 3, Medium: 2, Low: 1 };

export function InquiryPipeline({ inquiries }: { inquiries: SerializedInquiry[] }) {
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // ── Stats ──
  const stats = useMemo(() => ({
    total: inquiries.length,
    newCount: inquiries.filter((i) => i.status === "New").length,
    highPriority: inquiries.filter((i) => i.priority === "High").length,
    closed: inquiries.filter((i) => i.status === "Closed").length,
  }), [inquiries]);

  // ── Filtered + sorted list for table view ──
  const filtered = useMemo(() => {
    let list = [...inquiries];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.companyName.toLowerCase().includes(q) ||
          i.contactName.toLowerCase().includes(q) ||
          i.contactEmail.toLowerCase().includes(q) ||
          (i.equipment?.title ?? "").toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") list = list.filter((i) => i.status === statusFilter);
    if (priorityFilter !== "all") list = list.filter((i) => i.priority === priorityFilter);

    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "createdAt") cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      else if (sortKey === "priority") cmp = (PRIORITY_WEIGHT[a.priority] ?? 0) - (PRIORITY_WEIGHT[b.priority] ?? 0);
      else if (sortKey === "status") cmp = a.status.localeCompare(b.status);
      else if (sortKey === "companyName") cmp = a.companyName.localeCompare(b.companyName);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [inquiries, search, statusFilter, priorityFilter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (sortDir === "asc" ? <ChevronUp className="w-3 h-3 inline ml-0.5" /> : <ChevronDown className="w-3 h-3 inline ml-0.5" />) : null;

  const grouped = useMemo(() =>
    PIPELINE_COLUMNS.reduce((acc, col) => {
      acc[col.key] = inquiries.filter((i) => i.status === col.key);
      return acc;
    }, {} as Record<string, SerializedInquiry[]>),
  [inquiries]);

  const hasFilters = search || statusFilter !== "all" || priorityFilter !== "all";

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Inquiry Pipeline</h1>
          <p className="text-slate-500 text-sm mt-0.5">{inquiries.length} total inquiries</p>
        </div>
        {/* View toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setView("kanban")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              view === "kanban" ? "bg-white text-[#0F172A] shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Kanban
          </button>
          <button
            onClick={() => setView("table")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              view === "table" ? "bg-white text-[#0F172A] shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <List className="w-3.5 h-3.5" /> Table
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Inquiries", value: stats.total,       icon: Inbox,         color: "text-slate-600",  bg: "bg-slate-50",  border: "border-slate-200" },
          { label: "New / Unread",    value: stats.newCount,    icon: TrendingUp,    color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-200" },
          { label: "High Priority",   value: stats.highPriority,icon: AlertCircle,   color: "text-red-600",    bg: "bg-red-50",    border: "border-red-200" },
          { label: "Closed / Won",    value: stats.closed,      icon: CheckCircle2,  color: "text-green-600",  bg: "bg-green-50",  border: "border-green-200" },
        ].map((s) => (
          <div key={s.label} className={`flex items-center gap-3 p-4 rounded-xl border ${s.bg} ${s.border}`}>
            <s.icon className={`w-5 h-5 ${s.color} shrink-0`} />
            <div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── KANBAN VIEW ── */}
      {view === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {PIPELINE_COLUMNS.map((col) => {
            const colInquiries = grouped[col.key] ?? [];
            return (
              <div key={col.key} className="flex flex-col">
                {/* Column header */}
                <div className={`flex items-center justify-between mb-2.5 pb-2 border-b-2 ${col.color}`}>
                  <h3 className="font-semibold text-sm text-slate-800">{col.label}</h3>
                  <span className="text-xs bg-slate-100 text-slate-600 rounded-full px-2 py-0.5 font-semibold">
                    {colInquiries.length}
                  </span>
                </div>
                {/* Cards */}
                <div className="space-y-2 min-h-[80px]">
                  {colInquiries.length === 0 && (
                    <div className="rounded-xl border-2 border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
                      No inquiries
                    </div>
                  )}
                  {colInquiries.map((inquiry) => (
                    <Link
                      key={inquiry.id}
                      href={`/admin/inquiries/${inquiry.id}`}
                      className="block bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm hover:shadow-md hover:border-[#1B3A5C]/30 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="font-semibold text-sm text-slate-900 leading-tight line-clamp-1">
                          {inquiry.companyName}
                        </span>
                        <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded ${PRIORITY_COLORS[inquiry.priority] ?? ""}`}>
                          {inquiry.priority}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Building2 className="w-3 h-3 shrink-0" />
                          <span className="truncate">{inquiry.contactName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Mail className="w-3 h-3 shrink-0" />
                          <span className="truncate">{inquiry.contactEmail}</span>
                        </div>
                        {inquiry.equipment && (
                          <div className="flex items-center gap-1.5 text-xs text-[#1B3A5C] font-medium">
                            <MessageSquare className="w-3 h-3 shrink-0" />
                            <span className="truncate">{inquiry.equipment.title}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-1.5">
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <Clock className="w-3 h-3" />
                            {new Date(inquiry.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                          </div>
                          {inquiry.offerAmount != null && (
                            <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                              ${inquiry.offerAmount.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── TABLE VIEW ── */}
      {view === "table" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Filters */}
          <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search company, contact, asset…"
                className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A5C] bg-[#F8FAFC]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#1B3A5C]"
            >
              <option value="all">All Statuses</option>
              {PIPELINE_COLUMNS.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#1B3A5C]"
            >
              <option value="all">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            {hasFilters && (
              <button
                onClick={() => { setSearch(""); setStatusFilter("all"); setPriorityFilter("all"); }}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg px-3 py-2 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
            <span className="text-xs text-slate-400 ml-auto">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F8FAFC] border-b border-slate-200">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">OPP #</th>
                  <th
                    className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer hover:text-slate-800 select-none"
                    onClick={() => toggleSort("companyName")}
                  >
                    Company <SortIcon k="companyName" />
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Contact</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Asset</th>
                  <th
                    className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer hover:text-slate-800 select-none"
                    onClick={() => toggleSort("status")}
                  >
                    Status <SortIcon k="status" />
                  </th>
                  <th
                    className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer hover:text-slate-800 select-none"
                    onClick={() => toggleSort("priority")}
                  >
                    Priority <SortIcon k="priority" />
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Offer</th>
                  <th
                    className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer hover:text-slate-800 select-none"
                    onClick={() => toggleSort("createdAt")}
                  >
                    Date <SortIcon k="createdAt" />
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-slate-400 text-sm">
                      No inquiries match your filters.
                    </td>
                  </tr>
                )}
                {filtered.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs font-semibold text-[#1B3A5C] bg-[#1B3A5C]/10 px-2 py-1 rounded">
                        {(inquiry as { oppNumber?: string | null }).oppNumber ?? `#${inquiry.id.slice(-6)}`}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{inquiry.companyName}</td>
                    <td className="px-4 py-3">
                      <div className="text-slate-700">{inquiry.contactName}</div>
                      <div className="text-xs text-slate-400">{inquiry.contactEmail}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-[180px] truncate text-xs">
                      {inquiry.equipment?.title ?? <span className="text-slate-300 italic">General</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${INQUIRY_STATUS_COLORS[inquiry.status] ?? "bg-slate-100 text-slate-600"}`}>
                        {INQUIRY_STATUS_LABELS[inquiry.status] ?? inquiry.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${PRIORITY_COLORS[inquiry.priority] ?? ""}`}>
                        {inquiry.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-600">
                      {inquiry.offerAmount != null
                        ? `$${inquiry.offerAmount.toLocaleString()}`
                        : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {new Date(inquiry.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/admin/inquiries/${inquiry.id}`}
                        className="text-xs text-[#1B3A5C] hover:text-[#F59E0B] font-semibold transition-colors"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
