import { findPublicEquipment, type EquipmentFilters, type PublicEquipmentRow } from "@/lib/queries";
import { InventoryGridClient } from "./InventoryGridClient";

interface InventoryGridProps {
  filters: EquipmentFilters;
}

export async function InventoryGrid({ filters }: InventoryGridProps) {
  const { items, total, page, totalPages } = await findPublicEquipment(filters);

  return (
    <InventoryGridClient
      items={items}
      total={total}
      page={page}
      totalPages={totalPages}
      filters={filters}
    />
  );
}
