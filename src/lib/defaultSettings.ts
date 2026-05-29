// Canonical list of all site settings. The admin Settings page backfills any
// missing keys from this list so newly-added CMS fields always appear without a
// manual re-seed. Keep in sync with prisma/seed.ts.
export interface DefaultSetting {
  key: string;
  value: string;
  label: string;
  group: string;
}

export const DEFAULT_SETTINGS: DefaultSetting[] = [
  // ── Social ──
  { key: "linkedin_url", value: "https://www.linkedin.com/company/turbine-nexus/", label: "LinkedIn URL", group: "social" },
  { key: "telegram_url", value: "", label: "Telegram URL / Username", group: "social" },
  { key: "wechat_id", value: "", label: "WeChat ID / Link", group: "social" },

  // ── Contact ──
  { key: "sales_email", value: "sales@turbinenexus.com", label: "Sales Email", group: "contact" },
  { key: "info_email", value: "info@turbinenexus.com", label: "Info Email", group: "contact" },
  { key: "phone_display", value: "", label: "Phone Number (footer)", group: "contact" },
  { key: "phone_secondary", value: "", label: "Secondary Phone Number", group: "contact" },
  { key: "contact_address", value: "", label: "Office Address", group: "contact" },

  // ── General / footer ──
  { key: "footer_tagline", value: "Global specialists in the relocation and redeployment of surplus power generation equipment.", label: "Footer Tagline", group: "general" },
  { key: "footer_location", value: "Global Operations — Serving 40+ Countries", label: "Footer Location Text", group: "general" },
  { key: "calendly_url", value: "", label: "Calendly / Teams Booking URL", group: "general" },

  // ── Hero (home page) ──
  { key: "hero_heading", value: "Surplus Power Generation Equipment, Redeployed.", label: "Hero Heading", group: "hero" },
  { key: "hero_subheading", value: "Turbine Nexus connects motivated sellers with strategic buyers of gas turbines, steam turbines, and power generation assets across 40+ countries.", label: "Hero Subheading", group: "hero" },

  // ── About page stats ──
  { key: "about_stat_mw", value: "500+ MW", label: "About Stat — Capacity Brokered", group: "about" },
  { key: "about_stat_countries", value: "40+", label: "About Stat — Countries Served", group: "about" },
  { key: "about_stat_years", value: "15+", label: "About Stat — Years Expertise", group: "about" },
  { key: "about_stat_value", value: "$800M+", label: "About Stat — Assets Managed", group: "about" },
  { key: "about_stat_clients", value: "20+", label: "About Stat — Clients Served", group: "about" },

  // ── Integrations ──
  { key: "webhook_url", value: "", label: "Automation Webhook URL (n8n / Zapier / Make)", group: "integrations" },
];
