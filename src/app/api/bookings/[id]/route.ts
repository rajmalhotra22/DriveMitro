import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { dbStore } from "@/lib/db/store";

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const booking = dbStore.getBookingById(id);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    // Role-based privacy protection
    if (session.role === "customer" && booking.customerId !== session.userId) {
      return NextResponse.json(
        { error: "Forbidden: You cannot access another customer's booking." },
        { status: 403 }
      );
    }

    if (session.role === "driver") {
      const driver = dbStore.getDriverById(session.userId);
      if (
        booking.driverId !== driver?.id &&
        booking.driverId !== session.driverId &&
        booking.preferredDriverId !== driver?.id
      ) {
        return NextResponse.json(
          { error: "Forbidden: You cannot access bookings assigned to other drivers." },
          { status: 403 }
        );
      }
    }

    const history = dbStore.getBookingHistory(booking.id);
    let driverDetails = null;
    if (booking.driverId) {
      driverDetails = dbStore.getDriverById(booking.driverId);
    }

    return NextResponse.json({
      success: true,
      booking,
      driver: driverDetails,
      history,
    });
  } catch (err: unknown) {
    console.error("[Booking Detail Error]:", err);
    return NextResponse.json(
      { error: "Failed to retrieve booking details." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const booking = dbStore.getBookingById(id);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    const body = await request.json();
    const { action, cancellationReason, status, note, paymentStatus } = body;

    if (action === "accept_offer" || action === "reject_offer") {
      if (session.role !== "driver") {
        return NextResponse.json(
          { error: "Only drivers can respond to trip offers." },
          { status: 403 }
        );
      }

      const driver = dbStore.getDriverById(session.userId);
      if (!driver) {
        return NextResponse.json({ error: "Driver profile not found." }, { status: 404 });
      }

      const response = dbStore.respondToDriverOffer(
        booking.id,
        driver.id,
        session.name,
        action === "accept_offer"
      );
      if (!response.success) {
        return NextResponse.json({ error: response.message }, { status: 409 });
      }

      return NextResponse.json({ success: true, booking: response.booking });
    }

    // Handle cancellation
    if (action === "cancel") {
      if (session.role === "customer" && booking.customerId !== session.userId) {
        return NextResponse.json(
          { error: "You can only cancel your own bookings." },
          { status: 403 }
        );
      }

      if (session.role === "driver") {
        const driver = dbStore.getDriverById(session.userId);
        if (!driver || booking.driverId !== driver.id) {
          return NextResponse.json(
            { error: "You can only cancel bookings assigned to you." },
            { status: 403 }
          );
        }
      }

      if (booking.status === "completed") {
        return NextResponse.json(
          { error: "Cannot cancel a booking that has already been completed." },
          { status: 400 }
        );
      }
      if (booking.status === "cancelled") {
        return NextResponse.json(
          { error: "This booking is already cancelled." },
          { status: 400 }
        );
      }

      // Check cancellation rules:
      // If within 2 hours of pickup, apply cancellation fee (₹150)
      const pickupDateTime = new Date(`${booking.pickupDate}T${booking.pickupTime}`);
      const hoursDiff =
        (pickupDateTime.getTime() - new Date().getTime()) / (1000 * 60 * 60);

      let cancellationFee = 0;
      if (hoursDiff < 2 && ["assigned", "en_route"].includes(booking.status)) {
        const config = dbStore.getPricingConfig();
        cancellationFee = config.cancellationFeeRupees || 150;
      }

      const updated = dbStore.updateBooking(booking.id, {
        status: "cancelled",
        cancellationReason: cancellationReason || "Cancelled by user",
        cancellationFee,
        updatedAt: new Date().toISOString(),
      });

      dbStore.updateBookingStatus(
        booking.id,
        "cancelled",
        { id: session.userId, name: session.name, role: session.role },
        `Cancelled: ${cancellationReason || "No reason given"}. Fee: ₹${cancellationFee}`
      );

      // Notify other parties
      if (booking.driverId) {
        const drv = dbStore.getDriverById(booking.driverId);
        if (drv) {
          dbStore.createNotification({
            id: `notif_${Date.now()}_drv_cancel`,
            userId: drv.userId,
            title: "Booking Cancelled",
            message: `Booking ${booking.bookingRef} has been cancelled by the customer.`,
            type: "booking",
            read: false,
            linkUrl: "/driver/bookings",
            createdAt: new Date().toISOString(),
          });
        }
      }

      return NextResponse.json({
        success: true,
        message: "Booking cancelled successfully.",
        booking: updated,
      });
    }

    // Handle status update (driver or admin)
    if (status) {
      if (session.role === "customer") {
        return NextResponse.json(
          { error: "Customers cannot directly set booking operational status." },
          { status: 403 }
        );
      }

      if (session.role === "driver") {
        const driver = dbStore.getDriverById(session.userId);
        if (!driver || booking.driverId !== driver.id) {
          return NextResponse.json(
            { error: "You can only update bookings assigned to you." },
            { status: 403 }
          );
        }
      }

      const res = dbStore.updateBookingStatus(
        booking.id,
        status,
        { id: session.userId, name: session.name, role: session.role },
        note
      );

      if (!res.success) {
        return NextResponse.json({ error: res.message }, { status: 400 });
      }

      // If marked completed and payment status update requested
      if (paymentStatus) {
        dbStore.updateBooking(booking.id, { paymentStatus });
      }

      return NextResponse.json({
        success: true,
        booking: res.booking,
      });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (err: unknown) {
    console.error("[Booking PATCH Error]:", err);
    return NextResponse.json(
      { error: "Failed to update booking." },
      { status: 500 }
    );
  }
}
