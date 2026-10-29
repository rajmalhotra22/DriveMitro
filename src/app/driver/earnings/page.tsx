"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DriverNav } from "@/components/layout/DriverNav";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Wallet,
  TrendingUp,
  Receipt,
  Download,
  CheckCircle2,
  AlertCircle,
  Banknote,
} from "lucide-react";

export default function DriverEarningsPage() {
  const [earnings, setEarnings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/driver/earnings")
      .then((res) => res.json())
      .then((data) => {
        if (data.summary) setEarnings(data);
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
              My Chauffeur Earnings & Payouts
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Transparent 90% payout ledger with itemized platform fee deductions
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <DriverNav />

            <div className="flex-1 space-y-8 w-full">
              {/* Earnings summary metric cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-6 border-slate-200 bg-emerald-50/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      Net Take-Home
                    </span>
                    <Wallet className="h-5 w-5 text-emerald-600" />
                  </div>
                  <p className="text-3xl font-black text-emerald-700">
                    ₹{earnings?.summary?.netDriverEarningsRupees || 0}
                  </p>
                  <p className="text-[11px] text-emerald-800 mt-1">
                    Ready for direct bank transfer
                  </p>
                </Card>

                <Card className="p-6 border-slate-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Gross Trip Value
                    </span>
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-3xl font-black text-slate-900">
                    ₹{earnings?.summary?.totalGrossFareRupees || 0}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Across {earnings?.summary?.totalTrips || 0} completed trips
                  </p>
                </Card>

                <Card className="p-6 border-slate-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Platform Fee (10%)
                    </span>
                    <Receipt className="h-5 w-5 text-amber-600" />
                  </div>
                  <p className="text-3xl font-black text-slate-700">
                    ₹{earnings?.summary?.platformFeeDeductedRupees || 0}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Includes support & passenger verification
                  </p>
                </Card>
              </div>

              {/* Weekly Performance Bar */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900">
                  Weekly Earnings Overview (Patna)
                </h3>
                <div className="grid grid-cols-7 gap-2 pt-4 text-center">
                  {earnings?.weeklyBreakdown?.map((day: any, i: number) => (
                    <div key={i} className="space-y-2">
                      <div className="h-28 flex items-end justify-center rounded-xl bg-slate-100 p-1">
                        <div
                          style={{
                            height: `${Math.min(100, Math.max(10, (day.earnings / 1650) * 100))}%`,
                          }}
                          className="w-full rounded-lg bg-emerald-500 transition-all"
                        />
                      </div>
                      <p className="text-xs font-bold text-slate-800">{day.day}</p>
                      <p className="text-[10px] font-mono font-semibold text-emerald-600">
                        ₹{day.earnings}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Completed Trips Payout Ledger */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900">
                  Completed Trip Payout History
                </h3>

                {earnings?.completedTrips?.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4">
                    No completed trips yet. Complete your first trip to view settlement receipts.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 border-b text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <tr>
                          <th className="py-2.5 px-3">Booking Ref</th>
                          <th className="py-2.5 px-3">Trip Date</th>
                          <th className="py-2.5 px-3">Customer</th>
                          <th className="py-2.5 px-3">Gross Fare</th>
                          <th className="py-2.5 px-3">Net Payout</th>
                          <th className="py-2.5 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {earnings?.completedTrips?.map((trip: any) => (
                          <tr key={trip.id}>
                            <td className="py-3 px-3 font-mono font-bold text-slate-900">
                              {trip.bookingRef}
                            </td>
                            <td className="py-3 px-3">{trip.date}</td>
                            <td className="py-3 px-3 font-semibold">{trip.customerName}</td>
                            <td className="py-3 px-3">₹{trip.totalFare}</td>
                            <td className="py-3 px-3 font-black text-emerald-600">
                              ₹{trip.driverNet}
                            </td>
                            <td className="py-3 px-3">
                              <Badge variant="success" size="sm">
                                Settled
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
