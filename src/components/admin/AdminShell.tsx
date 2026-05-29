"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "./Sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try { setCollapsed(localStorage.getItem("sidebar-collapsed") === "true"); } catch {}
  }, []);

  const toggle = () =>
    setCollapsed((c) => {
      try { localStorage.setItem("sidebar-collapsed", String(!c)); } catch {}
      return !c;
    });

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <AdminSidebar collapsed={collapsed} onToggle={toggle} />
      <main
        className="flex-1 min-h-screen transition-all duration-300 ease-in-out"
        style={{ marginLeft: collapsed ? "4rem" : "16rem" }}
      >
        {children}
      </main>
    </div>
  );
}
