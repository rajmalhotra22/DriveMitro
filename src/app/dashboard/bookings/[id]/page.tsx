"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DashboardNav } from "@/components/layout/DashboardNav";
import { Booking, BookingStatus, DriverProfile, Review } from "@/types";
import {
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  Car,
  ShieldCheck,
  User,
  Phone,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Repeat,
  Star,
  FileText,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BookingStatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";

export default function CustomerBookingDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 py-20" aria-busy="true">
          <main>
            <p className="text-sm text-slate-600">Loading booking details...</p>
          </main>
        </div>
      }
    >
      <CustomerBookingDetailContent />
    </Suspense>
  );
}

function CustomerBookingDetailContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [driver, setDriver] = useState<DriverProfile | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cancellation modal
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  // Review modal
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const fetchBooking = () => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/bookings/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.booking) {
          setBooking(data.booking);
          setDriver(data.driver);
          setHistory(data.history || []);
        } else {
          setError(data.error || "Booking not found.");
        }
      })
      .catch(() => setError("Error loading booking details."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const handleCancelBooking = async () => {
    if (!booking) return;
    setCancelling(true);
    setCancelError("");

    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "cancel",
          cancellationReason: cancelReason || "Cancelled by customer",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to cancel booking.");
      }

      setCancelModalOpen(false);
      fetchBooking();
    } catch (err: any) {
      setCancelError(err.message || "Failed to cancel.");
    } finally {
      setCancelling(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    setSubmittingReview(true);
    setReviewError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.id,
          rating,
          comment,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review.");
      }

      setReviewSubmitted(true);
      setReviewModalOpen(false);
    } catch (err: any) {
      setReviewError(err.message || "Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const copyBookingRef = () => {
    if (!booking) return;
    navigator.clipboard?.writeText(booking.bookingRef);
    alert(`Booking reference ${booking.bookingRef} copied to clipboard!`);
  };

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

  if (error || !booking) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 py-16">
          <div className="max-w-md mx-auto text-center space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Booking Not Found</h2>
            <p className="text-sm text-slate-500">{error || "Unable to retrieve this booking."}</p>
            <Link href="/dashboard/bookings">
              <Button variant="outline">Back to Bookings</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const steps: BookingStatus[] = [
    "requested",
    "assigned",
    "en_route",
    "arrived",
    "trip_started",
    "completed",
  ];

  const currentStepIndex = steps.indexOf(booking.status);
  const isCancelled = booking.status === "cancelled";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          {/* Back link */}
          <Link
            href="/dashboard/bookings"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to My Bookings
          </Link>

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xl sm:text-2xl font-black text-slate-900">
                  {booking.bookingRef}
                </span>
                <BookingStatusBadge status={booking.status} />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Booked on {new Date(booking.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={copyBookingRef}
                className="gap-1.5 text-xs font-semibold"
              >
                <Share2 className="h-3.5 w-3.5" />
                Share Booking
              </Button>

              {["requested", "assigned", "en_route"].includes(booking.status) && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setCancelModalOpen(true)}
                  className="text-xs font-semibold"
                >
                  Cancel Booking
                </Button>
              )}

              {booking.status === "completed" && !reviewSubmitted && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setReviewModalOpen(true)}
                  className="text-xs font-bold"
                >
                  <Star className="h-3.5 w-3.5 mr-1 fill-white" />
                  Leave Chauffeur Review
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <DashboardNav />

            <div className="flex-1 space-y-8 w-full">
              {/* Trip Progression Step Bar */}
              {!isCancelled ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                    Live Status Progression
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2">
                    {steps.map((st, idx) => {
                      const isPast = idx <= currentStepIndex;
                      const isCurrent = idx === currentStepIndex;
                      return (
                        <div
                          key={st}
                          className={`rounded-2xl border p-3 text-center space-y-1 transition-all ${
                            isCurrent
                              ? "border-blue-600 bg-blue-50 text-blue-900 shadow-sm"
                              : isPast
                              ? "border-emerald-200 bg-emerald-50/60 text-emerald-800"
                              : "border-slate-100 bg-slate-50 text-slate-400"
                          }`}
                        >
                          <div className="flex justify-center">
                            {isPast ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <Clock className="h-4 w-4 text-slate-300" />
                            )}
                          </div>
                          <p className="text-[11px] font-bold capitalize">
                            {st.replace("_", " ")}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-red-200 bg-red-50 p-6 flex items-start gap-4">
                  <XCircle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-base font-bold text-red-900">
                      Booking Cancelled
                    </h3>
                    <p className="text-xs text-red-700 mt-1">
                      Reason: {booking.cancellationReason || "Cancelled by user"}
                    </p>
                    {booking.cancellationFee && booking.cancellationFee > 0 ? (
                      <p className="text-xs text-red-700 font-semibold mt-1">
                        Cancellation Fee Applied: ₹{booking.cancellationFee}
                      </p>
                    ) : null}
                  </div>
                </div>
              )}

              {/* Trip Details & Driver Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Trip Details */}
                <Card className="p-6 border-slate-200 space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span>Trip Specifications</span>
                  </h3>

                  <div className="space-y-3 text-xs text-slate-700 divide-y divide-slate-100">
                    <div className="pt-2 flex justify-between">
                      <span className="text-slate-500 font-medium">Trip Type:</span>
                      <span className="font-bold text-slate-900 uppercase">
                        {booking.tripType.replace("_", " ")}
                      </span>
                    </div>
                    <div className="pt-2 flex justify-between">
                      <span className="text-slate-500 font-medium">Pickup Date & Time:</span>
                      <span className="font-bold text-slate-900">
                        {formatDate(booking.pickupDate)} at {booking.pickupTime}
                      </span>
                    </div>
                    <div className="pt-2 flex justify-between">
                      <span className="text-slate-500 font-medium">Duration:</span>
                      <span className="font-bold text-slate-900">
                        {booking.durationHours} Hours
                      </span>
                    </div>
                    <div className="pt-2 flex justify-between">
                      <span className="text-slate-500 font-medium">Car Model:</span>
                      <span className="font-bold text-slate-900">
                        {booking.carType} ({booking.transmissionPreference || "Any"})
                      </span>
                    </div>
                    <div className="pt-2">
                      <span className="text-slate-500 font-medium">Pickup Location:</span>
                      <p className="font-bold text-slate-900 mt-0.5">
                        {booking.pickupLocation}
                      </p>
                    </div>
                    {booking.destinationLocation && (
                      <div className="pt-2">
                        <span className="text-slate-500 font-medium">Destination:</span>
                        <p className="font-bold text-slate-900 mt-0.5">
                          {booking.destinationLocation}
                        </p>
                      </div>
                    )}
                    {booking.specialInstructions && (
                      <div className="pt-2">
                        <span className="text-slate-500 font-medium">Special Notes:</span>
                        <p className="text-slate-600 mt-0.5 italic">
                          &ldquo;{booking.specialInstructions}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Assigned Chauffeur Details */}
                <Card className="p-6 border-slate-200 space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <User className="h-5 w-5 text-emerald-600" />
                    <span>Assigned Chauffeur</span>
                  </h3>

                  {booking.driverName ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-[#0B192C] text-white flex items-center justify-center text-xl font-bold">
                          {booking.driverName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-slate-900">
                            {booking.driverName}
                          </h4>
                          <Badge variant="success" size="sm" className="mt-1">
                            Verified Chauffeur
                          </Badge>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-3.5 space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-slate-700">
                          <Phone className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span className="font-bold font-mono">
                            {booking.driverPhone || "+91 98351 23456"}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Chauffeur contact is active for your trip coordination.
                        </p>
                      </div>

                      {driver && (
                        <div className="text-xs text-slate-600 space-y-1">
                          <p>
                            <strong>Experience:</strong> {driver.yearsExperience} Years
                          </p>
                          <p>
                            <strong>Spoken:</strong> {driver.languages.join(", ")}
                          </p>
                          <p>
                            <strong>Rating:</strong> {driver.rating} ★ ({driver.reviewCount} reviews)
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6 text-center space-y-2">
                      <Clock className="h-8 w-8 text-amber-600 mx-auto animate-pulse" />
                      <h4 className="text-sm font-bold text-amber-900">
                        Dispatching Chauffeur
                      </h4>
                      <p className="text-xs text-amber-700">
                        Our Patna dispatch team is matching the nearest available verified driver to your pickup area.
                      </p>
                    </div>
                  )}
                </Card>
              </div>

              {/* Authoritative Itemized Fare Receipt */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span>Official Itemized Fare Breakdown</span>
                  </h3>
                  <Badge variant="navy">
                    {booking.paymentStatus === "demo_paid"
                      ? "PAID (Demo Online)"
                      : booking.paymentStatus === "paid_cash"
                      ? "PAID (Cash)"
                      : "PAYMENT PENDING"}
                  </Badge>
                </div>

                <div className="space-y-3 text-xs text-slate-700 max-w-lg">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Base Fare ({booking.tripType}):</span>
                    <span className="font-semibold text-slate-900">
                      ₹{booking.priceBreakdown.baseFare}
                    </span>
                  </div>

                  {booking.priceBreakdown.durationFare > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Extra Hours Fare:</span>
                      <span className="font-semibold text-slate-900">
                        ₹{booking.priceBreakdown.durationFare}
                      </span>
                    </div>
                  )}

                  {booking.priceBreakdown.lateNightSurcharge > 0 && (
                    <div className="flex justify-between text-amber-600 font-semibold">
                      <span>Late Night Surcharge:</span>
                      <span>+₹{booking.priceBreakdown.lateNightSurcharge}</span>
                    </div>
                  )}

                  {booking.priceBreakdown.outstationAllowance > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Driver Food / Outstation Allowance:</span>
                      <span className="font-semibold text-slate-900">
                        ₹{booking.priceBreakdown.outstationAllowance}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-slate-500">Platform Verification Fee:</span>
                    <span className="font-semibold text-slate-900">
                      ₹{booking.priceBreakdown.platformFee}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">GST (5%):</span>
                    <span className="font-semibold text-slate-900">
                      ₹{booking.priceBreakdown.gst}
                    </span>
                  </div>

                  <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline text-sm font-extrabold text-slate-900">
                    <span>Total Authoritative Fare:</span>
                    <span className="text-xl text-blue-600">
                      ₹{booking.priceBreakdown.totalAmountRupees}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status History Audit Trail */}
              {history.length > 0 && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Trip Progression Event Log
                  </h4>
                  <div className="space-y-2 text-xs text-slate-600 divide-y divide-slate-100">
                    {history.map((h, i) => (
                      <div key={i} className="pt-2 flex justify-between items-start">
                        <div>
                          <span className="font-bold text-slate-900 capitalize">
                            {h.toStatus.replace("_", " ")}
                          </span>
                          <p className="text-[11px] text-slate-500">
                            {h.note || "Status updated"} by {h.updatedBy} ({h.role})
                          </p>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Cancellation Request Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Driver Booking"
        description={`Reference: ${booking.bookingRef}`}
      >
        <div className="space-y-4 text-left">
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-800 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Cancellation Policy Reminder
            </p>
            <p>
              Free cancellation is honored up to 2 hours before scheduled pickup. If cancelled within 2 hours of pickup, a ₹150 chauffeur travel fee applies.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Reason for Cancellation
            </label>
            <textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Schedule changed / Medical appointment rescheduled..."
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {cancelError && (
            <div className="rounded-xl bg-red-50 p-2.5 text-xs text-red-600 font-semibold">
              {cancelError}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setCancelModalOpen(false)}
              className="flex-1"
            >
              Keep Booking
            </Button>
            <Button
              variant="danger"
              isLoading={cancelling}
              onClick={handleCancelBooking}
              className="flex-1 font-bold"
            >
              Confirm Cancellation
            </Button>
          </div>
        </div>
      </Modal>

      {/* Review Submission Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Review Your Chauffeur"
        description={`Trip: ${booking.bookingRef} with ${booking.driverName}`}
      >
        <form onSubmit={handleSubmitReview} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Star Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`h-7 w-7 ${
                      star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Your Review / Experience
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was the driver's punctuality, car handling, and etiquette? (e.g. Manoj was extremely disciplined and drove calmly in traffic...)"
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {reviewError && (
            <div className="rounded-xl bg-red-50 p-2.5 text-xs text-red-600 font-semibold">
              {reviewError}
            </div>
          )}

          <Button
            type="submit"
            isLoading={submittingReview}
            className="w-full font-bold shadow-md shadow-blue-900/10"
          >
            Submit Feedback
          </Button>
        </form>
      </Modal>

      <Footer />
    </div>
  );
}
