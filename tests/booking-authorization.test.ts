import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth/session", () => ({ getSessionUser: vi.fn() }));

import { PATCH } from "@/app/api/bookings/[id]/route";
import { getSessionUser } from "@/lib/auth/session";
import { dbStore } from "@/lib/db/store";

describe("Booking cancellation authorization", () => {
  beforeEach(() => {
    dbStore.resetData();
    vi.mocked(getSessionUser).mockResolvedValue({
      userId: "another_customer",
      email: "another@example.com",
      name: "Another Customer",
      phone: "9000000000",
      role: "customer",
    });
  });

  it("does not allow a customer to cancel another customer's booking", async () => {
    const booking = dbStore.createBooking({
      id: "bkg_private_test",
      bookingRef: "DM-PAT-777777",
      customerId: "user_customer_01",
      customerName: "Seed Customer",
      customerPhone: "9876543210",
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
    const request = new Request("http://localhost/api/bookings/bkg_private_test", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cancel" }),
    });

    const response = await PATCH(request, {
      params: Promise.resolve({ id: booking.id }),
    });

    expect(response.status).toBe(403);
    expect(dbStore.getBookingById(booking.id)?.status).toBe("requested");
  });
});