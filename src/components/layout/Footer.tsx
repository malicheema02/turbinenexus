import Link from "next/link";
import { Zap, Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export function Footer() {
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
            <p className="text-sm leading-relaxed text-slate-400 mb-5">
              Global specialists in the relocation and redeployment of surplus power generation equipment.
            </p>
            <div className="flex flex-col gap-2.5">
              <a
                href="mailto:sales@TurbineNexus.com"
                className="flex items-center gap-2 text-sm text-[#F59E0B] hover:text-[#D97706] transition-colors"
              >
                <Mail className="w-4 h-4" />
                sales@TurbineNexus.com
              </a>
              <a
                href="mailto:admin@turbinenexus.com"
                className="flex items-center gap-2 text-sm hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                admin@turbinenexus.com
              </a>
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
                href="mailto:sales@TurbineNexus.com"
                className="text-[#F59E0B] font-bold text-sm hover:text-[#D97706] transition-colors flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                sales@TurbineNexus.com
              </a>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-slate-500" />
                <span>Global Operations — Serving 40+ Countries</span>
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
