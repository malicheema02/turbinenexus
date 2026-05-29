"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Zap, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 bg-[#F59E0B] rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-white font-bold text-xl tracking-tight">TURBINE</span>
            <span className="text-[#F59E0B] font-semibold text-xs tracking-[0.2em] -mt-0.5">NEXUS</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-2xl font-bold text-[#0F172A] mb-1">Admin Portal</h1>
          <p className="text-slate-500 text-sm mb-6">Sign in to manage inventory and inquiries.</p>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@turbinenexus.com"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <p className="text-xs text-slate-400 text-center mt-6">
            This portal is for authorised Turbine Nexus administrators only.
          </p>
        </div>
      </div>
    </div>
  );
}
