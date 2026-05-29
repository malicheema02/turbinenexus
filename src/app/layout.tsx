import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "https://turbinenexus.com"),
  title: {
    template: "%s | Turbine Nexus",
    default: "Turbine Nexus — Surplus Power Generation Equipment Specialists",
  },
  description:
    "Turbine Nexus connects buyers and sellers of surplus gas turbines, steam turbines, and power generation equipment from GE, Siemens, and Wärtsilä. Global reach, vetted assets.",
  keywords: [
    "surplus turbines",
    "used gas turbines",
    "used steam turbines",
    "power generation equipment",
    "GE turbine",
    "Siemens turbine",
    "Wärtsilä engine",
    "secondary market power equipment",
    "turbine relocation",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Turbine Nexus",
    title: "Turbine Nexus — Surplus Power Generation Equipment Specialists",
    description:
      "Global marketplace for the relocation and redeployment of surplus gas turbines, steam turbines, and industrial power generation assets.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Turbine Nexus — Surplus Power Generation Equipment",
    description:
      "Global marketplace for surplus gas turbines and power generation equipment.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-[#F8FAFC]">{children}</body>
    </html>
  );
}
