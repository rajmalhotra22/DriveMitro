"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdminNav } from "@/components/layout/AdminNav";
import {
  Users,
  UserCheck,
  CalendarDays,
  Banknote,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function AdminOverviewPage() {
  const router = useRouter();

  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (!data?.success) {
          router.push("/login");
          return;
        }
        setStats(data.stats);
        setChartData(data.chartData || []);
        setRecentActivity(data.recentActivity || []);
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  DriveMitro Executive Administration
                </h1>
                <Badge variant="navy">Patna Metro</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Real-time operational metrics, driver verifications, and financial performance
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/admin/bookings">
                <Button size="sm" variant="primary" className="font-bold text-xs">
                  Manage All Bookings
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <AdminNav />

            <div className="flex-1 space-y-8 w-full">
              {/* Financial Metrics Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-5 border-slate-200 bg-white">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Gross Booking Value
                    </span>
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    ₹{stats?.grossBookingValueRupees?.toLocaleString("en-IN") || 0}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                    Calculated from actual completed trips
                  </p>
                </Card>

                <Card className="p-5 border-slate-200 bg-white">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Platform Revenue
                    </span>
                    <Banknote className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="text-2xl font-black text-blue-600 mt-1">
                    ₹{stats?.platformCommissionRupees?.toLocaleString("en-IN") || 0}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Commission & booking fees
                  </p>
                </Card>

                <Card className="p-5 border-slate-200 bg-white">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Pending Verifications
                    </span>
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  </div>
                  <p className="text-2xl font-black text-amber-600 mt-1">
                    {stats?.pendingVerification || 0}
                  </p>
                  <Link
                    href="/admin/drivers"
                    className="text-[11px] font-bold text-amber-700 hover:underline mt-1 inline-block"
                  >
                    Review driver documents →
                  </Link>
                </Card>

                <Card className="p-5 border-slate-200 bg-white">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Total Bookings
                    </span>
                    <CalendarDays className="h-4 w-4 text-purple-600" />
                  </div>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    {stats?.totalBookings || 0}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {stats?.completedBookings || 0} completed • {stats?.cancelledBookings || 0} cancelled
                  </p>
                </Card>
              </div>

              {/* Monthly Booking & Revenue Trends Chart (Recharts) */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Platform Growth & Revenue Trends
                    </h3>
                    <p className="text-xs text-slate-500">
                      Monthly booking count and gross GMV (Patna market)
                    </p>
                  </div>
                  <Badge variant="navy" size="sm">
                    Recharts Live
                  </Badge>
                </div>

                <div className="h-64 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0B192C",
                          borderRadius: "12px",
                          color: "#fff",
                          fontSize: "12px",
                          border: "none",
                        }}
                      />
                      <Bar dataKey="revenue" name="Gross Revenue (₹)" fill="#008DDA" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Driver & Customer Count Summaries */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card className="p-6 border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <UserCheck className="h-5 w-5 text-emerald-600" />
                      <span>Driver Fleet Overview</span>
                    </h4>
                    <Link
                      href="/admin/drivers"
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      Manage
                    </Link>
                  </div>
                  <div className="space-y-2 text-xs text-slate-700">
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span>Total Registered Drivers:</span>
                      <span className="font-bold text-slate-900">{stats?.registeredDrivers}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span>Approved & Active:</span>
                      <span className="font-bold text-emerald-600">{stats?.verifiedDrivers}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span>Awaiting Review:</span>
                      <span className="font-bold text-amber-600">{stats?.pendingVerification}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span>Customer Base</span>
                    </h4>
                    <Link
                      href="/admin/customers"
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      Directory
                    </Link>
                  </div>
                  <div className="space-y-2 text-xs text-slate-700">
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span>Registered Car Owners:</span>
                      <span className="font-bold text-slate-900">{stats?.totalCustomers}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span>Active Bookings Right Now:</span>
                      <span className="font-bold text-blue-600">{stats?.confirmedBookings}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span>New Unassigned Requests:</span>
                      <span className="font-bold text-amber-600">{stats?.requestedBookings}</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Audit Activity Trail */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-purple-600" />
                    <span>Recent Administrative Audit Events</span>
                  </h4>
                  <Link
                    href="/admin/audit-logs"
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    View All Logs
                  </Link>
                </div>

                <div className="space-y-3 text-xs text-slate-600">
                  {recentActivity.slice(0, 5).map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <div className="space-y-0.5">
                        <span className="font-mono font-bold text-slate-900">
                          {log.action}
                        </span>
                        <p className="text-slate-600 text-[11px]">{log.details}</p>
                        <p className="text-[10px] text-slate-400">
                          By {log.performedBy} ({log.role})
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(log.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
