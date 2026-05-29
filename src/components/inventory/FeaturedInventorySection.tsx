"use client";

import { useState } from "react";
import { EquipmentCard } from "@/components/inventory/EquipmentCard";
import { InquiryModal } from "@/components/inventory/InquiryModal";
import { MeetingModal } from "@/components/inventory/MeetingModal";
import { MakeOfferModal } from "@/components/inventory/MakeOfferModal";
import type { PublicEquipmentRow } from "@/lib/queries";

type Selected = { id: string; title: string; price?: number | null; currency?: string } | null;

export function FeaturedInventorySection({ items }: { items: PublicEquipmentRow[] }) {
  const [inquireOpen, setInquireOpen] = useState(false);
  const [meetingOpen, setMeetingOpen] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);
  const [selected, setSelected] = useState<Selected>(null);

  const handleInquire = (id: string, title: string) => { setSelected({ id, title }); setInquireOpen(true); };
  const handleMeeting = (id: string, title: string) => { setSelected({ id, title }); setMeetingOpen(true); };
  const handleOffer = (id: string, title: string, price: number | null, currency: string) => {
    setSelected({ id, title, price, currency }); setOfferOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, idx) => (
          <EquipmentCard
            key={item.id}
            equipment={item}
            onInquire={handleInquire}
            onMeeting={handleMeeting}
            onOffer={handleOffer}
            priority={idx === 0}
          />
        ))}
      </div>

      <InquiryModal isOpen={inquireOpen} onClose={() => setInquireOpen(false)} equipmentId={selected?.id} equipmentTitle={selected?.title} />
      <MeetingModal isOpen={meetingOpen} onClose={() => setMeetingOpen(false)} equipmentId={selected?.id} equipmentTitle={selected?.title} />
      <MakeOfferModal
        isOpen={offerOpen}
        onClose={() => setOfferOpen(false)}
        equipmentId={selected?.id}
        equipmentTitle={selected?.title}
        listPrice={selected?.price ?? null}
        currency={selected?.currency ?? "USD"}
      />
    </>
  );
}
