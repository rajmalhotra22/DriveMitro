"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DashboardNav } from "@/components/layout/DashboardNav";
import { Booking } from "@/types";
import {
  CalendarDays,
  Search,
  Filter,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Repeat,
  Car,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BookingStatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/utils";

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchRef, setSearchRef] = useState("");

  const fetchBookings = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterStatus !== "all") params.set("status", filterStatus);
    if (searchRef) params.set("ref", searchRef);

    fetch(`/api/bookings?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.bookings) setBookings(data.bookings);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, [filterStatus]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                My Booking History
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                View status, track drivers, and review receipts of all your trips
              </p>
            </div>
            <Link href="/book">
              <Button size="md" className="font-bold">
                Book New Trip
              </Button>
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <DashboardNav />

            <div className="flex-1 space-y-6 w-full">
              {/* Filter and Search Bar */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
                {/* Status Tabs */}
                <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
                  {["all", "requested", "assigned", "completed", "cancelled"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setFilterStatus(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                        filterStatus === st
                          ? "bg-white text-blue-700 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {/* Reference Search */}
                <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-72">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by DM-PAT..."
                      value={searchRef}
                      onChange={(e) => setSearchRef(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-xs"
                    />
                  </div>
                  <Button type="submit" variant="outline" size="sm" className="font-semibold">
                    Filter
                  </Button>
                </form>
              </div>

              {/* Bookings List */}
              {loading ? (
                <div className="py-20 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent"></div>
                  <p className="mt-3 text-xs text-slate-500 font-semibold">
                    Loading your bookings...
                  </p>
                </div>
              ) : bookings.length === 0 ? (
                <Card className="p-12 text-center border-slate-200 space-y-4">
                  <div className="mx-auto h-14 w-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                    <CalendarDays className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    No Bookings Found
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    No trips match your selected status filter.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFilterStatus("all");
                      setSearchRef("");
                    }}
                  >
                    Clear Filters
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {bookings.map((b) => (
                    <Card
                      key={b.id}
                      hoverEffect
                      className="p-6 border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      <div className="space-y-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                            {b.bookingRef}
                          </span>
                          <BookingStatusBadge status={b.status} />
                          <Badge variant="navy" size="sm">
                            {b.tripType.replace("_", " ").toUpperCase()}
                          </Badge>
                          <span className="text-xs text-slate-400">
                            Booked on {new Date(b.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="space-y-1 text-xs text-slate-600">
                          <p className="font-bold text-slate-800 flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-blue-600" />
                            {formatDate(b.pickupDate)} at {b.pickupTime} ({b.durationHours} hours)
                          </p>
                          <p className="flex items-center gap-1.5 text-slate-600">
                            <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                            From: {b.pickupLocation}
                          </p>
                          {b.destinationLocation && (
                            <p className="flex items-center gap-1.5 text-slate-500">
                              <MapPin className="h-3.5 w-3.5 text-slate-400" />
                              To: {b.destinationLocation}
                            </p>
                          )}
                          {b.driverName && (
                            <p className="text-blue-700 font-bold">
                              Assigned Chauffeur: {b.driverName}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                        <div>
                          <span className="text-[11px] text-slate-400 font-medium">
                            Fare Amount:
                          </span>
                          <p className="text-xl font-black text-slate-900">
                            ₹{b.priceBreakdown.totalAmountRupees}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {b.status === "completed" && (
                            <Link
                              href={`/book?type=${b.tripType}&area=${encodeURIComponent(
                                b.pickupLocation.split(",")[0]
                              )}`}
                            >
                              <Button variant="outline" size="sm" className="font-semibold text-xs">
                                <Repeat className="h-3.5 w-3.5 mr-1" />
                                Rebook
                              </Button>
                            </Link>
                          )}
                          <Link href={`/dashboard/bookings/${b.bookingRef}`}>
                            <Button size="sm" variant="primary" className="font-bold text-xs">
                              View Trip & Receipt
                              <ArrowRight className="h-3.5 w-3.5 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))}
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
