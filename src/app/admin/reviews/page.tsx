"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdminNav } from "@/components/layout/AdminNav";
import { Review } from "@/types";
import { Star, ShieldCheck, CheckCircle2, Flag, EyeOff, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = () => {
    setLoading(true);
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews) setReviews(data.reviews);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleModeration = (reviewId: string, status: "approved" | "flagged" | "hidden") => {
    setReviews(
      reviews.map((r) => (r.id === reviewId ? { ...r, status, isModerated: true } : r))
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          <div className="border-b border-slate-200 pb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Customer Reviews & Feedback Moderation
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Audit and moderate authentic passenger reviews for Patna chauffeur quality control
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <AdminNav />

            <div className="flex-1 space-y-6 w-full">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">
                  Compliance Rule: In accordance with product integrity, administrators cannot fabricate customer reviews.
                </span>
                <Badge variant="navy">{reviews.length} Verified Reviews</Badge>
              </div>

              <div className="space-y-4">
                {reviews.map((rev) => (
                  <Card key={rev.id} className="p-6 border-slate-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">
                            {rev.customerName}
                          </h4>
                          <span className="text-xs text-slate-400">
                            reviewed chauffeur ({rev.driverId})
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-amber-500 mt-0.5">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
                          ))}
                          <span className="text-slate-400 font-normal ml-1">
                            • {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <Badge
                        variant={
                          rev.status === "approved"
                            ? "success"
                            : rev.status === "flagged"
                            ? "warning"
                            : "danger"
                        }
                      >
                        {rev.status.toUpperCase()}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed italic">
                      &ldquo;{rev.comment}&rdquo;
                    </p>

                    <div className="pt-2 flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleModeration(rev.id, "approved")}
                        className="text-xs text-emerald-700 font-semibold"
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleModeration(rev.id, "flagged")}
                        className="text-xs text-amber-700 font-semibold"
                      >
                        Flag for Review
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleModeration(rev.id, "hidden")}
                        className="text-xs text-red-600 font-semibold"
                      >
                        Hide
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
