"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdminNav } from "@/components/layout/AdminNav";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Settings, RotateCcw, Database, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleResetDemoData = async () => {
    if (!confirm("Are you sure you want to restore the initial demo dataset? This will reseed all Patna sample bookings and drivers.")) {
      return;
    }

    setResetting(true);
    setResetSuccess(false);

    try {
      const res = await fetch("/api/admin/reset", {
        method: "POST",
      });
      if (res.ok) {
        setResetSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          <div className="border-b border-slate-200 pb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Platform Configuration & Environment Settings
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Zero-budget development controls, database synchronization, and demo dataset controls
            </p>
          </div>

          {resetSuccess && (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Demo database successfully restored to clean initial seed state!</span>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <AdminNav />

            <div className="flex-1 space-y-6 w-full">
              {/* Environment info */}
              <Card className="p-6 border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    <span>Database Engine & Environment</span>
                  </h3>
                  <Badge variant="navy">Local Persistent Store (Zero Budget Active)</Badge>
                </div>

                <div className="space-y-3 text-xs text-slate-600">
                  <p>
                    <strong>Storage Status:</strong> Active local JSON persistence in <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700">.data/store.json</code>. Changes to bookings, drivers, and pricing persist across browser reloads and server restarts.
                  </p>
                  <p>
                    <strong>MongoDB Atlas Integration:</strong> To attach a free tier MongoDB Atlas database in production, configure <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700">MONGODB_URI</code> in <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700">.env</code>.
                  </p>
                  <p>
                    <strong>Session Security:</strong> JWT cookies via <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700">jose</code> with HS256 algorithm and bcrypt password encryption.
                  </p>
                </div>
              </Card>

              {/* Reset Dataset Card */}
              <Card className="p-6 border-red-200 bg-red-50/20 space-y-4">
                <div className="flex items-center justify-between border-b border-red-100 pb-3">
                  <h3 className="text-base font-bold text-red-900 flex items-center gap-2">
                    <RotateCcw className="h-5 w-5 text-red-600" />
                    <span>Reset Development Demo Dataset</span>
                  </h3>
                  <Badge variant="danger">Destructive Action</Badge>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Resetting the database reloads the original Patna chauffeur dataset (Manoj, Rakesh, Sunil, Deepak, Amit, Vikash) and clears modified test bookings back to their initial states.
                </p>

                <div className="pt-2">
                  <Button
                    variant="danger"
                    size="md"
                    isLoading={resetting}
                    onClick={handleResetDemoData}
                    className="font-bold"
                  >
                    <RotateCcw className="h-4 w-4 mr-1.5" />
                    Restore Default Seed Dataset
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
