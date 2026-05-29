import Link from "next/link";
import { Zap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-[#1B3A5C]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Zap className="w-8 h-8 text-[#1B3A5C]" />
          </div>
          <h1 className="text-6xl font-extrabold text-[#1B3A5C] mb-3">404</h1>
          <h2 className="text-2xl font-bold text-[#0F172A] mb-3">Page Not Found</h2>
          <p className="text-slate-500 mb-8">
            The page you are looking for does not exist or may have been moved.
            If you are looking for a specific asset, browse our current inventory.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="default">
              <Link href="/inventory">Browse Inventory</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
