import { beforeEach, describe, expect, it } from "vitest";
import { POST } from "@/app/api/bookings/route";
import { dbStore } from "@/lib/db/store";

describe("Booking API guest access", () => {
  beforeEach(() => {
    dbStore.resetData();
  });

  it("does not let a guest create a booking under an existing customer's account", async () => {
    const bookingCountBefore = dbStore.getBookings().length;
    const pickupDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
    const request = new Request("http://localhost/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tripType: "hourly",
        pickupLocation: "Boring Road",
        pickupDate,
        pickupTime: "10:00",
        customerInfo: {
          name: "Impersonator",
          phone: "9000000000",
          email: "customer@drivemitro.com",
        },
      }),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(401);
    expect(result.error).toContain("Please sign in");
    expect(dbStore.getBookings()).toHaveLength(bookingCountBefore);
  });

  it("keeps a preferred driver request unassigned until acceptance", async () => {
    const pickupDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
    const request = new Request("http://localhost/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tripType: "hourly",
        pickupLocation: "Boring Road",
        pickupDate,
        pickupTime: "10:00",
        preferredDriverId: "drv_01",
        customerInfo: {
          name: "Demo Guest",
          phone: "9000000001",
          email: "new-guest@example.com",
        },
      }),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.booking.status).toBe("requested");
    expect(result.booking.driverId).toBeUndefined();
    expect(result.booking.preferredDriverId).toBe("drv_01");
  });
});
