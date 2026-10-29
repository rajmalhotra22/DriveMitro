"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DriverNav } from "@/components/layout/DriverNav";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DriverVerificationBadge } from "@/components/ui/StatusBadge";
import {
  ShieldCheck,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Upload,
} from "lucide-react";

export default function DriverVerificationPage() {
  const [driver, setDriver] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user?.driverProfile) {
          setDriver(data.user.driverProfile);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          <div className="border-b border-slate-200 pb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Driving License & Police Verification Status
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              DriveMitro mandatory chauffeur compliance credentials
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <DriverNav />

            <div className="flex-1 space-y-6 w-full">
              {/* Verification status card */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Current Verification Tier
                    </h3>
                    <p className="text-xs text-slate-500">
                      RTO Driving License & Background Check Protocol
                    </p>
                  </div>
                  {driver && (
                    <DriverVerificationBadge status={driver.verificationStatus} />
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-2xl border p-4 bg-slate-50 text-xs space-y-1">
                    <span className="text-slate-400 font-medium">Commercial DL Number:</span>
                    <p className="font-mono font-bold text-slate-900 text-sm">
                      BR-01-20150029384
                    </p>
                    <span className="text-emerald-600 font-semibold text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Valid through 2035
                    </span>
                  </div>

                  <div className="rounded-2xl border p-4 bg-slate-50 text-xs space-y-1">
                    <span className="text-slate-400 font-medium">Identity Proof Type:</span>
                    <p className="font-bold text-slate-900 text-sm">
                      Aadhaar + LMV Badge
                    </p>
                    <span className="text-emerald-600 font-semibold text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Physical verification done
                    </span>
                  </div>

                  <div className="rounded-2xl border p-4 bg-slate-50 text-xs space-y-1">
                    <span className="text-slate-400 font-medium">Local Police Verification:</span>
                    <p className="font-bold text-slate-900 text-sm">
                      Patna Police Certificate
                    </p>
                    <span className="text-emerald-600 font-semibold text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Clear record confirmed
                    </span>
                  </div>
                </div>

                {/* Status-specific banners */}
                {driver?.verificationStatus === "approved" ? (
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-emerald-900 space-y-1">
                      <h4 className="font-bold text-sm">You are an Approved Chauffeur!</h4>
                      <p>
                        Your documents have been validated by the DriveMitro administration desk. Your profile is visible in the public driver directory, and you can accept customer dispatches across Patna.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 flex items-start gap-3">
                    <Clock className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-900 space-y-1">
                      <h4 className="font-bold text-sm">Awaiting Administrative Approval</h4>
                      <p>
                        Our compliance team is verifying your submitted documents against official RTO records. You will receive an in-app notification once your account is activated.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
