"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DriverNav } from "@/components/layout/DriverNav";
import { Booking, BookingStatus } from "@/types";
import {
  CalendarCheck,
  MapPin,
  Calendar,
  Phone,
  Clock,
  Car,
  Navigation,
  CheckCircle2,
  PlayCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BookingStatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/utils";

export default function DriverBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchBookings = () => {
    setLoading(true);
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => {
        if (data.bookings) setBookings(data.bookings);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusTransition = async (bookingId: string, nextStatus: BookingStatus) => {
    setActionLoading(bookingId);
    setMessage("");
    setError("");

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: nextStatus,
          note: `Chauffeur updated status to ${nextStatus}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update trip status.");
      }

      setMessage(`Trip status successfully updated to: ${nextStatus.replace("_", " ").toUpperCase()}`);
      fetchBookings();
    } catch (err: any) {
      setError(err.message || "Failed to transition status.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          <div className="border-b border-slate-200 pb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My Chauffeur Trips & Status Dispatch
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Advance your trip status accurately from departure to customer destination drop
            </p>
          </div>

          {message && (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-xs font-semibold text-red-600 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <DriverNav />

            <div className="flex-1 space-y-6 w-full">
              {loading ? (
                <div className="py-20 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-r-transparent"></div>
                  <p className="mt-3 text-xs text-slate-500">Loading your assigned trips...</p>
                </div>
              ) : bookings.length === 0 ? (
                <Card className="p-12 text-center border-slate-200 space-y-3">
                  <CalendarCheck className="h-10 w-10 text-slate-400 mx-auto" />
                  <h3 className="text-lg font-bold text-slate-900">
                    No Trips Assigned Yet
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    New trips assigned by our Patna dispatch office will appear here. Ensure your status is set to Online on your dashboard.
                  </p>
                </Card>
              ) : (
                <div className="space-y-6">
                  {bookings.map((trip) => {
                    const isOperating = actionLoading === trip.id;
                    return (
                      <Card
                        key={trip.id}
                        hoverEffect
                        className="p-6 border-slate-200 space-y-5"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-base font-black text-slate-900">
                              {trip.bookingRef}
                            </span>
                            <BookingStatusBadge status={trip.status} />
                            <Badge variant="navy" size="sm">
                              {trip.tripType.toUpperCase()}
                            </Badge>
                          </div>

                          <div className="text-right">
                            <span className="text-[11px] text-slate-400 font-medium">
                              Driver Take-Home:
                            </span>
                            <p className="text-lg font-black text-emerald-600">
                              ₹{trip.priceBreakdown.totalAmountRupees}
                            </p>
                          </div>
                        </div>

                        {/* Customer & Car Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
                          <div className="space-y-1">
                            <p className="text-slate-500 font-medium">Passenger Name:</p>
                            <p className="font-bold text-slate-900 text-sm">
                              {trip.customerName}
                            </p>
                            <p className="text-slate-600 flex items-center gap-1 font-mono">
                              <Phone className="h-3.5 w-3.5 text-emerald-600" />
                              {trip.customerPhone}
                            </p>
                            <p className="text-slate-600 flex items-center gap-1 pt-1">
                              <Car className="h-3.5 w-3.5 text-blue-600" />
                              {trip.carType} ({trip.transmissionPreference || "Any"})
                            </p>
                          </div>

                          <div className="space-y-1">
                            <p className="text-slate-500 font-medium">Schedule:</p>
                            <p className="font-bold text-slate-900">
                              {formatDate(trip.pickupDate)} at {trip.pickupTime} ({trip.durationHours} hrs)
                            </p>
                            <p className="text-slate-600 flex items-start gap-1 pt-1">
                              <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>Pickup: {trip.pickupLocation}</span>
                            </p>
                            {trip.destinationLocation && (
                              <p className="text-slate-500 flex items-start gap-1">
                                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                                <span>Drop: {trip.destinationLocation}</span>
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action buttons based on current state */}
                        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                          <span className="text-[11px] text-slate-500 italic">
                            *Advance trip status sequentially during your shift
                          </span>

                          <div className="flex gap-2">
                            {trip.status === "assigned" && (
                              <Button
                                size="sm"
                                variant="primary"
                                isLoading={isOperating}
                                onClick={() => handleStatusTransition(trip.id, "en_route")}
                                className="font-bold text-xs bg-blue-700 hover:bg-blue-800"
                              >
                                <Navigation className="h-3.5 w-3.5 mr-1 animate-bounce" />
                                Start Commute (En Route)
                              </Button>
                            )}

                            {trip.status === "en_route" && (
                              <Button
                                size="sm"
                                variant="secondary"
                                isLoading={isOperating}
                                onClick={() => handleStatusTransition(trip.id, "arrived")}
                                className="font-bold text-xs"
                              >
                                <MapPin className="h-3.5 w-3.5 mr-1" />
                                Mark Arrived at Pickup
                              </Button>
                            )}

                            {trip.status === "arrived" && (
                              <Button
                                size="sm"
                                variant="success"
                                isLoading={isOperating}
                                onClick={() => handleStatusTransition(trip.id, "trip_started")}
                                className="font-bold text-xs"
                              >
                                <PlayCircle className="h-3.5 w-3.5 mr-1" />
                                Customer Onboard (Start Trip)
                              </Button>
                            )}

                            {trip.status === "trip_started" && (
                              <Button
                                size="sm"
                                variant="success"
                                isLoading={isOperating}
                                onClick={() => handleStatusTransition(trip.id, "completed")}
                                className="font-bold text-xs bg-emerald-700 hover:bg-emerald-800"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                Complete Trip & Settle Fare
                              </Button>
                            )}

                            {trip.status === "completed" && (
                              <Badge variant="success" size="md">
                                Trip Completed & Settled
                              </Badge>
                            )}

                            {trip.status === "cancelled" && (
                              <Badge variant="danger" size="md">
                                Trip Cancelled
                              </Badge>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
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
