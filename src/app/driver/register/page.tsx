"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Car,
  Lock,
  Mail,
  User,
  Phone,
  ShieldCheck,
  FileText,
  Award,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PATNA_SERVICE_AREAS } from "@/lib/pricing/config";

export default function DriverRegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [yearsExperience, setYearsExperience] = useState("5");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseExpiry, setLicenseExpiry] = useState("2035-08-15");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([
    "Boring Road",
    "Bailey Road",
  ]);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([
    "Manual",
    "Automatic",
    "Sedan",
  ]);
  const [languages, setLanguages] = useState<string[]>(["Hindi", "Bhojpuri"]);
  const [bio, setBio] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAreaToggle = (area: string) => {
    if (selectedAreas.includes(area)) {
      setSelectedAreas(selectedAreas.filter((a) => a !== area));
    } else {
      setSelectedAreas([...selectedAreas, area]);
    }
  };

  const handleVehicleToggle = (v: string) => {
    if (selectedVehicles.includes(v)) {
      setSelectedVehicles(selectedVehicles.filter((item) => item !== v));
    } else {
      setSelectedVehicles([...selectedVehicles, v]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agreeTerms) {
      setError("Please confirm adherence to Driver Code of Conduct & terms.");
      return;
    }

    if (!licenseNumber) {
      setError("Please enter your valid Commercial / LMV Driving License Number.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name,
        email,
        phone,
        password,
        role: "driver",
        driverDetails: {
          bio: bio || `${yearsExperience} years experienced personal chauffeur in Patna.`,
          yearsExperience: Number(yearsExperience),
          licenseNumber,
          licenseExpiry,
          serviceAreas: selectedAreas,
          vehiclePreferences: selectedVehicles,
          languages,
        },
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Driver registration failed.");
      }

      router.push("/driver/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-8 text-left">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B192C] text-emerald-400 shadow-md">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Chauffeur Partner Onboarding
            </h1>
            <p className="text-xs text-slate-500">
              Join DriveMitro in Patna • Drive private customer cars & earn 90% of trip fares
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl space-y-6">
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 flex items-start gap-2.5">
              <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Honest Verification Workflow Notice</p>
                <p className="mt-0.5 text-amber-800">
                  Submitting this application creates your partner account with <strong>Pending Verification</strong> status. You will only appear in the public driver directory and receive dispatch trips once an authorized admin verifies your RTO license and background check.
                </p>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs font-semibold text-red-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 border-b pb-2">
                  1. Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Manoj Kumar Yadav"
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Mobile Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98351 23456"
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="driver@example.com"
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* License Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 border-b pb-2">
                  2. Driving Credentials & Experience
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      DL Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value.toUpperCase())}
                      placeholder="BR-01-20180098765"
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-mono uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      License Expiry *
                    </label>
                    <input
                      type="date"
                      required
                      value={licenseExpiry}
                      onChange={(e) => setLicenseExpiry(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Years Experience *
                    </label>
                    <select
                      value={yearsExperience}
                      onChange={(e) => setYearsExperience(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
                    >
                      <option value="3">3 Years</option>
                      <option value="5">5 Years</option>
                      <option value="8">8 Years</option>
                      <option value="10">10+ Years</option>
                    </select>
                  </div>
                </div>

                {/* Vehicle Transmission checkboxes */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Vehicle Transmissions & Types You Can Drive
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Manual", "Automatic", "Hatchback", "Sedan", "SUV", "Luxury"].map((v) => (
                      <button
                        type="button"
                        key={v}
                        onClick={() => handleVehicleToggle(v)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                          selectedVehicles.includes(v)
                            ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                            : "border-slate-200 bg-white text-slate-600"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Patna Service Areas */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Preferred Patna Localities (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 border rounded-xl bg-slate-50">
                    {PATNA_SERVICE_AREAS.map((area) => (
                      <button
                        type="button"
                        key={area}
                        onClick={() => handleAreaToggle(area)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                          selectedAreas.includes(area)
                            ? "bg-blue-600 text-white font-bold"
                            : "bg-white text-slate-700 border border-slate-200"
                        }`}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Short Chauffeur Bio / Highway Experience
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="e.g. 8 years disciplined driver across Patna, specializing in smooth night driving and outstation family travel..."
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="driverTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 accent-emerald-600 rounded"
                />
                <label htmlFor="driverTerms" className="text-xs text-slate-600">
                  I agree to the Driver Code of Conduct, confirm zero criminal records, and understand that admin approval is mandatory before receiving bookings.
                </label>
              </div>

              <Button
                type="submit"
                size="lg"
                isLoading={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                Submit Partner Application
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
