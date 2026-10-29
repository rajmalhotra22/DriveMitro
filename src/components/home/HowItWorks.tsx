import React from "react";
import { MapPin, Users, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/Button";

export function HowItWorks() {
  const steps = [
    {
      stepNumber: "01",
      title: "Tell Us When & Where",
      description:
        "Select your pickup neighborhood in Patna (Boring Road, Kankarbagh, Bailey Rd, etc.), choose your car type, and specify whether you need an hourly or outstation chauffeur.",
      icon: MapPin,
    },
    {
      stepNumber: "02",
      title: "Compare Verified Drivers",
      description:
        "View detailed chauffeur profiles, years of experience, vehicle transmission proficiencies (Manual vs Automatic), transparent hourly rates, and genuine customer ratings.",
      icon: Users,
    },
    {
      stepNumber: "03",
      title: "Confirm & Track Real-Time",
      description:
        "Get instant booking confirmation with an itemized price breakdown. Track your assigned driver's dispatch status and pay effortlessly via cash or demo digital option.",
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How DriveMitro Works
          </h2>
          <p className="text-base text-slate-600">
            Booking a professional driver for your private car takes less than 60 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl bg-white p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-14 w-14 rounded-2xl bg-[#0B192C] text-blue-400 flex items-center justify-center shadow-md">
                      <Icon className="h-7 w-7" />
                    </div>
                    <span className="text-4xl font-black text-slate-200">
                      {step.stepNumber}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-blue-600">
                  <span>Step {step.stepNumber} of 03</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link href="/book">
            <Button size="lg" className="font-bold">
              Try It Now — Book a Driver
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
