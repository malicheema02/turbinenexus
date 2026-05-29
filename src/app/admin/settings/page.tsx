import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SiteSettingsForm } from "./SiteSettingsForm";

export const metadata: Metadata = { title: "Site Settings — Turbine Nexus Admin" };

export default async function SiteSettingsPage() {
  const settings = await prisma.siteSettings.findMany({ orderBy: { group: "asc" } });
  const byGroup = settings.reduce<Record<string, typeof settings>>((acc, s) => {
    (acc[s.group] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-[#0F172A] mb-1">Site Settings</h1>
      <p className="text-slate-500 text-sm mb-8">
        Edit your social links, contact details, and footer content. Changes go live immediately.
      </p>
      <SiteSettingsForm byGroup={byGroup} />
    </div>
  );
}
