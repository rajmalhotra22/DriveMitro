"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Car,
  Clock,
  Calendar,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Info,
  CreditCard,
  Banknote,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PATNA_SERVICE_AREAS, POPULAR_VEHICLE_MODELS } from "@/lib/pricing/config";
import { DriverProfile, PriceBreakdown, TripType } from "@/types";

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL pre-fills
  const initialType = (searchParams.get("type") as TripType) || "hourly";
  const initialDriverId = searchParams.get("driverId") || "";
  const initialDriverName = searchParams.get("driverName") || "";
  const initialArea = searchParams.get("area") || "Boring Road";
  const initialDate =
    searchParams.get("date") ||
    new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const initialTime = searchParams.get("time") || "10:00";
  const initialDuration = Number(searchParams.get("duration")) || 3;

  // Form state
  const [tripType, setTripType] = useState<TripType>(initialType);
  const [pickupLocation, setPickupLocation] = useState(
    initialArea ? `${initialArea}, Patna` : "Boring Road, Patna"
  );
  const [destinationLocation, setDestinationLocation] = useState("");
  const [pickupDate, setPickupDate] = useState(initialDate);
  const [pickupTime, setPickupTime] = useState(initialTime);
  const [durationHours, setDurationHours] = useState(initialDuration);
  const [outstationDays, setOutstationDays] = useState(1);
  const [carType, setCarType] = useState("Maruti Suzuki Dzire / Swift");
  const [transmission, setTransmission] = useState<"Manual" | "Automatic" | "Any">("Any");
  const [passengerCount, setPassengerCount] = useState(2);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash_on_trip" | "demo_online">("cash_on_trip");

  // Driver selection
  const [drivers, setDrivers] = useState<DriverProfile[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState(initialDriverId);

  // Guest details if not logged in
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Pricing breakdown state
  const [pricing, setPricing] = useState<PriceBreakdown | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);
  const [error, setError] = useState("");

  // Check current session
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setCurrentUser(data.user);
          setCustomerInfo({
            name: data.user.name,
            phone: data.user.phone,
            email: data.user.email,
          });
        }
      })
      .catch(() => {});

    // Fetch verified drivers for optional selection
    fetch("/api/drivers")
      .then((res) => res.json())
      .then((data) => {
        if (data?.drivers) {
          setDrivers(data.drivers);
        }
      })
      .catch(() => {});
  }, []);

  // Update dynamic price whenever trip parameters change
  useEffect(() => {
    setPriceLoading(true);
    fetch("/api/pricing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tripType,
        durationHours,
        pickupTime,
        outstationDays,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.pricing) {
          setPricing(data.pricing);
        }
      })
      .catch(() => {})
      .finally(() => setPriceLoading(false));
  }, [tripType, durationHours, pickupTime, outstationDays]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!pickupLocation || !pickupDate || !pickupTime) {
      setError("Please fill in pickup location, date, and time.");
      return;
    }

    if (!currentUser && (!customerInfo.name || !customerInfo.phone || !customerInfo.email)) {
      setError("Please enter your name, contact phone, and email to receive booking updates.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        tripType,
        pickupLocation,
        destinationLocation,
        pickupDate,
        pickupTime,
        durationHours,
        outstationDays,
        transmissionPreference: transmission,
        carType,
        passengerCount,
        specialInstructions,
        preferredDriverId: selectedDriverId || undefined,
        paymentMethod,
        customerInfo: !currentUser ? customerInfo : undefined,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create booking.");
      }

      setBookingSuccess(data.booking);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          {/* Header */}
          <div className="border-b border-slate-200 pb-6">
            <Badge variant="navy" className="mb-2">
              Patna Driver Dispatch
            </Badge>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
              Book a Verified Personal Driver
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Select your requirements and receive authoritative instant pricing for your private car.
            </p>
          </div>

          {/* Success Confirmation Modal/View */}
          {bookingSuccess ? (
            <div className="rounded-3xl border border-emerald-200 bg-white p-8 sm:p-12 shadow-xl text-center max-w-2xl mx-auto space-y-6 animate-in zoom-in-95">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div className="space-y-2">
                <Badge variant="success">Booking Confirmed</Badge>
                <h2 className="text-2xl font-black text-slate-900">
                  Your Driver Request Has Been Placed!
                </h2>
                <p className="text-xs text-slate-500">
                  Unique Booking Reference:{" "}
                  <strong className="text-slate-900 font-mono text-sm">
                    {bookingSuccess.bookingRef}
                  </strong>
                </p>
              </div>

              {/* Summary Card */}
              <div className="rounded-2xl bg-slate-50 p-6 border border-slate-200/80 text-left space-y-3 text-xs text-slate-700">
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500">Trip Service:</span>
                  <span className="font-bold text-slate-900 uppercase">
                    {bookingSuccess.tripType.replace("_", " ")}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500">Pickup Schedule:</span>
                  <span className="font-bold text-slate-900">
                    {bookingSuccess.pickupDate} at {bookingSuccess.pickupTime}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500">Pickup Area:</span>
                  <span className="font-bold text-slate-900">
                    {bookingSuccess.pickupLocation}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500">Assigned Driver:</span>
                  <span className="font-bold text-blue-600">
                    {bookingSuccess.driverName || "Assigning Nearest Chauffeur..."}
                  </span>
                </div>
                <div className="flex justify-between pt-1 text-sm font-extrabold text-slate-900">
                  <span>Total Authoritative Fare:</span>
                  <span>₹{bookingSuccess.priceBreakdown.totalAmountRupees}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Link href={`/dashboard/bookings/${bookingSuccess.bookingRef}`}>
                  <Button size="lg" className="w-full sm:w-auto font-bold">
                    Track Booking Status
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Go to Customer Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left 8 Cols: Booking Fields */}
              <div className="lg:col-span-8 space-y-8">
                {/* 1. Trip Type Selector */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span>1. Select Trip Type</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { id: "hourly", label: "Hourly Driver", desc: "From ₹149/hr" },
                      { id: "half_day", label: "Half-Day (4h)", desc: "₹549 flat" },
                      { id: "full_day", label: "Full-Day (8h)", desc: "₹999 flat" },
                      { id: "airport", label: "Patna Airport", desc: "₹499 flat" },
                      { id: "outstation", label: "Outstation Bihar", desc: "₹1,499/day" },
                      { id: "recurring", label: "Monthly Driver", desc: "₹11,999/mo" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setTripType(t.id as TripType);
                          if (t.id === "hourly") setDurationHours(3);
                          if (t.id === "half_day") setDurationHours(4);
                          if (t.id === "full_day") setDurationHours(8);
                          if (t.id === "airport") setDurationHours(2);
                        }}
                        className={`rounded-2xl border p-4 text-left transition-all ${
                          tripType === t.id
                            ? "border-blue-600 bg-blue-50/60 shadow-xs"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <p className={`text-sm font-bold ${tripType === t.id ? "text-blue-900" : "text-slate-800"}`}>
                          {t.label}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">{t.desc}</p>
                      </button>
                    ))}
                  </div>

                  {/* Duration Slider if hourly */}
                  {tripType === "hourly" && (
                    <div className="pt-4 border-t border-slate-100">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Booking Duration (Hours)
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

                  {/* Outstation days if outstation */}
                  {tripType === "outstation" && (
                    <div className="pt-4 border-t border-slate-100">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Number of Tour Days
                      </label>
                      <select
                        value={outstationDays}
                        onChange={(e) => setOutstationDays(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-sm"
                      >
                        <option value={1}>1 Day (Return same day)</option>
                        <option value={2}>2 Days</option>
                        <option value={3}>3 Days</option>
                        <option value={4}>4 Days</option>
                        <option value={5}>5+ Days</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* 2. Schedule and Locations */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                    <span>2. Location & Schedule</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Pickup Address / Area in Patna *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Boring Road, Near Alankar Jewellers"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        required
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Destination (Optional for hourly)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Patna Airport / Rajgir / Multiple stops"
                        value={destinationLocation}
                        onChange={(e) => setDestinationLocation(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Pickup Date *
                      </label>
                      <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        required
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Pickup Time *
                      </label>
                      <input
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        required
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Vehicle & Chauffeur Preferences */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Car className="h-5 w-5 text-purple-600" />
                    <span>3. Vehicle & Driver Preference</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Car Model
                      </label>
                      <select
                        value={carType}
                        onChange={(e) => setCarType(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      >
                        {POPULAR_VEHICLE_MODELS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Transmission
                      </label>
                      <select
                        value={transmission}
                        onChange={(e) => setTransmission(e.target.value as any)}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="Any">Any Transmission</option>
                        <option value="Manual">Manual Transmission</option>
                        <option value="Automatic">Automatic Transmission</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Passengers
                      </label>
                      <select
                        value={passengerCount}
                        onChange={(e) => setPassengerCount(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      >
                        <option value={1}>1 Passenger</option>
                        <option value={2}>2 Passengers</option>
                        <option value={3}>3 Passengers</option>
                        <option value={4}>4 Passengers</option>
                        <option value={6}>5-7 Passengers (SUV/Innova)</option>
                      </select>
                    </div>
                  </div>

                  {/* Preferred Driver Choice */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Request a Preferred Chauffeur (Optional)
                    </label>
                    <select
                      value={selectedDriverId}
                      onChange={(e) => setSelectedDriverId(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Any Available Verified Chauffeur in Patna</option>
                      {drivers.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.displayName} ({d.rating > 0 ? `${d.rating}★` : "Verified"} • {d.yearsExperience} yrs exp)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Special Instructions (Luggage, route preferences)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Elderly parents onboard; please avoid bumpy shortcuts near Ashok Rajpath."
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* 4. Customer Contact Details if not logged in */}
                {!currentUser && (
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                    <h3 className="text-base font-bold text-slate-900">
                      4. Customer Contact Information
                    </h3>
                    <p className="text-xs text-slate-500">
                      We will send your driver tracking reference and booking updates to this number.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={customerInfo.name}
                          onChange={(e) =>
                            setCustomerInfo({ ...customerInfo, name: e.target.value })
                          }
                          placeholder="e.g. Rajesh Kumar"
                          className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={customerInfo.phone}
                          onChange={(e) =>
                            setCustomerInfo({ ...customerInfo, phone: e.target.value })
                          }
                          placeholder="98765 43210"
                          className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={customerInfo.email}
                          onChange={(e) =>
                            setCustomerInfo({ ...customerInfo, email: e.target.value })
                          }
                          placeholder="rajesh@example.com"
                          className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right 4 Cols: Authoritative Pricing Breakdown & Confirm */}
              <div className="lg:col-span-4 sticky top-28 space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-lg font-bold text-slate-900">
                      Fare Breakdown
                    </h3>
                    {priceLoading ? (
                      <span className="text-[11px] text-blue-600 animate-pulse font-semibold">
                        Calculating...
                      </span>
                    ) : (
                      <Badge variant="navy" size="sm">
                        Itemized INR
                      </Badge>
                    )}
                  </div>

                  {pricing ? (
                    <div className="space-y-3 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>Base Fare:</span>
                        <span className="font-semibold text-slate-900">
                          ₹{pricing.baseFare}
                        </span>
                      </div>

                      {pricing.durationFare > 0 && (
                        <div className="flex justify-between">
                          <span>Extra Hours Fare:</span>
                          <span className="font-semibold text-slate-900">
                            ₹{pricing.durationFare}
                          </span>
                        </div>
                      )}

                      {pricing.lateNightSurcharge > 0 && (
                        <div className="flex justify-between text-amber-600">
                          <span>Night Surcharge (22:00 - 06:00):</span>
                          <span className="font-semibold">
                            +₹{pricing.lateNightSurcharge}
                          </span>
                        </div>
                      )}

                      {pricing.outstationAllowance > 0 && (
                        <div className="flex justify-between">
                          <span>Chauffeur Food & Day Allowance:</span>
                          <span className="font-semibold text-slate-900">
                            ₹{pricing.outstationAllowance}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span>Platform & Support Fee:</span>
                        <span className="font-semibold text-slate-900">
                          ₹{pricing.platformFee}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>GST (5%):</span>
                        <span className="font-semibold text-slate-900">
                          ₹{pricing.gst}
                        </span>
                      </div>

                      <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                        <span className="text-sm font-bold text-slate-900">
                          Total Payable:
                        </span>
                        <div className="text-right">
                          <span className="text-2xl font-black text-blue-600">
                            ₹{pricing.totalAmountRupees}
                          </span>
                          <p className="text-[10px] text-slate-400">
                            Inclusive of all taxes
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">Loading fare engine...</p>
                  )}

                  {/* Payment Choice */}
                  <div className="pt-2 border-t border-slate-100">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Payment Mode
                    </label>
                    <div className="space-y-2">
                      <label
                        className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer text-xs transition-colors ${
                          paymentMethod === "cash_on_trip"
                            ? "border-blue-600 bg-blue-50/50 text-blue-900 font-bold"
                            : "border-slate-200 text-slate-700"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "cash_on_trip"}
                          onChange={() => setPaymentMethod("cash_on_trip")}
                          className="accent-blue-600"
                        />
                        <Banknote className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>Pay Cash to Driver at End of Trip</span>
                      </label>

                      <label
                        className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer text-xs transition-colors ${
                          paymentMethod === "demo_online"
                            ? "border-blue-600 bg-blue-50/50 text-blue-900 font-bold"
                            : "border-slate-200 text-slate-700"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "demo_online"}
                          onChange={() => setPaymentMethod("demo_online")}
                          className="accent-blue-600"
                        />
                        <CreditCard className="h-4 w-4 text-blue-600 shrink-0" />
                        <span>Demo Digital Payment (Simulation)</span>
                      </label>
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    isLoading={submitting}
                    disabled={submitting}
                    className="w-full font-bold shadow-lg shadow-blue-900/10"
                  >
                    Confirm & Book Chauffeur
                  </Button>

                  <div className="rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500 space-y-1">
                    <p className="flex items-center gap-1 font-semibold text-slate-700">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      Free Cancellation Policy
                    </p>
                    <p>
                      Cancel for free up to 2 hours before pickup. No credit card required.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent"></div>
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
