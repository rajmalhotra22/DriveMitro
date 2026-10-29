"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdminNav } from "@/components/layout/AdminNav";
import { SupportTicket } from "@/types";
import { LifeBuoy, CheckCircle2, Clock, Phone, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchTickets = () => {
    setLoading(true);
    fetch("/api/support")
      .then((res) => res.json())
      .then((data) => {
        if (data.tickets) setTickets(data.tickets);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleResolve = async (ticketId: string, status: "open" | "in_progress" | "resolved") => {
    setUpdatingId(ticketId);
    try {
      await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          id: ticketId,
          status,
          resolutionNotes: `Ticket updated to ${status} by admin desk`,
        }),
      });
      fetchTickets();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          <div className="border-b border-slate-200 pb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Customer Support & Incident Escalations
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Patna passenger inquiries, chauffeur complaints, and resolution tracking
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <AdminNav />

            <div className="flex-1 space-y-6 w-full">
              <div className="space-y-4">
                {tickets.map((t) => (
                  <Card key={t.id} className="p-6 border-slate-200 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                            {t.ticketId}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900">
                            {t.subject}
                          </h4>
                          <Badge variant={t.priority === "urgent" ? "danger" : "warning"} size="sm">
                            {t.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          From: {t.userName} ({t.userPhone}) • Category: {t.category}
                        </p>
                      </div>

                      <Badge
                        variant={
                          t.status === "resolved"
                            ? "success"
                            : t.status === "in_progress"
                            ? "info"
                            : "warning"
                        }
                      >
                        {t.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3.5 text-xs text-slate-700">
                      <strong>Customer Message:</strong>
                      <p className="mt-1 italic">&ldquo;{t.message}&rdquo;</p>
                    </div>

                    {t.resolutionNotes && (
                      <div className="text-xs text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                        <strong>Resolution Note:</strong> {t.resolutionNotes}
                      </div>
                    )}

                    <div className="pt-2 flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        isLoading={updatingId === t.id}
                        onClick={() => handleResolve(t.id, "in_progress")}
                        className="text-xs font-semibold"
                      >
                        Mark In Progress
                      </Button>
                      <Button
                        size="sm"
                        variant="success"
                        isLoading={updatingId === t.id}
                        onClick={() => handleResolve(t.id, "resolved")}
                        className="text-xs font-bold"
                      >
                        Mark Resolved
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
