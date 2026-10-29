import { PricingConfiguration } from "@/types";

export const DEFAULT_PRICING_CONFIG: PricingConfiguration = {
  id: "default_pricing_patna",
  serviceRates: {
    hourlyRate: 149,
    minHoursHourly: 2,
    halfDayRate: 549,
    halfDayHours: 4,
    fullDayRate: 999,
    fullDayHours: 8,
    outstationDailyRate: 1499,
    airportTransferFlatRate: 499,
    recurringMonthlyBase: 11999,
  },
  surcharges: {
    nightSurchargePercentage: 15,
    nightHoursStart: "22:00",
    nightHoursEnd: "06:00",
    outstationDriverFoodAllowancePerDay: 400,
  },
  platformFeePercent: 0, // Flat platform fee handled as standard ₹40
  gstPercent: 5,
  cancellationFeeRupees: 150,
  updatedAt: new Date().toISOString(),
};

export const PATNA_SERVICE_AREAS = [
  "Boring Road",
  "Kankarbagh",
  "Bailey Road",
  "Patliputra Colony",
  "Rajendra Nagar",
  "Fraser Road / Dak Bungalow",
  "Danapur Cantonment",
  "AIIMS Patna",
  "Patna Airport (Jayprakash Narayan)",
  "Khagaul",
  "Phulwari Sharif",
  "Anisabad",
  "Ashok Rajpath",
  "Digha",
  "Exhibition Road",
  "Saguna More",
];

export const POPULAR_VEHICLE_MODELS = [
  "Maruti Suzuki Dzire / Swift",
  "Hyundai Creta / Venue",
  "Tata Nexon / Punch",
  "Toyota Innova / Crysta",
  "Mahindra Scorpio / XUV700",
  "Honda City / Amaze",
  "Kia Seltos / Sonet",
  "Luxury (BMW / Audi / Mercedes)",
];
