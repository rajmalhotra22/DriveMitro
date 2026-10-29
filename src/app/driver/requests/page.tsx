"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DriverNav } from "@/components/layout/DriverNav";
import { Booking } from "@/types";
import { Clock, MapPin, Calendar, Car, Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export default function DriverRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const fetchRequests = () => {
    fetch("/api/bookings?status=requested")
      .then((res) => res.json())
      .then((data) => {
        if (data.bookings) setRequests(data.bookings);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAcceptRequest = async (bookingId: string) => {
    setActing(bookingId);
    setMessage("");

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "accept_offer" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to claim booking.");
      }

      setMessage("Trip accepted! Navigating to your active dispatches...");
      setTimeout(() => {
        router.push("/driver/bookings");
      }, 1000);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to accept booking.");
    } finally {
      setActing(null);
    }
  };

  const handleRejectRequest = async (bookingId: string) => {
    setActing(bookingId);
    setMessage("");
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject_offer" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to pass on offer.");
      setRequests((current) => current.filter((request) => request.id !== bookingId));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to pass on offer.");
    } finally {
      setActing(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          <div className="border-b border-slate-200 pb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Incoming Trip Requests
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Patna passenger booking requests waiting for driver assignment
            </p>
          </div>

          {message && (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800">
              {message}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <DriverNav />

            <div className="flex-1 space-y-6 w-full">
              {loading ? (
                <div className="py-20 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-r-transparent"></div>
                  <p className="mt-3 text-xs text-slate-500">Checking incoming requests...</p>
                </div>
              ) : requests.length === 0 ? (
                <Card className="p-12 text-center border-slate-200 space-y-3">
                  <Clock className="h-10 w-10 text-slate-400 mx-auto" />
                  <h3 className="text-lg font-bold text-slate-900">
                    No Pending Requests Right Now
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    New incoming trip requests across Boring Road, Bailey Road, and Patna Airport will appear here.
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {requests.map((req) => (
                    <Card
                      key={req.id}
                      hoverEffect
                      className="p-6 border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                            {req.bookingRef}
                          </span>
                          <Badge variant="warning" size="sm">
                            Unassigned Offer
                          </Badge>
                          <Badge variant="navy" size="sm">
                            {req.tripType.toUpperCase()}
                          </Badge>
                        </div>

                        <div className="space-y-1 text-xs text-slate-600">
                          <p className="font-bold text-slate-900 flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-blue-600" />
                            {formatDate(req.pickupDate)} at {req.pickupTime} ({req.durationHours} hours)
                          </p>
                          <p className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            Pickup: {req.pickupLocation}
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Car className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                            Car: {req.carType} ({req.transmissionPreference || "Any"})
                          </p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div>
                          <span className="text-[11px] text-slate-400 font-medium">
                            Estimated Payout:
                          </span>
                          <p className="text-xl font-black text-emerald-600">
                            ₹{req.priceBreakdown.totalAmountRupees}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRejectRequest(req.id)}
                            className="text-xs text-slate-500 hover:text-red-600"
                          >
                            <X className="h-3.5 w-3.5 mr-1" />
                            Pass
                          </Button>
                          <Button
                            variant="success"
                            size="sm"
                            isLoading={acting === req.id}
                            onClick={() => handleAcceptRequest(req.id)}
                            className="font-bold text-xs"
                          >
                            <Check className="h-3.5 w-3.5 mr-1" />
                            Accept Trip
                          </Button>
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
