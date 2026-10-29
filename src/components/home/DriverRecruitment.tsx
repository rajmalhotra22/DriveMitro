import React from "react";
import Link from "next/link";
import {
  Wallet,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Award,
} from "lucide-react";
import { Button } from "../ui/Button";

export function DriverRecruitment() {
  const benefits = [
    {
      title: "Earn ₹25,000 to ₹40,000+ Monthly",
      desc: "Transparent 90% payout on every completed trip with zero unfair deductions.",
      icon: Wallet,
    },
    {
      title: "Total Schedule Flexibility",
      desc: "Choose when you want to work. Turn your availability online or offline anytime from your chauffeur dashboard.",
      icon: Clock,
    },
    {
      title: "Drive High-End Private Cars",
      desc: "No car investment required. Drive customer-owned sedans, SUVs, and luxury vehicles.",
      icon: Award,
    },
    {
      title: "Respect & Professional Recognition",
      desc: "Earn high customer ratings, build a loyal base of repeat car owners, and unlock premium badges.",
      icon: ShieldCheck,
    },
  ];

  const eligibility = [
    "Valid Commercial / LMV Driving License (minimum 3 years driving experience)",
    "Clean criminal record & police verification clearance",
    "Familiarity with Patna roads & national highways in Bihar",
    "Polite demeanor, professional etiquette, and smartphone familiarity",
  ];

  return (
    <section className="py-20 bg-[#0B192C] text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 -z-0 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Benefits */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-900/30 px-3.5 py-1.5 text-xs font-semibold text-blue-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span>Chauffeur Partners Wanted in Patna</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Earn Respect & Consistent Income as a Verified Chauffeur
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Have a valid driving license and disciplined driving skills? Partner with DriveMitro to drive private car owners across Patna. Keep 90% of trip fares and enjoy instant daily payouts.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {benefits.map((b, i) => {
                const Icon = b.icon;
                return (
                  <div key={i} className="flex gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">
                        {b.title}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {b.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Eligibility & Registration Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-slate-700 bg-slate-800/80 p-6 sm:p-8 backdrop-blur-md shadow-2xl text-left">
              <h3 className="text-xl font-bold text-white mb-2">
                Chauffeur Eligibility
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                To guarantee safety, all partner chauffeurs must fulfill:
              </p>

              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                {eligibility.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="rounded-2xl bg-blue-950/60 border border-blue-800/50 p-4 mb-6">
                <p className="text-xs font-semibold text-blue-200">
                  3-Step Onboarding:
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  1. Submit online application → 2. Verification review by Admin → 3. Start receiving trip offers.
                </p>
              </div>

              <Link href="/driver/register">
                <Button
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Register as a Driver
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
