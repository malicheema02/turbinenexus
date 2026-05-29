"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  contactName: z.string().min(2, "Your name is required"),
  contactEmail: z.string().email("A valid email is required"),
  contactPhone: z.string().optional(),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(20, "Please provide a message (min 20 characters)"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactFormValues) => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: data.companyName,
          contactName: data.contactName,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone,
          message: `Subject: ${data.subject}\n\n${data.message}`,
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setStatus("success");
      reset();
    } catch {
      setErrorMsg("Something went wrong. Please try emailing us directly.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">Message Received!</h3>
        <p className="text-slate-500 mb-6">
          Thank you for reaching out. We will be in touch within one business day.
        </p>
        <Button onClick={() => setStatus("idle")} variant="default">
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {status === "error" && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />{errorMsg}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Company Name <span className="text-red-500">*</span></label>
          <Input {...register("companyName")} placeholder="Your company" className={errors.companyName ? "border-red-400" : ""} />
          {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Your Name <span className="text-red-500">*</span></label>
          <Input {...register("contactName")} placeholder="Full name" className={errors.contactName ? "border-red-400" : ""} />
          {errors.contactName && <p className="text-red-500 text-xs mt-1">{errors.contactName.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
          <Input type="email" {...register("contactEmail")} placeholder="you@company.com" className={errors.contactEmail ? "border-red-400" : ""} />
          {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone (optional)</label>
          <Input type="tel" {...register("contactPhone")} placeholder="+1 (555) 000-0000" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject <span className="text-red-500">*</span></label>
        <Input {...register("subject")} placeholder="e.g. Gas turbine sourcing enquiry" className={errors.subject ? "border-red-400" : ""} />
        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Message <span className="text-red-500">*</span></label>
        <Textarea {...register("message")} rows={5} placeholder="Please describe your requirements in detail…" className={errors.message ? "border-red-400" : ""} />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
      </div>
      <Button type="submit" variant="amber" size="lg" className="w-full" disabled={status === "submitting"}>
        {status === "submitting" ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : "Send Message"}
      </Button>
    </form>
  );
}
