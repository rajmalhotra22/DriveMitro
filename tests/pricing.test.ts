import { describe, it, expect } from "vitest";
import { calculatePrice } from "@/lib/pricing/calculator";
import { DEFAULT_PRICING_CONFIG } from "@/lib/pricing/config";

describe("Pricing Engine Calculations", () => {
  it("should calculate local hourly booking with minimum 2 hours correctly", () => {
    // 2 hours at ₹149/hr
    const result = calculatePrice({
      tripType: "hourly",
      durationHours: 2,
      pickupTime: "14:00",
    });

    expect(result.baseFare).toBe(298); // 149 * 2
    expect(result.durationFare).toBe(0);
    expect(result.lateNightSurcharge).toBe(0);
    expect(result.platformFee).toBe(40);
    // Subtotal: 298 + 40 = 338. GST 5% = 16.9 -> 17. Total = 355
    expect(result.totalAmountRupees).toBe(355);
    expect(result.totalAmountPaise).toBe(35500);
  });

  it("should calculate extra hours accurately for hourly trips", () => {
    // 4 hours: 2 base hours (298) + 2 extra hours (298)
    const result = calculatePrice({
      tripType: "hourly",
      durationHours: 4,
      pickupTime: "11:00",
    });

    expect(result.baseFare).toBe(298);
    expect(result.durationFare).toBe(298);
  });

  it("should apply late night surcharge between 22:00 and 06:00", () => {
    // 2 hours at 23:00 (11:00 PM)
    const result = calculatePrice({
      tripType: "hourly",
      durationHours: 2,
      pickupTime: "23:00",
    });

    const baseAndDuration = result.baseFare + result.durationFare;
    const expectedSurcharge = Math.round(
      (baseAndDuration * DEFAULT_PRICING_CONFIG.surcharges.nightSurchargePercentage) / 100
    );
    expect(result.lateNightSurcharge).toBe(expectedSurcharge);
    expect(result.lateNightSurcharge).toBeGreaterThan(0);
  });

  it("should compute outstation journey daily rate plus driver food allowance", () => {
    const result = calculatePrice({
      tripType: "outstation",
      outstationDays: 2,
      pickupTime: "07:00",
    });

    expect(result.baseFare).toBe(DEFAULT_PRICING_CONFIG.serviceRates.outstationDailyRate * 2);
    expect(result.outstationAllowance).toBe(
      DEFAULT_PRICING_CONFIG.surcharges.outstationDriverFoodAllowancePerDay * 2
    );
  });

  it("should calculate airport flat transfer fare accurately", () => {
    const result = calculatePrice({
      tripType: "airport",
      pickupTime: "09:00",
    });

    expect(result.baseFare).toBe(499);
    expect(result.platformFee).toBe(40);
  });
});
