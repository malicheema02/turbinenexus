"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/inventory", label: "Available Inventory" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#0F172A]/95 backdrop-blur-md shadow-lg"
          : "bg-[#0F172A]"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-[#F59E0B] rounded-lg flex items-center justify-center group-hover:bg-[#D97706] transition-colors">
              <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-white font-bold text-lg tracking-tight">
                TURBINE
              </span>
              <span className="text-[#F59E0B] font-semibold text-xs tracking-[0.2em] -mt-0.5">
                NEXUS
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="mailto:sales@TurbineNexus.com"
              className="text-[#F59E0B] text-sm font-medium hover:text-[#D97706] transition-colors"
            >
              sales@TurbineNexus.com
            </a>
            <Button asChild variant="amber" size="sm">
              <Link href="/inventory">Browse Inventory</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-slate-300 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="lg:hidden border-t border-slate-700 py-4">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-slate-300 hover:text-white hover:bg-slate-700 px-3 py-2.5 rounded-md text-sm font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-slate-700 mt-2">
                <a
                  href="mailto:sales@TurbineNexus.com"
                  className="block text-[#F59E0B] text-sm font-medium px-3 py-2"
                >
                  sales@TurbineNexus.com
                </a>
                <div className="px-3 pt-2">
                  <Button asChild variant="amber" className="w-full">
                    <Link href="/inventory">Browse Inventory</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
