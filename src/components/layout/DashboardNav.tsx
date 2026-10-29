"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Heart,
  User,
  Bell,
  PlusCircle,
} from "lucide-react";

export function DashboardNav() {
  const pathname = usePathname();

  const links = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Bookings", href: "/dashboard/bookings", icon: CalendarDays },
    { label: "Favorite Drivers", href: "/dashboard/favorites", icon: Heart },
    { label: "My Profile", href: "/dashboard/profile", icon: User },
    { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  ];

  return (
    <div className="flex flex-col gap-6 w-full lg:w-64 shrink-0">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="px-3 py-2 mb-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Customer Portal
          </p>
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
                <Icon className={`h-4 w-4 ${isActive ? "text-blue-400" : "text-slate-500"}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="hidden lg:block rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50/40 p-5 text-left">
        <h4 className="text-sm font-bold text-slate-900 mb-1">Need a Driver Now?</h4>
        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          Book verified chauffeurs for instant hourly or outstation journeys in Patna.
        </p>
        <Link
          href="/book"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          Book New Trip
        </Link>
      </div>
    </div>
  );
}
