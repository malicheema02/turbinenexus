import { prisma } from "@/lib/prisma";

/**
 * Loads all SiteSettings into a key→value Map. Returns an empty Map if the
 * table does not yet exist (e.g. before `prisma db push`), so callers can
 * always fall back to hardcoded defaults gracefully.
 */
export async function getSettingsMap(): Promise<Map<string, string>> {
  try {
    const rows = await prisma.siteSettings.findMany({ select: { key: true, value: true } });
    return new Map(rows.map((r) => [r.key, r.value]));
  } catch {
    return new Map();
  }
}

/** Convenience: read a single setting with a fallback default. */
export async function getSetting(key: string, fallback = ""): Promise<string> {
  const map = await getSettingsMap();
  const v = map.get(key);
  return v && v.trim() ? v : fallback;
}
