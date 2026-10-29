"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DriverProfile } from "@/types";
import {
  Search,
  MapPin,
  Star,
  X,
  Heart,
  Car,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DriverVerificationBadge } from "@/components/ui/StatusBadge";
import { PATNA_SERVICE_AREAS } from "@/lib/pricing/config";

export default function DriversMarketplacePage() {
  const [drivers, setDrivers] = useState<DriverProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters state
  const [search, setSearch] = useState("");
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedVehicle, setSelectedVehicle] = useState("all");
  const [minRating, setMinRating] = useState("0");
  const [minExp, setMinExp] = useState("0");
  const [sortBy, setSortBy] = useState("recommended");
  const [favorites, setFavorites] = useState<string[]>([]);

  const fetchDrivers = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (selectedArea !== "all") params.set("area", selectedArea);
    if (selectedVehicle !== "all") params.set("vehicle", selectedVehicle);
    if (minRating !== "0") params.set("minRating", minRating);
    if (minExp !== "0") params.set("minExperience", minExp);
    if (sortBy) params.set("sort", sortBy);

    fetch(`/api/drivers?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.drivers) {
          setDrivers(data.drivers);
        } else {
          setError(data.error || "Failed to load drivers");
        }
      })
      .catch(() => setError("Network error loading drivers"))
      .finally(() => setLoading(false));
  }, [search, selectedArea, selectedVehicle, minRating, minExp, sortBy]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  useEffect(() => {
    fetch("/api/favorites")
      .then((res) => res.json())
      .then((data) => {
        if (data?.favorites) {
          setFavorites(data.favorites.map((f: { id: string }) => f.id));
        }
      })
      .catch(() => {});
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    fetchDrivers();
  };

  const handleClearFilters = () => {
    setSearch("");
    setSelectedArea("all");
    setSelectedVehicle("all");
    setMinRating("0");
    setMinExp("0");
    setSortBy("recommended");
  };

  const toggleFav = async (driverId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driverId }),
      });
      const data = await res.json();
      if (data.isFavorite) {
        setFavorites([...favorites, driverId]);
      } else {
        setFavorites(favorites.filter((id) => id !== driverId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6 text-left">
            <div>
              <Badge variant="navy" className="mb-2">
                Sample Driver Directory
              </Badge>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
                Find Personal Drivers in Patna
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Browse fictitious demo profiles. Ratings and verification labels are sample data, not completed real-world checks.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-semibold">
                Sort By:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="recommended">Recommended (Top Rated)</option>
                <option value="rating">Highest Rating</option>
                <option value="experience">Most Experienced</option>
                <option value="price_low">Lowest Hourly Rate</option>
              </select>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by driver name, locality (Boring Rd, Bailey Rd), or skill (VIP Protocol)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <Button type="submit" variant="primary" size="sm" className="font-bold">
                Search
              </Button>
            </form>

            {/* Filter Dropdowns Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Patna Area
                </label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="all">All Localities</option>
                  {PATNA_SERVICE_AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Vehicle Skill
                </label>
                <select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="all">All Transmissions</option>
                  <option value="Manual">Manual Transmission</option>
                  <option value="Automatic">Automatic Transmission</option>
                  <option value="Sedan">Sedan Specialist</option>
                  <option value="SUV">SUV Specialist</option>
                  <option value="Luxury">Luxury Chauffeur</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Min Rating
                </label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="0">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.8">4.8+ Stars (Top Rated)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Driving Exp.
                </label>
                <select
                  value={minExp}
                  onChange={(e) => setMinExp(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="0">Any Experience</option>
                  <option value="5">5+ Years</option>
                  <option value="8">8+ Years (Veteran)</option>
                  <option value="10">10+ Years</option>
                </select>
              </div>
            </div>

            {/* Clear Filter Tag */}
            {(selectedArea !== "all" ||
              selectedVehicle !== "all" ||
              minRating !== "0" ||
              minExp !== "0" ||
              search) && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-500 font-medium">
                  Active filters applied
                </span>
                <button
                  onClick={handleClearFilters}
                  className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Loading and Error States */}
          {loading && (
            <div className="py-20 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-3 text-sm font-semibold text-slate-600">
                Finding matching chauffeurs in Patna...
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
              <p className="font-semibold">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchDrivers}
                className="mt-3"
              >
                Retry
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && drivers.length === 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                <Car className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                No Drivers Found
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                No drivers match your current filter combination. Try clearing your filters or selecting a broader Patna locality.
              </p>
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                Reset Filters
              </Button>
            </div>
          )}

          {/* Drivers Grid */}
          {!loading && !error && drivers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drivers.map((driver) => {
                const isFavorite = favorites.includes(driver.id);
                return (
                  <Card
                    key={driver.id}
                    hoverEffect
                    className="flex flex-col justify-between border-slate-200 p-6 text-left relative"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-14 rounded-2xl bg-[#0B192C] text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                            {driver.displayName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-bold text-slate-900">
                                {driver.displayName}
                              </h3>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-amber-500 mt-0.5">
                              <Star className="h-3.5 w-3.5 fill-amber-500" />
                              <span className="font-extrabold text-slate-900">
                                {driver.rating > 0 ? driver.rating : "New"}
                              </span>
                              <span className="text-slate-400">
                                ({driver.reviewCount} reviews)
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Favorite button */}
                        <button
                          onClick={(e) => toggleFav(driver.id, e)}
                          title="Save to Favorites"
                          className={`rounded-xl p-2 transition-colors ${
                            isFavorite
                              ? "bg-rose-50 text-rose-600"
                              : "bg-slate-50 text-slate-400 hover:text-slate-600"
                          }`}
                        >
                          <Heart
                            className={`h-4 w-4 ${isFavorite ? "fill-rose-600" : ""}`}
                          />
                        </button>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-4">
                        <DriverVerificationBadge
                          status={driver.verificationStatus}
                        />
                        {driver.badge && (
                          <Badge variant="navy" size="sm">
                            {driver.badge}
                          </Badge>
                        )}
                        <Badge variant="neutral" size="sm">
                          {driver.yearsExperience} yrs exp
                        </Badge>
                      </div>

                      {/* Bio */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                        {driver.bio}
                      </p>

                      {/* Vehicle Proficiencies & Areas */}
                      <div className="space-y-2 mb-4 text-xs text-slate-600">
                        <div className="flex items-start gap-1.5">
                          <Car className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span className="text-[11px]">
                            <strong className="text-slate-700">Vehicles:</strong>{" "}
                            {driver.vehiclePreferences.join(", ")}
                          </span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-[11px] truncate">
                            <strong className="text-slate-700">Coverage:</strong>{" "}
                            {driver.serviceAreas.slice(0, 3).join(", ")}
                            {driver.serviceAreas.length > 3 && "..."}
                          </span>
                        </div>
                      </div>

                      {/* Pricing Tag */}
                      <div className="rounded-xl bg-slate-50 border border-slate-100 p-2.5 flex items-center justify-between mb-4">
                        <div>
                          <span className="text-xs text-slate-400 font-medium">
                            Starting from:
                          </span>
                          <p className="text-sm font-extrabold text-slate-900">
                            ₹{driver.baseRateHourly} / hr
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-slate-400 font-medium">
                            Full Day (8h):
                          </span>
                          <p className="text-sm font-extrabold text-blue-600">
                            ₹{driver.baseRateFullDay}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-100 flex gap-2">
                      <Link
                        href={`/drivers/${driver.id}`}
                        className="flex-1"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full font-semibold"
                        >
                          View Profile
                        </Button>
                      </Link>
                      <Link
                        href={`/book?driverId=${driver.id}`}
                        className="flex-1"
                      >
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full font-bold"
                        >
                          Book Now
                        </Button>
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
