import { prisma } from "@/lib/prisma";
import { InquiryPipeline } from "./InquiryPipeline";
import type { SerializedInquiry } from "./InquiryPipeline";

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      equipment: { select: { title: true, slug: true } },
    },
  });

  // Serialize Date → string so the client component can receive them as props
  const serialized: SerializedInquiry[] = inquiries.map((i) => ({
    id: i.id,
    companyName: i.companyName,
    contactName: i.contactName,
    contactEmail: i.contactEmail,
    contactPhone: i.contactPhone,
    status: i.status,
    priority: i.priority,
    inquiryType: (i as { inquiryType?: string | null }).inquiryType ?? null,
    offerAmount: (i as { offerAmount?: number | null }).offerAmount ?? null,
    oppNumber: (i as { oppNumber?: string | null }).oppNumber ?? null,
    createdAt: i.createdAt.toISOString(),
    equipment: i.equipment ? { title: i.equipment.title, slug: i.equipment.slug } : null,
  }));

  return <InquiryPipeline inquiries={serialized} />;
}
