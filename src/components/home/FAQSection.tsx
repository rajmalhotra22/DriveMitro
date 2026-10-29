"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/Button";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      category: "Booking & Duration",
      question: "What is the minimum booking duration for an hourly driver?",
      answer:
        "The minimum booking duration for our local hourly chauffeur service is 2 hours (₹298 base fare). Any additional time is billed automatically at ₹149 per hour. Half-day (4 hours) and full-day (8 hours) flat packages are also available.",
    },
    {
      category: "Cancellations",
      question: "What is the cancellation policy if my plans change?",
      answer:
        "You can cancel your booking for free up to 2 hours before the scheduled pickup time. Cancellations made within 2 hours of pickup (after a driver has been dispatched or committed) incur a nominal ₹150 cancellation charge to compensate the chauffeur.",
    },
    {
      category: "Payments",
      question: "How do payments work? Do you require credit card details upfront?",
      answer:
        "No credit card is required. You can choose to pay the driver in cash directly upon completion of the trip, or use our digital payment option. All prices are calculated with complete transparency on our server before you confirm.",
    },
    {
      category: "Safety & Verification",
      question: "How are DriveMitro drivers background-checked and verified?",
      answer:
        "Every chauffeur undergoes a rigorous verification protocol before being approved by our admin team: 1. Physical Driving License verification against RTO database records; 2. Government identity proof (Aadhaar/PAN); 3. Police clearance certification; 4. In-person driving etiquette and city route assessment.",
    },
    {
      category: "Outstation",
      question: "How do outstation bookings outside Patna work?",
      answer:
        "For outstation journeys (e.g. to Bodh Gaya, Rajgir, Muzaffarpur, or Varanasi), the driver charge is ₹1,499 per day plus a standard ₹400 driver food and daily lodging allowance. Fuel, highway tolls, and parking fees remain the car owner's responsibility.",
    },
    {
      category: "Vehicle Responsibility",
      question: "Does DriveMitro provide car insurance during the booking?",
      answer:
        "In our initial prototype phase, your vehicle's existing comprehensive motor insurance covers the car. DriveMitro verifies that all chauffeurs possess valid commercial/LMV driving licenses and safe driving records. Before commercial road rollout, commercial partner transit protections will be finalized.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-slate-600">
            Everything you need to know about booking personal chauffeurs in Patna.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white transition-all duration-200 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3 pr-4">
                    <HelpCircle className="h-5 w-5 text-blue-600 shrink-0" />
                    <span className="text-base font-bold text-slate-900">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    <p>{faq.answer}</p>
                    <span className="inline-block mt-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      Category: {faq.category}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 rounded-2xl bg-blue-50/80 border border-blue-200 p-6 text-center space-y-3">
          <h4 className="text-base font-bold text-slate-900">
            Have a specific question not listed here?
          </h4>
          <p className="text-xs text-slate-600">
            Our Patna customer care team is available 24/7 to help you with booking inquiries.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link href="/contact">
              <Button size="sm" variant="primary">
                Contact Support
              </Button>
            </Link>
            <a
              href="https://wa.me/919835012345?text=Hello%20DriveMitro%2C%20I%20have%20a%20question%20about%20driver%20booking"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" variant="outline">
                WhatsApp Inquiry
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
