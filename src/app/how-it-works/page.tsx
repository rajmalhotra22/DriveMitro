import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import {
  ShieldCheck,
  CreditCard,
  PhoneCall,
  Clock,
  Car,
  AlertCircle,
} from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4">
            <Badge variant="navy">Complete Guide</Badge>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight sm:text-5xl">
              How DriveMitro Works
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to know about hiring background-checked personal drivers for your car in Patna.
            </p>
          </div>

          {/* Core steps */}
          <HowItWorks />

          {/* Details breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <Card className="p-8 space-y-4">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Car className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                What Car Owners Provide
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                You provide the vehicle with adequate fuel, valid registration certificate (RC), and active motor insurance. Our chauffeurs take over all driving stress, navigation, and tight parking maneuvers.
              </p>
            </Card>

            <Card className="p-8 space-y-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                What DriveMitro Guarantees
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                A verified, polite, and punctual chauffeur trained in passenger protocol. If your assigned driver faces an unavoidable emergency, our dispatch team offers prompt replacement assistance.
              </p>
            </Card>

            <Card className="p-8 space-y-4">
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <CreditCard className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Transparent Trip Billing
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Billing begins only when the chauffeur arrives at your pickup location and your trip is marked started. No guesswork or unexpected cash demands at the end of the trip.
              </p>
            </Card>

            <Card className="p-8 space-y-4">
              <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <PhoneCall className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                24/7 Patna Support Desk
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Need to extend your booking duration by two hours while at a family wedding? Need a quick route detour? Our local team coordinates seamlessly with your chauffeur.
              </p>
            </Card>
          </div>

          <div className="rounded-3xl bg-[#0B192C] text-white p-8 sm:p-12 text-center space-y-6">
            <h2 className="text-3xl font-black">Ready to Enjoy the Ride?</h2>
            <p className="text-slate-300 max-w-xl mx-auto text-sm leading-relaxed">
              Experience the freedom of having your personal chauffeur whenever you step into your car.
            </p>
            <Link href="/book">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-500 font-bold">
                Book Your First Trip Now
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
