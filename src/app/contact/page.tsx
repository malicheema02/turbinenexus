import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us — Turbine Nexus",
  description: "Get in touch with Turbine Nexus — specialists in surplus power generation equipment. Respond within one business day.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-[#0F172A] py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="text-[#F59E0B] text-sm font-semibold uppercase tracking-wider">Get In Touch</span>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-white mt-3 mb-6">
                Contact <span className="text-[#F59E0B]">Turbine Nexus</span>
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
                  <p className="text-slate-500 text-sm mb-6">All enquiries are handled in strict confidence.</p>
                  <ContactForm />
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-[#1B3A5C] rounded-2xl p-6 text-white">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[#F59E0B]" />
                    Direct Sales Channel
                  </h3>
                  <p className="text-slate-300 text-sm mb-4">
                    For immediate assistance or urgent asset requirements, contact our sales team directly:
                  </p>
                  <a href="mailto:sales@TurbineNexus.com"
                    className="flex items-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold px-4 py-3 rounded-xl transition-colors text-sm">
                    <ExternalLink className="w-4 h-4" />
                    sales@TurbineNexus.com
                  </a>
                  <p className="text-slate-400 text-xs mt-3">Responses within 1 business day. Urgent enquiries prioritised.</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h3 className="font-bold text-[#0F172A] mb-4">Contact Details</h3>
                  <div className="space-y-4">
                    {[
                      { icon: Mail, label: "General Enquiries", value: "info@turbinenexus.com", href: "mailto:info@turbinenexus.com" },
                      { icon: Phone, label: "Phone", value: "Available on request", href: null },
                      { icon: MapPin, label: "Operations", value: "Global — 40+ Countries", href: null },
                      { icon: Clock, label: "Response Time", value: "Within 1 business day", href: null },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-3">
                        <item.icon className="w-5 h-5 text-[#1B3A5C] mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{item.label}</p>
                          {item.href
                            ? <a href={item.href} className="text-sm text-[#1B3A5C] hover:underline font-medium">{item.value}</a>
                            : <p className="text-sm text-slate-600">{item.value}</p>
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h3 className="font-bold text-[#0F172A] mb-2">Arrange a Teams Meeting</h3>
                  <p className="text-slate-500 text-sm mb-4">
                    Prefer a video call? Schedule a Microsoft Teams meeting directly with our team.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <a href="#" target="_blank" rel="noopener noreferrer">Book a Teams Meeting</a>
                  </Button>
                  <p className="text-xs text-slate-400 mt-2 text-center">Calendar link — configure in admin settings</p>
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
