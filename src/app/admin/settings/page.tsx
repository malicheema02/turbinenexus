import type { Metadata } from "next";
import { SiteSettingsForm } from "./SiteSettingsForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Site Settings — Turbine Nexus Admin" };

export default function SiteSettingsPage() {
  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-[#0F172A] mb-1">Site Settings</h1>
      <p className="text-slate-500 text-sm mb-8">
        Edit your social links, contact details, and footer content. Changes go live immediately.
      </p>
      <SiteSettingsForm />
    </div>
  );
}
