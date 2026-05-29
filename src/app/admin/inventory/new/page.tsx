import { EquipmentForm } from "@/components/admin/EquipmentForm";

export default function NewEquipmentPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0F172A]">Add New Asset</h1>
        <p className="text-slate-500 mt-1">
          Fields marked PRIVATE are stored securely and never exposed publicly.
        </p>
      </div>
      <EquipmentForm mode="create" />
    </div>
  );
}
