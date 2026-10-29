import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12 text-left">
          <div className="text-center space-y-4">
            <Badge variant="navy">Data Protection</Badge>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="text-sm text-slate-500">
              Commitment to safeguarding your personal information in Patna, Bihar
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
            <h3 className="text-lg font-bold text-slate-900">
              1. Information We Collect
            </h3>
            <p>
              We collect strictly necessary details required for booking coordination: customer name, contact phone number, email address, pickup and destination addresses in Patna, and car model preferences. We do not store sensitive payment card details or unencrypted passwords.
            </p>

            <h3 className="text-lg font-bold text-slate-900">
              2. Chauffeur Document Privacy
            </h3>
            <p>
              Chauffeur government identity records (Aadhaar, driving license documents) submitted during verification are stored securely on private backend repositories and are accessible solely by authorized administrative personnel for background verification. They are never published openly on public URLs.
            </p>

            <h3 className="text-lg font-bold text-slate-900">
              3. Data Retention & Sharing
            </h3>
            <p>
              We never sell or distribute customer contact details to third-party telemarketers. Trip contact details are shared exclusively between the assigned driver and booking customer for the duration of the confirmed trip.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
