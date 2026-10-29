"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DriverNav } from "@/components/layout/DriverNav";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Calendar, Clock, CheckCircle2 } from "lucide-react";

export default function DriverAvailabilityPage() {
  const [schedule, setSchedule] = useState({
    monday: ["08:00 - 14:00", "16:00 - 22:00"],
    tuesday: ["08:00 - 14:00", "16:00 - 22:00"],
    wednesday: ["08:00 - 14:00", "16:00 - 22:00"],
    thursday: ["08:00 - 14:00", "16:00 - 22:00"],
    friday: ["08:00 - 14:00", "16:00 - 22:00"],
    saturday: ["09:00 - 23:00 (Full Day & Outstation)"],
    sunday: ["09:00 - 23:00 (Family Outstation Tours)"],
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          <div className="border-b border-slate-200 pb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Weekly Availability Schedule
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Set your operating hours so the dispatch system matches trips matching your availability
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <DriverNav />

            <div className="flex-1 space-y-6 w-full">
              {saved && (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Your weekly schedule has been updated!</span>
                </div>
              )}

              <Card className="p-6 border-slate-200 space-y-6">
                <div className="divide-y divide-slate-100 text-xs">
                  {Object.entries(schedule).map(([day, slots]) => (
                    <div
                      key={day}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <span className="font-bold text-slate-900 capitalize w-32">
                        {day}
                      </span>
                      <div className="flex flex-wrap gap-2 flex-1">
                        {slots.map((s, i) => (
                          <span
                            key={i}
                            className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1 text-emerald-800 font-semibold"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                      <span className="text-[11px] font-bold text-blue-600 cursor-pointer hover:underline">
                        Edit Slot
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t flex justify-end">
                  <Button size="md" onClick={handleSave} className="font-bold">
                    Save Weekly Schedule
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
