"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdminNav } from "@/components/layout/AdminNav";
import { PricingConfiguration } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Banknote, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminPricingPage() {
  const [config, setConfig] = useState<PricingConfiguration | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/pricing")
      .then((res) => res.json())
      .then((data) => {
        if (data.config) setConfig(data.config);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    setSaving(true);
    setSuccessMsg("");

    try {
      const res = await fetch("/api/admin/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update pricing.");
      }

      setSuccessMsg("Platform rates updated successfully! Applied to all upcoming bookings.");
      setConfig(data.config);
    } catch (err: any) {
      alert(err.message || "Failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !config) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          <div className="border-b border-slate-200 pb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Platform Pricing & Surcharge Engine
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Configure Patna hourly rates, package tiers, late-night surcharges, and cancellation fees
            </p>
          </div>

          {successMsg && (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <AdminNav />

            <div className="flex-1 space-y-6 w-full">
              <form onSubmit={handleSave} className="space-y-6">
                {/* Service Rates */}
                <Card className="p-6 border-slate-200 space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Banknote className="h-5 w-5 text-blue-600" />
                    <span>Base Service Tiers (INR)</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Hourly Rate (₹ / hr)
                      </label>
                      <input
                        type="number"
                        min={50}
                        max={1000}
                        value={config.serviceRates.hourlyRate}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            serviceRates: {
                              ...config.serviceRates,
                              hourlyRate: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 p-2.5 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Half-Day Flat (4h)
                      </label>
                      <input
                        type="number"
                        min={200}
                        value={config.serviceRates.halfDayRate}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            serviceRates: {
                              ...config.serviceRates,
                              halfDayRate: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 p-2.5 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Full-Day Flat (8h)
                      </label>
                      <input
                        type="number"
                        min={500}
                        value={config.serviceRates.fullDayRate}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            serviceRates: {
                              ...config.serviceRates,
                              fullDayRate: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 p-2.5 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Airport Transfer Flat (PAT)
                      </label>
                      <input
                        type="number"
                        min={200}
                        value={config.serviceRates.airportTransferFlatRate}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            serviceRates: {
                              ...config.serviceRates,
                              airportTransferFlatRate: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 p-2.5 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Outstation Daily Rate
                      </label>
                      <input
                        type="number"
                        min={1000}
                        value={config.serviceRates.outstationDailyRate}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            serviceRates: {
                              ...config.serviceRates,
                              outstationDailyRate: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 p-2.5 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Outstation Food Allowance (₹/day)
                      </label>
                      <input
                        type="number"
                        min={200}
                        value={config.surcharges.outstationDriverFoodAllowancePerDay}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            surcharges: {
                              ...config.surcharges,
                              outstationDriverFoodAllowancePerDay: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 p-2.5 font-bold"
                      />
                    </div>
                  </div>
                </Card>

                {/* Surcharges & Cancellation Rules */}
                <Card className="p-6 border-slate-200 space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    <span>Surcharges & Cancellation Fee</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Night Surcharge (%)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={50}
                        value={config.surcharges.nightSurchargePercentage}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            surcharges: {
                              ...config.surcharges,
                              nightSurchargePercentage: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 p-2.5 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Late Cancellation Fee (₹)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={config.cancellationFeeRupees}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            cancellationFeeRupees: Number(e.target.value),
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 p-2.5 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Statutory GST (%)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={28}
                        value={config.gstPercent}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            gstPercent: Number(e.target.value),
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 p-2.5 font-bold"
                      />
                    </div>
                  </div>
                </Card>

                <Button type="submit" size="lg" isLoading={saving} className="font-bold">
                  Save & Apply Pricing Rules
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
