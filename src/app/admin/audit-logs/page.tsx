"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdminNav } from "@/components/layout/AdminNav";
import { AuditLog } from "@/types";
import { FileText, ShieldCheck, Clock, User } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.recentActivity) setLogs(data.recentActivity);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          <div className="border-b border-slate-200 pb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              System Audit Trail & Security Logs
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Immutable chronological record of administrative interventions, price changes, and verification approvals
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <AdminNav />

            <div className="flex-1 space-y-6 w-full">
              <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Performed By</th>
                      <th className="py-3 px-4">Target Entity</th>
                      <th className="py-3 px-4">Audit Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          <Badge variant="navy" size="sm">
                            {log.action}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-900">{log.performedBy}</p>
                          <p className="text-[10px] text-slate-400 uppercase">{log.role}</p>
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                          {log.targetType} ({log.targetId})
                        </td>
                        <td className="py-3 px-4 text-slate-600 max-w-sm">
                          {log.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
