"use client";

import { useState } from "react";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { EquipmentCard } from "@/components/inventory/EquipmentCard";
import { InquiryModal } from "@/components/inventory/InquiryModal";
import { Button } from "@/components/ui/button";
import type { PublicEquipmentRow, EquipmentFilters } from "@/lib/queries";

interface InventoryGridClientProps {
  items: PublicEquipmentRow[];
  total: number;
  page: number;
  totalPages: number;
  filters: EquipmentFilters;
}

export function InventoryGridClient({
  items,
  total,
  page,
  totalPages,
  filters,
}: InventoryGridClientProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const handleInquire = (id: string, title: string) => {
    setSelectedEquipment({ id, title });
    setModalOpen(true);
  };

  const buildPageUrl = (newPage: number) => {
    const params = new URLSearchParams();
    if (filters.manufacturer) params.set("manufacturer", filters.manufacturer);
    if (filters.equipmentType) params.set("type", filters.equipmentType);
    if (filters.condition) params.set("condition", filters.condition);
    if (filters.status) params.set("status", filters.status);
    if (filters.search) params.set("q", filters.search);
    if (newPage > 1) params.set("page", String(newPage));
    const qs = params.toString();
    return `/inventory${qs ? `?${qs}` : ""}`;
  };

  return (
    <>
      {/* Results count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-500">
          <span className="font-semibold text-slate-900">{total}</span>{" "}
          {total === 1 ? "asset" : "assets"} found
          {filters.search && (
            <span className="ml-1">for &ldquo;{filters.search}&rdquo;</span>
          )}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <PackageSearch className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No assets found</h3>
          <p className="text-slate-400 mb-6 text-sm">
            Try adjusting your filters, or{" "}
            <Link href="/contact" className="text-[#1B3A5C] hover:underline font-medium">
              contact our team
            </Link>{" "}
            to request a specific asset.
          </p>
          <Button asChild variant="outline">
            <Link href="/inventory">Clear all filters</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map((item) => (
            <EquipmentCard
              key={item.id}
              equipment={item}
              onInquire={handleInquire}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {page > 1 && (
            <Button asChild variant="outline" size="sm">
              <Link href={buildPageUrl(page - 1)}>← Previous</Link>
            </Button>
          )}
          <span className="flex items-center text-sm text-slate-500 px-3">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Button asChild variant="outline" size="sm">
              <Link href={buildPageUrl(page + 1)}>Next →</Link>
            </Button>
          )}
        </div>
      )}

      <InquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        equipmentId={selectedEquipment?.id}
        equipmentTitle={selectedEquipment?.title}
      />
    </>
  );
}
