import { PriceBreakdown, PricingConfiguration, TripType } from "@/types";
import { DEFAULT_PRICING_CONFIG } from "./config";
import { rupeesToPaise } from "../utils";

export interface PricingInput {
  tripType: TripType;
  durationHours?: number;
  pickupTime?: string;
  outstationDays?: number;
  config?: PricingConfiguration;
}

export function calculatePrice(input: PricingInput): PriceBreakdown {
  const config = input.config || DEFAULT_PRICING_CONFIG;
  const rates = config.serviceRates;
  const tripType = input.tripType;
  let duration = input.durationHours || 2;
  const outstationDays = Math.max(1, input.outstationDays || 1);

  let baseFare = 0;
  let durationFare = 0;
  let outstationAllowance = 0;
  const waitingFare = 0;

  switch (tripType) {
    case "hourly": {
      const minHours = rates.minHoursHourly;
      duration = Math.max(minHours, duration);
      baseFare = rates.hourlyRate * minHours;
      const extraHours = Math.max(0, duration - minHours);
      durationFare = extraHours * rates.hourlyRate;
      break;
    }
    case "half_day": {
      duration = Math.max(rates.halfDayHours, duration);
      baseFare = rates.halfDayRate;
      const extraHours = Math.max(0, duration - rates.halfDayHours);
      durationFare = extraHours * rates.hourlyRate;
      break;
    }
    case "full_day": {
      duration = Math.max(rates.fullDayHours, duration);
      baseFare = rates.fullDayRate;
      const extraHours = Math.max(0, duration - rates.fullDayHours);
      durationFare = extraHours * rates.hourlyRate;
      break;
    }
    case "outstation": {
      baseFare = rates.outstationDailyRate * outstationDays;
      outstationAllowance =
        config.surcharges.outstationDriverFoodAllowancePerDay * outstationDays;
      durationFare = 0;
      break;
    }
    case "airport": {
      baseFare = rates.airportTransferFlatRate;
      durationFare = 0;
      break;
    }
    case "recurring": {
      baseFare = rates.recurringMonthlyBase;
      durationFare = 0;
      break;
    }
    default: {
      baseFare = rates.hourlyRate * 2;
      durationFare = 0;
    }
  }

  // Check late night surcharge (22:00 to 06:00)
  let lateNightSurcharge = 0;
  if (input.pickupTime) {
    const [hoursStr] = input.pickupTime.split(":");
    const hours = parseInt(hoursStr, 10);
    if (!isNaN(hours) && (hours >= 22 || hours < 6)) {
      const taxableBase = baseFare + durationFare;
      lateNightSurcharge = Math.round(
        (taxableBase * config.surcharges.nightSurchargePercentage) / 100
      );
    }
  }

  const platformFee = 40; // Flat ₹40 platform charge for insurance, verification & 24/7 support
  const subtotal =
    baseFare +
    durationFare +
    lateNightSurcharge +
    outstationAllowance +
    waitingFare +
    platformFee;

  const gst = Math.round((subtotal * (config.gstPercent || 5)) / 100);
  const totalAmountRupees = subtotal + gst;
  const totalAmountPaise = rupeesToPaise(totalAmountRupees);

  return {
    baseFare,
    durationFare,
    lateNightSurcharge,
    waitingFare,
    outstationAllowance,
    platformFee,
    gst,
    totalAmountRupees,
    totalAmountPaise,
  };
}
