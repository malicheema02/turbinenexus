import { prisma } from "@/lib/prisma";

/**
 * Generates a sequential opportunity number in the form OPP<YYYYMMDD><NNN>,
 * where NNN is the zero-padded count of inquiries created so far today + 1.
 */
export async function generateOppNumber(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  const todayCount = await prisma.inquiry.count({
    where: { createdAt: { gte: startOfDay, lte: endOfDay } },
  });

  const sequence = String(todayCount + 1).padStart(3, "0");
  return `OPP${year}${month}${day}${sequence}`;
}

interface UpsertArgs {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string | null;
  jobTitle?: string | null;
}

/**
 * Finds or creates a Company + Contact for an incoming lead, applying strict
 * deduplication:
 *  - Company name match is case-insensitive ("reflow" == "ReflowX"? no — but
 *    "REFLOW" == "reflow" yes). Names are normalized (trim) before compare.
 *  - Domain match: if the contact's email domain (e.g. @reflowx.com) matches an
 *    existing company's stored website, the contact nests under that company.
 *  - Contact email match is case-insensitive; existing contacts are reused and
 *    their phone is back-filled if it was previously missing.
 *
 * Best-effort: returns the contactId, or null if the CRM tables are unavailable.
 */
export async function upsertCompanyAndContact({
  companyName,
  contactName,
  contactEmail,
  contactPhone,
  jobTitle,
}: UpsertArgs): Promise<string | null> {
  try {
    const normalizedCompany = companyName.trim();
    const normalizedEmail = contactEmail.toLowerCase().trim();
    const emailDomain = normalizedEmail.split("@")[1] ?? "";

    const allCompanies = await prisma.company.findMany({
      select: { id: true, name: true, website: true },
    });

    // 1) exact (case-insensitive) name match
    let company =
      allCompanies.find(
        (c) => c.name.toLowerCase() === normalizedCompany.toLowerCase()
      ) ?? null;

    // 2) domain match against stored website
    if (!company && emailDomain) {
      company =
        allCompanies.find(
          (c) => c.website && c.website.toLowerCase().includes(emailDomain)
        ) ?? null;
    }

    // 3) create new company
    if (!company) {
      const created = await prisma.company.create({
        data: { name: normalizedCompany },
      });
      company = { id: created.id, name: created.name, website: created.website };
    }

    // Contact dedup by normalized email
    const allContacts = await prisma.contact.findMany({
      select: { id: true, email: true, phone: true },
    });
    const existing =
      allContacts.find((c) => c.email.toLowerCase() === normalizedEmail) ?? null;

    if (existing) {
      if (!existing.phone && contactPhone) {
        await prisma.contact.update({
          where: { id: existing.id },
          data: { phone: contactPhone },
        });
      }
      return existing.id;
    }

    const created = await prisma.contact.create({
      data: {
        name: contactName,
        email: normalizedEmail,
        phone: contactPhone ?? null,
        companyId: company.id,
        ...(jobTitle ? { jobTitle } : {}),
      },
    });
    return created.id;
  } catch (err) {
    console.warn("[crm] upsertCompanyAndContact skipped:", err);
    return null;
  }
}
