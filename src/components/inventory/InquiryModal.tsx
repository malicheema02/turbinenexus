"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const inquirySchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  contactName: z.string().min(2, "Your name is required"),
  contactEmail: z.string().email("A valid email is required"),
  contactPhone: z.string().optional(),
  message: z.string().min(10, "Please provide a brief message (min 10 chars)"),
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentId?: string;
  equipmentTitle?: string;
}

export function InquiryModal({ isOpen, onClose, equipmentId, equipmentTitle }: InquiryModalProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      message: equipmentTitle
        ? `I am interested in the ${equipmentTitle}. Please provide further information including availability and pricing.`
        : "",
    },
  });

  const onSubmit = async (data: InquiryFormValues) => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, equipmentId, equipmentTitle }),
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
          aria-describedby="inquiry-modal-description"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <Dialog.Title className="text-xl font-bold text-[#0F172A]">
                Submit Inquiry
              </Dialog.Title>
              <Dialog.Description id="inquiry-modal-description" className="text-sm text-slate-500 mt-1">
                {equipmentTitle
                  ? `Inquiring about: ${equipmentTitle}`
                  : "Our team will respond within one business day."}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          {status === "success" ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Inquiry Received!</h3>
              <p className="text-slate-500 mb-6">
                Thank you. A member of our team will be in touch within one business day. For urgent
                enquiries, email{" "}
                <a href="mailto:sales@TurbineNexus.com" className="text-[#1B3A5C] font-semibold hover:underline">
                  sales@TurbineNexus.com
                </a>
              </p>
              <Button onClick={handleClose} variant="default">
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {status === "error" && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...register("companyName")}
                    placeholder="Your company name"
                    className={errors.companyName ? "border-red-400" : ""}
                  />
                  {errors.companyName && (
                    <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Contact Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...register("contactName")}
                    placeholder="Your full name"
                    className={errors.contactName ? "border-red-400" : ""}
                  />
                  {errors.contactName && (
                    <p className="text-red-500 text-xs mt-1">{errors.contactName.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    {...register("contactEmail")}
                    placeholder="you@company.com"
                    className={errors.contactEmail ? "border-red-400" : ""}
                  />
                  {errors.contactEmail && (
                    <p className="text-red-500 text-xs mt-1">{errors.contactEmail.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Phone (optional)
                  </label>
                  <Input
                    type="tel"
                    {...register("contactPhone")}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <Textarea
                  {...register("message")}
                  rows={4}
                  placeholder="Please describe your requirements, timeline, and any technical questions…"
                  className={errors.message ? "border-red-400" : ""}
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  variant="amber"
                  className="flex-1"
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    "Submit Inquiry"
                  )}
                </Button>
                <Button type="button" variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
              </div>

              <p className="text-xs text-slate-400 text-center pt-1">
                Your information is kept strictly confidential.
              </p>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
