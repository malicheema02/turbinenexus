"use client";

import { useState } from "react";
import { EquipmentCard } from "@/components/inventory/EquipmentCard";
import { InquiryModal } from "@/components/inventory/InquiryModal";
import type { PublicEquipmentRow } from "@/lib/queries";

export function FeaturedInventorySection({ items }: { items: PublicEquipmentRow[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<{ id: string; title: string } | null>(null);

  const handleInquire = (id: string, title: string) => {
    setSelected({ id, title });
    setModalOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, idx) => (
          <EquipmentCard
            key={item.id}
            equipment={item}
            onInquire={handleInquire}
            priority={idx === 0}
          />
        ))}
      </div>
      <InquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        equipmentId={selected?.id}
        equipmentTitle={selected?.title}
      />
    </>
  );
}
