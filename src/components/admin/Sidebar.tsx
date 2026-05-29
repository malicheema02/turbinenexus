"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Package, MessageSquare, Plus, LogOut, Zap,
  ChevronRight, Building2, Users, ClipboardList, Settings,
  PanelLeftClose, PanelLeftOpen, Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin",               label: "Dashboard",      icon: LayoutDashboard, exact: true },
  { href: "/admin/inventory",     label: "Inventory",      icon: Package,         exact: false },
  { href: "/admin/inventory/new", label: "Add Asset",      icon: Plus,            exact: true,  indent: true },
  { href: "/admin/inquiries",     label: "Inquiries / CRM",icon: MessageSquare,   exact: false },
  { href: "/admin/companies",     label: "Companies",      icon: Building2,       exact: false },
  { href: "/admin/contacts",      label: "Contacts",       icon: Users,           exact: false },
  { href: "/admin/listings",      label: "Sell Listings",  icon: ClipboardList,   exact: false },
  { href: "/admin/settings",      label: "Site Settings",  icon: Settings,        exact: false },
];

interface AdminSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function AdminSidebar({ collapsed = false, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside
      className={cn(
        "bg-[#0F172A] min-h-screen flex flex-col fixed top-0 left-0 z-40 transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo + toggle */}
      <div className={cn(
        "flex items-center border-b border-slate-800 px-3 py-4",
        collapsed ? "justify-center" : "justify-between px-5"
      )}>
        {!collapsed && (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 bg-[#F59E0B] rounded-lg flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-white font-bold text-sm tracking-tight truncate">TURBINE NEXUS</span>
              <span className="text-[#F59E0B] text-[10px] tracking-[0.2em]">ADMIN</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-[#F59E0B] rounded-lg flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
        )}
        <button
          onClick={onToggle}
          className={cn(
            "text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors shrink-0",
            collapsed && "mt-3 mx-auto block"
          )}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed
            ? <PanelLeftOpen className="w-4 h-4" />
            : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative",
                item.indent && !collapsed && "ml-4 pl-2",
                item.indent && collapsed && "ml-0",
                active
                  ? "bg-[#1B3A5C] text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className={cn("w-4 h-4 shrink-0", active ? "text-[#F59E0B]" : "")} />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {active && <ChevronRight className="w-3.5 h-3.5 text-[#F59E0B]" />}
                </>
              )}
              {/* Tooltip on collapsed */}
              {collapsed && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg border border-slate-700">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-4 border-t border-slate-800 pt-3 space-y-0.5">
        <Link
          href="/"
          target="_blank"
          title={collapsed ? "View Public Site" : undefined}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all group relative",
            collapsed && "justify-center px-2"
          )}
        >
          <Globe className="w-4 h-4 shrink-0" />
          {!collapsed && <span>View Public Site</span>}
          {collapsed && (
            <span className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg border border-slate-700">
              View Public Site
            </span>
          )}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          title={collapsed ? "Sign Out" : undefined}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all group relative",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
          {collapsed && (
            <span className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg border border-slate-700">
              Sign Out
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
