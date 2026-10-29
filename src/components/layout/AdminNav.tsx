"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  UserCheck,
  Users,
  Banknote,
  Star,
  LifeBuoy,
  FileText,
  Settings,
} from "lucide-react";

export function AdminNav() {
  const pathname = usePathname();

  const links = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Bookings", href: "/admin/bookings", icon: CalendarDays },
    { label: "Drivers", href: "/admin/drivers", icon: UserCheck },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Pricing Engine", href: "/admin/pricing", icon: Banknote },
    { label: "Reviews", href: "/admin/reviews", icon: Star },
    { label: "Support Tickets", href: "/admin/support", icon: LifeBuoy },
    { label: "Audit Logs", href: "/admin/audit-logs", icon: FileText },
    { label: "Settings & Reset", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col gap-6 w-full lg:w-64 shrink-0">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="px-3 py-2 mb-2 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Admin Console
          </p>
          <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">
            SECURE
          </span>
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
    </div>
  );
}
