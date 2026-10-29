import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { dbStore } from "@/lib/db/store";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required." },
        { status: 403 }
      );
    }

    const users = dbStore.getUsers();
    const drivers = dbStore.getDrivers();
    const bookings = dbStore.getBookings();
    const auditLogs = dbStore.getAuditLogs();

    const totalCustomers = users.filter((u) => u.role === "customer").length;
    const registeredDrivers = drivers.length;
    const verifiedDrivers = drivers.filter(
      (d) => d.verificationStatus === "approved"
    ).length;
    const pendingVerification = drivers.filter(
      (d) => d.verificationStatus === "pending"
    ).length;

    const requestedBookings = bookings.filter(
      (b) => b.status === "requested"
    ).length;
    const confirmedBookings = bookings.filter((b) =>
      ["assigned", "en_route", "arrived", "trip_started"].includes(b.status)
    ).length;
    const completedBookings = bookings.filter(
      (b) => b.status === "completed"
    ).length;
    const cancelledBookings = bookings.filter(
      (b) => b.status === "cancelled"
    ).length;

    // Financial calculations from completed & paid bookings
    let grossBookingValueRupees = 0;
    let platformCommissionRupees = 0;

    bookings.forEach((b) => {
      if (b.status === "completed" || b.paymentStatus !== "pending") {
        grossBookingValueRupees += b.priceBreakdown.totalAmountRupees;
        // Platform commission is platformFee + 10% base fare
        const commission =
          b.priceBreakdown.platformFee +
          Math.round((b.priceBreakdown.baseFare * 10) / 100);
        platformCommissionRupees += commission;
      }
    });

    const currentMonth = new Date();
    const chartData = Array.from({ length: 6 }, (_, index) => {
      const monthDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - (5 - index),
        1
      );
      const year = monthDate.getFullYear();
      const monthIndex = monthDate.getMonth();
      const monthBookings = bookings.filter((booking) => {
        const createdAt = new Date(booking.createdAt);
        return createdAt.getFullYear() === year && createdAt.getMonth() === monthIndex;
      });
      const revenue = monthBookings.reduce((total, booking) => {
        if (
          booking.status === "completed" ||
          booking.paymentStatus === "paid_cash" ||
          booking.paymentStatus === "demo_paid"
        ) {
          return total + booking.priceBreakdown.totalAmountRupees;
        }
        return total;
      }, 0);

      return {
        month: monthDate.toLocaleString("en-IN", { month: "short" }),
        bookings: monthBookings.length,
        revenue,
      };
    });

    return NextResponse.json({
      success: true,
      isDemoMode: dbStore.isDemoMode,
      environmentLabel: "Demo Environment (Local Persistent Store)",
      stats: {
        totalCustomers,
        registeredDrivers,
        verifiedDrivers,
        pendingVerification,
        requestedBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        grossBookingValueRupees,
        platformCommissionRupees,
        totalBookings: bookings.length,
      },
      chartData,
      recentActivity: auditLogs.slice(0, 10),
    });
  } catch (err: unknown) {
    console.error("[Admin Stats Error]:", err);
    return NextResponse.json(
      { error: "Failed to generate admin metrics." },
      { status: 500 }
    );
  }
}
