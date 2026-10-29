"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DriverNav } from "@/components/layout/DriverNav";
import { Booking, DriverProfile } from "@/types";
import {
  CalendarCheck,
  Clock,
  Wallet,
  ShieldCheck,
  Star,
  MapPin,
  Car,
  ToggleLeft,
  ToggleRight,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BookingStatusBadge, DriverVerificationBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/utils";

export default function DriverDashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [driver, setDriver] = useState<DriverProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [earnings, setEarnings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [toggleMsg, setToggleMsg] = useState("");

  const loadData = () => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data?.user || data.user.role !== "driver") {
          router.push("/login");
          return;
        }
        setUser(data.user);
        setDriver(data.user.driverProfile);

        // Fetch driver bookings
        fetch("/api/bookings")
          .then((r) => r.json())
          .then((bData) => {
            if (bData.bookings) setBookings(bData.bookings);
          });

        // Fetch driver earnings
        fetch("/api/driver/earnings")
          .then((r) => r.json())
          .then((eData) => {
            if (eData.summary) setEarnings(eData.summary);
          });
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [router]);

  const toggleAvailability = async () => {
    if (!driver) return;
    setToggling(true);
    setToggleMsg("");

    try {
      const res = await fetch("/api/driver/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !driver.isAvailable }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update availability.");
      }

      setDriver({ ...driver, isAvailable: !driver.isAvailable });
      setToggleMsg(`Status updated: ${!driver.isAvailable ? "Online (Ready for trips)" : "Offline"}`);
    } catch (err: any) {
      setToggleMsg(err.message || "Failed to update.");
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-r-transparent"></div>
        </div>
        <Footer />
      </div>
    );
  }

  const assignedTrips = bookings.filter((b) =>
    ["assigned", "en_route", "arrived", "trip_started"].includes(b.status)
  );

  const completedTrips = bookings.filter((b) => b.status === "completed");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Chauffeur Command Desk
                </h1>
                {driver && (
                  <DriverVerificationBadge status={driver.verificationStatus} />
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Welcome back, {driver?.displayName || user?.name}! Patna driver partner portal
              </p>
            </div>

            {/* Online / Offline Toggle */}
            <div className="flex items-center gap-3">
              {driver && (
                <button
                  onClick={toggleAvailability}
                  disabled={toggling || driver.verificationStatus !== "approved"}
                  className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-bold transition-all ${
                    driver.isAvailable
                      ? "border-emerald-300 bg-emerald-50 text-emerald-800 shadow-sm"
                      : "border-slate-300 bg-white text-slate-600"
                  } disabled:opacity-50`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      driver.isAvailable ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
                    }`}
                  />
                  <span>{driver.isAvailable ? "You are Online" : "You are Offline"}</span>
                </button>
              )}
            </div>
          </div>

          {toggleMsg && (
            <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-xs font-semibold text-blue-800">
              {toggleMsg}
            </div>
          )}

          {driver && driver.verificationStatus === "pending" && (
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Verification Pending Admin Approval</p>
                <p className="mt-0.5 text-amber-800">
                  Your driving license and identity records have been submitted. Our admin desk reviews applications within 24 hours. Once approved, you can turn your availability online and receive passenger bookings.
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <DriverNav />

            <div className="flex-1 space-y-8 w-full">
              {/* Quick Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card className="p-4 border-slate-200">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Net Earnings
                  </p>
                  <p className="text-2xl font-black text-emerald-600 mt-1">
                    ₹{earnings?.netDriverEarningsRupees || 0}
                  </p>
                </Card>

                <Card className="p-4 border-slate-200">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Assigned Trips
                  </p>
                  <p className="text-2xl font-black text-blue-600 mt-1">
                    {assignedTrips.length}
                  </p>
                </Card>

                <Card className="p-4 border-slate-200">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Completed Trips
                  </p>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    {completedTrips.length}
                  </p>
                </Card>

                <Card className="p-4 border-slate-200">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Chauffeur Rating
                  </p>
                  <p className="text-2xl font-black text-amber-500 mt-1 flex items-center gap-1">
                    <Star className="h-5 w-5 fill-amber-500" />
                    {driver?.rating || "5.0"}
                  </p>
                </Card>
              </div>

              {/* Active Assigned Trips (Chauffeur Operational Execution) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Navigation className="h-5 w-5 text-blue-600" />
                    <span>Current Active Assignments</span>
                  </h2>
                  <Link
                    href="/driver/bookings"
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    All Trips
                  </Link>
                </div>

                {assignedTrips.length === 0 ? (
                  <Card className="p-8 text-center border-slate-200 space-y-2">
                    <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
                    <h3 className="text-base font-bold text-slate-900">
                      No Pending Dispatches
                    </h3>
                    <p className="text-xs text-slate-500">
                      You have no active trips currently en route. Keep your status online to receive new trip requests in Patna.
                    </p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {assignedTrips.map((trip) => (
                      <Card
                        key={trip.id}
                        hoverEffect
                        className="p-6 border-blue-200 bg-blue-50/20 space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-black text-slate-900">
                              {trip.bookingRef}
                            </span>
                            <BookingStatusBadge status={trip.status} />
                            <Badge variant="navy" size="sm">
                              {trip.tripType.toUpperCase()}
                            </Badge>
                          </div>
                          <span className="text-xs font-bold text-emerald-600">
                            Fare: ₹{trip.priceBreakdown.totalAmountRupees}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
                          <div>
                            <p className="text-slate-500 font-medium">Customer Details:</p>
                            <p className="font-bold text-slate-900 mt-0.5">
                              {trip.customerName} ({trip.customerPhone})
                            </p>
                            <p className="mt-1 text-slate-600">
                              Vehicle: <strong>{trip.carType}</strong> ({trip.transmissionPreference})
                            </p>
                          </div>

                          <div>
                            <p className="text-slate-500 font-medium">Schedule & Pickup:</p>
                            <p className="font-bold text-slate-900 mt-0.5">
                              {formatDate(trip.pickupDate)} at {trip.pickupTime} ({trip.durationHours} hrs)
                            </p>
                            <p className="mt-1 text-slate-600 flex items-start gap-1">
                              <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{trip.pickupLocation}</span>
                            </p>
                          </div>
                        </div>

                        {trip.specialInstructions && (
                          <div className="rounded-xl bg-white p-2.5 border text-xs text-slate-600">
                            <strong>Customer Note:</strong> &ldquo;{trip.specialInstructions}&rdquo;
                          </div>
                        )}

                        <div className="pt-2 flex justify-end">
                          <Link href="/driver/bookings">
                            <Button size="sm" variant="primary" className="font-bold text-xs">
                              Manage Status (En Route / Arrived / Complete)
                              <ArrowRight className="h-3.5 w-3.5 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </Card>
                    ))}
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
