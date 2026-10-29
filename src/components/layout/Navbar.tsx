"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Car,
  ShieldCheck,
  Menu,
  X,
  Bell,
  LogOut,
  User as UserIcon,
  ChevronDown,
  LayoutDashboard,
  Compass,
} from "lucide-react";
import { Button } from "../ui/Button";

interface NavUser {
  id: string;
  name: string;
  email: string;
  role: "customer" | "driver" | "admin";
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<NavUser | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          // Fetch unread notifications
          fetch("/api/notifications")
            .then((r) => r.json())
            .then((nData) => {
              if (nData?.unreadCount) setUnreadCount(nData.unreadCount);
            })
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setUserDropdownOpen(false);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const getDashboardLink = () => {
    if (!user) return "/dashboard";
    if (user.role === "admin") return "/admin";
    if (user.role === "driver") return "/driver/dashboard";
    return "/dashboard";
  };

  const navLinks = [
    { label: "Find a Driver", href: "/drivers" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Services", href: "/services" },
    { label: "Safety", href: "/safety" },
    { label: "Become a Driver", href: "/driver/register" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B192C] text-white shadow-md shadow-blue-900/10 transition-transform group-hover:scale-105">
            <Car className="h-6 w-6 text-blue-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-[#0B192C] flex items-center gap-1">
              DriveMitro
              <span className="inline-block w-2 h-2 rounded-full bg-blue-600"></span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
              Patna Mobility
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-slate-100 text-blue-700 font-bold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action / Auth CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2 relative">
              {/* Notification icon */}
              <Link
                href={
                  user.role === "admin"
                    ? "/admin"
                    : user.role === "driver"
                    ? "/driver/dashboard"
                    : "/dashboard/notifications"
                }
                className="relative rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </Link>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="max-w-[110px] truncate">{user.name}</span>
                  <span className="rounded bg-blue-600/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-blue-700">
                    {user.role}
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs text-slate-400 font-medium">
                        Signed in as
                      </p>
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href={getDashboardLink()}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      <LayoutDashboard className="h-4 w-4 text-blue-600" />
                      Dashboard
                    </Link>
                    <Link
                      href="/drivers"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      <Compass className="h-4 w-4 text-emerald-600" />
                      Browse Drivers
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-red-600 hover:bg-red-50 font-medium text-left mt-1 border-t border-slate-100 pt-2"
                    >
                      <LogOut className="h-4 w-4 text-red-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>

              <Link href="/book">
                <Button variant="secondary" size="sm" className="font-bold">
                  Book Driver
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-semibold">
                  Sign In
                </Button>
              </Link>
              <Link href="/book">
                <Button
                  variant="primary"
                  size="sm"
                  className="font-bold shadow-md shadow-blue-900/10"
                >
                  Book a Driver
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {user && (
            <Link
              href={getDashboardLink()}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-800"
            >
              <UserIcon className="h-4 w-4" />
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl p-2 text-slate-700 hover:bg-slate-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-4">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-semibold text-slate-800 hover:bg-slate-50 hover:text-blue-600"
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
              {user ? (
                <>
                  <Link
                    href={getDashboardLink()}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      Go to {user.role.toUpperCase()} Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full justify-start gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out ({user.name})
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link
                    href="/book"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="primary" className="w-full font-bold">
                      Book a Driver
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
