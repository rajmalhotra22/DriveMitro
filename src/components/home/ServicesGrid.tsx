import React from "react";
import Link from "next/link";
import {
  Clock,
  Compass,
  CalendarDays,
  Plane,
  Car,
  Repeat,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

export function ServicesGrid() {
  const services = [
    {
      type: "hourly",
      title: "Hourly Chauffeur",
      tagline: "Short trips, grocery errands & clinic visits",
      price: "₹149/hr",
      minDuration: "Min 2 Hours",
      icon: Clock,
      features: [
        "Pay strictly for the hours used",
        "Multiple stops across Patna",
        "Expert parking & waiting assistance",
      ],
      badge: "Most Popular",
      badgeVariant: "info" as const,
      link: "/book?type=hourly",
    },
    {
      type: "half_day",
      title: "Half-Day Package",
      tagline: "Shopping sprees, meetings & weddings",
      price: "₹549 flat",
      minDuration: "Up to 4 Hours",
      icon: Compass,
      features: [
        "Economical bundled 4-hour slot",
        "Extra hours charged at ₹149/hr",
        "Ideal for Maurya Lok & Fraser Rd errands",
      ],
      badge: "Great Value",
      badgeVariant: "neutral" as const,
      link: "/book?type=half_day",
    },
    {
      type: "full_day",
      title: "Full-Day Chauffeur",
      tagline: "All-day family travels & client tours",
      price: "₹999 flat",
      minDuration: "8 Full Hours",
      icon: CalendarDays,
      features: [
        "Continuous 8-hour chauffeur availability",
        "Danapur, Kankarbagh & City outskirts",
        "Stress-free zero parking fatigue",
      ],
      badge: "Best for Families",
      badgeVariant: "success" as const,
      link: "/book?type=full_day",
    },
    {
      type: "airport",
      title: "Patna Airport (PAT) Express",
      tagline: "Jayprakash Narayan Airport transfers",
      price: "₹499 flat",
      minDuration: "Fixed Point-to-Point",
      icon: Plane,
      features: [
        "Flight delay & schedule buffer",
        "Luggage loading & unloading help",
        "Drop right at departure gate",
      ],
      badge: "Fixed Price",
      badgeVariant: "navy" as const,
      link: "/book?type=airport",
    },
    {
      type: "outstation",
      title: "Outstation Bihar Journeys",
      tagline: "Bodh Gaya, Rajgir, Darbhanga & beyond",
      price: "₹1,499/day",
      minDuration: "Single or Multi-Day",
      icon: Car,
      features: [
        "Experienced national highway drivers",
        "Driver food allowance included/calculated",
        "Safe night highway discipline",
      ],
      badge: "Highway Specialists",
      badgeVariant: "warning" as const,
      link: "/book?type=outstation",
    },
    {
      type: "recurring",
      title: "Monthly Dedicated Driver",
      tagline: "Daily office commutes & school runs",
      price: "From ₹11,999/mo",
      minDuration: "26 Days/Month",
      icon: Repeat,
      features: [
        "Consistent verified personal chauffeur",
        "Backup driver guarantee on leaves",
        "Custom hours for your family schedule",
      ],
      badge: "Corporate & Regular",
      badgeVariant: "info" as const,
      link: "/book?type=recurring",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="navy" className="uppercase tracking-widest text-[10px]">
            Tailored For Car Owners
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Flexible Driver Services in Patna
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Whether you need a chauffeur for two hours of city shopping or a multi-day highway tour to Rajgir, choose the exact package that fits your schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <Card
                key={svc.type}
                hoverEffect
                className="flex flex-col justify-between border-slate-200/90 relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center transition-transform group-hover:scale-110">
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant={svc.badgeVariant}>{svc.badge}</Badge>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    {svc.title}
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">{svc.tagline}</p>

                  <div className="rounded-xl bg-slate-50 p-3 mb-5 border border-slate-100 flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-black text-slate-900">
                        {svc.price}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">
                      {svc.minDuration}
                    </span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                    {svc.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    href={svc.link}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B192C] px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-600 shadow-sm"
                  >
                    <span>Book {svc.title.split(" ")[0]}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
