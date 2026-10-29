import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Car, Users, Target, HeartHandshake, MapPin } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12 text-left">
          <div className="text-center space-y-4">
            <Badge variant="navy">Our Story & Mission</Badge>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight sm:text-5xl">
              About DriveMitro
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Empowering car owners across Patna to enjoy their private vehicles without the exhaustion of city traffic and highway fatigue.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
            <h2 className="text-2xl font-bold text-slate-900">
              The Idea: Your Car. Your Driver. Your Way.
            </h2>
            <p>
              In growing tier-2 cities like Patna, car ownership has expanded tremendously. Families own comfortable hatchbacks, sedans, and SUVs. Yet, dense traffic along Bailey Road, tight parking bottlenecks in Boring Road and Fraser Road, and nighttime exhaustion on national highways mean that car owners often leave their vehicles parked and struggle with irregular public transit.
            </p>
            <p>
              At the same time, hundreds of skilled, disciplined professional chauffeurs across Bihar seek dignified, steady livelihood opportunities without vehicle debt.
            </p>
            <p>
              DriveMitro bridges this gap as an on-demand personal driver marketplace. We match background-verified chauffeurs with car owners on an hourly, daily, or outstation basis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Our Mission</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Make reliable, polite chauffeur services as accessible and effortless as tapping a smartphone screen in Patna.
              </p>
            </Card>

            <Card className="p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Driver Dignity</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chauffeurs earn 90% of trip fares with transparent pricing, respectful passenger guidelines, and zero predatory platform deductions.
              </p>
            </Card>

            <Card className="p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Patna First</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tailored specifically for the unique road network, localities, and outstation corridors of Bihar.
              </p>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
