"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Loader2, Lock, Upload, X, FileText, ImageIcon } from "lucide-react";
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
  frequency: z.string().optional(),
  yearOfManufacture: z.coerce.number().int().min(1950).max(2030).optional(),
  operatingHours: z.coerce.number().int().min(0).optional(),
  condition: z.string().min(1, "Condition required"),
  location: z.string().optional(),
  description: z.string().min(10, "Description required"),
  status: z.enum(["Available", "UnderNegotiation", "Sold"]),
  featured: z.boolean().default(false),
  // Pricing (public)
  showPrice: z.boolean().default(false),
  price: z.coerce.number().optional(),
  priceCurrency: z.string().default("USD"),
  // Document data room
  documentsAvailable: z.boolean().default(false),
  // Accept any non-empty string so /uploads/... paths are valid
  images: z.array(z.object({ url: z.string().min(1) })).default([]),
  keySpecs: z.array(z.object({ key: z.string().min(1), value: z.string().min(1) })).default([]),
  // Private fields
  serialNumber: z.string().optional(),
  internalNotes: z.string().optional(),
  sellerFloorPrice: z.coerce.number().optional(),
  assetOwnerName: z.string().optional(),
  assetOwnerContact: z.string().optional(),
  documentUrl: z.string().optional(),
});

const CONDITION_OPTIONS = ["New / Unused", "Zero-Hour Refurbished", "Surplus", "Used", "Excellent", "Good", "Fair", "For Parts"];
const FUEL_OPTIONS = ["Natural Gas", "Diesel", "HFO", "Dual Fuel", "Hydrogen-Ready", "Steam", "Other"];
const FREQUENCY_OPTIONS = ["50 Hz", "60 Hz"];
const CURRENCY_OPTIONS = ["USD", "EUR", "GBP", "AED"];

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
  const [docUploading, setDocUploading] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentFormSchema),
    defaultValues: defaultValues ?? {
      status: "Available",
      condition: "Good",
      equipmentType: "GasTurbine",
      featured: false,
      showPrice: false,
      priceCurrency: "USD",
      documentsAvailable: false,
      images: [],
      keySpecs: [{ key: "", value: "" }],
    },
  });

  const { fields: imageFields, append: addImage, remove: removeImage } = useFieldArray({ control, name: "images" });
  const { fields: specFields, append: addSpec, remove: removeSpec } = useFieldArray({ control, name: "keySpecs" });

  const documentUrl = watch("documentUrl");
  const docFileName = documentUrl ? decodeURIComponent(documentUrl.split("/").pop() ?? "") : null;

  // Upload photos from desktop
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append("files", f));
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const { urls } = await res.json() as { urls: string[] };
      urls.forEach((url) => addImage({ url }));
    } catch {
      setError("Photo upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  };

  // Upload confidential document from desktop
  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocUploading(true);
    try {
      const formData = new FormData();
      formData.append("files", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const { urls } = await res.json() as { urls: string[] };
      setValue("documentUrl", urls[0]);
    } catch {
      setError("Document upload failed. Please try again.");
    } finally {
      setDocUploading(false);
      if (docInputRef.current) docInputRef.current.value = "";
    }
  };

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
        throw new Error((body as { error?: string }).error ?? "Save failed");
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
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
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
            <select {...register("fuelType")} className={fieldClass()}>
              <option value="">Select fuel type</option>
              {FUEL_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className={labelClass}>Frequency</label>
            <select {...register("frequency")} className={fieldClass()}>
              <option value="">Select frequency</option>
              {FREQUENCY_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Condition *</label>
            <select {...register("condition")} className={fieldClass(!!errors.condition)}>
              {CONDITION_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.condition && <p className={errorClass}>{errors.condition.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Location (Country / Region)</label>
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

        {/* Photos — upload from desktop */}
        <div>
          <label className={labelClass}>Photos</label>
          {/* Hidden file input */}
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoUpload}
            className="hidden"
          />
          {/* Thumbnail grid */}
          {imageFields.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-3">
              {imageFields.map((field, i) => (
                <div key={field.id} className="relative group aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={field.url}
                    alt={`Photo ${i + 1}`}
                    className="w-full h-full object-cover rounded-lg border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {imageFields.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-8 mb-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
              <ImageIcon className="w-8 h-8" />
              <p className="text-sm">No photos yet</p>
            </div>
          )}
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-600 hover:border-[#1B3A5C] hover:text-[#1B3A5C] hover:bg-slate-50 transition-colors font-medium"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? "Uploading photos…" : "Upload Photos from Desktop"}
          </button>
          <p className="text-xs text-slate-400 mt-1.5">Supports JPG, PNG, WebP. Select multiple files at once.</p>
        </div>
      </div>

      {/* Status & Visibility */}
      <div className={sectionClass}>
        <h2 className="text-lg font-bold text-[#0F172A] pb-2 border-b border-slate-100">Status &amp; Visibility</h2>
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
            <input type="checkbox" id="featured" {...register("featured")}
              className="w-4 h-4 rounded border-slate-300 text-[#1B3A5C] focus:ring-[#1B3A5C]" />
            <label htmlFor="featured" className="text-sm font-medium text-slate-700">
              Mark as Featured (shown on homepage)
            </label>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className={sectionClass}>
        <h2 className="text-lg font-bold text-[#0F172A] pb-2 border-b border-slate-100">
          Pricing
          <span className="text-xs font-normal text-slate-400 ml-2">Controls public price display</span>
        </h2>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="showPrice" {...register("showPrice")}
            className="w-4 h-4 rounded border-slate-300 text-[#1B3A5C] focus:ring-[#1B3A5C]" />
          <label htmlFor="showPrice" className="text-sm font-medium text-slate-700">
            Show price publicly (enables &quot;Make an Offer&quot;). If off, shows &quot;Price on Request&quot;.
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>List Price (public)</label>
            <Input type="number" step="1000" {...register("price")} placeholder="e.g. 4500000" />
          </div>
          <div>
            <label className={labelClass}>Currency</label>
            <select {...register("priceCurrency")} className={fieldClass()}>
              {CURRENCY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3 pt-1">
          <input type="checkbox" id="documentsAvailable" {...register("documentsAvailable")}
            className="w-4 h-4 rounded border-slate-300 text-[#1B3A5C] focus:ring-[#1B3A5C]" />
          <label htmlFor="documentsAvailable" className="text-sm font-medium text-slate-700">
            Technical documents available (shows &quot;Documents available upon NDA/Request&quot; on public page)
          </label>
        </div>
      </div>

      {/* Private / Internal Fields */}
      <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 space-y-5">
        <h2 className="text-lg font-bold text-amber-900 pb-2 border-b border-amber-200 flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Internal / Private Fields
          <span className="text-xs font-normal text-amber-600 ml-1">NEVER shown on public website or API</span>
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

        {/* Confidential Document — upload from desktop */}
        <div>
          <label className={labelClass}>Confidential Document (PRIVATE)</label>
          {/* Hidden file input */}
          <input
            ref={docInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar"
            onChange={handleDocUpload}
            className="hidden"
          />
          {/* Show current document if set */}
          {docFileName && (
            <div className="flex items-center gap-3 p-3 bg-white border border-amber-200 rounded-lg mb-2">
              <FileText className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-sm text-slate-700 truncate flex-1">{docFileName}</span>
              <button
                type="button"
                onClick={() => setValue("documentUrl", "")}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => docInputRef.current?.click()}
            disabled={docUploading}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-amber-300 bg-white rounded-lg text-sm text-amber-700 hover:border-amber-500 hover:bg-amber-50 transition-colors font-medium"
          >
            {docUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {docUploading ? "Uploading document…" : docFileName ? "Replace Document" : "Upload Confidential Document"}
          </button>
          <p className="text-xs text-amber-600 mt-1.5">Supports PDF, Word, Excel, ZIP. Stored for admin use only — never exposed publicly.</p>
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
