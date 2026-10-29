import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DriveMitro | Book Trusted Personal Drivers in Patna",
  description: "Your Car. Your Driver. Your Way. Book verified on-demand drivers in Patna for hourly commutes, airport transfers, full-day trips, and outstation journeys.",
  keywords: ["driver booking Patna", "hire personal driver Patna", "chauffeur services Bihar", "outstation driver Patna", "car driver Patna"],
  openGraph: {
    title: "DriveMitro | Your Car. Your Driver. Your Way.",
    description: "Book background-verified personal drivers in Patna for your private vehicle.",
    url: "https://drivemitro.com",
    siteName: "DriveMitro",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
