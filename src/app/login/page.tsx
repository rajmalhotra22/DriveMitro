"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Car,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  UserCheck,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed.");
      }

      // Route according to user role
      if (data.user.role === "admin") {
        router.push("/admin");
      } else if (data.user.role === "driver") {
        router.push("/driver/dashboard");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role: "customer" | "driver" | "admin") => {
    setError("");
    if (role === "customer") {
      setEmail("customer@drivemitro.com");
      setPassword("MitroCustomer123!");
    } else if (role === "driver") {
      setEmail("driver@drivemitro.com");
      setPassword("MitroDriver123!");
    } else if (role === "admin") {
      setEmail("admin@drivemitro.com");
      setPassword("MitroAdmin123!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 text-left">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B192C] text-white shadow-md">
              <Car className="h-6 w-6 text-blue-400" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Sign In to DriveMitro
            </h1>
            <p className="text-xs text-slate-500">
              Access your bookings, chauffeur profile, or administration desk
            </p>
          </div>

          {/* Quick 1-Click Demo Logins */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-blue-900">
              <span className="flex items-center gap-1.5">
                <KeyRound className="h-4 w-4 text-blue-600" />
                Demo Credentials (1-Click Fill)
              </span>
              <Badge variant="navy" size="sm">
                Dev Mode
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemo("customer")}
                className="rounded-xl border border-blue-200 bg-white py-1.5 px-2 text-[11px] font-bold text-blue-800 hover:bg-blue-100 transition-colors shadow-xs"
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => fillDemo("driver")}
                className="rounded-xl border border-blue-200 bg-white py-1.5 px-2 text-[11px] font-bold text-emerald-800 hover:bg-emerald-50 transition-colors shadow-xs"
              >
                Chauffeur
              </button>
              <button
                type="button"
                onClick={() => fillDemo("admin")}
                className="rounded-xl border border-blue-200 bg-white py-1.5 px-2 text-[11px] font-bold text-purple-800 hover:bg-purple-50 transition-colors shadow-xs"
              >
                Admin
              </button>
            </div>
          </div>

          {/* Main Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
            {error && (
              <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs font-semibold text-red-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                isLoading={loading}
                className="w-full font-bold shadow-md shadow-blue-900/10 mt-2"
              >
                Sign In to Account
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
              Don&apos;t have an account yet?{" "}
              <Link
                href="/register"
                className="font-bold text-blue-600 hover:underline"
              >
                Register as Customer
              </Link>{" "}
              or{" "}
              <Link
                href="/driver/register"
                className="font-bold text-emerald-600 hover:underline"
              >
                Join as Chauffeur
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
