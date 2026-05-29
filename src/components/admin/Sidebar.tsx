"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Plus,
  LogOut,
  Zap,
  ChevronRight,
  Building2,
  Users,
  ClipboardList,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/inventory",
    label: "Inventory",
    icon: Package,
    exact: false,
  },
  {
    href: "/admin/inventory/new",
    label: "Add Asset",
    icon: Plus,
    exact: true,
    indent: true,
  },
  {
    href: "/admin/inquiries",
    label: "Inquiries / CRM",
    icon: MessageSquare,
    exact: false,
  },
  {
    href: "/admin/companies",
    label: "Companies",
    icon: Building2,
    exact: false,
  },
  {
    href: "/admin/contacts",
    label: "Contacts",
    icon: Users,
    exact: false,
  },
  {
    href: "/admin/listings",
    label: "Sell Listings",
    icon: ClipboardList,
    exact: false,
  },
  {
    href: "/admin/settings",
    label: "Site Settings",
    icon: Settings,
    exact: false,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="w-64 bg-[#0F172A] min-h-screen flex flex-col fixed top-0 left-0 z-40">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-800">
        <div className="w-8 h-8 bg-[#F59E0B] rounded-lg flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-white font-bold text-sm tracking-tight">TURBINE NEXUS</span>
          <span className="text-[#F59E0B] text-[10px] tracking-[0.2em]">ADMIN</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                item.indent && "ml-4 pl-2",
                active
                  ? "bg-[#1B3A5C] text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              <item.icon className={cn("w-4 h-4 shrink-0", active ? "text-[#F59E0B]" : "")} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 text-[#F59E0B]" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-5 border-t border-slate-800 pt-4">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all mb-1"
          target="_blank"
        >
          <Zap className="w-4 h-4" />
          <span>View Public Site</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
