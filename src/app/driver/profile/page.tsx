"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DriverNav } from "@/components/layout/DriverNav";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { User, MapPin, Car, CheckCircle2 } from "lucide-react";
import { PATNA_SERVICE_AREAS } from "@/lib/pricing/config";

export default function DriverProfilePage() {
  const [driver, setDriver] = useState<any>(null);
  const [bio, setBio] = useState("");
  const [areas, setAreas] = useState<string[]>([]);
  const [vehicles, setVehicles] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user?.driverProfile) {
          const p = data.user.driverProfile;
          setDriver(p);
          setBio(p.bio || "");
          setAreas(p.serviceAreas || []);
          setVehicles(p.vehiclePreferences || []);
        }
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/driver/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio,
          serviceAreas: areas,
          vehiclePreferences: vehicles,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const toggleArea = (area: string) => {
    if (areas.includes(area)) {
      setAreas(areas.filter((a) => a !== area));
    } else {
      setAreas([...areas, area]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          <div className="border-b border-slate-200 pb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Chauffeur Public Profile
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              This information is shown to car owners browsing the DriveMitro marketplace in Patna
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <DriverNav />

            <div className="flex-1 space-y-6 w-full">
              {saved && (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Your public chauffeur profile has been saved!</span>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-6">
                <Card className="p-6 border-slate-200 space-y-4">
                  <h3 className="text-base font-bold text-slate-900">
                    Chauffeur Bio & Experience Summary
                  </h3>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell car owners about your driving record, VIP protocol experience, and highway expertise..."
                    className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </Card>

                <Card className="p-6 border-slate-200 space-y-4">
                  <h3 className="text-base font-bold text-slate-900">
                    Patna Service Localities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {PATNA_SERVICE_AREAS.map((area) => (
                      <button
                        type="button"
                        key={area}
                        onClick={() => toggleArea(area)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                          areas.includes(area)
                            ? "bg-blue-600 border-blue-600 text-white font-bold"
                            : "bg-white border-slate-200 text-slate-700"
                        }`}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </Card>

                <Button type="submit" size="lg" isLoading={saving} className="font-bold">
                  Save Chauffeur Profile
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
