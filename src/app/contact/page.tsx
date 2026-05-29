"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const contactSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  contactName: z.string().min(2, "Your name is required"),
  contactEmail: z.string().email("A valid email is required"),
  contactPhone: z.string().optional(),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(20, "Please provide a message (min 20 characters)"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) });

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

  return (
    <>
      <Navbar />

      <main className="pt-20">
        {/* Hero */}
        <section className="bg-[#0F172A] py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="text-[#F59E0B] text-sm font-semibold uppercase tracking-wider">
                Get In Touch
              </span>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-white mt-3 mb-6">
                Contact{" "}
                <span className="text-[#F59E0B]">Turbine Nexus</span>
              </h1>
              <p className="text-lg text-slate-300">
                Our team of specialists responds to all enquiries within one business day.
                For urgent requirements, please use our direct sales channel below.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                  <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Send Us a Message</h2>
                  <p className="text-slate-500 text-sm mb-6">
                    All enquiries are handled in strict confidence.
                  </p>

                  {status === "success" ? (
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
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                      {status === "error" && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          {errorMsg}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Company Name <span className="text-red-500">*</span>
                          </label>
                          <Input {...register("companyName")} placeholder="Your company" className={errors.companyName ? "border-red-400" : ""} />
                          {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Your Name <span className="text-red-500">*</span>
                          </label>
                          <Input {...register("contactName")} placeholder="Full name" className={errors.contactName ? "border-red-400" : ""} />
                          {errors.contactName && <p className="text-red-500 text-xs mt-1">{errors.contactName.message}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <Input type="email" {...register("contactEmail")} placeholder="you@company.com" className={errors.contactEmail ? "border-red-400" : ""} />
                          {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail.message}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Phone (optional)
                          </label>
                          <Input type="tel" {...register("contactPhone")} placeholder="+1 (555) 000-0000" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Subject <span className="text-red-500">*</span>
                        </label>
                        <Input {...register("subject")} placeholder="e.g. Gas turbine sourcing enquiry" className={errors.subject ? "border-red-400" : ""} />
                        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Message <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                          {...register("message")}
                          rows={5}
                          placeholder="Please describe your requirements in detail…"
                          className={errors.message ? "border-red-400" : ""}
                        />
                        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                      </div>

                      <Button type="submit" variant="amber" size="lg" className="w-full" disabled={status === "submitting"}>
                        {status === "submitting" ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                        ) : (
                          "Send Message"
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Direct Sales Channel - Prominent */}
                <div className="bg-[#1B3A5C] rounded-2xl p-6 text-white">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[#F59E0B]" />
                    Direct Sales Channel
                  </h3>
                  <p className="text-slate-300 text-sm mb-4">
                    For immediate assistance or urgent asset requirements, contact our sales team directly:
                  </p>
                  <a
                    href="mailto:sales@TurbineNexus.com"
                    className="flex items-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold px-4 py-3 rounded-xl transition-colors text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    sales@TurbineNexus.com
                  </a>
                  <p className="text-slate-400 text-xs mt-3">
                    Responses within 1 business day. Urgent enquiries prioritised.
                  </p>
                </div>

                {/* General Contact Info */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h3 className="font-bold text-[#0F172A] mb-4">Contact Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-[#1B3A5C] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">General Enquiries</p>
                        <a href="mailto:admin@turbinenexus.com" className="text-sm text-[#1B3A5C] hover:underline font-medium">
                          admin@turbinenexus.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-[#1B3A5C] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Phone</p>
                        <p className="text-sm text-slate-600">Available on request</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#1B3A5C] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Operations</p>
                        <p className="text-sm text-slate-600">Global — 40+ Countries</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-[#1B3A5C] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Response Time</p>
                        <p className="text-sm text-slate-600">Within 1 business day</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Teams Meeting */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h3 className="font-bold text-[#0F172A] mb-2">Arrange a Teams Meeting</h3>
                  <p className="text-slate-500 text-sm mb-4">
                    Prefer a video call? Schedule a Microsoft Teams meeting directly with our team.
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full"
                  >
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      Book a Teams Meeting
                    </a>
                  </Button>
                  <p className="text-xs text-slate-400 mt-2 text-center">
                    Calendar link — configure in admin settings
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
