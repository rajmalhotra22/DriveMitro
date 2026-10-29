"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DriverProfile, Review } from "@/types";
import {
  Star,
  MapPin,
  Calendar,
  ShieldCheck,
  Award,
  Clock,
  Car,
  Languages,
  CheckCircle2,
  ArrowRight,
  Heart,
  ChevronLeft,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DriverVerificationBadge } from "@/components/ui/StatusBadge";

export default function DriverDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 py-20" aria-busy="true">
          <main>
            <p className="text-sm text-slate-600">Loading driver profile...</p>
          </main>
        </div>
      }
    >
      <DriverDetailContent />
    </Suspense>
  );
}

function DriverDetailContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [driver, setDriver] = useState<DriverProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    fetch(`/api/drivers/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.driver) {
          setDriver(data.driver);
          setReviews(data.reviews || []);
        } else {
          setError(data.error || "Driver profile not found.");
        }
      })
      .catch(() => setError("Error loading profile."))
      .finally(() => setLoading(false));

    // Check favorite status
    fetch("/api/favorites")
      .then((res) => res.json())
      .then((data) => {
        if (data?.favorites) {
          const isFav = data.favorites.some((f: { id: string }) => f.id === id);
          setIsFavorite(isFav);
        }
      })
      .catch(() => {});
  }, [id]);

  const toggleFavorite = async () => {
    if (!driver) return;
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driverId: driver.id }),
      });
      const data = await res.json();
      setIsFavorite(data.isFavorite);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-3 text-sm text-slate-600">Loading chauffeur credentials...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !driver) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 py-16">
          <div className="max-w-md mx-auto text-center space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Driver Not Found</h2>
            <p className="text-sm text-slate-500">{error || "This driver profile does not exist or has been modified."}</p>
            <Link href="/drivers">
              <Button variant="outline">Back to Driver Directory</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          {/* Back button */}
          <Link
            href="/drivers"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to All Drivers in Patna
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Cols: Driver Profile Info & Reviews */}
            <div className="lg:col-span-8 space-y-8">
              {/* Profile Card */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-5">
                    <div className="h-20 w-20 rounded-2xl bg-[#0B192C] text-white flex items-center justify-center text-3xl font-black shadow-md">
                      {driver.displayName.charAt(0)}
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        {driver.displayName}
                      </h1>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 text-sm text-amber-500 font-bold">
                          <Star className="h-4 w-4 fill-amber-500" />
                          <span>{driver.rating > 0 ? driver.rating : "New"}</span>
                        </div>
                        <span className="text-xs text-slate-400">
                          ({driver.reviewCount} customer reviews)
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-600 font-medium">
                          Patna, Bihar
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={toggleFavorite}
                    className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition-colors ${
                      isFavorite
                        ? "border-rose-200 bg-rose-50 text-rose-600"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 ${isFavorite ? "fill-rose-600" : ""}`}
                    />
                    <span>{isFavorite ? "Saved in Favorites" : "Add to Favorites"}</span>
                  </button>
                </div>

                {/* Badges strip */}
                <div className="flex flex-wrap items-center gap-2 py-4">
                  <DriverVerificationBadge status={driver.verificationStatus} />
                  {driver.badge && (
                    <Badge variant="navy">{driver.badge}</Badge>
                  )}
                  <Badge variant="neutral">{driver.yearsExperience} Years Road Experience</Badge>
                  <Badge variant="info">
                    {driver.isAvailable ? "Available Today" : "Schedule Required"}
                  </Badge>
                </div>

                {/* Bio */}
                <div className="pt-4 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Chauffeur Background & Driving Style
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {driver.bio}
                  </p>
                </div>
              </div>

              {/* Skills and Experience Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <Car className="h-4 w-4 text-blue-600" />
                    <span>Vehicle & Transmission Mastery</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {driver.vehiclePreferences.map((v, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-blue-50 border border-blue-200/60 px-2.5 py-1 text-xs font-semibold text-blue-800"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <Award className="h-4 w-4 text-emerald-600" />
                    <span>Specialized Skills & Protocol</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {driver.skills.map((s, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 text-xs font-semibold text-emerald-800"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <MapPin className="h-4 w-4 text-purple-600" />
                    <span>Frequent Service Localities</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {driver.serviceAreas.map((area, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <Languages className="h-4 w-4 text-amber-600" />
                    <span>Spoken Languages</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {driver.languages.map((lang, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-amber-50 border border-amber-200/60 px-2.5 py-1 text-xs font-semibold text-amber-800"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Customer Reviews Section */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Customer Reviews & Feedback
                    </h3>
                    <p className="text-xs text-slate-500">
                      Verified customer ratings from completed trips in Patna
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-800">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <span>{driver.rating > 0 ? driver.rating : "5.0"} / 5.0</span>
                  </div>
                </div>

                {reviews.length === 0 ? (
                  <p className="text-sm text-slate-500 italic py-4">
                    No customer reviews yet. Be the first to book and review {driver.displayName}!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-slate-900">
                            {rev.customerName}
                          </span>
                          <div className="flex gap-0.5 text-amber-400">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed italic">
                          &ldquo;{rev.comment}&rdquo;
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Reviewed on {new Date(rev.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right 4 Cols: Sticky Booking Action Card */}
            <div className="lg:col-span-4 sticky top-28 space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    Book {driver.displayName.split(" ")[0]}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Reserve this chauffeur directly for your vehicle
                  </p>
                </div>

                <div className="space-y-3 rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs text-slate-700">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Hourly Rate:</span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      ₹{driver.baseRateHourly} / hr
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Full Day (8h):</span>
                    <span className="font-extrabold text-blue-600 text-sm">
                      ₹{driver.baseRateFullDay} flat
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Outstation:</span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      ₹1,499 / day
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>Verified DL & Aadhaar record</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span>Free cancellation up to 2 hours prior</span>
                  </div>
                </div>

                <Link
                  href={`/book?driverId=${driver.id}&driverName=${encodeURIComponent(
                    driver.displayName
                  )}`}
                >
                  <Button size="lg" className="w-full font-bold shadow-md shadow-blue-900/10">
                    Book This Driver
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>

                <p className="text-[11px] text-center text-slate-400">
                  *Carrying driver into instant booking flow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
