import React from "react";
import Link from "next/link";
import {
  Car,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#0B192C] text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand info */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
                <Car className="h-5 w-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                DriveMitro<span className="text-blue-500">.</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              Your Car. Your Driver. Your Way. Explore a sample personal-driver
              booking experience for Patna. This prototype is not currently taking
              live bookings.
            </p>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Driver Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/book?type=hourly"
                  className="hover:text-blue-400 transition-colors"
                >
                  Hourly Commute Chauffeur
                </Link>
              </li>
              <li>
                <Link
                  href="/book?type=half_day"
                  className="hover:text-blue-400 transition-colors"
                >
                  Half-Day Shopping & Errands
                </Link>
              </li>
              <li>
                <Link
                  href="/book?type=full_day"
                  className="hover:text-blue-400 transition-colors"
                >
                  Full-Day Family Travel
                </Link>
              </li>
              <li>
                <Link
                  href="/book?type=airport"
                  className="hover:text-blue-400 transition-colors"
                >
                  Patna Airport (PAT) Express
                </Link>
              </li>
              <li>
                <Link
                  href="/book?type=outstation"
                  className="hover:text-blue-400 transition-colors"
                >
                  Outstation Bihar Journeys
                </Link>
              </li>
              <li>
                <Link
                  href="/book?type=recurring"
                  className="hover:text-blue-400 transition-colors"
                >
                  Monthly Dedicated Driver
                </Link>
              </li>
            </ul>
          </div>

          {/* Sample Patna localities */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Sample Localities
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="h-3 w-3 text-blue-400" />
                Boring Road & Canal
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="h-3 w-3 text-blue-400" />
                Kankarbagh Colony
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="h-3 w-3 text-blue-400" />
                Bailey Road & Saguna More
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="h-3 w-3 text-blue-400" />
                Patliputra & Digha
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="h-3 w-3 text-blue-400" />
                Danapur Cantonment & AIIMS
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="h-3 w-3 text-blue-400" />
                Rajendra Nagar & Fraser Road
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="h-3 w-3 text-blue-400" />
                Anisabad & Phulwari Sharif
              </li>
            </ul>
          </div>

          {/* Company & Policies */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Trust & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/how-it-works"
                  className="hover:text-blue-400 transition-colors"
                >
                  How DriveMitro Works
                </Link>
              </li>
              <li>
                <Link
                  href="/safety"
                  className="hover:text-blue-400 transition-colors"
                >
                  Safety Standards
                </Link>
              </li>
              <li>
                <Link
                  href="/driver/register"
                  className="hover:text-blue-400 transition-colors"
                >
                  Apply as a Driver
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-blue-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-blue-400 transition-colors"
                >
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link
                  href="/cancellation-policy"
                  className="hover:text-blue-400 transition-colors"
                >
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-blue-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Demo Disclaimer Banner */}
        <div className="mt-12 rounded-2xl border border-slate-700/60 bg-slate-800/40 p-4 text-xs leading-relaxed text-slate-400">
          <p className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-blue-400" />
            DriveMitro Zero-Budget College Project & Initial Patna Prototype
          </p>
          <p>
            Notice: All driver profiles, vehicle references, reviews, and test credentials in demo mode are fictitious sample data created for demonstration and evaluation. Before enabling live customer bookings on public roads, required commercial permits, driver identity checks, and commercial legal compliance must be finalized.
          </p>
        </div>
      </div>
    </footer>
  );
}
