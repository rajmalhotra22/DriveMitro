import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { dbStore } from "@/lib/db/store";
import { calculatePrice } from "@/lib/pricing/calculator";
import { generateBookingRef } from "@/lib/utils";
import { Booking, TripType } from "@/types";

export async function GET(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const ref = searchParams.get("ref");

    let bookings: Booking[] = [];

    if (session.role === "admin") {
      bookings = dbStore.getBookings();
    } else if (session.role === "driver") {
      const driver = dbStore.getDriverById(session.userId);
      const driverId = driver ? driver.id : session.driverId;
      bookings = driverId
        ? [
            ...dbStore.getBookingsByDriver(driverId),
            ...dbStore
              .getBookings()
              .filter(
                (booking) =>
                  booking.preferredDriverId === driverId &&
                  booking.status === "requested"
              ),
          ]
        : [];
    } else {
      // Customer
      bookings = dbStore.getBookingsByCustomer(session.userId);
    }

    if (status && status !== "all") {
      bookings = bookings.filter((b) => b.status === status);
    }

    if (ref) {
      bookings = bookings.filter((b) =>
        b.bookingRef.toLowerCase().includes(ref.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (err: unknown) {
    console.error("[Bookings GET Error]:", err);
    return NextResponse.json(
      { error: "Failed to retrieve bookings." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      tripType,
      pickupLocation,
      destinationLocation,
      pickupDate,
      pickupTime,
      durationHours = 2,
      outstationDays = 1,
      transmissionPreference = "Any",
      carType = "Sedan",
      passengerCount = 1,
      specialInstructions = "",
      preferredDriverId,
      paymentMethod = "cash_on_trip",
      customerInfo,
    } = body;

    // Validation
    if (!tripType || !pickupLocation || !pickupDate || !pickupTime) {
      return NextResponse.json(
        { error: "Please fill in all mandatory trip details." },
        { status: 400 }
      );
    }

    // Check date validity
    const bookingDateObj = new Date(`${pickupDate}T${pickupTime}`);
    const now = new Date();
    // Allow small 5-min clock tolerance
    if (bookingDateObj.getTime() < now.getTime() - 5 * 60 * 1000) {
      return NextResponse.json(
        { error: "Pickup date and time cannot be in the past." },
        { status: 400 }
      );
    }

    let customerId = "";
    let customerName = "";
    let customerPhone = "";

    const session = await getSessionUser();
    if (session) {
      customerId = session.userId;
      customerName = session.name;
      customerPhone = session.phone;
    } else if (customerInfo?.name && customerInfo?.phone && customerInfo?.email) {
      // Create guest customer record if not logged in
      const existing = dbStore.getUserByEmail(customerInfo.email);
      if (existing) {
        return NextResponse.json(
          { error: "An account with this email exists. Please sign in to book." },
          { status: 401 }
        );
      } else {
        const newGuest = {
          id: `user_${Date.now()}`,
          name: customerInfo.name,
          email: customerInfo.email.toLowerCase(),
          phone: customerInfo.phone,
          role: "customer" as const,
          status: "active" as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        dbStore.createUser(newGuest);
        customerId = newGuest.id;
        customerName = newGuest.name;
        customerPhone = newGuest.phone;
      }
    } else {
      return NextResponse.json(
        { error: "Please sign in or provide contact details to book." },
        { status: 401 }
      );
    }

    // Recalculate price authoritatively on server
    const pricingConfig = dbStore.getPricingConfig();
    const priceBreakdown = calculatePrice({
      tripType: tripType as TripType,
      durationHours: Number(durationHours),
      pickupTime,
      outstationDays: Number(outstationDays),
      config: pricingConfig,
    });

    const preferredDriver = preferredDriverId
      ? dbStore.getDriverById(preferredDriverId)
      : undefined;

    let bookingRef = generateBookingRef();
    while (dbStore.getBookingByRef(bookingRef)) {
      bookingRef = generateBookingRef();
    }
    const newBooking: Booking = {
      id: `bkg_${Date.now()}`,
      bookingRef,
      customerId,
      customerName,
      customerPhone,
      preferredDriverId:
        preferredDriver?.verificationStatus === "approved"
          ? preferredDriver.id
          : undefined,
      tripType,
      pickupLocation,
      destinationLocation: destinationLocation || "",
      pickupDate,
      pickupTime,
      durationHours: Number(durationHours),
      transmissionPreference,
      carType,
      passengerCount: Number(passengerCount) || 1,
      specialInstructions,
      status: "requested",
      paymentStatus: paymentMethod === "demo_online" ? "demo_paid" : "pending",
      paymentMethod,
      priceBreakdown,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dbStore.createBooking(newBooking);

    // Notify customer
    dbStore.createNotification({
      id: `notif_${Date.now()}_bkg`,
      userId: customerId,
      title: "Booking Received",
      message: `Your booking ${bookingRef} for ${pickupDate} has been placed successfully. Status: Finding Driver.`,
      type: "booking",
      read: false,
      linkUrl: `/dashboard/bookings/${bookingRef}`,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      booking: newBooking,
    });
  } catch (err: unknown) {
    console.error("[Create Booking Error]:", err);
    return NextResponse.json(
      { error: "Failed to create booking." },
      { status: 500 }
    );
  }
}
