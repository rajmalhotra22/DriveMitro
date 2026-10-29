import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FAQSection } from "@/components/home/FAQSection";
import { Badge } from "@/components/ui/Badge";

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 py-12">
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
