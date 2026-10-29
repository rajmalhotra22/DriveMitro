"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdminNav } from "@/components/layout/AdminNav";
import { Booking, DriverProfile } from "@/types";
import {
  CalendarDays,
  Search,
  Filter,
  UserCheck,
  MapPin,
  Clock,
  Car,
  XCircle,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BookingStatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [drivers, setDrivers] = useState<DriverProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchRef, setSearchRef] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Assign Driver Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  const fetchBookings = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (searchRef) params.set("ref", searchRef);

    fetch(`/api/bookings?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.bookings) setBookings(data.bookings);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    fetch("/api/drivers?all=true")
      .then((r) => r.json())
      .then((dData) => {
        if (dData.drivers) setDrivers(dData.drivers);
      });
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings();
  };

  const openAssignModal = (bkg: Booking) => {
    setSelectedBooking(bkg);
    setSelectedDriverId(bkg.driverId || "");
    setActionError("");
    setActionSuccess("");
    setAssignModalOpen(true);
  };

  const handleAssignDriver = async () => {
    if (!selectedBooking || !selectedDriverId) return;
    setAssigning(true);
    setActionError("");

    try {
      const res = await fetch(`/api/admin/bookings/${selectedBooking.id}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driverId: selectedDriverId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to assign driver.");
      }

      setActionSuccess("Driver assigned successfully!");
      setAssignModalOpen(false);
      fetchBookings();
    } catch (err: any) {
      setActionError(err.message || "Failed to assign.");
    } finally {
      setAssigning(false);
    }
  };

  const handleStatusOverride = async (bookingId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          note: `Admin status override to ${newStatus}`,
        }),
      });
      if (res.ok) {
        fetchBookings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          <div className="border-b border-slate-200 pb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Admin Booking Management
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Dispatch control, chauffeur assignment, and booking dispute resolutions
            </p>
          </div>

          {actionSuccess && (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800">
              {actionSuccess}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <AdminNav />

            <div className="flex-1 space-y-6 w-full">
              {/* Filter Strip */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
                  {["all", "requested", "assigned", "en_route", "completed", "cancelled"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                        statusFilter === st
                          ? "bg-white text-blue-700 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {st.replace("_", " ")}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-72">
                  <input
                    type="text"
                    placeholder="Search DM-PAT..."
                    value={searchRef}
                    onChange={(e) => setSearchRef(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs"
                  />
                  <Button type="submit" variant="outline" size="sm" className="font-semibold">
                    Filter
                  </Button>
                </form>
              </div>

              {/* Table of bookings */}
              <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="py-3 px-4">Booking Ref</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Pickup Date & Locality</th>
                        <th className="py-3 px-4">Assigned Chauffeur</th>
                        <th className="py-3 px-4">Fare</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loading ? (
                        <tr>
                          <td colSpan={7} className="text-center py-12 text-slate-400">
                            Loading bookings...
                          </td>
                        </tr>
                      ) : bookings.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-12 text-slate-400">
                            No bookings matching filter.
                          </td>
                        </tr>
                      ) : (
                        bookings.map((bkg) => (
                          <tr key={bkg.id} className="hover:bg-slate-50/60">
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                              {bkg.bookingRef}
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-slate-900">{bkg.customerName}</p>
                              <p className="text-[11px] text-slate-500">{bkg.customerPhone}</p>
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="font-semibold text-slate-800">
                                {formatDate(bkg.pickupDate)} • {bkg.pickupTime}
                              </p>
                              <p className="text-[11px] text-slate-500 truncate max-w-xs">
                                {bkg.pickupLocation}
                              </p>
                            </td>
                            <td className="py-3.5 px-4">
                              {bkg.driverName ? (
                                <span className="font-bold text-blue-700">
                                  {bkg.driverName}
                                </span>
                              ) : (
                                <span className="text-amber-600 font-bold italic">
                                  Unassigned
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-slate-900">
                              ₹{bkg.priceBreakdown.totalAmountRupees}
                            </td>
                            <td className="py-3.5 px-4">
                              <BookingStatusBadge status={bkg.status} />
                            </td>
                            <td className="py-3.5 px-4 text-right space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openAssignModal(bkg)}
                                className="text-xs font-semibold"
                              >
                                {bkg.driverName ? "Reassign" : "Assign Driver"}
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Assign Driver Modal */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="Assign Verified Chauffeur"
        description={`Trip ${selectedBooking?.bookingRef} • ${selectedBooking?.pickupDate} at ${selectedBooking?.pickupTime}`}
      >
        <div className="space-y-4 text-left">
          {actionError && (
            <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 font-semibold">
              {actionError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Select Approved Chauffeur
            </label>
            <select
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900"
            >
              <option value="">-- Choose Eligible Chauffeur --</option>
              {drivers
                .filter((d) => d.verificationStatus === "approved")
                .map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.displayName} ({d.rating}★ • {d.yearsExperience} yrs exp • Areas: {d.serviceAreas.slice(0, 2).join(", ")})
                  </option>
                ))}
            </select>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 text-[11px] text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800">Validation Guards Active:</p>
            <p>
              • Unapproved chauffeurs are filtered out from assignment.
            </p>
            <p>
              • Server validates that the driver is not double-booked on {selectedBooking?.pickupDate}.
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setAssignModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              isLoading={assigning}
              disabled={!selectedDriverId || assigning}
              onClick={handleAssignDriver}
              className="flex-1 font-bold"
            >
              Confirm Assignment
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
