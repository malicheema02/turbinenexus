"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, CalendarCheck, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Timezones relevant to international power-equipment buyers. GST (Dubai) default.
const TIMEZONES = [
  { value: "Asia/Dubai",        label: "GST · UTC+4 — Dubai / Abu Dhabi" },
  { value: "Asia/Riyadh",       label: "AST · UTC+3 — Riyadh / Doha" },
  { value: "Europe/London",     label: "GMT · UTC+0 — London" },
  { value: "Europe/Berlin",     label: "CET · UTC+1 — Berlin / Paris" },
  { value: "Asia/Kolkata",      label: "IST · UTC+5:30 — India" },
  { value: "Asia/Singapore",    label: "SGT · UTC+8 — Singapore / China" },
  { value: "Asia/Tokyo",        label: "JST · UTC+9 — Tokyo / Seoul" },
  { value: "Australia/Sydney",  label: "AEST · UTC+10 — Sydney" },
  { value: "America/New_York",  label: "EST · UTC-5 — New York" },
  { value: "America/Chicago",   label: "CST · UTC-6 — Chicago" },
  { value: "America/Los_Angeles", label: "PST · UTC-8 — Los Angeles" },
];

const meetingSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  contactName: z.string().min(2, "Your name is required"),
  contactEmail: z.string().email("A valid email is required"),
  contactPhone: z.string().min(4, "Phone number is required"),
  preferredDate: z.string().min(1, "Please choose a date"),
  preferredTime: z.string().min(1, "Please choose a time"),
  timezone: z.string().min(1),
  notes: z.string().optional(),
});

type MeetingFormValues = z.infer<typeof meetingSchema>;

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentId?: string;
  equipmentTitle?: string;
}

export function MeetingModal({ isOpen, onClose, equipmentId, equipmentTitle }: MeetingModalProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MeetingFormValues>({
    resolver: zodResolver(meetingSchema),
    defaultValues: { timezone: "Asia/Dubai" },
  });

  const onSubmit = async (data: MeetingFormValues) => {
    setStatus("submitting");
    const tzLabel = TIMEZONES.find((t) => t.value === data.timezone)?.label ?? data.timezone;
    const message =
      `Meeting request${equipmentTitle ? ` regarding: ${equipmentTitle}` : ""}.\n` +
      `Preferred: ${data.preferredDate} at ${data.preferredTime} (${tzLabel}).\n` +
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
          inquiryType: "Meeting",
          meetingTimezone: data.timezone,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Submission failed");
      }
      setStatus("success");
      reset({ timezone: "Asia/Dubai" });
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred.");
      setStatus("error");
    }
  };

  const handleClose = () => {
    setStatus("idle");
    setErrorMessage("");
    reset({ timezone: "Asia/Dubai" });
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl animate-slide-up p-6"
          aria-describedby="meeting-modal-description"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <Dialog.Title className="text-xl font-bold text-[#0F172A]">Arrange a Meeting</Dialog.Title>
              <Dialog.Description id="meeting-modal-description" className="text-sm text-slate-500 mt-1">
                {equipmentTitle ? `Discuss: ${equipmentTitle}` : "Schedule a call with our advisory team."}
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
              <CalendarCheck className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Meeting Requested!</h3>
              <p className="text-slate-500 mb-6">
                Our team will confirm your slot by email shortly. We look forward to speaking with you.
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Date <span className="text-red-500">*</span></label>
                  <Input type="date" {...register("preferredDate")} className={errors.preferredDate ? "border-red-400" : ""} />
                  {errors.preferredDate && <p className="text-red-500 text-xs mt-1">{errors.preferredDate.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Time <span className="text-red-500">*</span></label>
                  <Input type="time" {...register("preferredTime")} className={errors.preferredTime ? "border-red-400" : ""} />
                  {errors.preferredTime && <p className="text-red-500 text-xs mt-1">{errors.preferredTime.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Timezone <span className="text-red-500">*</span></label>
                <select
                  {...register("timezone")}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1B3A5C]/30"
                >
                  {TIMEZONES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes (optional)</label>
                <Textarea {...register("notes")} rows={3} placeholder="Agenda, attendees, technical questions…" />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="amber" className="flex-1" disabled={status === "submitting"}>
                  {status === "submitting" ? (<><Loader2 className="w-4 h-4 animate-spin" />Requesting…</>) : "Request Meeting"}
                </Button>
                <Button type="button" variant="secondary" onClick={handleClose}>Cancel</Button>
              </div>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
