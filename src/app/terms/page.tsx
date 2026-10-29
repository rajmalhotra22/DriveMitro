import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12 text-left">
          <div className="text-center space-y-4">
            <Badge variant="navy">Legal Terms</Badge>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight sm:text-5xl">
              Terms of Service
            </h1>
            <p className="text-sm text-slate-500">
              Last updated: October 2026 • Patna, Bihar
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
            <h3 className="text-lg font-bold text-slate-900">
              1. Platform Nature & Scope
            </h3>
            <p>
              DriveMitro operates an on-demand marketplace connecting private vehicle owners with verified personal chauffeurs. DriveMitro does not own, lease, or operate commercial passenger vehicles. All journeys are conducted in vehicles owned or lawfully possessed by the customer.
            </p>

            <h3 className="text-lg font-bold text-slate-900">
              2. Vehicle Owner Responsibilities
            </h3>
            <p>
              The customer warrants that the vehicle provided is legally registered with appropriate RTO authorities, possesses a valid pollution under control (PUC) certificate, and carries active comprehensive motor insurance coverage. The customer must not instruct the chauffeur to violate traffic rules, exceed permissible speed limits, or carry contraband.
            </p>

            <h3 className="text-lg font-bold text-slate-900">
              3. Chauffeur Standards & Independent Contractor Relationship
            </h3>
            <p>
              Chauffeurs matched through DriveMitro are independent professionals who have completed identity verification, background screening, and driving record checks. They are bound by professional conduct rules, sobriety requirements, and non-smoking guidelines while in charge of a customer&apos;s vehicle.
            </p>

            <h3 className="text-lg font-bold text-slate-900">
              4. Fare Calculation & Surcharges
            </h3>
            <p>
              Fares are computed authoritatively on our platform based on selected service tiers (hourly, half-day, full-day, airport transfer, or outstation). Fares exclude road tolls, parking fees, and vehicle fuel, which are the customer&apos;s direct responsibility.
            </p>

            <h3 className="text-lg font-bold text-slate-900">
              5. Prototype & Demo Disclaimer
            </h3>
            <p>
              This web platform represents a student engineering MVP and startup prototype. Seeded driver records and demo payment functions are provided for testing purposes.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
