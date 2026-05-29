import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SiteSettingsForm } from "./SiteSettingsForm";

export const metadata: Metadata = { title: "Site Settings — Turbine Nexus Admin" };

export default async function SiteSettingsPage() {
  let byGroup: Record<string, { id: string; key: string; value: string; label: string; group: string }[]> = {};
  let needsMigration = false;

  try {
    const settings = await prisma.siteSettings.findMany({ orderBy: { group: "asc" } });
    byGroup = settings.reduce<typeof byGroup>((acc, s) => {
      (acc[s.group] ??= []).push(s);
      return acc;
    }, {});
  } catch {
    needsMigration = true;
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-[#0F172A] mb-1">Site Settings</h1>
      <p className="text-slate-500 text-sm mb-8">
        Edit your social links, contact details, and footer content. Changes go live immediately.
      </p>
      {needsMigration ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h2 className="font-bold text-amber-800 mb-2">Database Migration Required</h2>
          <p className="text-amber-700 text-sm mb-3">
            The settings table does not exist yet. Run the following command in your project folder, then refresh:
          </p>
          <code className="block bg-amber-100 text-amber-900 px-4 py-3 rounded-lg text-sm font-mono">
            npx prisma db push
          </code>
        </div>
      ) : (
        <SiteSettingsForm byGroup={byGroup} />
      )}
    </div>
  );
}
