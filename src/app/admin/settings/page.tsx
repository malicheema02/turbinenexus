import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DEFAULT_SETTINGS } from "@/lib/defaultSettings";
import { SiteSettingsForm } from "./SiteSettingsForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Site Settings — Turbine Nexus Admin" };

// Render groups in a sensible order rather than alphabetical.
const GROUP_ORDER = ["hero", "about", "contact", "social", "general", "integrations"];

export default async function SiteSettingsPage() {
  let byGroup: Record<string, { id: string; key: string; value: string; label: string; group: string }[]> = {};
  let needsMigration = false;

  try {
    // Backfill any missing default keys so newly-added CMS fields always appear.
    const existing = await prisma.siteSettings.findMany({ select: { key: true } });
    const existingKeys = new Set(existing.map((s) => s.key));
    const missing = DEFAULT_SETTINGS.filter((d) => !existingKeys.has(d.key));
    if (missing.length > 0) {
      await prisma.siteSettings.createMany({ data: missing });
    }

    // Explicitly select only serialisable string fields (exclude DateTime updatedAt)
    // to avoid Next.js Server→Client prop serialisation errors.
    const settings = await prisma.siteSettings.findMany({
      select: { id: true, key: true, value: true, label: true, group: true },
    });
    byGroup = settings.reduce<typeof byGroup>((acc, s) => {
      (acc[s.group] ??= []).push(s);
      return acc;
    }, {});
    // Order groups
    byGroup = Object.fromEntries(
      Object.entries(byGroup).sort(
        ([a], [b]) => (GROUP_ORDER.indexOf(a) + 1 || 99) - (GROUP_ORDER.indexOf(b) + 1 || 99)
      )
    );
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
