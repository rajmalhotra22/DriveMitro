"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DashboardNav } from "@/components/layout/DashboardNav";
import { Notification } from "@/types";
import { Bell, CheckCheck, Clock, ArrowRight, ShieldCheck, Car } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function CustomerNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = () => {
    setLoading(true);
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        if (data.notifications) setNotifications(data.notifications);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_all_read" }),
      });
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const markOneRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Notification Center
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Real-time booking confirmations, chauffeur assignments, and system alerts
              </p>
            </div>
            {notifications.some((n) => !n.read) && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllRead}
                className="gap-1.5 text-xs font-semibold"
              >
                <CheckCheck className="h-4 w-4" />
                Mark All as Read
              </Button>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <DashboardNav />

            <div className="flex-1 space-y-4 w-full">
              {loading ? (
                <div className="py-20 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent"></div>
                  <p className="mt-3 text-xs text-slate-500">Loading alerts...</p>
                </div>
              ) : notifications.length === 0 ? (
                <Card className="p-12 text-center border-slate-200 space-y-3">
                  <div className="mx-auto h-12 w-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
                    <Bell className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    No Notifications
                  </h3>
                  <p className="text-xs text-slate-500">
                    You have caught up with all your booking and trip updates.
                  </p>
                </Card>
              ) : (
                notifications.map((notif) => (
                  <Card
                    key={notif.id}
                    className={`p-5 border transition-all ${
                      !notif.read
                        ? "border-blue-200 bg-blue-50/40"
                        : "border-slate-200/80 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                            !notif.read
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <Bell className="h-4 w-4" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">
                              {notif.title}
                            </h4>
                            {!notif.read && (
                              <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {notif.message}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {new Date(notif.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {notif.linkUrl && (
                          <Link href={notif.linkUrl}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs font-semibold"
                            >
                              View
                              <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          </Link>
                        )}
                        {!notif.read && (
                          <button
                            onClick={() => markOneRead(notif.id)}
                            title="Mark as read"
                            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100"
                          >
                            <CheckCheck className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
