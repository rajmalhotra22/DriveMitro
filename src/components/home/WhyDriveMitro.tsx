import React from "react";
import {
  ShieldCheck,
  BadgeIndianRupee,
  Smartphone,
  Heart,
  BellRing,
  Headphones,
} from "lucide-react";

export function WhyDriveMitro() {
  const features = [
    {
      title: "RTO & Police Verified Profiles",
      description:
        "Every driver profile lists verified driving license numbers, years of road experience, and language proficiencies before assignment.",
      icon: ShieldCheck,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "100% Transparent Upfront Rates",
      description:
        "No hidden surge or unexpected driver demands. Authoritative itemized calculation with clear night surcharge rules and GST breakdown.",
      icon: BadgeIndianRupee,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Frictionless Booking in 60s",
      description:
        "Simple pickup location picker, instant time slot selection, and immediate dispatch without requiring paid credit cards or subscription fees.",
      icon: Smartphone,
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      title: "Save Favorite Preferred Drivers",
      description:
        "Found a chauffeur who handles your vehicle with utmost care? Save them to your favorites and request them directly for future trips.",
      icon: Heart,
      color: "text-rose-600 bg-rose-50",
    },
    {
      title: "Live Booking Status Progression",
      description:
        "Track your trip progression through verified checkpoints: Driver Assigned, En Route, Arrived, In Progress, and Completed.",
      icon: BellRing,
      color: "text-amber-600 bg-amber-50",
    },
    {
      title: "Local Patna Support Desk",
      description:
        "Dedicated in-app support ticketing desk and direct WhatsApp customer helpline for quick assistance and route adjustments.",
      icon: Headphones,
      color: "text-purple-600 bg-purple-50",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            Why DriveMitro
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Built For Patna Car Owners Who Value Peace of Mind
          </h2>
          <p className="text-base text-slate-600">
            We don&apos;t rent cars; we empower you to enjoy your own vehicle from the comfort of the back seat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200/80 p-6 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all duration-200"
              >
                <div
                  className={`h-12 w-12 rounded-xl flex items-center justify-center mb-5 ${item.color}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
