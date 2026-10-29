"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Star,
  Car,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../ui/Button";
import { PATNA_SERVICE_AREAS } from "@/lib/pricing/config";

export function HeroSection() {
  const router = useRouter();

  // Booking widget state
  const [tripType, setTripType] = useState<string>("hourly");
  const [pickupArea, setPickupArea] = useState<string>("Boring Road");
  const [pickupDate, setPickupDate] = useState<string>("");
  const [pickupTime, setPickupTime] = useState<string>("10:00");
  const [durationHours, setDurationHours] = useState<number>(3);
  const [error, setError] = useState<string>("");

  const handleQuickBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupArea || !pickupDate || !pickupTime) {
      setError("Please select all pickup details.");
      return;
    }
    setError("");

    const params = new URLSearchParams({
      type: tripType,
      area: pickupArea,
      date: pickupDate,
      time: pickupTime,
      duration: durationHours.toString(),
    });

    router.push(`/book?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/60 pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Subtle backdrop decoration */}
      <div className="absolute top-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl" />
      <div className="absolute bottom-10 left-10 -z-10 h-72 w-72 rounded-full bg-slate-200/50 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Headline and Trust */}
          <div className="text-left lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1.5 text-xs font-semibold text-blue-800 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              <span>Personal driver booking demo for Patna</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0B192C] leading-[1.12]">
              Your Car Deserves the{" "}
              <span className="text-blue-600 underline decoration-blue-200 decoration-wavy decoration-2">
                Right Driver.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl">
              Explore a sample booking flow for personal drivers in Patna, from local errands to airport and outstation trips. Driver profiles are fictitious demo records; live bookings are not available.
            </p>

            {/* Value bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-slate-700">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>Driver verification review workflow</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>Illustrative hourly pricing from ₹149</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>Vehicle preferences captured at booking</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>No car rental markup — you own the car</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a href="#quick-booking">
                <Button size="lg" className="font-bold shadow-lg shadow-blue-900/10">
                  Book a Driver Now
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </a>
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push("/drivers")}
                className="font-semibold text-slate-800"
              >
                Browse Driver Profiles
              </Button>
            </div>

            {/* Honest Demo Trust Strip */}
            <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Verification workflow demo</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span>Sample ratings for demonstration</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-blue-600" />
                <span>Example Patna service areas</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Compact Booking Widget */}
          <div id="quick-booking" className="lg:col-span-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50 relative">
              <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Plan a Driver Booking
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sample flow · no live dispatch
                  </p>
                </div>
                <div className="rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                  Illustrative ₹149/hr
                </div>
              </div>

              {error && (
                <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleQuickBook} className="space-y-4">
                {/* Trip Type Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 text-left">
                    Select Requirement
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setTripType("hourly");
                        setDurationHours(3);
                      }}
                      className={`py-2 text-xs font-bold rounded-lg transition-all ${
                        tripType === "hourly"
                          ? "bg-white text-blue-700 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Hourly
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTripType("full_day");
                        setDurationHours(8);
                      }}
                      className={`py-2 text-xs font-bold rounded-lg transition-all ${
                        tripType === "full_day"
                          ? "bg-white text-blue-700 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Full Day
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTripType("outstation");
                        setDurationHours(24);
                      }}
                      className={`py-2 text-xs font-bold rounded-lg transition-all ${
                        tripType === "outstation"
                          ? "bg-white text-blue-700 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Outstation
                    </button>
                  </div>
                </div>

                {/* Pickup Area in Patna */}
                <div className="text-left">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Pickup Area in Patna
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <select
                      value={pickupArea}
                      onChange={(e) => setPickupArea(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      {PATNA_SERVICE_AREAS.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date & Time Grid */}
                <div className="grid grid-cols-2 gap-3 text-left">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Pickup Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-2 text-xs sm:text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Pickup Time
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-2 text-xs sm:text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Duration Slider / Select */}
                {tripType === "hourly" && (
                  <div className="text-left">
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Duration (Hours)
                      </label>
                      <span className="text-xs font-bold text-blue-600">
                        {durationHours} Hours (Min 2 hrs)
                      </span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={12}
                      step={1}
                      value={durationHours}
                      onChange={(e) => setDurationHours(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>
                )}

                {/* Indicative estimate badge */}
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-left">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Estimated Chauffeur Fare:</span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      {tripType === "hourly"
                        ? `₹${149 * Math.max(2, durationHours)} + taxes`
                        : tripType === "full_day"
                        ? "₹999 (8 hrs) + taxes"
                        : "₹1,499/day + allowance"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    *Authoritative itemized calculation shown before confirmation.
                  </p>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full font-bold shadow-md shadow-blue-900/10"
                >
                  Find Available Drivers
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
