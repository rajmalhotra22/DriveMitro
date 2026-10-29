"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DashboardNav } from "@/components/layout/DashboardNav";
import { Booking, DriverProfile, Notification } from "@/types";
import {
  Calendar,
  Clock,
  Car,
  MapPin,
  ArrowRight,
  PlusCircle,
  Star,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Repeat,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BookingStatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/utils";

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favorites, setFavorites] = useState<DriverProfile[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data?.user) {
          router.push("/login");
          return;
        }
        setUser(data.user);

        // Fetch bookings
        fetch("/api/bookings")
          .then((r) => r.json())
          .then((bData) => {
            if (bData.bookings) setBookings(bData.bookings);
          });

        // Fetch favorites
        fetch("/api/favorites")
          .then((r) => r.json())
          .then((fData) => {
            if (fData.favorites) setFavorites(fData.favorites);
          });

        // Fetch notifications
        fetch("/api/notifications")
          .then((r) => r.json())
          .then((nData) => {
            if (nData.notifications) setNotifications(nData.notifications);
          });
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
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

  const activeBookings = bookings.filter((b) =>
    ["requested", "assigned", "en_route", "arrived", "trip_started"].includes(b.status)
  );

  const pastBookings = bookings.filter((b) =>
    ["completed", "cancelled"].includes(b.status)
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Welcome back, {user?.name || "Customer"}!
                </h1>
                <Badge variant="success" size="sm">
                  Verified Car Owner
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Patna personal chauffeur dashboard • Manage trips and favorites
              </p>
            </div>
            <Link href="/book">
              <Button size="md" className="font-bold shadow-md shadow-blue-900/10">
                <PlusCircle className="h-4 w-4 mr-1.5" />
                Book a Driver
              </Button>
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Sidebar Navigation */}
            <DashboardNav />

            {/* Dashboard Content */}
            <div className="flex-1 space-y-8 w-full">
              {/* Quick Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card className="p-4 border-slate-200">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Active Trips
                  </p>
                  <p className="text-2xl font-black text-blue-600 mt-1">
                    {activeBookings.length}
                  </p>
                </Card>

                <Card className="p-4 border-slate-200">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Total Trips
                  </p>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    {bookings.length}
                  </p>
                </Card>

                <Card className="p-4 border-slate-200">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Saved Drivers
                  </p>
                  <p className="text-2xl font-black text-rose-600 mt-1">
                    {favorites.length}
                  </p>
                </Card>

                <Card className="p-4 border-slate-200">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Account Status
                  </p>
                  <p className="text-base font-bold text-emerald-600 mt-2 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Active
                  </p>
                </Card>
              </div>

              {/* Active Bookings Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span>Active & Upcoming Bookings</span>
                  </h2>
                  <Link
                    href="/dashboard/bookings"
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    View All Bookings
                  </Link>
                </div>

                {activeBookings.length === 0 ? (
                  <Card className="p-8 text-center border-slate-200 space-y-3">
                    <div className="mx-auto h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Car className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      No Active Trips Scheduled
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Need a driver for city shopping, office commute, or weekend outstation travel? Book now in 60 seconds.
                    </p>
                    <Link href="/book">
                      <Button size="sm" className="font-bold mt-2">
                        Book a Driver Now
                      </Button>
                    </Link>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {activeBookings.map((bkg) => (
                      <Card
                        key={bkg.id}
                        hoverEffect
                        className="p-6 border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6"
                      >
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                              {bkg.bookingRef}
                            </span>
                            <BookingStatusBadge status={bkg.status} />
                            <Badge variant="navy" size="sm">
                              {bkg.tripType.replace("_", " ").toUpperCase()}
                            </Badge>
                          </div>

                          <div className="space-y-1 text-xs text-slate-600">
                            <p className="flex items-center gap-1.5 font-medium text-slate-800">
                              <Calendar className="h-3.5 w-3.5 text-blue-600" />
                              {formatDate(bkg.pickupDate)} at {bkg.pickupTime} ({bkg.durationHours} hrs)
                            </p>
                            <p className="flex items-center gap-1.5 text-slate-600">
                              <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                              Pickup: {bkg.pickupLocation}
                            </p>
                            {bkg.driverName ? (
                              <p className="text-blue-700 font-bold">
                                Assigned Driver: {bkg.driverName} ({bkg.driverPhone})
                              </p>
                            ) : (
                              <p className="text-amber-600 font-medium italic">
                                Assigning nearest verified chauffeur in your area...
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                          <div>
                            <span className="text-[11px] text-slate-400">Total:</span>
                            <p className="text-lg font-black text-slate-900">
                              ₹{bkg.priceBreakdown.totalAmountRupees}
                            </p>
                          </div>
                          <Link href={`/dashboard/bookings/${bkg.bookingRef}`}>
                            <Button size="sm" variant="primary" className="font-bold">
                              Track Trip
                              <ArrowRight className="h-3.5 w-3.5 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Past Bookings with 1-Click Rebook */}
              {pastBookings.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Repeat className="h-5 w-5 text-emerald-600" />
                    <span>Recent Completed & Cancelled Trips</span>
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pastBookings.slice(0, 2).map((past) => (
                      <Card key={past.id} className="p-5 border-slate-200 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-mono text-xs font-bold text-slate-700">
                              {past.bookingRef}
                            </span>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {past.pickupDate} • ₹{past.priceBreakdown.totalAmountRupees}
                            </p>
                          </div>
                          <BookingStatusBadge status={past.status} />
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-1">
                          {past.pickupLocation}
                        </p>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <Link
                            href={`/book?type=${past.tripType}&area=${encodeURIComponent(
                              past.pickupLocation.split(",")[0]
                            )}`}
                          >
                            <Button variant="outline" size="sm" className="font-semibold text-xs">
                              <Repeat className="h-3 w-3 mr-1" />
                              Rebook Trip
                            </Button>
                          </Link>
                          <Link
                            href={`/dashboard/bookings/${past.bookingRef}`}
                            className="text-xs text-blue-600 font-bold hover:underline"
                          >
                            Details
                          </Link>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
