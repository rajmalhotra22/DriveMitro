"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DashboardNav } from "@/components/layout/DashboardNav";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { User, Phone, Mail, ShieldCheck, CheckCircle2, Car } from "lucide-react";

export default function CustomerProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emergencyRelation, setEmergencyRelation] = useState("Spouse");
  const [carOwned, setCarOwned] = useState("Honda City (Petrol)");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setProfile(data.user);
          setName(data.user.name || "");
          setPhone(data.user.phone || "");
          setEmergencyName(data.user.emergencyContact?.name || "Sunita Verma");
          setEmergencyPhone(data.user.emergencyContact?.phone || "9876543211");
          setEmergencyRelation(data.user.emergencyContact?.relation || "Spouse");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    // Save profile simulation
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          <div className="border-b border-slate-200 pb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Customer Profile & Security
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage your personal info, emergency contacts, and vehicle preferences
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <DashboardNav />

            <div className="flex-1 space-y-6 w-full">
              {success && (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Profile and emergency preferences updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-6">
                {/* Basic Info */}
                <Card className="p-6 border-slate-200 space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <span>Personal Information</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 p-2.5"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 p-2.5"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Registered Email
                      </label>
                      <input
                        type="email"
                        disabled
                        value={profile?.email || "customer@drivemitro.com"}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-400 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Primary Vehicle
                      </label>
                      <input
                        type="text"
                        value={carOwned}
                        onChange={(e) => setCarOwned(e.target.value)}
                        placeholder="e.g. Hyundai Creta / Honda City"
                        className="w-full rounded-xl border border-slate-200 p-2.5"
                      />
                    </div>
                  </div>
                </Card>

                {/* Emergency Contact */}
                <Card className="p-6 border-slate-200 space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    <span>Safety & Emergency Contact</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    This contact can receive SOS trip status notifications in case of route emergencies.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Emergency Contact Name
                      </label>
                      <input
                        type="text"
                        value={emergencyName}
                        onChange={(e) => setEmergencyName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 p-2.5"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 p-2.5"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Relationship
                      </label>
                      <select
                        value={emergencyRelation}
                        onChange={(e) => setEmergencyRelation(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 p-2.5"
                      >
                        <option value="Spouse">Spouse</option>
                        <option value="Parent">Parent</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Colleague">Colleague</option>
                      </select>
                    </div>
                  </div>
                </Card>

                <Button type="submit" size="lg" isLoading={saving} className="font-bold">
                  Save Changes
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
