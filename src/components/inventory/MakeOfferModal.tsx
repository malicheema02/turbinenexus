"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, HandCoins, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const offerSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  contactName: z.string().min(2, "Your name is required"),
  contactEmail: z.string().email("A valid email is required"),
  contactPhone: z.string().min(4, "Phone number is required"),
  offerAmount: z.coerce.number().positive("Enter a valid offer amount"),
  notes: z.string().optional(),
});

type OfferFormValues = z.infer<typeof offerSchema>;

interface MakeOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentId?: string;
  equipmentTitle?: string;
  listPrice?: number | null;
  currency?: string;
}

export function MakeOfferModal({
  isOpen,
  onClose,
  equipmentId,
  equipmentTitle,
  listPrice,
  currency = "USD",
}: MakeOfferModalProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OfferFormValues>({ resolver: zodResolver(offerSchema) });

  const onSubmit = async (data: OfferFormValues) => {
    setStatus("submitting");
    const message =
      `Offer submitted${equipmentTitle ? ` for: ${equipmentTitle}` : ""}.\n` +
      `Offer amount: ${currency} ${data.offerAmount.toLocaleString()}.\n` +
      `${listPrice ? `List price: ${currency} ${listPrice.toLocaleString()}.\n` : ""}` +
      `${data.notes ? `Notes: ${data.notes}` : ""}`;
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: data.companyName,
          contactName: data.contactName,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone,
          message,
          equipmentId,
          equipmentTitle,
          inquiryType: "Offer",
          offerAmount: data.offerAmount,
          priority: "High",
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Submission failed");
      }
      setStatus("success");
      reset();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred.");
      setStatus("error");
    }
  };

  const handleClose = () => {
    setStatus("idle");
    setErrorMessage("");
    reset();
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl animate-slide-up p-6"
          aria-describedby="offer-modal-description"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <Dialog.Title className="text-xl font-bold text-[#0F172A]">Make an Offer</Dialog.Title>
              <Dialog.Description id="offer-modal-description" className="text-sm text-slate-500 mt-1">
                {equipmentTitle ? `For: ${equipmentTitle}` : "Submit a confidential offer."}
                {listPrice ? ` · List: ${currency} ${listPrice.toLocaleString()}` : ""}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          {status === "success" ? (
            <div className="text-center py-8">
              <HandCoins className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Offer Received!</h3>
              <p className="text-slate-500 mb-6">
                Your offer has been logged confidentially. A senior advisor will respond to begin negotiation.
              </p>
              <Button onClick={handleClose} variant="default">Close</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {status === "error" && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />{errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Company Name <span className="text-red-500">*</span></label>
                  <Input {...register("companyName")} placeholder="Your company" className={errors.companyName ? "border-red-400" : ""} />
                  {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact Name <span className="text-red-500">*</span></label>
                  <Input {...register("contactName")} placeholder="Your full name" className={errors.contactName ? "border-red-400" : ""} />
                  {errors.contactName && <p className="text-red-500 text-xs mt-1">{errors.contactName.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email <span className="text-red-500">*</span></label>
                  <Input type="email" {...register("contactEmail")} placeholder="you@company.com" className={errors.contactEmail ? "border-red-400" : ""} />
                  {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone <span className="text-red-500">*</span></label>
                  <Input type="tel" {...register("contactPhone")} placeholder="+971 5X XXX XXXX" className={errors.contactPhone ? "border-red-400" : ""} />
                  {errors.contactPhone && <p className="text-red-500 text-xs mt-1">{errors.contactPhone.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Your Offer ({currency}) <span className="text-red-500">*</span></label>
                <Input type="number" step="any" {...register("offerAmount")} placeholder="e.g. 3500000" className={errors.offerAmount ? "border-red-400" : ""} />
                {errors.offerAmount && <p className="text-red-500 text-xs mt-1">{errors.offerAmount.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes (optional)</label>
                <Textarea {...register("notes")} rows={3} placeholder="Terms, conditions, timeline…" />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="amber" className="flex-1" disabled={status === "submitting"}>
                  {status === "submitting" ? (<><Loader2 className="w-4 h-4 animate-spin" />Submitting…</>) : "Submit Offer"}
                </Button>
                <Button type="button" variant="secondary" onClick={handleClose}>Cancel</Button>
              </div>

              <p className="text-xs text-slate-400 text-center pt-1">
                Offers are treated in strict confidence and are non-binding until contracted.
              </p>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
