"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Loader2, Lock, Upload, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const equipmentFormSchema = z.object({
  title: z.string().min(3, "Title required"),
  manufacturer: z.string().min(1, "Manufacturer required"),
  equipmentType: z.enum(["GasTurbine", "SteamTurbine", "GasEngine", "Generator", "Other"]),
  model: z.string().min(1, "Model required"),
  ratedPowerMW: z.coerce.number().optional(),
  fuelType: z.string().optional(),
  yearOfManufacture: z.coerce.number().int().min(1950).max(2030).optional(),
  operatingHours: z.coerce.number().int().min(0).optional(),
  condition: z.enum(["Excellent", "Good", "Fair", "For Parts"]),
  location: z.string().optional(),
  description: z.string().min(10, "Description required"),
  status: z.enum(["Available", "UnderNegotiation", "Sold"]),
  featured: z.boolean().default(false),
  images: z.array(z.object({ url: z.string().url("Valid URL required") })).default([]),
  keySpecs: z.array(z.object({ key: z.string().min(1), value: z.string().min(1) })).default([]),
  // Private fields
  serialNumber: z.string().optional(),
  internalNotes: z.string().optional(),
  sellerFloorPrice: z.coerce.number().optional(),
  assetOwnerName: z.string().optional(),
  assetOwnerContact: z.string().optional(),
});

type EquipmentFormValues = z.infer<typeof equipmentFormSchema>;

interface EquipmentFormProps {
  mode: "create" | "edit";
  equipmentId?: string;
  defaultValues?: Partial<EquipmentFormValues>;
}

const manufacturers = [
  "General Electric", "Siemens", "Wärtsilä", "MAN Energy Solutions",
  "Rolls-Royce", "Solar Turbines", "Alstom", "ABB", "Other",
];

export function EquipmentForm({ mode, equipmentId, defaultValues }: EquipmentFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentFormSchema),
    defaultValues: defaultValues ?? {
      status: "Available",
      condition: "Good",
      equipmentType: "GasTurbine",
      featured: false,
      images: [],
      keySpecs: [{ key: "", value: "" }],
    },
  });

  const { fields: imageFields, append: addImage, remove: removeImage } = useFieldArray({
    control,
    name: "images",
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("files", file));

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const { urls } = await res.json() as { urls: string[] };
      urls.forEach((url: string) => addImage({ url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploading(false);
      // Reset file input so same files can be re-selected if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const { fields: specFields, append: addSpec, remove: removeSpec } = useFieldArray({
    control,
    name: "keySpecs",
  });

  const onSubmit = async (data: EquipmentFormValues) => {
    setSaving(true);
    setError("");

    const payload = {
      ...data,
      images: JSON.stringify(data.images.map((i) => i.url)),
      keySpecs: JSON.stringify(data.keySpecs),
    };

    try {
      let res: Response;
      if (mode === "create") {
        res = await fetch("/api/admin/equipment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/admin/equipment/${equipmentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Save failed");
      }

      router.push("/admin/inventory");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setSaving(false);
    }
  };

  const fieldClass = (hasError?: boolean) =>
    `flex h-10 w-full rounded-md border ${hasError ? "border-red-400" : "border-slate-300"} bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3A5C]`;

  const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";
  const errorClass = "text-red-500 text-xs mt-1";
  const sectionClass = "bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Public Information */}
      <div className={sectionClass}>
        <h2 className="text-lg font-bold text-[#0F172A] pb-2 border-b border-slate-100">
          Public Information
          <span className="text-xs font-normal text-slate-400 ml-2">Visible on the website</span>
        </h2>

        <div>
          <label className={labelClass}>Title *</label>
          <Input {...register("title")} placeholder="e.g. GE LM6000 Gas Turbine — 45 MW" className={errors.title ? "border-red-400" : ""} />
          {errors.title && <p className={errorClass}>{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Manufacturer *</label>
            <select {...register("manufacturer")} className={fieldClass(!!errors.manufacturer)}>
              <option value="">Select manufacturer</option>
              {manufacturers.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            {errors.manufacturer && <p className={errorClass}>{errors.manufacturer.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Model *</label>
            <Input {...register("model")} placeholder="e.g. LM6000-PC Sprint" className={errors.model ? "border-red-400" : ""} />
            {errors.model && <p className={errorClass}>{errors.model.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Equipment Type *</label>
            <select {...register("equipmentType")} className={fieldClass()}>
              <option value="GasTurbine">Gas Turbine</option>
              <option value="SteamTurbine">Steam Turbine</option>
              <option value="GasEngine">Gas Engine</option>
              <option value="Generator">Generator</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Rated Power (MW)</label>
            <Input type="number" step="0.1" {...register("ratedPowerMW")} placeholder="e.g. 45.0" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className={labelClass}>Year of Manufacture</label>
            <Input type="number" {...register("yearOfManufacture")} placeholder="e.g. 2008" />
          </div>
          <div>
            <label className={labelClass}>Operating Hours</label>
            <Input type="number" {...register("operatingHours")} placeholder="e.g. 42500" />
          </div>
          <div>
            <label className={labelClass}>Fuel Type</label>
            <Input {...register("fuelType")} placeholder="e.g. Natural Gas" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Condition *</label>
            <select {...register("condition")} className={fieldClass()}>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="For Parts">For Parts</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Location (Country/Region)</label>
            <Input {...register("location")} placeholder="e.g. United States" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Description *</label>
          <Textarea {...register("description")} rows={5} placeholder="Detailed public description of the asset…" className={errors.description ? "border-red-400" : ""} />
          {errors.description && <p className={errorClass}>{errors.description.message}</p>}
        </div>

        {/* Key Specs */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={labelClass}>Technical Specifications</label>
            <Button type="button" variant="ghost" size="sm" onClick={() => addSpec({ key: "", value: "" })}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Spec
            </Button>
          </div>
          <div className="space-y-2">
            {specFields.map((field, i) => (
              <div key={field.id} className="flex gap-2">
                <Input {...register(`keySpecs.${i}.key`)} placeholder="Spec name (e.g. ISO Rating)" />
                <Input {...register(`keySpecs.${i}.value`)} placeholder="Value (e.g. 45 MW)" />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeSpec(i)}>
                  <Trash2 className="w-4 h-4 text-red-400" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={labelClass}>Image URLs</label>
            <Button type="button" variant="ghost" size="sm" onClick={() => addImage({ url: "" })}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Image
            </Button>
          </div>
          <div className="space-y-2">
            {imageFields.map((field, i) => (
              <div key={field.id} className="flex gap-2">
                <Input {...register(`images.${i}.url`)} placeholder="https://..." className={errors.images?.[i]?.url ? "border-red-400" : ""} />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeImage(i)}>
                  <Trash2 className="w-4 h-4 text-red-400" />
                </Button>
              </div>
            ))}
            {imageFields.length === 0 && <p className="text-xs text-slate-400">No images added. Click &apos;Add Image&apos; to add URLs.</p>}
          </div>
        </div>
      </div>

      {/* Status & Visibility */}
      <div className={sectionClass}>
        <h2 className="text-lg font-bold text-[#0F172A] pb-2 border-b border-slate-100">
          Status &amp; Visibility
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Listing Status *</label>
            <select {...register("status")} className={fieldClass()}>
              <option value="Available">Available</option>
              <option value="UnderNegotiation">Under Negotiation</option>
              <option value="Sold">Sold</option>
            </select>
          </div>
          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="featured"
              {...register("featured")}
              className="w-4 h-4 rounded border-slate-300 text-[#1B3A5C] focus:ring-[#1B3A5C]"
            />
            <label htmlFor="featured" className="text-sm font-medium text-slate-700">
              Mark as Featured (shown on homepage)
            </label>
          </div>
        </div>
      </div>

      {/* Private / Internal Fields */}
      <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 space-y-5">
        <h2 className="text-lg font-bold text-amber-900 pb-2 border-b border-amber-200 flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Internal / Private Fields
          <span className="text-xs font-normal text-amber-600 ml-1">
            NEVER shown on public website or API
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Serial Number (PRIVATE)</label>
            <Input {...register("serialNumber")} placeholder="OEM serial number" />
          </div>
          <div>
            <label className={labelClass}>Seller Floor Price (USD, PRIVATE)</label>
            <Input type="number" step="1000" {...register("sellerFloorPrice")} placeholder="e.g. 3800000" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Asset Owner Name (PRIVATE)</label>
            <Input {...register("assetOwnerName")} placeholder="Company or individual name" />
          </div>
          <div>
            <label className={labelClass}>Asset Owner Contact (PRIVATE)</label>
            <Input {...register("assetOwnerContact")} placeholder="Email or phone" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Internal Notes (PRIVATE)</label>
          <Textarea {...register("internalNotes")} rows={4} placeholder="Internal deal notes, negotiation history, logistics notes…" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button type="submit" variant="amber" size="lg" disabled={saving}>
          {saving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving…</> : (mode === "create" ? "Create Asset" : "Save Changes")}
        </Button>
        <Button type="button" variant="secondary" size="lg" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
