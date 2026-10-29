"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Clock,
  Wallet,
  Calendar,
  ShieldCheck,
  User,
} from "lucide-react";

export function DriverNav() {
  const pathname = usePathname();

  const links = [
    { label: "Driver Command", href: "/driver/dashboard", icon: LayoutDashboard },
    { label: "My Trips", href: "/driver/bookings", icon: CalendarCheck },
    { label: "Trip Requests", href: "/driver/requests", icon: Clock },
    { label: "Availability", href: "/driver/availability", icon: Calendar },
    { label: "My Earnings", href: "/driver/earnings", icon: Wallet },
    { label: "Verification", href: "/driver/verification", icon: ShieldCheck },
    { label: "Public Profile", href: "/driver/profile", icon: User },
  ];

  return (
    <div className="flex flex-col gap-6 w-full lg:w-64 shrink-0">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="px-3 py-2 mb-2 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Chauffeur Desk
          </p>
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
        <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-[#0B192C] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-emerald-400" : "text-slate-500"}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
