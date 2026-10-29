import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { dbStore } from "@/lib/db/store";
import { Review } from "@/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const driverId = searchParams.get("driverId") || undefined;
    const reviews = dbStore.getReviews(driverId);

    return NextResponse.json({
      success: true,
      reviews,
    });
  } catch (err: unknown) {
    console.error("[Reviews GET Error]:", err);
    return NextResponse.json(
      { error: "Failed to retrieve reviews." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role === "admin") {
      return NextResponse.json(
        { error: "Admins cannot submit customer reviews." },
        { status: 403 }
      );
    }

    const { bookingId, rating, comment } = await request.json();
    if (!bookingId || !rating || !comment) {
      return NextResponse.json(
        { error: "Booking, rating, and comment are required." },
        { status: 400 }
      );
    }

    const booking = dbStore.getBookingById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found." },
        { status: 404 }
      );
    }

    if (booking.customerId !== session.userId) {
      return NextResponse.json(
        { error: "You can only review your own trips." },
        { status: 403 }
      );
    }

    if (booking.status !== "completed") {
      return NextResponse.json(
        { error: "You can only review a trip once it has been completed." },
        { status: 400 }
      );
    }

    if (!booking.driverId) {
      return NextResponse.json(
        { error: "No driver was assigned to this trip." },
        { status: 400 }
      );
    }

    const existing = dbStore
      .getReviews()
      .find((r) => r.bookingId === booking.id && r.customerId === session.userId);
    if (existing) {
      return NextResponse.json(
        { error: "You have already submitted a review for this booking." },
        { status: 400 }
      );
    }

    const newReview: Review = {
      id: `rev_${Date.now()}`,
      bookingId: booking.id,
      driverId: booking.driverId,
      customerId: session.userId,
      customerName: session.name,
      rating: Math.min(5, Math.max(1, Number(rating))),
      comment,
      isModerated: true,
      status: "approved",
      createdAt: new Date().toISOString(),
    };

    dbStore.createReview(newReview);

    const driver = dbStore.getDriverById(booking.driverId);
    if (driver) {
      dbStore.createNotification({
        id: `notif_${Date.now()}_rev`,
        userId: driver.userId,
        title: "New Customer Review",
        message: `${session.name} gave you a ${rating}★ rating for booking ${booking.bookingRef}!`,
        type: "driver",
        read: false,
        linkUrl: "/driver/dashboard",
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! Your feedback has been recorded.",
      review: newReview,
    });
  } catch (err: unknown) {
    console.error("[Review POST Error]:", err);
    return NextResponse.json(
      { error: "Failed to submit review." },
      { status: 500 }
    );
  }
}
