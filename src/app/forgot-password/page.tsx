"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Mail, KeyRound, ArrowRight, CheckCircle2, ChevronLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to process request.");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 text-left">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-xs">
              <KeyRound className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Reset Your Password
            </h1>
            <p className="text-xs text-slate-500">
              Recover access to your DriveMitro account
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl space-y-6">
            {result ? (
              <div className="space-y-4 animate-in fade-in">
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800 flex items-start gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Password Reset Instructions</p>
                    <p className="mt-1 font-normal text-emerald-700">
                      {result.message}
                    </p>
                  </div>
                </div>

                {result.defaultPasswords && (
                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs space-y-2">
                    <p className="font-bold text-slate-800">
                      Preset Development Mode Passwords:
                    </p>
                    <ul className="space-y-1 font-mono text-[11px] text-slate-600">
                      <li>Customer: {result.defaultPasswords.customer}</li>
                      <li>Driver: {result.defaultPasswords.driver}</li>
                      <li>Admin: {result.defaultPasswords.admin}</li>
                    </ul>
                  </div>
                )}

                <Link href="/login">
                  <Button variant="primary" className="w-full font-bold">
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="customer@drivemitro.com"
                      className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 font-semibold">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  isLoading={loading}
                  className="w-full font-bold"
                >
                  Request Password Reset
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </form>
            )}

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900"
              >
                <ChevronLeft className="h-4 w-4" />
                Return to Login
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
