import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { dbStore } from "@/lib/db/store";

export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const session = await getSessionUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required." },
        { status: 403 }
      );
    }

    const { driverId } = await request.json();
    if (!driverId) {
      return NextResponse.json(
        { error: "Please select a driver to assign." },
        { status: 400 }
      );
    }

    const result = dbStore.assignDriverToBooking(
      id,
      driverId,
      session.userId,
      session.name
    );

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Driver assigned successfully.",
      booking: result.booking,
    });
  } catch (err: unknown) {
    console.error("[Assign Driver Error]:", err);
    return NextResponse.json(
      { error: "Failed to assign driver." },
      { status: 500 }
    );
  }
}
