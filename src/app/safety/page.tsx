import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  ShieldCheck,
  FileCheck,
  AlertTriangle,
  Lock,
  PhoneCall,
  Share2,
  Car,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function SafetyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16 text-left">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <Badge variant="success">Trust & Security</Badge>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight sm:text-5xl">
              Your Vehicle&apos;s Safety is Our Highest Mandate
            </h1>
            <p className="text-lg text-slate-600">
              Handing over your personal car keys requires total trust. Here is how DriveMitro verifies, assesses, and monitors every chauffeur in Patna.
            </p>
          </div>

          {/* 4 Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 space-y-3">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                1. Multi-Step Chauffeur Verification
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Chauffeurs cannot merely sign up and become verified. Every applicant must submit valid driving license records checked against RTO data, Aadhaar identity verification, and local police station character certificates.
              </p>
            </Card>

            <Card className="p-8 space-y-3">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Car className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                2. Practical Driving Assessment
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                We verify manual and automatic transmission competencies, smooth braking, reverse parking discipline, and road etiquette for Patna&apos;s crowded lanes (Boring Canal, Ashok Rajpath, Gandhi Maidan).
              </p>
            </Card>

            <Card className="p-8 space-y-3">
              <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Share2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                3. Share Booking Details with Family
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every booking generates a unique reference code (e.g. DM-PAT-837492) that can be shared via WhatsApp with family members, showing the assigned driver&apos;s verified name, photo, and phone number.
              </p>
            </Card>

            <Card className="p-8 space-y-3">
              <div className="h-12 w-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <PhoneCall className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                4. 24/7 Patna Emergency Escalation
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Direct phone helpline (+91 98350 12345) and in-app support ticketing. In case of unexpected car breakdown, medical urgency, or driver route dispute, our response desk intervenes immediately.
              </p>
            </Card>
          </div>

          {/* Legal and Insurance Notice */}
          <div className="rounded-3xl border border-amber-200 bg-amber-50/70 p-8 space-y-4">
            <div className="flex items-center gap-2.5 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
              <h4 className="text-lg font-bold">
                Operational Legal & Insurance Disclosure
              </h4>
            </div>
            <p className="text-sm text-amber-900 leading-relaxed">
              In accordance with ethical consumer transparency: In this initial prototype phase, DriveMitro acts as a digital matching platform for verified personal drivers. DriveMitro does not own vehicles or directly issue insurance policies. The vehicle owner&apos;s existing comprehensive motor insurance policy remains primary. Before commercial commercial operations are enabled in Patna, partner fleet insurance coverage and statutory transportation permits will be formalized.
            </p>
          </div>

          {/* Incident reporting CTA */}
          <div className="rounded-3xl bg-[#0B192C] text-white p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Report a Safety Concern or Incident</h3>
              <p className="text-xs text-slate-300 max-w-lg">
                Did a chauffeur fail to adhere to traffic regulations or behave inappropriately? Submit a support ticket for immediate investigation.
              </p>
            </div>
            <Link href="/contact">
              <Button size="lg" className="bg-red-600 hover:bg-red-500 font-bold whitespace-nowrap">
                Contact Safety Desk
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
