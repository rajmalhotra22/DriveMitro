"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DashboardNav } from "@/components/layout/DashboardNav";
import { DriverProfile } from "@/types";
import { Heart, Star, MapPin, Car, ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DriverVerificationBadge } from "@/components/ui/StatusBadge";

export default function CustomerFavoritesPage() {
  const [favorites, setFavorites] = useState<DriverProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = () => {
    setLoading(true);
    fetch("/api/favorites")
      .then((res) => res.json())
      .then((data) => {
        if (data.favorites) setFavorites(data.favorites);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const removeFavorite = async (driverId: string) => {
    try {
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driverId }),
      });
      fetchFavorites();
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
              My Favorite Chauffeurs
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Drivers who know your car, routes, and family travel preferences
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <DashboardNav />

            <div className="flex-1 space-y-6 w-full">
              {loading ? (
                <div className="py-20 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent"></div>
                  <p className="mt-3 text-xs text-slate-500">Loading saved drivers...</p>
                </div>
              ) : favorites.length === 0 ? (
                <Card className="p-12 text-center border-slate-200 space-y-4">
                  <div className="mx-auto h-14 w-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
                    <Heart className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    No Favorite Drivers Saved
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    When you find a chauffeur you enjoy traveling with, tap the heart icon on their profile to request them again anytime.
                  </p>
                  <Link href="/drivers">
                    <Button size="sm" variant="outline">
                      Explore Drivers in Patna
                    </Button>
                  </Link>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {favorites.map((driver) => (
                    <Card
                      key={driver.id}
                      hoverEffect
                      className="p-6 border-slate-200 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-2xl bg-[#0B192C] text-white flex items-center justify-center text-lg font-bold">
                              {driver.displayName.charAt(0)}
                            </div>
                            <div>
                              <h4 className="text-base font-bold text-slate-900">
                                {driver.displayName}
                              </h4>
                              <div className="flex items-center gap-1 text-xs text-amber-500">
                                <Star className="h-3.5 w-3.5 fill-amber-500" />
                                <span className="font-bold text-slate-900">
                                  {driver.rating}
                                </span>
                                <span className="text-slate-400">
                                  ({driver.reviewCount} reviews)
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => removeFavorite(driver.id)}
                            title="Remove from favorites"
                            className="rounded-xl p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          <DriverVerificationBadge status={driver.verificationStatus} />
                          <Badge variant="neutral" size="sm">
                            {driver.yearsExperience} yrs exp
                          </Badge>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                          {driver.bio}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-slate-400 font-medium">
                            Hourly Rate:
                          </span>
                          <p className="text-sm font-black text-slate-900">
                            ₹{driver.baseRateHourly} / hr
                          </p>
                        </div>
                        <Link
                          href={`/book?driverId=${driver.id}&driverName=${encodeURIComponent(
                            driver.displayName
                          )}`}
                        >
                          <Button size="sm" variant="primary" className="font-bold text-xs">
                            Book This Chauffeur
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
      </main>

      <Footer />
    </div>
  );
}
