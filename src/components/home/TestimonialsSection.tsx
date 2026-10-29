import React from "react";
import { Star, Quote, ShieldAlert } from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Dr. Ananya Srivastava",
      role: "Senior Consultant, AIIMS Patna",
      location: "Patliputra Colony, Patna",
      comment:
        "DriveMitro solved our daily family headache. We own a Honda City, but navigating Bailey Road traffic after 12-hour hospital shifts was draining. Manoj ji drove with such poise and care.",
      rating: 5,
      tripType: "Full-Day Chauffeur",
    },
    {
      name: "Rajesh Kumar Verma",
      role: "Business Owner, Fraser Road",
      location: "Boring Road, Patna",
      comment:
        "Booked an airport transfer to Jayprakash Narayan Airport and then an outstation roundtrip to Bodh Gaya. Transparent pricing without arguing over tolls or hidden charges.",
      rating: 5,
      tripType: "Airport + Outstation",
    },
    {
      name: "Alok Shekhar (Advocate)",
      role: "Patna High Court Counsel",
      location: "Kankarbagh, Patna",
      comment:
        "Handling High Court parking rush used to be impossible. Having a verified driver drop me right at the entrance and handle the car was a total gamechanger.",
      rating: 5,
      tripType: "Hourly City Commute",
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/80 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-300">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Sample Demo Testimonials (Fictitious Prototype Reviews)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How Patna Car Owners Experience DriveMitro
          </h2>
          <p className="text-sm text-slate-500">
            *In compliance with honest product transparency, these sample testimonials illustrate actual use cases from our pilot user research in Patna.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <Card
              key={idx}
              className="flex flex-col justify-between border-slate-200/80 bg-white p-7"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <Badge variant="neutral" size="sm">
                    {t.tripType}
                  </Badge>
                </div>

                <Quote className="h-8 w-8 text-blue-100 mb-2" />

                <p className="text-sm text-slate-700 leading-relaxed italic mb-6">
                  &ldquo;{t.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                <p className="text-xs text-blue-600 font-medium">{t.role}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{t.location}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
