import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { CheckCircle2, ShieldCheck, Car } from "lucide-react";

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <Badge variant="navy">Driver Marketplace</Badge>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight sm:text-5xl">
              Professional Driver Services in Patna
            </h1>
            <p className="text-lg text-slate-600">
              Select the right chauffeur service for your private car. Every booking includes full background verification and dedicated customer support.
            </p>
          </div>

          <ServicesGrid />

          {/* Service Comparison Matrix */}
          <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
              Service Comparison & Inclusions
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-3 px-4">Service Type</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Starting Rate</th>
                    <th className="py-3 px-4">Ideal For</th>
                    <th className="py-3 px-4">Driver Food Allowance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Hourly Commute</td>
                    <td className="py-3.5 px-4">Min 2 Hours</td>
                    <td className="py-3.5 px-4 text-blue-600 font-bold">₹149 / hr</td>
                    <td className="py-3.5 px-4">Market errands, doctor visits</td>
                    <td className="py-3.5 px-4 text-slate-400">Not Applicable</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Half-Day Package</td>
                    <td className="py-3.5 px-4">4 Hours</td>
                    <td className="py-3.5 px-4 text-blue-600 font-bold">₹549 flat</td>
                    <td className="py-3.5 px-4">Shopping, client visits</td>
                    <td className="py-3.5 px-4 text-slate-400">Not Applicable</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Full-Day Chauffeur</td>
                    <td className="py-3.5 px-4">8 Hours</td>
                    <td className="py-3.5 px-4 text-blue-600 font-bold">₹999 flat</td>
                    <td className="py-3.5 px-4">Family visits, city exploration</td>
                    <td className="py-3.5 px-4 text-slate-400">Not Applicable</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Airport Transfer</td>
                    <td className="py-3.5 px-4">Fixed Trip</td>
                    <td className="py-3.5 px-4 text-blue-600 font-bold">₹499 flat</td>
                    <td className="py-3.5 px-4">Jayprakash Narayan Airport</td>
                    <td className="py-3.5 px-4 text-slate-400">Not Applicable</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Outstation Journey</td>
                    <td className="py-3.5 px-4">Full Day / Multi-Day</td>
                    <td className="py-3.5 px-4 text-blue-600 font-bold">₹1,499 / day</td>
                    <td className="py-3.5 px-4">Bodh Gaya, Rajgir, Varanasi</td>
                    <td className="py-3.5 px-4 text-emerald-600 font-medium">₹400 / day included</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Monthly Dedicated</td>
                    <td className="py-3.5 px-4">26 Days</td>
                    <td className="py-3.5 px-4 text-blue-600 font-bold">₹11,999 / mo</td>
                    <td className="py-3.5 px-4">Daily executive & family driver</td>
                    <td className="py-3.5 px-4 text-slate-400">Custom Agreement</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
