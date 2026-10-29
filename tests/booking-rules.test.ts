import { describe, it, expect, beforeEach } from "vitest";
import { dbStore } from "@/lib/db/store";

describe("Booking Business Rules & State Machine", () => {
  beforeEach(() => {
    dbStore.resetData();
  });

  it("should prevent assigning an unapproved driver to a booking", () => {
    // drv_06 (Vikash Tiwari) has verificationStatus: 'pending'
    const result = dbStore.assignDriverToBooking(
      "bkg_01",
      "drv_06",
      "admin_test",
      "Admin Test"
    );

    expect(result.success).toBe(false);
    expect(result.message).toContain("verification is not approved");
  });

  it("should only let the preferred verified driver accept an open offer", () => {
    const booking = dbStore.createBooking({
      id: "bkg_preferred_offer_test",
      bookingRef: "DM-PAT-888888",
      customerId: "user_customer_01",
      customerName: "Test Customer",
      customerPhone: "9876543210",
      preferredDriverId: "drv_01",
      tripType: "hourly",
      pickupLocation: "Boring Road",
      pickupDate: "2030-10-30",
      pickupTime: "10:00",
      durationHours: 3,
      status: "requested",
      paymentStatus: "pending",
      paymentMethod: "cash_on_trip",
      priceBreakdown: {
        baseFare: 298,
        durationFare: 149,
        lateNightSurcharge: 0,
        waitingFare: 0,
        outstationAllowance: 0,
        platformFee: 40,
        gst: 24,
        totalAmountRupees: 511,
        totalAmountPaise: 51100,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const wrongDriver = dbStore.respondToDriverOffer(
      booking.id,
      "drv_02",
      "Other Driver",
      true
    );
    expect(wrongDriver.success).toBe(false);

    const accepted = dbStore.respondToDriverOffer(
      booking.id,
      "drv_01",
      "Manoj Kumar Yadav",
      true
    );
    expect(accepted.success).toBe(true);
    expect(accepted.booking?.status).toBe("assigned");
    expect(accepted.booking?.driverId).toBe("drv_01");
  });

  it("should successfully assign an approved driver to an unassigned booking", () => {
    // drv_01 (Manoj Kumar Yadav) is approved
    const result = dbStore.assignDriverToBooking(
      "bkg_01",
      "drv_01",
      "admin_test",
      "Admin Test"
    );

    expect(result.success).toBe(true);
    expect(result.booking?.status).toBe("assigned");
    expect(result.booking?.driverId).toBe("drv_01");
  });

  it("should prevent double-assigning a driver to an overlapping date", () => {
    // Assign drv_01 to bkg_01 on 2026-10-30
    dbStore.assignDriverToBooking("bkg_01", "drv_01", "admin", "Admin");

    // Create another booking on same date
    const bkgConflict = dbStore.createBooking({
      id: "bkg_conflict_test",
      bookingRef: "DM-PAT-999999",
      customerId: "cust_test",
      customerName: "Test Customer",
      customerPhone: "9876543210",
      tripType: "hourly",
      pickupLocation: "Boring Road",
      pickupDate: "2026-10-30", // Same date!
      pickupTime: "15:00",
      durationHours: 3,
      status: "requested",
      paymentStatus: "pending",
      paymentMethod: "cash_on_trip",
      priceBreakdown: {
        baseFare: 298,
        durationFare: 149,
        lateNightSurcharge: 0,
        waitingFare: 0,
        outstationAllowance: 0,
        platformFee: 40,
        gst: 24,
        totalAmountRupees: 511,
        totalAmountPaise: 51100,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Attempt to assign drv_01 again on 2026-10-30
    const conflictResult = dbStore.assignDriverToBooking(
      bkgConflict.id,
      "drv_01",
      "admin",
      "Admin"
    );

    expect(conflictResult.success).toBe(false);
    expect(conflictResult.message).toContain("already assigned");
  });

  it("should reject invalid status transitions for non-admin callers", () => {
    // Requested directly to completed is invalid
    const result = dbStore.updateBookingStatus(
      "bkg_01",
      "completed",
      { id: "cust_1", name: "Customer", role: "customer" }
    );

    expect(result.success).toBe(false);
    expect(result.message).toContain("Invalid status transition");
  });
});
