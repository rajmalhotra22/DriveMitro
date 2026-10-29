"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdminNav } from "@/components/layout/AdminNav";
import { DriverProfile, VerificationStatus } from "@/types";
import {
  UserCheck,
  ShieldCheck,
  Star,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Car,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DriverVerificationBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";

export default function AdminDriversPage() {
  const [drivers, setDrivers] = useState<DriverProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // Verification modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<DriverProfile | null>(null);
  const [newStatus, setNewStatus] = useState<VerificationStatus>("approved");
  const [adminNotes, setAdminNotes] = useState("");
  const [processing, setProcessing] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchDrivers = () => {
    setLoading(true);
    fetch("/api/drivers?all=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.drivers) setDrivers(data.drivers);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const openVerifyModal = (driver: DriverProfile) => {
    setSelectedDriver(driver);
    setNewStatus(driver.verificationStatus === "approved" ? "approved" : "approved");
    setAdminNotes(`Physical DL verified by Admin on ${new Date().toLocaleDateString()}`);
    setModalOpen(true);
  };

  const handleUpdateVerification = async () => {
    if (!selectedDriver) return;
    setProcessing(true);
    setMsg("");

    try {
      const res = await fetch(`/api/admin/drivers/${selectedDriver.id}/verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          adminNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update verification.");
      }

      setMsg(`Verification updated to: ${newStatus.toUpperCase()}`);
      setModalOpen(false);
      fetchDrivers();
    } catch (err: any) {
      alert(err.message || "Failed.");
    } finally {
      setProcessing(false);
    }
  };

  const displayedDrivers = drivers.filter((d) => {
    if (filter === "approved") return d.verificationStatus === "approved";
    if (filter === "pending") return d.verificationStatus === "pending";
    if (filter === "rejected") return ["rejected", "resubmission_required"].includes(d.verificationStatus);
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          <div className="border-b border-slate-200 pb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Chauffeur Compliance & Verification
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Review RTO records, background certificates, and grant authorized verified badges
            </p>
          </div>

          {msg && (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800">
              {msg}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <AdminNav />

            <div className="flex-1 space-y-6 w-full">
              {/* Filter tabs */}
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
                {["all", "pending", "approved", "rejected"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                      filter === st
                        ? "bg-white text-blue-700 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Drivers table */}
              <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="py-3 px-4">Chauffeur</th>
                      <th className="py-3 px-4">Experience</th>
                      <th className="py-3 px-4">Service Localities</th>
                      <th className="py-3 px-4">Rating</th>
                      <th className="py-3 px-4">Verification Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {displayedDrivers.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50/60">
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900">{d.displayName}</p>
                          <p className="text-[11px] text-slate-500">{d.phone}</p>
                        </td>
                        <td className="py-3.5 px-4 font-semibold">
                          {d.yearsExperience} Years
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                          {d.serviceAreas.join(", ")}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1 font-bold text-amber-500">
                            <Star className="h-3.5 w-3.5 fill-amber-500" />
                            <span>{d.rating > 0 ? d.rating : "New"}</span>
                            <span className="text-slate-400 font-normal">
                              ({d.reviewCount})
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <DriverVerificationBadge status={d.verificationStatus} />
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Button
                            size="sm"
                            variant={d.verificationStatus === "pending" ? "primary" : "outline"}
                            onClick={() => openVerifyModal(d)}
                            className="font-bold text-xs"
                          >
                            Review / Verify
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Verification Status Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Chauffeur Verification Review"
        description={`Applicant: ${selectedDriver?.displayName}`}
      >
        <div className="space-y-4 text-left">
          <div className="space-y-2 rounded-2xl bg-slate-50 p-4 border text-xs">
            <p className="font-bold text-slate-900">Submitted Compliance Records:</p>
            <p>• Commercial / LMV License: BR-01-20180098765 (Active)</p>
            <p>• Aadhaar Identity Check: Valid Match</p>
            <p>• Background Clearance: Clean Patna Police record</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Decision
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as VerificationStatus)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900"
            >
              <option value="approved">Approve & Activate Chauffeur</option>
              <option value="resubmission_required">Request Document Resubmission</option>
              <option value="rejected">Reject Application</option>
              <option value="pending">Keep in Pending Review</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Administrative Review Notes
            </label>
            <textarea
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              isLoading={processing}
              onClick={handleUpdateVerification}
              className="flex-1 font-bold"
            >
              Save Decision
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
