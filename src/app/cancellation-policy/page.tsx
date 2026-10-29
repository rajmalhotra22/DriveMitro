import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ShieldCheck, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function CancellationPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12 text-left">
          <div className="text-center space-y-4">
            <Badge variant="navy">Customer Fair Terms</Badge>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight sm:text-5xl">
              Cancellation & Refund Policy
            </h1>
            <p className="text-base text-slate-600">
              Clear, transparent, and fair cancellation guidelines for Patna car owners and driver partners.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm space-y-8 text-sm text-slate-700 leading-relaxed">
            <section className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                1. Free Cancellation (More than 2 hours before pickup)
              </h3>
              <p>
                Plans change, and we understand. If you cancel your booking more than 2 hours prior to the scheduled pickup time, zero cancellation fee is applied. If paid via digital mode, 100% of the fare is refunded immediately to your source account.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-600" />
                2. Late Cancellation (Within 2 hours of pickup)
              </h3>
              <p>
                When a customer cancels within 2 hours of pickup, the assigned driver has already set aside their shift and begun commuting to your location in Patna. A flat compensation fee of ₹150 is charged. This amount is directly transferred to the chauffeur to respect their time and travel expense.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                3. Post-Arrival & In-Progress Trips
              </h3>
              <p>
                Once a chauffeur has arrived at your pickup address or the trip has commenced, the minimum booking duration (2 hours or the package base fare) is payable in full.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                4. Driver-Initiated Cancellation
              </h3>
              <p>
                In the rare instance where an assigned driver cannot reach you due to sudden illness, mechanical delay, or road obstruction, DriveMitro automatically re-dispatches an alternate verified chauffeur in your Patna locality at zero penalty, or refunds 100% of your amount.
              </p>
            </section>
          </div>

          <div className="text-center">
            <Link href="/book">
              <Button size="lg" className="font-bold">
                Book a Driver with Confidence
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
