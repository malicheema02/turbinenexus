import Link from "next/link";
import { Zap, Mail, Phone, MapPin, ExternalLink, Linkedin } from "lucide-react";
import { prisma } from "@/lib/prisma";

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z" />
    </svg>
  );
}

function WeChatIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-3.898-6.348-7.596-6.348zM5.787 7.515a1.027 1.027 0 0 1-1.021-1.021 1.027 1.027 0 0 1 1.021-1.022 1.027 1.027 0 0 1 1.022 1.022 1.027 1.027 0 0 1-1.022 1.021zm5.002 0a1.027 1.027 0 0 1-1.02-1.021 1.027 1.027 0 0 1 1.02-1.022 1.027 1.027 0 0 1 1.022 1.022 1.027 1.027 0 0 1-1.022 1.021zm8.467 4.438c0-3.405-3.186-6.168-7.12-6.168-3.933 0-7.12 2.763-7.12 6.168 0 3.404 3.187 6.168 7.12 6.168.943 0 1.846-.149 2.685-.416a.72.72 0 0 1 .596.082l1.584.927a.272.272 0 0 0 .14.046.245.245 0 0 0 .24-.246c0-.06-.024-.12-.04-.178l-.325-1.233a.493.493 0 0 1 .177-.554c1.552-1.12 2.563-2.78 2.563-4.596zm-9.38-.635a.855.855 0 0 1-.852-.852.855.855 0 0 1 .852-.852.855.855 0 0 1 .853.852.855.855 0 0 1-.853.852zm4.516 0a.855.855 0 0 1-.852-.852.855.855 0 0 1 .852-.852.855.855 0 0 1 .852.852.855.855 0 0 1-.852.852z" />
    </svg>
  );
}

async function getSettings() {
  try {
    const rows = await prisma.siteSettings.findMany();
    return rows.reduce<Record<string, string>>((a, r) => { a[r.key] = r.value; return a; }, {});
  } catch {
    return {} as Record<string, string>;
  }
}

export async function Footer() {
  const s = await getSettings();
  const linkedinUrl = s.linkedin_url || "";
  const telegramUrl = s.telegram_url || "";
  const wechatUrl   = s.wechat_id    || "";
  const salesEmail  = s.sales_email  || "sales@turbinenexus.com";
  const infoEmail   = s.info_email   || "info@turbinenexus.com";
  const tagline     = s.footer_tagline || "Global specialists in the relocation and redeployment of surplus power generation equipment.";
  const location    = s.footer_location || "Global Operations — Serving 40+ Countries";
  return (
    <footer className="bg-[#0F172A] text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer grid */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-[#F59E0B] rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-white font-bold text-lg tracking-tight">TURBINE</span>
                <span className="text-[#F59E0B] font-semibold text-xs tracking-[0.2em] -mt-0.5">NEXUS</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 mb-5">{tagline}</p>
            <div className="flex flex-col gap-2.5 mb-5">
              <a href={`mailto:${salesEmail}`}
                className="flex items-center gap-2 text-sm text-[#F59E0B] hover:text-[#D97706] transition-colors">
                <Mail className="w-4 h-4" />{salesEmail}
              </a>
              <a href={`mailto:${infoEmail}`}
                className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                <Mail className="w-4 h-4" />{infoEmail}
              </a>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              {linkedinUrl ? (
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer"
                  aria-label="Turbine Nexus on LinkedIn"
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#0A66C2] flex items-center justify-center transition-colors">
                  <Linkedin className="w-4 h-4 text-slate-300" />
                </a>
              ) : null}
              {telegramUrl ? (
                <a href={telegramUrl} target="_blank" rel="noopener noreferrer"
                  aria-label="Turbine Nexus on Telegram"
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#229ED9] flex items-center justify-center transition-colors">
                  <TelegramIcon className="w-4 h-4 text-slate-300" />
                </a>
              ) : null}
              {wechatUrl ? (
                <a href={wechatUrl} target="_blank" rel="noopener noreferrer"
                  aria-label="Turbine Nexus on WeChat"
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#07C160] flex items-center justify-center transition-colors">
                  <WeChatIcon className="w-4 h-4 text-slate-300" />
                </a>
              ) : null}
              {!linkedinUrl && !telegramUrl && !wechatUrl && (
                <span className="text-xs text-slate-600 italic">Add social links in Admin → Site Settings</span>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "Home" },
                { href: "/inventory", label: "Available Inventory" },
                { href: "/how-it-works", label: "How It Works" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact Us" },
                { href: "/sell-your-equipment", label: "Sell Your Equipment" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Equipment Types */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Equipment
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "Gas Turbines", href: "/inventory?type=GasTurbine" },
                { label: "Steam Turbines", href: "/inventory?type=SteamTurbine" },
                { label: "Gas Engines", href: "/inventory?type=GasEngine" },
                { label: "Generators", href: "/inventory?type=Generator" },
                { label: "GE Assets", href: "/inventory?manufacturer=General+Electric" },
                { label: "Siemens Assets", href: "/inventory?manufacturer=Siemens" },
                { label: "Wärtsilä Assets", href: "/inventory?manufacturer=W%C3%A4rtsil%C3%A4" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / Direct Sales */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Direct Sales Channel
            </h3>
            <div className="bg-[#1B3A5C]/50 border border-[#1B3A5C] rounded-xl p-4 mb-4">
              <p className="text-xs text-slate-400 mb-1">For immediate assistance:</p>
              <a
                href={`mailto:${salesEmail}`}
                className="text-[#F59E0B] font-bold text-sm hover:text-[#D97706] transition-colors flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {salesEmail}
              </a>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-slate-500" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-slate-500" />
                <Link href="/contact" className="hover:text-white transition-colors">
                  Request callback
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Turbine Nexus. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span>Specialists in Surplus Power Generation Equipment</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
